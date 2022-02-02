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
    private edges: {[id: string]: {line: Line, inclination: Vector}} = {};
    private vertices: {[id: string]: {station: Station, index: Vector, startCoords: Vector}} = {};
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
        const startTime = performance.now()
        const solution = this.minimizeLoss();
        console.log("Time taken for optimization:", performance.now()-startTime, "(incl: "+Config.default.gravitatorUseInclinationInertness+")");
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
            this.gradientScale = 1/Math.pow(euclidian, 2)*Config.default.gravitatorGradientScale;
            console.log('averageEuclidianLengthRatio^-1', 1/this.averageEuclidianLengthRatio);
        }
    }

    private getWeightsSum() {
        let sum = 0;
        for (const edge of Object.values(this.edges)) {
            sum += edge.line.weight || 0;
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

    private edgeVector(edge: {line: Line, inclination: Vector}): Vector {
        return this.vertices[edge.line.termini[1].stationId].station.baseCoords.delta(this.vertices[edge.line.termini[0].stationId].station.baseCoords);
    }

    private initializeGraph() {
        for (const [key, edge] of Object.entries(this.edges)) {
            if (this.initialWeightFactors[key] == undefined) {
                this.initialWeightFactors[key] = Config.default.gravitatorInitializeRelativeToEuclidianDistance
                    ? 1 / this.averageEuclidianLengthRatio
                    : this.edgeVector(edge).length / (edge.line.weight || 0);
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
        for (const [key, e] of Object.entries(this.edges)) {
            const edge = e.line;
            const normXStart = e.inclination.x;
            const normYStart = e.inclination.y;
            
            const deltaXCurrent = this.deltaX(A, this.vertices, edge.termini);
            const deltaYCurrent = this.deltaY(A, this.vertices, edge.termini);
            const squaredDeltaCurrent = Math.pow(deltaXCurrent, 2)+Math.pow(deltaYCurrent, 2);
            const normCurrent = this.averageEuclidianLength / Math.sqrt(squaredDeltaCurrent);
            const normXCurrent = deltaXCurrent * normCurrent;
            const normYCurrent = deltaYCurrent * normCurrent;

            const normXDelta = normXCurrent-normXStart;
            const normYDelta = normYCurrent-normYStart;
            fx += (
                Math.pow(normXDelta, 2) +
                Math.pow(normYDelta, 2)
            ) * Config.default.gravitatorInertness;

            const deltaXCurrentPrimeX0 = 1;
            const deltaXCurrentPrimeX1 = -1;
            const deltaXCurrentPrimeY0 = 0;
            const deltaXCurrentPrimeY1 = 0;
            const deltaYCurrentPrimeX0 = 0;
            const deltaYCurrentPrimeX1 = 0;
            const deltaYCurrentPrimeY0 = 1;
            const deltaYCurrentPrimeY1 = -1;

            const squareRootPrime = Math.pow(squaredDeltaCurrent,-3/2);
            const normCurrentPrimeX0 = -this.averageEuclidianLength*(deltaXCurrent*deltaXCurrentPrimeX0+deltaYCurrent*deltaYCurrentPrimeX0)*squareRootPrime;
            const normCurrentPrimeX1 = -this.averageEuclidianLength*(deltaXCurrent*deltaXCurrentPrimeX1+deltaYCurrent*deltaYCurrentPrimeX1)*squareRootPrime;
            const normCurrentPrimeY0 = -this.averageEuclidianLength*(deltaXCurrent*deltaXCurrentPrimeY0+deltaYCurrent*deltaYCurrentPrimeY0)*squareRootPrime;
            const normCurrentPrimeY1 = -this.averageEuclidianLength*(deltaXCurrent*deltaXCurrentPrimeY1+deltaYCurrent*deltaYCurrentPrimeY1)*squareRootPrime;
            
            const normXCurrentPrimeX0 = deltaXCurrentPrimeX0*normCurrent+deltaXCurrent*normCurrentPrimeX0;
            const normXCurrentPrimeX1 = deltaXCurrentPrimeX1*normCurrent+deltaXCurrent*normCurrentPrimeX1;
            const normXCurrentPrimeY0 = deltaXCurrentPrimeY0*normCurrent+deltaXCurrent*normCurrentPrimeY0;
            const normXCurrentPrimeY1 = deltaXCurrentPrimeY1*normCurrent+deltaXCurrent*normCurrentPrimeY1;
            const normYCurrentPrimeX0 = deltaYCurrentPrimeX0*normCurrent+deltaYCurrent*normCurrentPrimeX0;
            const normYCurrentPrimeX1 = deltaYCurrentPrimeX1*normCurrent+deltaYCurrent*normCurrentPrimeX1;
            const normYCurrentPrimeY0 = deltaYCurrentPrimeY0*normCurrent+deltaYCurrent*normCurrentPrimeY0;
            const normYCurrentPrimeY1 = deltaYCurrentPrimeY1*normCurrent+deltaYCurrent*normCurrentPrimeY1;

            const c = 2 * Config.default.gravitatorInertness;
            fxprime[this.vertices[edge.termini[0].stationId].index.x] += c * (normXDelta * normXCurrentPrimeX0 + normYDelta * normYCurrentPrimeX0);
            fxprime[this.vertices[edge.termini[0].stationId].index.y] += c * (normXDelta * normXCurrentPrimeY0 + normYDelta * normYCurrentPrimeY0);
            fxprime[this.vertices[edge.termini[1].stationId].index.x] += c * (normXDelta * normXCurrentPrimeX1 + normYDelta * normYCurrentPrimeX1);
            fxprime[this.vertices[edge.termini[1].stationId].index.y] += c * (normXDelta * normXCurrentPrimeY1 + normYDelta * normYCurrentPrimeY1);
        }
        return fx;
    }

    private deltaToNewDistancesToEnsureAccuracy(fx: number, A: number[], fxprime: number[]): number {
        for (const [key, e] of Object.entries(this.edges)) {
            const edge = e.line;
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
        let sum = 0;
        for (const [key, e] of Object.entries(this.edges)) {
            const edge = e.line;
            const deviation = Math.sqrt(
                Math.pow(this.deltaX(solution, this.vertices, edge.termini), 2) +
                Math.pow(this.deltaY(solution, this.vertices, edge.termini), 2)
            ) / (this.initialWeightFactors[key] * (edge.weight || 0)) - 1;
            sum += deviation;
            if (Math.abs(deviation) > Gravitator.DEVIATION_WARNING) {
                console.warn(edge.name, 'diverges by ', deviation);
            }
        }
        console.log("Total relative deviation", sum);
    } 

    private moveStationsAndLines(solution: number[], delay: number, animate: boolean): number {
        const animationDurationSeconds = animate
            ? Math.min(Config.default.gravitatorAnimMaxDurationSeconds, this.getTotalDistanceToMove(solution) / Config.default.gravitatorAnimSpeed)
            : 0;
        for (const vertex of Object.values(this.vertices)) {
            vertex.station.move(delay, animationDurationSeconds, new Vector(solution[vertex.index.x], solution[vertex.index.y]));
        }
        for (const e of Object.values(this.edges)) {
            const edge = e.line;
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

    private startEdgeInclination(line: Line): Vector {
        const deltaXStart = this.deltaXStart(this.vertices, line.termini);
        const deltaYStart = this.deltaYStart(this.vertices, line.termini);
        const normStart = this.averageEuclidianLength / Math.sqrt(Math.pow(deltaXStart, 2)+Math.pow(deltaYStart, 2));
        return new Vector(deltaXStart / normStart, deltaYStart / normStart);
    }

    addEdge(line: Line) {
        if (line.weight == undefined) 
            return;
        this.dirty = true;
        const id = this.getIdentifier(line);
        this.addVertex(line.termini[0].stationId);
        this.addVertex(line.termini[1].stationId);
        this.edges[id] = {line: line, inclination: this.startEdgeInclination(line)};
    }

    private getIdentifier(line: Line) {
        return Utils.alphabeticId(line.termini[0].stationId, line.termini[1].stationId);
    }
}
