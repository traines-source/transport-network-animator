import { Instant } from "../Instant";
import { Vector } from "../Vector";
import { BoundingBox } from "../BoundingBox";
import { AbstractTimedDrawableAdapter } from "../drawables/AbstractTimedDrawable";

export class SvgAbstractTimedDrawable implements AbstractTimedDrawableAdapter {

    constructor(protected element: SVGGraphicsElement) {

    }

    get name(): string {
        return this.element.getAttribute('name') || this.element.getAttribute('src') || '';
    }

    get from(): Instant {
        return this.getInstant('from');
    }

    get to(): Instant {
        return this.getInstant('to');
    }

    get boundingBox(): BoundingBox {
        const r = this.element.getBBox();
        return new BoundingBox(new Vector(r.x, r.y), new Vector(r.x+r.width, r.y+r.height));
    }

    private getInstant(fromOrTo: string): Instant {
        if (this.element.dataset[fromOrTo] != undefined) {
            const arr = this.element.dataset[fromOrTo]?.split(/\s+/)
            if (arr != undefined) {
                return Instant.from(arr);
            }
        }
        return Instant.BIG_BANG;
    }
}