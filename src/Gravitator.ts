import { Station, Stop } from "./drawables/Station";
import { Vector } from "./Vector";
import { Line } from "./drawables/Line";
import { Utils } from "./Utils";
import { StationProvider } from "./Network";
import { Config } from "./Config";

const fmin = require('fmin');


export class Gravitator {
    static DEVIATION_WARNING = 0.2;

    private initialWeightFactors: {[id: string] : number} = {};
    private averageEuclidianLengthRatio: number = -1;
    private averageEuclidianLength = 1;
    private edges: {[id: string]: Line} = {};
    private vertices: {[id: string] : {station: Station, index: Vector, startCoords: Vector}} = {};
    private dirty = false;
    private gradientScale = 0;

    constructor(private stationProvider: StationProvider) {
        
    }

    gravitate(delay: number, animate: boolean): number {
        if (!this.dirty)
            return delay;
        this.dirty = false;
        this.initialize();
        this.initializeGraph();
        const solution = this.minimizeLoss();
        this.assertDistances(solution);
        return this.moveStationsAndLines(solution, delay, animate);
    }

    private initialize() {
        const weights = this.getWeightsSum();
        const euclidian = this.getEuclidianDistanceSum();
        const edgeCount = Object.values(this.edges).length;
        console.log('weights:', weights, 'euclidian:', euclidian);        
        if (this.averageEuclidianLengthRatio == -1 && edgeCount > 0) {
            this.averageEuclidianLengthRatio = weights / euclidian;
            this.averageEuclidianLength = euclidian / edgeCount;
            console.log('averageEuclidianLengthRatio^-1', 1/this.averageEuclidianLengthRatio);
        }
        this.gradientScale = 1/Math.pow(euclidian, 2)*Config.default.gravitatorGradientScale;
    }

    private getWeightsSum() {
        let sum = 0;
        for (const edge of Object.values(this.edges)) {
            sum += edge.weight || 0;
        }
        return sum;
    }

    private getEuclidianDistanceSum() {
        let sum = 0;
        for (const edge of Object.values(this.edges)) {
            sum += this.edgeVector(edge).length;
        }
        return sum;
    }

    private edgeVector(edge: Line): Vector {
        return this.vertices[edge.termini[1].stationId].station.baseCoords.delta(this.vertices[edge.termini[0].stationId].station.baseCoords);
    }

    private initializeGraph() {
        for (const [key, edge] of Object.entries(this.edges)) {
            if (this.initialWeightFactors[key] == undefined) {
                this.initialWeightFactors[key] = Config.default.gravitatorInitializeRelativeToEuclidianDistance
                    ? 1 / this.averageEuclidianLengthRatio
                    : this.edgeVector(edge).length / (edge.weight || 0);
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
        const start: number[] = this.startStationPositions();
        const solution = fmin.conjugateGradient((A: number[], fxprime: number[]) => {
            fxprime = fxprime || A.slice();
            for (let i=0; i<fxprime.length; i++) {
                fxprime[i] = 0;
            }
            let fx = 0;
            if (Config.default.gravitatorUseInclinationInertness) {
                fx = gravitator.deltaToInclinationToEnsureInertness(fx, A, fxprime);
            } else {
                fx = gravitator.deltaToStartStationPositionsToEnsureInertness(fx, A, fxprime);
                fx = gravitator.deltaToCurrentStationPositionsToEnsureInertness(fx, A, fxprime);
            }            
            fx = gravitator.deltaToNewDistancesToEnsureAccuracy(fx, A, fxprime);
            gravitator.scaleGradientToEnsureWorkingStepSize(fxprime);
            return fx;
        }, start, params);
        return solution.x;
    }

    private startStationPositions(): number[] {
        const start: number[] = [];
        for (const vertex of Object.values(this.vertices)) {
            start[vertex.index.x] = vertex.startCoords.x;
            start[vertex.index.y] = vertex.startCoords.y;
        }
        return start;
    }

    private deltaX(A: number[], vertices: {[id: string] : {station: Station, index: Vector}}, termini: Stop[]): number {
        return A[vertices[termini[0].stationId].index.x] - A[vertices[termini[1].stationId].index.x];
    }

    private deltaY(A: number[], vertices: {[id: string] : {station: Station, index: Vector}}, termini: Stop[]): number {
        return A[vertices[termini[0].stationId].index.y] - A[vertices[termini[1].stationId].index.y];
    }

    private deltaXStart(vertices: {[id: string] : {station: Station, startCoords: Vector}}, termini: Stop[]): number {
        return vertices[termini[0].stationId].startCoords.x - vertices[termini[1].stationId].startCoords.x;
    }

    private deltaYStart(vertices: {[id: string] : {station: Station, startCoords: Vector}}, termini: Stop[]): number {
        return vertices[termini[0].stationId].startCoords.y - vertices[termini[1].stationId].startCoords.y;
    }

    private deltaToStartStationPositionsToEnsureInertness(fx: number, A: number[], fxprime: number[]): number {
        for (const vertex of Object.values(this.vertices)) {
            fx += (
                    Math.pow(A[vertex.index.x]-vertex.startCoords.x, 2) +
                    Math.pow(A[vertex.index.y]-vertex.startCoords.y, 2)
                ) * Config.default.gravitatorInertness;
            fxprime[vertex.index.x] += 2 * (A[vertex.index.x]-vertex.startCoords.x) * Config.default.gravitatorInertness;
            fxprime[vertex.index.y] += 2 * (A[vertex.index.y]-vertex.startCoords.y) * Config.default.gravitatorInertness;
        }
        return fx;
    }

    private deltaToCurrentStationPositionsToEnsureInertness(fx: number, A: number[], fxprime: number[]): number {
        for (const vertex of Object.values(this.vertices)) {
            fx += (
                    Math.pow(A[vertex.index.x]-vertex.station.baseCoords.x, 2) +
                    Math.pow(A[vertex.index.y]-vertex.station.baseCoords.y, 2)
                ) * Config.default.gravitatorInertness;
            fxprime[vertex.index.x] += 2 * (A[vertex.index.x]-vertex.station.baseCoords.x) * Config.default.gravitatorInertness;
            fxprime[vertex.index.y] += 2 * (A[vertex.index.y]-vertex.station.baseCoords.y) * Config.default.gravitatorInertness;
        }
        return fx;
    }

    private deltaToInclinationToEnsureInertness(fx: number, A: number[], fxprime: number[]): number {
        for (const [key, edge] of Object.entries(this.edges)) {
            const deltaXStart = this.deltaXStart(this.vertices, edge.termini);
            const deltaYStart = this.deltaYStart(this.vertices, edge.termini);
            const normStart = this.averageEuclidianLength / Math.sqrt(Math.pow(deltaXStart, 2)+Math.pow(deltaYStart, 2));
            const normXStart = deltaXStart / normStart;
            const normYStart = deltaYStart / normStart;
            
            const deltaXCurrent = this.deltaX(A, this.vertices, edge.termini);
            const deltaYCurrent = this.deltaY(A, this.vertices, edge.termini);
            const squaredDeltaCurrent = Math.pow(deltaXCurrent, 2)+Math.pow(deltaYCurrent, 2);
            const normCurrent = this.averageEuclidianLength / Math.sqrt(squaredDeltaCurrent);
            const normXCurrent = deltaXCurrent * normCurrent;
            const normYCurrent = deltaYCurrent * normCurrent;

            fx += (
                Math.pow(normXCurrent-normXStart, 2) +
                Math.pow(normYCurrent-normYStart, 2)
            ) * Config.default.gravitatorInertness;

            const deltaXCurrentPrimeX0 = 1;
            const deltaXCurrentPrimeX1 = -1;
            const deltaXCurrentPrimeY0 = 0;
            const deltaXCurrentPrimeY1 = 0;
            const deltaYCurrentPrimeX0 = 0;
            const deltaYCurrentPrimeX1 = 0;
            const deltaYCurrentPrimeY0 = 1;
            const deltaYCurrentPrimeY1 = -1;

            const normCurrentPrimeX0 = -this.averageEuclidianLength*(deltaXCurrent*deltaXCurrentPrimeX0+deltaYCurrent*deltaYCurrentPrimeX0)*Math.pow(squaredDeltaCurrent,-3/2);
            const normCurrentPrimeX1 = -this.averageEuclidianLength*(deltaXCurrent*deltaXCurrentPrimeX1+deltaYCurrent*deltaYCurrentPrimeX1)*Math.pow(squaredDeltaCurrent,-3/2);
            const normCurrentPrimeY0 = -this.averageEuclidianLength*(deltaXCurrent*deltaXCurrentPrimeY0+deltaYCurrent*deltaYCurrentPrimeY0)*Math.pow(squaredDeltaCurrent,-3/2);
            const normCurrentPrimeY1 = -this.averageEuclidianLength*(deltaXCurrent*deltaXCurrentPrimeY1+deltaYCurrent*deltaYCurrentPrimeY1)*Math.pow(squaredDeltaCurrent,-3/2);
            
            const normXCurrentPrimeX0 = deltaXCurrentPrimeX0*normCurrent+deltaXCurrent*normCurrentPrimeX0;
            const normXCurrentPrimeX1 = deltaXCurrentPrimeX1*normCurrent+deltaXCurrent*normCurrentPrimeX1;
            const normXCurrentPrimeY0 = deltaXCurrentPrimeY0*normCurrent+deltaXCurrent*normCurrentPrimeY0;
            const normXCurrentPrimeY1 = deltaXCurrentPrimeY1*normCurrent+deltaXCurrent*normCurrentPrimeY1;
            const normYCurrentPrimeX0 = deltaYCurrentPrimeX0*normCurrent+deltaYCurrent*normCurrentPrimeX0;
            const normYCurrentPrimeX1 = deltaYCurrentPrimeX1*normCurrent+deltaYCurrent*normCurrentPrimeX1;
            const normYCurrentPrimeY0 = deltaYCurrentPrimeY0*normCurrent+deltaYCurrent*normCurrentPrimeY0;
            const normYCurrentPrimeY1 = deltaYCurrentPrimeY1*normCurrent+deltaYCurrent*normCurrentPrimeY1;

            const c = 2 * Config.default.gravitatorInertness;
            fxprime[this.vertices[edge.termini[0].stationId].index.x] += c * ((normXCurrent-normXStart) * normXCurrentPrimeX0 + (normYCurrent-normYStart) * normYCurrentPrimeX0);
            fxprime[this.vertices[edge.termini[0].stationId].index.y] += c * ((normXCurrent-normXStart) * normXCurrentPrimeY0 + (normYCurrent-normYStart) * normYCurrentPrimeY0);
            fxprime[this.vertices[edge.termini[1].stationId].index.x] += c * ((normXCurrent-normXStart) * normXCurrentPrimeX1 + (normYCurrent-normYStart) * normYCurrentPrimeX1);
            fxprime[this.vertices[edge.termini[1].stationId].index.y] += c * ((normXCurrent-normXStart) * normXCurrentPrimeY1 + (normYCurrent-normYStart) * normYCurrentPrimeY1);
        }
        return fx;
    }

    private deltaToNewDistancesToEnsureAccuracy(fx: number, A: number[], fxprime: number[]): number {
        for (const [key, edge] of Object.entries(this.edges)) {                
            const v = Math.pow(this.deltaX(A, this.vertices, edge.termini), 2)
                        + Math.pow(this.deltaY(A, this.vertices, edge.termini), 2)
                        - Math.pow(this.initialWeightFactors[key] * (edge.weight || 0), 2);
            fx += Math.pow(v, 2);
            fxprime[this.vertices[edge.termini[0].stationId].index.x] += +4 * v * this.deltaX(A, this.vertices, edge.termini);
            fxprime[this.vertices[edge.termini[0].stationId].index.y] += +4 * v * this.deltaY(A, this.vertices, edge.termini);
            fxprime[this.vertices[edge.termini[1].stationId].index.x] += -4 * v * this.deltaX(A, this.vertices, edge.termini);
            fxprime[this.vertices[edge.termini[1].stationId].index.y] += -4 * v * this.deltaY(A, this.vertices, edge.termini);
        }
        return fx;
    }

    private scaleGradientToEnsureWorkingStepSize(fxprime: number[]): void {
        for (let i=0; i<fxprime.length; i++) {
            fxprime[i] *= this.gradientScale;
        }
    }

    private assertDistances(solution: number[]) {
        for (const [key, edge] of Object.entries(this.edges)) {
            const deviation = Math.sqrt(
                Math.pow(this.deltaX(solution, this.vertices, edge.termini), 2) +
                Math.pow(this.deltaY(solution, this.vertices, edge.termini), 2)
            ) / (this.initialWeightFactors[key] * (edge.weight || 0)) - 1;
            if (Math.abs(deviation) > Gravitator.DEVIATION_WARNING) {
                console.warn(edge.name, 'diverges by ', deviation);
            }
        }
    } 

    private moveStationsAndLines(solution: number[], delay: number, animate: boolean): number {
        const animationDurationSeconds = animate
            ? Math.min(Config.default.gravitatorAnimMaxDurationSeconds, this.getTotalDistanceToMove(solution) / Config.default.gravitatorAnimSpeed)
            : 0;
        for (const vertex of Object.values(this.vertices)) {
            vertex.station.move(delay, animationDurationSeconds, new Vector(solution[vertex.index.x], solution[vertex.index.y]));
        }
        for (const edge of Object.values(this.edges)) {
            const coords = [this.getNewStationPosition(edge.termini[0].stationId, solution), this.getNewStationPosition(edge.termini[1].stationId, solution)];
            edge.move(delay, animationDurationSeconds, coords, this.getColorByDeviation(edge, edge.weight || 0));
        }
        delay += animationDurationSeconds;
        return delay;
    }

    private getColorByDeviation(edge: Line, weight: number) {
        const initialDist = this.vertices[edge.termini[0].stationId].startCoords.delta(this.vertices[edge.termini[1].stationId].startCoords).length;
        return Math.max(-1, Math.min(1, (weight - this.averageEuclidianLengthRatio * initialDist) * Config.default.gravitatorColorDeviation));
    }

    private getTotalDistanceToMove(solution: number[]) {
        let sum = 0;
        for (const vertex of Object.values(this.vertices)) {
            sum += new Vector(solution[vertex.index.x], solution[vertex.index.y]).delta(vertex.station.baseCoords).length;
        }
        return sum;
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
        if (line.weight == undefined) 
            return;
        this.dirty = true;
        const id = this.getIdentifier(line);
        this.edges[id] = line;
        this.addVertex(line.termini[0].stationId);
        this.addVertex(line.termini[1].stationId);
    }

    private getIdentifier(line: Line) {
        return Utils.alphabeticId(line.termini[0].stationId, line.termini[1].stationId);
    }
}
