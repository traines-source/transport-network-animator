import { Station } from "./Station";
import { Vector } from "./Vector";
import { Line } from "./Line";
import { Utils } from "./Utils";
import { StationProvider } from "./Network";

const fmin = require('fmin');


export class Gravitator {
    static INERTNESS = 5;
    static DEVIATION_WARNING = 0.1;

    private initialWeightFactors: {[id: string] : number} = {};
    private edges: {[id: string]: Line} = {};
    private vertices: {[id: string] : {station: Station, index: Vector}} = {};

    constructor(private stationProvider: StationProvider) {
        
    }

    gravitate() {
        this.obtainStations();
        const initial: number[] = [];
        for (const vertex of Object.values(this.vertices)) {
            initial[vertex.index.x] = vertex.station.baseCoords.x;
            initial[vertex.index.y] = vertex.station.baseCoords.y;            
        }
        const gravitator = this;
        const solution = fmin.nelderMead((X: number[]) => {
            let value = 0;
            for (const vertex of Object.values(gravitator.vertices)) {
                value += (
                        Math.pow(X[vertex.index.x]-vertex.station.baseCoords.x, 2) +
                        Math.pow(X[vertex.index.y]-vertex.station.baseCoords.y, 2)
                    ) / Gravitator.INERTNESS;
            }
            for (const [key, edge] of Object.entries(gravitator.edges)) {
                value += Math.pow(
                    Math.pow(X[gravitator.vertices[edge.termini[0].stationId].index.x] - X[gravitator.vertices[edge.termini[1].stationId].index.x], 2) +
                    Math.pow(X[gravitator.vertices[edge.termini[0].stationId].index.y] - X[gravitator.vertices[edge.termini[1].stationId].index.y], 2) -
                    Math.pow(gravitator.initialWeightFactors[key] * (edge.length || 0), 2),
                2);
            }
            return value;
        }, initial);
        console.log('solution:', solution.x);
        console.log(this.vertices);
        console.log(this.initialWeightFactors);
        console.log(this.edges);
        for (const [key, edge] of Object.entries(gravitator.edges)) {
            if (Math.abs(1 - Math.sqrt(
                Math.pow(solution.x[gravitator.vertices[edge.termini[0].stationId].index.x] - solution.x[gravitator.vertices[edge.termini[1].stationId].index.x], 2) +
                Math.pow(solution.x[gravitator.vertices[edge.termini[0].stationId].index.y] - solution.x[gravitator.vertices[edge.termini[1].stationId].index.y], 2)
            ) / (gravitator.initialWeightFactors[key] * (edge.length || 0))) > Gravitator.DEVIATION_WARNING) {
                console.warn(edge.name, 'diverges by more than', Gravitator.DEVIATION_WARNING )
            }
        }
        for (const vertex of Object.values(this.vertices)) {
            vertex.station.baseCoords = new Vector(solution.x[vertex.index.x], solution.x[vertex.index.y]);
        }
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

    private addVertex(vertexId: string) {
        if (this.vertices[vertexId] == undefined) {
            const station = this.stationProvider.stationById(vertexId);
            if (station == undefined)
                throw new Error('Station with ID ' + vertexId + ' is undefined');
            this.vertices[vertexId] = {station: station, index: Vector.NULL};
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
