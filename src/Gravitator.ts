import { Station, Stop } from "./Station";
import { Vector } from "./Vector";
import { Line } from "./Line";
import { Utils } from "./Utils";
import { StationProvider } from "./Network";

const fmin = require('fmin');


export class Gravitator {
    static INERTNESS = 100;
    static GRADIENT_SCALE = 0.000000001;
    static DEVIATION_WARNING = 0.1;

    private initialWeightFactors: {[id: string] : number} = {};
    private edges: {[id: string]: Line} = {};
    private vertices: {[id: string] : {station: Station, index: Vector, startCoords: Vector}} = {};

    constructor(private stationProvider: StationProvider) {
        
    }

    gravitate(delay: number, animate: boolean): number {
        this.obtainStations();
        const solution = this.minimizeLoss();
        console.log('solution:', solution);
        console.log(this.vertices);
        console.log(this.initialWeightFactors);
        console.log(this.edges);
        this.assertDistances(solution);
        return this.moveStationsAndLines(solution, delay, animate);
    }

    private obtainStations() {
        for (const [key, edge] of Object.entries(this.edges)) {
            this.addVertex(edge.termini[0].stationId);
            this.addVertex(edge.termini[1].stationId);
            if (this.initialWeightFactors[key] == undefined) {
                const lengthInPixels = this.vertices[edge.termini[0].stationId].station.baseCoords.delta(this.vertices[edge.termini[1].stationId].station.baseCoords).length;
                this.initialWeightFactors[key] = lengthInPixels / (edge.length || 0);
            }
        }
        let i = 0;
        for (const vertex of Object.values(this.vertices)) {
            vertex.index = new Vector(i, i+1);
            i += 2;
        }
    }

    private minimizeLoss(): number[] {
        const gravitator = this;
        const params = {history: []};
        const initial: number[] = this.initializeWithStartStationPositions();
        const solution = fmin.conjugateGradient((A: number[], fxprime: number[]) => {
            fxprime = fxprime || A.slice();
            let fx = 0;
            fx = this.deltaToStartStationPositionsToEnsureInertness(fx, A, fxprime, gravitator);
            fx = this.deltaToNewDistancesToEnsureAccuracy(fx, A, fxprime, gravitator);
            this.scaleGradientToEnsureWorkingStepSize(fxprime);
            return fx;
        }, initial, params);
        return solution.x;
    }

    private initializeWithStartStationPositions(): number[] {
        const initial: number[] = [];
        for (const vertex of Object.values(this.vertices)) {
            initial[vertex.index.x] = vertex.startCoords.x;
            initial[vertex.index.y] = vertex.startCoords.y;
        }
        return initial;
    }

    private deltaX(A: number[], vertices: {[id: string] : {station: Station, index: Vector}}, termini: Stop[]): number {
        return A[vertices[termini[0].stationId].index.x] - A[vertices[termini[1].stationId].index.x];
    }

    private deltaY(A: number[], vertices: {[id: string] : {station: Station, index: Vector}}, termini: Stop[]): number {
        return A[vertices[termini[0].stationId].index.y] - A[vertices[termini[1].stationId].index.y];
    }

    private deltaToStartStationPositionsToEnsureInertness(fx: number, A: number[], fxprime: number[], gravitator: Gravitator): number {
        for (const vertex of Object.values(gravitator.vertices)) {
            fx += (
                    Math.pow(A[vertex.index.x]-vertex.startCoords.x, 2) +
                    Math.pow(A[vertex.index.y]-vertex.startCoords.y, 2)
                ) * Gravitator.INERTNESS;
            fxprime[vertex.index.x] = 2 * (A[vertex.index.x]-vertex.startCoords.x) * Gravitator.INERTNESS;
            fxprime[vertex.index.y] = 2 * (A[vertex.index.y]-vertex.startCoords.y) * Gravitator.INERTNESS;
        }
        return fx;
    }

    private deltaToNewDistancesToEnsureAccuracy(fx: number, A: number[], fxprime: number[], gravitator: Gravitator): number {
        for (const [key, edge] of Object.entries(gravitator.edges)) {                
            const v = Math.pow(this.deltaX(A, gravitator.vertices, edge.termini), 2)
                        + Math.pow(this.deltaY(A, gravitator.vertices, edge.termini), 2)
                        - Math.pow(gravitator.initialWeightFactors[key] * (edge.length || 0), 2);
            fx += Math.pow(v, 2);
            fxprime[gravitator.vertices[edge.termini[0].stationId].index.x] += +4 * v * this.deltaX(A, gravitator.vertices, edge.termini);
            fxprime[gravitator.vertices[edge.termini[0].stationId].index.y] += +4 * v * this.deltaY(A, gravitator.vertices, edge.termini);
            fxprime[gravitator.vertices[edge.termini[1].stationId].index.x] += -4 * v * this.deltaX(A, gravitator.vertices, edge.termini);
            fxprime[gravitator.vertices[edge.termini[1].stationId].index.y] += -4 * v * this.deltaY(A, gravitator.vertices, edge.termini);
        }
        return fx;
    }

    private scaleGradientToEnsureWorkingStepSize(fxprime: number[]): void {
        for (let i=0; i<fxprime.length; i++) {
            fxprime[i] *= Gravitator.GRADIENT_SCALE;
        }
    }

    private assertDistances(solution: number[]) {
        for (const [key, edge] of Object.entries(this.edges)) {
            const deviation = Math.abs(1 - Math.sqrt(
                Math.pow(this.deltaX(solution, this.vertices, edge.termini), 2) +
                Math.pow(this.deltaY(solution, this.vertices, edge.termini), 2)
            ) / (this.initialWeightFactors[key] * (edge.length || 0)));
            if (deviation > Gravitator.DEVIATION_WARNING) {
                console.warn(edge.name, 'diverges by ', deviation);
            }
        }
    } 

    private moveStationsAndLines(solution: number[], delay: number, animate: boolean): number {
        const animationDurationSeconds = animate ? 3 : 0;
        for (const vertex of Object.values(this.vertices)) {
            vertex.station.move(delay, animationDurationSeconds, new Vector(solution[vertex.index.x], solution[vertex.index.y]));
        }
        for (const edge of Object.values(this.edges)) {
            edge.move(delay, animationDurationSeconds, [this.getNewStationPosition(edge.termini[0].stationId, solution), this.getNewStationPosition(edge.termini[1].stationId, solution)]);
        }
        delay += animationDurationSeconds;
        return delay;
    }

    private getNewStationPosition(stationId: string, solution: number[]): Vector {
        return new Vector(solution[this.vertices[stationId].index.x], solution[this.vertices[stationId].index.y]);
    }

    private addVertex(vertexId: string) {
        if (this.vertices[vertexId] == undefined) {
            const station = this.stationProvider.stationById(vertexId);
            if (station == undefined)
                throw new Error('Station with ID ' + vertexId + ' is undefined');
            this.vertices[vertexId] = {station: station, index: Vector.NULL, startCoords: station.baseCoords};
        }
    }

    addEdge(line: Line) {
        if (line.length == undefined) 
            return;
        const id = this.getIdentifier(line);
        this.edges[id] = line;
    }

    private getIdentifier(line: Line) {
        return Utils.alphabeticId(line.termini[0].stationId, line.termini[1].stationId);
    }
}
