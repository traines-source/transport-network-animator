import { TimedDrawable, Timed } from "./Drawable";
import { BoundingBox } from "./BoundingBox";
import { Vector } from "./Vector";
import { Zoomer } from "./Zoomer";
import { Instant } from "./Instant";

export interface GenericTimedDrawableAdapter extends Timed {
    name: string;
    boundingBox: BoundingBox;
    zoom: Vector;
    draw(delaySeconds: number, animationDurationSeconds: number, zoomCenter: Vector, zoomScale: number): void;
    erase(delaySeconds: number): void;
}

export class GenericTimedDrawable implements TimedDrawable {
    static LABEL_HEIGHT = 12;

    constructor(private adapter: GenericTimedDrawableAdapter) {

    }

    from = this.adapter.from;
    to = this.adapter.to;
    name = this.adapter.name;
    boundingBox = this.adapter.boundingBox;

    draw(delay: number, animate: boolean): number {
        const zoomer = new Zoomer(this.boundingBox);
        zoomer.include(this.getZoomedBoundingBox(), Instant.BIG_BANG, Instant.BIG_BANG, true, true, false);
        this.adapter.draw(delay, this.adapter.from.delta(this.adapter.to), zoomer.center, zoomer.scale);
        return 0;
    }

    erase(delay: number, animate: boolean, reverse: boolean): number {
        this.adapter.erase(delay);
        return 0;
    }

    private getZoomedBoundingBox(): BoundingBox {
        const bbox = this.adapter.boundingBox;

        const center = this.adapter.zoom;
        if (center != Vector.NULL) {
            const zoomBbox = bbox.calculateBoundingBoxForZoom(center.x, center.y);
            console.log('zoom', zoomBbox);
            return zoomBbox;
        }
        return bbox;
    }

    
}