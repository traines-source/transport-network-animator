import { TimedDrawable, Timed, BoundingBox } from "./Drawable";
import { Vector } from "./Vector";

export interface GenericTimedDrawableAdapter extends Timed {
    name: string;
    boundingBox: BoundingBox;
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

    get boundingBox(): BoundingBox {
        const bbox = this.adapter.boundingBox;

        const center = this.adapter.zoom;
        if (this.adapter.zoom != Vector.NULL) {
            const zoomBbox = this.calculateBoundingBoxForZoom(center.x, center.y, bbox);
            console.log('zoom', zoomBbox);
            return zoomBbox;
        }
        return bbox;
    }

    private calculateBoundingBoxForZoom(percentX: number, percentY: number, bbox: BoundingBox): BoundingBox {
        const delta = bbox.dimensions;
        const relativeCenter = new Vector(percentX/100, percentY/100);
        const center = bbox.tl.add(new Vector(delta.x*relativeCenter.x, delta.y*relativeCenter.y));
        const edgeDistance = new Vector(delta.x*Math.min(relativeCenter.x, 1-relativeCenter.x), delta.y*Math.min(relativeCenter.y, 1-relativeCenter.y));
        return new BoundingBox(center.add(new Vector(-edgeDistance.x, -edgeDistance.y)), center.add(edgeDistance));
    }
}