import { Station } from "./Station";
import { Vector } from "../Vector";
import Delaunator from "delaunator";
import { AbstractTimedDrawableAdapter, AbstractTimedDrawable } from "./AbstractTimedDrawable";

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
    private canvasSides: { corner: Vector, side: Vector }[] = [];

    constructor(protected adapter: CrumpledImageAdapter) {
        super(adapter);
    }

    initialize(stations: Station[]) {
        this.vertices = stations.map(n => ({currentCoords: () => n.baseCoords, startCoords: n.baseCoords}));
        this.canvasSides = this.getCanvasSides();
        let delaunay = this.getDelaunator();
        
        this.setVerticesExtendedToCanvasBoundaries(delaunay.triangles, delaunay.halfedges);

        delaunay = this.getDelaunator();
        this.setTriangles(delaunay.triangles);
    }

    private getDelaunator(): Delaunator<Vertex> {
        return Delaunator.from(this.vertices, n => n.startCoords.x, n => n.startCoords.y);
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

    private setVerticesExtendedToCanvasBoundaries(triangles: Uint32Array, halfEdges: Int32Array) {     
        for (let i = 0; i < halfEdges.length; i++) {
            if (halfEdges[i] == -1) {
                const c = this.vertices[triangles[i]];
                const b = this.vertices[triangles[this.prevHalfedge(i)]];
                const a = this.vertices[triangles[this.nextHalfedge(i)]];

                const ba = b.startCoords.delta(a.startCoords);
                const bc = b.startCoords.delta(c.startCoords);
                const baFactor = this.factorToExtendVectorToCanvasBoundaries(b.startCoords, ba);
                const bcFactor = this.factorToExtendVectorToCanvasBoundaries(b.startCoords, bc);
                const aExtendedStartCoords = b.startCoords.add(ba.scale(baFactor));
                const cExtendedStartCoords = b.startCoords.add(bc.scale(bcFactor));

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
    }

    private nextHalfedge(e: number) { 
        return (e % 3 === 2) ? e - 2 : e + 1;
    }
    
    private prevHalfedge(e: number) { 
        return (e % 3 === 0) ? e + 2 : e - 1;
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

    private extendCurrentVector(origin: Vertex, direction: Vertex, factor: number) {
        return origin.currentCoords().add(origin.currentCoords().delta(direction.currentCoords()).scale(factor));
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