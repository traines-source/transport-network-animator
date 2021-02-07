import { Station, Stop } from "./Station";
import { Vector } from "./Vector";
import { Line } from "./Line";
import { Utils } from "./Utils";
import { StationProvider } from "./Network";

//const mathjs = require('mathjs');
const fmin = require('fmin');


export class Gravitator {
    static INERTNESS = 50;
    static GRADIENT_SCALE = 0.000000001;
    static DEVIATION_WARNING = 0.1;
    static INITIALIZE_RELATIVE_TO_EUCLIDIAN_DISTANCE = true;
    static SPEED = 250;
    static MAX_ANIM_DURATION = 6;

    private initialWeightFactors: {[id: string] : number} = {};
    private initialAngles: {aStation: string, commonStation: string, bStation: string, angle: number}[] = [];
    private angleF: any;
    private angleFPrime: {[id: string]: any} = {};
    private averageEuclidianLengthRatio: number = -1;
    private edges: {[id: string]: Line} = {};
    private vertices: {[id: string] : {station: Station, index: Vector, startCoords: Vector}} = {};
    private dirty = false;

    constructor(private stationProvider: StationProvider) {
        
    }

    gravitate(delay: number, animate: boolean): number {
        if (!this.dirty)
            return delay;
        this.dirty = false;
        this.initialize();
        this.initializeGraph();
        const solution = this.minimizeLoss();
        console.log(this.edges);
        this.assertDistances(solution);
        return this.moveStationsAndLines(solution, delay, animate);
    }

    private initialize() {
        if (this.averageEuclidianLengthRatio == -1 && Object.values(this.edges).length > 0) {
            this.averageEuclidianLengthRatio = this.getWeightsSum() / this.getEuclidianDistanceSum();
            console.log('averageEuclidianLengthRatio^-1', 1/this.averageEuclidianLengthRatio);

            //this.initializeAngleGradients();
        }
        
    }

    /*private initializeAngleGradients() {
        const expression = '(acos(((b_x-a_x)*(b_x-c_x)+(b_y-a_y)*(b_y-c_y))/(sqrt((b_x-a_x)^2+(b_y-a_y)^2)*sqrt((b_x-c_x)^2+(b_y-c_y)^2)))*((b_y-c_y)*(b_x-a_x)-(b_y-a_y)*(b_x-c_x))/abs(((b_y-c_y)*(b_x-a_x)-(b_y-a_y)*(b_x-c_x)))-const)';
        const f = mathjs.parse(expression);
        this.angleF = f.compile();

        const fDelta = mathjs.parse(expression + '^2');

        const vars = ['a_x', 'a_y', 'b_x', 'b_y', 'c_x', 'c_y'];
        for (let i=0; i<vars.length; i++) {
            this.angleFPrime[vars[i]] = mathjs.derivative(fDelta, vars[i]).compile();
        }
    }*/

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
                this.initialWeightFactors[key] = Gravitator.INITIALIZE_RELATIVE_TO_EUCLIDIAN_DISTANCE
                    ? 1 / this.averageEuclidianLengthRatio
                    : this.edgeVector(edge).length / (edge.weight || 0);
                //this.addInitialAngles(edge);
            }
        }
        let i = 0;
        for (const vertex of Object.values(this.vertices)) {
            vertex.index = new Vector(i, i+1);
            i += 2;
        }
    }

    private addInitialAngles(edge: Line) {
        for (const adjacent of Object.values(this.edges)) {
            if (adjacent == edge) {
                continue;
            }
            for (let i=0; i<2; i++) {
                for (let j=0; j<2; j++) {
                    if (edge.termini[i].stationId == adjacent.termini[j].stationId) {
                        const angle = this.threeDotAngle(
                            this.vertices[edge.termini[i^1].stationId].station.baseCoords,
                            this.vertices[edge.termini[i].stationId].station.baseCoords,
                            this.vertices[adjacent.termini[j^1].stationId].station.baseCoords
                        );
                        this.initialAngles.push({
                            aStation: edge.termini[i^1].stationId,
                            commonStation: edge.termini[i].stationId,
                            bStation: adjacent.termini[j^1].stationId,
                            angle: angle
                        });
                        return;
                    }
                }
            }
        }
        //derive arccos(((a-c)*(e-g)+(b-d)*(f-h))/(sqrt((a-c)^2+(b-d)^2)*sqrt((e-g)^2+(f-h)^2)))*((f-h)*(a-c)-(b-d)*(e-g))/|((f-h)*(a-c)-(b-d)*(e-g))|
        //derive acos(((b_x-a_x)*(b_x-c_x)+(b_y-a_y)*(b_y-c_y))/(sqrt((b_x-a_x)^2+(b_y-a_y)^2)*sqrt((b_x-c_x)^2+(b_y-c_y)^2)))*((b_y-c_y)*(b_x-a_x)-(b_y-a_y)*(b_x-c_x))/abs(((b_y-c_y)*(b_x-a_x)-(b_y-a_y)*(b_x-c_x)))
    }

    private threeDotAngle(a: Vector, b: Vector, c: Vector) {
        return this.evaluateThreeDotFunction(this.angleF, a, b, c, 0);
    }

    private evaluateThreeDotFunction(f: any, a: Vector, b: Vector, c: Vector, oldValue: number) {
        return f.evaluate({a_x: a.x, a_y: a.y, b_x: b.x, b_y: b.y, c_x: c.x, c_y: c.y, const: oldValue});
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
            fx = this.deltaToStartStationPositionsToEnsureInertness(fx, A, fxprime, gravitator);
            fx = this.deltaToCurrentStationPositionsToEnsureInertness(fx, A, fxprime, gravitator);
            //fx = this.deltaToAnglesToEnsureInertness(fx, A, fxprime, gravitator);
            fx = this.deltaToNewDistancesToEnsureAccuracy(fx, A, fxprime, gravitator);
            this.scaleGradientToEnsureWorkingStepSize(fxprime);
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

    private deltaToStartStationPositionsToEnsureInertness(fx: number, A: number[], fxprime: number[], gravitator: Gravitator): number {
        for (const vertex of Object.values(gravitator.vertices)) {
            fx += (
                    Math.pow(A[vertex.index.x]-vertex.startCoords.x, 2) +
                    Math.pow(A[vertex.index.y]-vertex.startCoords.y, 2)
                ) * Gravitator.INERTNESS;
            fxprime[vertex.index.x] += 2 * (A[vertex.index.x]-vertex.startCoords.x) * Gravitator.INERTNESS;
            fxprime[vertex.index.y] += 2 * (A[vertex.index.y]-vertex.startCoords.y) * Gravitator.INERTNESS;
        }
        return fx;
    }

    private deltaToCurrentStationPositionsToEnsureInertness(fx: number, A: number[], fxprime: number[], gravitator: Gravitator): number {
        for (const vertex of Object.values(gravitator.vertices)) {
            fx += (
                    Math.pow(A[vertex.index.x]-vertex.station.baseCoords.x, 2) +
                    Math.pow(A[vertex.index.y]-vertex.station.baseCoords.y, 2)
                ) * Gravitator.INERTNESS;
            fxprime[vertex.index.x] += 2 * (A[vertex.index.x]-vertex.station.baseCoords.x) * Gravitator.INERTNESS;
            fxprime[vertex.index.y] += 2 * (A[vertex.index.y]-vertex.station.baseCoords.y) * Gravitator.INERTNESS;
        }
        return fx;
    }

    private deltaToAnglesToEnsureInertness(fx: number, A: number[], fxprime: number[], gravitator: Gravitator): number {
        for (const pair of Object.values(gravitator.initialAngles)) {
            const a = new Vector(A[gravitator.vertices[pair.aStation].index.x], A[gravitator.vertices[pair.aStation].index.y]);
            const b = new Vector(A[gravitator.vertices[pair.commonStation].index.x], A[gravitator.vertices[pair.commonStation].index.y]);
            const c = new Vector(A[gravitator.vertices[pair.bStation].index.x], A[gravitator.vertices[pair.bStation].index.y]);

            const delta = this.evaluateThreeDotFunction(this.angleF, a, b, c, pair.angle);
            console.log(delta);
            fx += Math.pow(delta, 2) * Gravitator.INERTNESS;

            fxprime[gravitator.vertices[pair.aStation].index.x] += this.evaluateThreeDotFunction(this.angleFPrime['a_x'], a, b, c, pair.angle) * Gravitator.INERTNESS;
            fxprime[gravitator.vertices[pair.aStation].index.y] += this.evaluateThreeDotFunction(this.angleFPrime['a_y'], a, b, c, pair.angle) * Gravitator.INERTNESS;
            fxprime[gravitator.vertices[pair.commonStation].index.x] += this.evaluateThreeDotFunction(this.angleFPrime['b_x'], a, b, c, pair.angle) * Gravitator.INERTNESS;
            fxprime[gravitator.vertices[pair.commonStation].index.y] += this.evaluateThreeDotFunction(this.angleFPrime['b_y'], a, b, c, pair.angle) * Gravitator.INERTNESS;
            fxprime[gravitator.vertices[pair.bStation].index.x] += this.evaluateThreeDotFunction(this.angleFPrime['c_x'], a, b, c, pair.angle) * Gravitator.INERTNESS;
            fxprime[gravitator.vertices[pair.bStation].index.y] += this.evaluateThreeDotFunction(this.angleFPrime['c_y'], a, b, c, pair.angle) * Gravitator.INERTNESS;
        }
        return fx;
    }

    private deltaToNewDistancesToEnsureAccuracy(fx: number, A: number[], fxprime: number[], gravitator: Gravitator): number {
        for (const [key, edge] of Object.entries(gravitator.edges)) {                
            const v = Math.pow(this.deltaX(A, gravitator.vertices, edge.termini), 2)
                        + Math.pow(this.deltaY(A, gravitator.vertices, edge.termini), 2)
                        - Math.pow(gravitator.initialWeightFactors[key] * (edge.weight || 0), 2);
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
            ) / (this.initialWeightFactors[key] * (edge.weight || 0)));
            if (deviation > Gravitator.DEVIATION_WARNING) {
                console.warn(edge.name, 'diverges by ', deviation);
            }
        }
    } 

    private moveStationsAndLines(solution: number[], delay: number, animate: boolean): number {
        const animationDurationSeconds = animate ? Math.min(Gravitator.MAX_ANIM_DURATION, this.getTotalDistanceToMove(solution) / Gravitator.SPEED) : 0;
        for (const vertex of Object.values(this.vertices)) {
            vertex.station.move(delay, animationDurationSeconds, new Vector(solution[vertex.index.x], solution[vertex.index.y]));
        }
        for (const edge of Object.values(this.edges)) {
            edge.move(delay, animationDurationSeconds, [this.getNewStationPosition(edge.termini[0].stationId, solution), this.getNewStationPosition(edge.termini[1].stationId, solution)]);
        }
        delay += animationDurationSeconds;
        return delay;
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
