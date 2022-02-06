import { Instant } from "../Instant";
import { Vector } from "../Vector";
import { BoundingBox } from "../BoundingBox";
import { AbstractTimedDrawableAdapter } from "../drawables/AbstractTimedDrawable";
import { SvgAbstractTimedDrawableAttributes } from "./SvgApi";

export class SvgAbstractTimedDrawable implements AbstractTimedDrawableAdapter, SvgAbstractTimedDrawableAttributes {

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
        const lBox = this.element.getBBox();
        if (document.getElementById('zoomable') != undefined) {
            const zoomable = <SVGGraphicsElement> <unknown> document.getElementById('zoomable');
            const zRect = zoomable.getBoundingClientRect();
            const zBox = zoomable.getBBox();
            const lRect = this.element.getBoundingClientRect();
            const zScale = zBox.width/zRect.width;
            const x = (lRect.x-zRect.x)*zScale+zBox.x;
            const y = (lRect.y-zRect.y)*zScale+zBox.y;
            return new BoundingBox(new Vector(x, y), new Vector(x+lRect.width*zScale, y+lRect.height*zScale));
        }
        return new BoundingBox(new Vector(lBox.x, lBox.y), new Vector(lBox.x+lBox.width, lBox.y+lBox.height));
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