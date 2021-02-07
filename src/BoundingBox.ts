import { Vector } from "./Vector";

export class BoundingBox {
    constructor(public tl: Vector, public br: Vector) {
    }

    static from(tl_x: number, tl_y: number, br_x: number, br_y: number): BoundingBox {
        return new BoundingBox(new Vector(tl_x, tl_y), new Vector(br_x, br_y));
    }
    
    get dimensions(): Vector {
        return this.tl.delta(this.br);
    }
    isNull() {
        return this.tl == Vector.NULL || this.br == Vector.NULL;
    }
    
    calculateBoundingBoxForZoom(percentX: number, percentY: number): BoundingBox {
        const bbox = this;
        const delta = bbox.dimensions;
        const relativeCenter = new Vector(percentX / 100, percentY / 100);
        const center = bbox.tl.add(new Vector(delta.x * relativeCenter.x, delta.y * relativeCenter.y));
        const edgeDistance = new Vector(delta.x * Math.min(relativeCenter.x, 1 - relativeCenter.x), delta.y * Math.min(relativeCenter.y, 1 - relativeCenter.y));
        const ratioPreservingEdgeDistance = new Vector(edgeDistance.y * delta.x / delta.y, edgeDistance.x * delta.y / delta.x);
        const minimalEdgeDistance = new Vector(Math.min(edgeDistance.x, ratioPreservingEdgeDistance.x), Math.min(edgeDistance.y, ratioPreservingEdgeDistance.y));
        return new BoundingBox(center.add(new Vector(-minimalEdgeDistance.x, -minimalEdgeDistance.y)), center.add(minimalEdgeDistance));
    }
}
