import { BoundingBox } from "./BoundingBox";
import { Vector } from "./Vector";
import { Zoomer } from "./Zoomer";
import { Instant } from "./Instant";
import { AbstractTimedDrawable, AbstractTimedDrawableAdapter } from "./AbstractTimedDrawable";

export interface KenImageAdapter extends AbstractTimedDrawableAdapter {
    zoom: Vector;
    draw(delaySeconds: number, animationDurationSeconds: number, zoomCenter: Vector, zoomScale: number): void;
    erase(delaySeconds: number): void;
}

export class KenImage extends AbstractTimedDrawable {

    constructor(protected adapter: KenImageAdapter) {
        super(adapter);
    }

    draw(delay: number, animate: boolean): number {
        const zoomer = new Zoomer(this.boundingBox);
        zoomer.include(this.getZoomedBoundingBox(), Instant.BIG_BANG, Instant.BIG_BANG, true, true, false);
        this.adapter.draw(delay, !animate ? 0 : this.adapter.from.delta(this.adapter.to), zoomer.center, zoomer.scale);
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
            return zoomBbox;
        }
        return bbox;
    }

}