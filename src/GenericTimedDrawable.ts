import { TimedDrawable, Timed } from "./Drawable";
import { Vector } from "./Vector";

export interface GenericTimedDrawableAdapter extends Timed {
    name: string;
    boundingBox: {tl: Vector, br: Vector};
    zoom: Vector;
    draw(delaySeconds: number): void;
    erase(delaySeconds: number): void;
}

export class GenericTimedDrawable implements TimedDrawable {
    static LABEL_HEIGHT = 12;

    constructor(private adapter: GenericTimedDrawableAdapter) {

    }

    from = this.adapter.from;
    to = this.adapter.to;
    name = this.adapter.name;

    draw(delay: number, animate: boolean): number {
        this.adapter.draw(delay);
        return 0;
    }

    erase(delay: number, animate: boolean, reverse: boolean): number {
        this.adapter.erase(delay);
        return 0;
    }

    get boundingBox(): {tl: Vector, br: Vector} {
        const bbox = this.adapter.boundingBox;

        const center = this.adapter.zoom;
        if (this.adapter.zoom != Vector.NULL) {
            const zoomBbox = this.calculateBoundingBoxForZoom(center.x, center.y, bbox);
            console.log('zoom', zoomBbox);
            return zoomBbox;
        }
        return bbox;
    }

    private calculateBoundingBoxForZoom(percentX: number, percentY: number, bbox: {tl: Vector, br: Vector}): {tl: Vector, br: Vector} {
        const delta = bbox.tl.delta(bbox.br);
        const relativeCenter = new Vector(percentX/100, percentY/100);
        const center = bbox.tl.add(new Vector(delta.x*relativeCenter.x, delta.y*relativeCenter.y));
        const edgeDistance = new Vector(delta.x*Math.min(relativeCenter.x, 1-relativeCenter.x), delta.y*Math.min(relativeCenter.y, 1-relativeCenter.y));
        return {tl: center.add(new Vector(-edgeDistance.x, -edgeDistance.y)), br: center.add(edgeDistance)};
    }
}