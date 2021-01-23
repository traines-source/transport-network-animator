import { Instant } from "../Instant";
import { Vector } from "../Vector";
import { GenericTimedDrawableAdapter } from "../GenericTimedDrawable";
import { DEFAULT_MIN_VERSION } from "tls";

export class SvgGenericTimedDrawable implements GenericTimedDrawableAdapter {

    constructor(private element: SVGGraphicsElement) {

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

    get boundingBox(): {tl: Vector, br: Vector} {
        const r = this.element.getBBox();
        const bbox = {tl: new Vector(r.x, r.y), br: new Vector(r.x+r.width, r.y+r.height)};
        console.log('bbox', bbox);
        return bbox;
    }

    get zoom() {
        if (this.element.dataset['zoom'] != undefined) {
            const center = this.element.dataset['zoom'].split(' ');
            return new Vector(parseInt(center[0]) || 50, parseInt(center[1]) || 50);
        }
        return Vector.NULL;
    }

    draw(delaySeconds: number): void {
        if (delaySeconds > 0) {
            const label = this;
            window.setTimeout(function() { label.draw(0); }, delaySeconds * 1000);
            return;
        }
        this.element.style.visibility = 'visible';
    }

    erase(delaySeconds: number): void {
        if (delaySeconds > 0) {
            const label = this;
            window.setTimeout(function() { label.erase(0); }, delaySeconds * 1000);
            return;
        }
        this.element.style.visibility = 'hidden';
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