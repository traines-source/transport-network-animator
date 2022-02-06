import { Station } from "./Station";
import { Vector } from "../Vector";
import Delaunator from "delaunator";
import { AbstractTimedDrawableAdapter, AbstractTimedDrawable } from "./AbstractTimedDrawable";
import { Rotation } from "../Rotation";

export interface Vertex {currentCoords: () => Vector, startCoords: Vector};
export interface Triangle {a: Vertex, b: Vertex, c: Vertex};

export interface CrumpledImageAdapter extends AbstractTimedDrawableAdapter {
    draw(delaySeconds: number, animationDurationSeconds: number, triangles: Triangle[]): void;
    erase(delaySeconds: number): void;
}

export class CrumpledImage extends AbstractTimedDrawable {
    static EXTEND_BEYOND_CANVAS_FACTOR = 2;

    private vertices: Vertex[] = [];
    private triangles: Triangle[] = [];
    private extendToCanvas: {triangle: Triangle, aExtendedStartCoords: Vector, cExtendedStartCoords: Vector, baFactor: number, bcFactor: number}[] = [];
    private canvasSides: { corner: Vector, side: Vector }[] = [];

    constructor(protected adapter: CrumpledImageAdapter) {
        super(adapter);
    }

    initialize(stations: Station[]) {
        this.vertices = stations.map(n => ({currentCoords: () => n.baseCoords, startCoords: n.baseCoords}));
        this.canvasSides = this.getCanvasSides();
        let delaunay = Delaunator.from(this.vertices, n => n.startCoords.x, n => n.startCoords.y);
        
        this.setTriangles(delaunay.triangles);
        this.setTrianglesExtendedToCanvasBoundaries(delaunay.triangles, delaunay.halfedges);
        //this.setTrianglesExtendedToCanvasCorners();

        delaunay = Delaunator.from(this.vertices, n => n.startCoords.x, n => n.startCoords.y);
        this.setTriangles(delaunay.triangles);
    }

    private setTriangles(triangles: Uint32Array) {
        for (let i = 0; i < triangles.length; i += 3) {
            this.triangles.push({
                a: this.vertices[triangles[i]],
                b: this.vertices[triangles[i + 1]],
                c: this.vertices[triangles[i + 2]]
            });
        }
    }

    private setTrianglesExtendedToCanvasBoundaries(triangles: Uint32Array, halfEdges: Int32Array) {
        const single: Vector[][] = [];
        for (let i = 0; i < halfEdges.length; i++) {
            if (halfEdges[i] == -1) {
                const c = this.vertices[triangles[i]];
                const b = this.vertices[triangles[this.prevHalfedge(i)]];
                const a = this.vertices[triangles[this.nextHalfedge(i)]];

                single.push([a.startCoords, c.startCoords]);

                const ba = b.startCoords.delta(a.startCoords);
                const bc = b.startCoords.delta(c.startCoords);
                const baFactor = this.factorToExtendVectorToCanvasBoundaries(b.startCoords, ba);
                const bcFactor = this.factorToExtendVectorToCanvasBoundaries(b.startCoords, bc);
                const aExtendedStartCoords = b.startCoords.add(ba.scale(baFactor));
                const cExtendedStartCoords = b.startCoords.add(bc.scale(bcFactor));
                this.extendToCanvas.push({
                    triangle: {a: a, b: b, c: c},
                    aExtendedStartCoords: aExtendedStartCoords,
                    cExtendedStartCoords: cExtendedStartCoords,
                    baFactor: baFactor,
                    bcFactor: bcFactor,
                });
                this.vertices.push({
                    currentCoords: () => this.extendCurrentVector(b, a, baFactor),
                    startCoords: aExtendedStartCoords
                });
                this.vertices.push({
                    currentCoords: () => this.extendCurrentVector(b, c, bcFactor),
                    startCoords: cExtendedStartCoords
                });
            }
        }
        //console.log(this.extendToCanvas.map(v => [v.aExtendedStartCoords, v.cExtendedStartCoords]).map(v => v[0].x + " " + v[0].y + " L " +  v[1].x + " " + v[1].y).join(" M "));
        //console.log(single.map(v => v[0].x + " " + v[0].y + " L " +  v[1].x + " " + v[1].y).join(" M "));
    }

    private extendCurrentVector(origin: Vertex, direction: Vertex, factor: number) {
        return origin.currentCoords().add(origin.currentCoords().delta(direction.currentCoords()).scale(factor));
    }

    private setTrianglesExtendedToCanvasCorners() {
        for (let i=0; i<this.canvasSides.length; i++) {
            let minAngleBefore = Rotation.from("n");
            let minAngleAfter = Rotation.from("n");
            let minExtended = -1;
            for (let j=0; j<this.extendToCanvas.length; j++) {
                const e = this.extendToCanvas[i];
                const extendedToCorner = e.triangle.b.startCoords.delta(this.canvasSides[i].corner);
                const angleBefore = e.triangle.b.startCoords.delta(e.aExtendedStartCoords).angle(extendedToCorner);
                const angleAfter = e.triangle.b.startCoords.delta(e.cExtendedStartCoords).angle(extendedToCorner);
                /*const dist = this.extendToCanvas[i].aExtendedStartCoords.delta(this.canvasSides[i].corner).length +
                    this.extendToCanvas[i].cExtendedStartCoords.delta(this.canvasSides[i].corner).length;*/
                if (minExtended == -1 || angleBefore.degrees + angleAfter.degrees < minAngleBefore.degrees + minAngleAfter.degrees) {
                    minAngleBefore = angleBefore;
                    minAngleAfter = angleAfter;
                    minExtended = i;
                }
            }

            const e = this.extendToCanvas[minExtended];
            const interpolatedFactor = (minAngleBefore.degrees*e.baFactor+minAngleAfter.degrees*e.bcFactor)/(minAngleBefore.degrees+minAngleAfter.degrees);
            const interpolatedExtend = {currentCoords: () => new Vector(0, 0), startCoords: this.canvasSides[i].corner};
            this.vertices.push({
                currentCoords: () => this.extendCurrentVector(e.triangle.b, interpolatedExtend, interpolatedFactor),
                startCoords: this.canvasSides[i].corner
            });
        }
    }

    private factorToExtendVectorToCanvasBoundaries(origin: Vector, extend: Vector): number {
        for (let i=0; i<this.canvasSides.length; i++) {
            const solution = this.canvasSides[i].corner.delta(origin).solveDeltaForIntersection(this.canvasSides[i].side, extend);
            if (solution.a >= 0 && solution.a <= 1 && solution.b >= 0) {
                return solution.b*CrumpledImage.EXTEND_BEYOND_CANVAS_FACTOR;
            }
        }
        throw new Error(extend + " does not seem to intersect with canvas boundaries, which is impossible.");
    }

    private getCanvasSides(): {corner: Vector, side: Vector}[] {
        const tl = this.adapter.boundingBox.tl;
        const br = this.adapter.boundingBox.br;
        const tr = new Vector(br.x, tl.y);
        const bl = new Vector(tl.x, br.y);
        const t = new Vector(tr.x-tl.x, 0);
        const r = new Vector(0, br.y-tr.y);
        const b = new Vector(bl.x-br.x, 0);
        const l = new Vector(0, tl.y-bl.y);
        return [
            { corner: tl, side: t },
            { corner: tr, side: r },
            { corner: br, side: b },
            { corner: bl, side: l }
        ];
    }

    private nextHalfedge(e: number) { 
        return (e % 3 === 2) ? e - 2 : e + 1;
    }
    
    private prevHalfedge(e: number) { 
        return (e % 3 === 0) ? e + 2 : e - 1;
    }

    draw(delay: number, animate: boolean, reverse: boolean): number {
        this.adapter.draw(delay, 0, []);
        return 0;
    }

    crumple(delay: number, animationDurationSeconds: number) {
        this.adapter.draw(delay, animationDurationSeconds, this.triangles);
        return 0;
    }

    erase(delay: number, animate: boolean, reverse: boolean): number {
        this.adapter.erase(delay);
        return 0;
    }
}