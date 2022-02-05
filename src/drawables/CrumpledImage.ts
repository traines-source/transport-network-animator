import { Station } from "./Station";
import { Vector } from "../Vector";
import Delaunator from "delaunator";
import { AbstractTimedDrawableAdapter, AbstractTimedDrawable } from "./AbstractTimedDrawable";

interface Vertex {station: Station, startCoords: Vector};

export interface CrumpledImageAdapter extends AbstractTimedDrawableAdapter {
    draw(delaySeconds: number, animationDurationSeconds: number, triangles: {src: Vector[], dst: Station[]}[]): void;
    erase(delaySeconds: number): void;
}

export class CrumpledImage extends AbstractTimedDrawable {

    private vertices: Vertex[] = [];
    private triangles: {a: Vertex, b: Vertex, c: Vertex}[] = [];
    private extendToCanvas: {a: Vertex, b: Vertex, c: Vertex, aExtendedStartCoords: Vector, cExtendedStartCoords: Vector, baFactor: number, bcFactor: number}[] = [];

    constructor(protected adapter: CrumpledImageAdapter) {
        super(adapter);
    }

    initialize(stations: Station[]) {
        
        this.vertices = stations.map(n => ({station: n, startCoords: n.baseCoords}));
        const delaunay = Delaunator.from(this.vertices, n => n.startCoords.x, n => n.startCoords.y);
        
        this.setTriangles(delaunay.triangles);
        this.setTrianglesExtendedToCanvasBoundaries(delaunay.triangles, delaunay.halfedges);
        
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
                const a = this.vertices[triangles[i]];
                const b = this.vertices[triangles[this.prevHalfedge(i)]];
                const c = this.vertices[triangles[this.nextHalfedge(i)]];

                single.push([a.startCoords, c.startCoords]);

                const ba = b.startCoords.delta(a.startCoords);
                const bc = b.startCoords.delta(c.startCoords);
                const baFactor = this.factorToExtendVectorToCanvasBoundaries(b.startCoords, ba);
                const bcFactor = this.factorToExtendVectorToCanvasBoundaries(b.startCoords, bc);
                this.extendToCanvas.push({
                    a: a,
                    b: b,
                    c: c,
                    aExtendedStartCoords: b.startCoords.add(ba.scale(baFactor)),
                    cExtendedStartCoords: b.startCoords.add(bc.scale(bcFactor)),
                    baFactor: baFactor,
                    bcFactor: bcFactor,
                });
            }
        }
        //console.log(this.extendToCanvas.map(v => [v.aExtendedStartCoords, v.cExtendedStartCoords]).map(v => v[0].x + " " + v[0].y + " L " +  v[1].x + " " + v[1].y).join(" M "));
        //console.log(single.map(v => v[0].x + " " + v[0].y + " L " +  v[1].x + " " + v[1].y).join(" M "));
    }

    private factorToExtendVectorToCanvasBoundaries(origin: Vector, extend: Vector): number {
        const canvasSides = this.getCanvasSides();
        for (let i=0; i<canvasSides.length; i++) {
            const solution = canvasSides[i].corner.delta(origin).solveDeltaForIntersection(canvasSides[i].side, extend);
            if (solution.a >= 0 && solution.a <= 1 && solution.b >= 0) {
                return solution.b;
            }
        }
        throw new Error(extend + " does not seem to intersect with canvas boundaries, which is impossible.");
    }

    private getCanvasSides(): {corner: Vector, side: Vector}[] {
        const tl = this.adapter.boundingBox.tl;
        const br = this.adapter.boundingBox.br;
        const t = new Vector(br.x-tl.x, 0);
        const r = new Vector(0, tl.y-br.y);
        const b = new Vector(tl.x-br.x, 0);
        const l = new Vector(0, br.y-tl.y);
        return [
            { corner: tl, side: t },
            { corner: br, side: r },
            { corner: br, side: b },
            { corner: tl, side: l }
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
        this.adapter.draw(delay, animationDurationSeconds,
            this.triangles.map(t => ({src: [t.a.startCoords, t.b.startCoords, t.c.startCoords], dst: [t.a.station, t.b.station, t.c.station]})));
        return 0;
    }

    erase(delay: number, animate: boolean, reverse: boolean): number {
        this.adapter.erase(delay);
        return 0;
    }
}