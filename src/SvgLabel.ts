import { Rotation } from "./Rotation";
import { LabelAdapter } from "./Label";
import { Instant } from "./Instant";
import { Vector } from "./Vector";
import { Utils } from "./Utils";

export class SvgLabel implements LabelAdapter {
    
    constructor(private element: SVGTextElement) {

    }

    get from(): Instant {
        return this.getInstant('from');
    }

    get to(): Instant {
        return this.getInstant('to');
    }

    get forStation(): string | undefined {
        return this.element.dataset.station;
    }

    get boundingBox(): {tl: Vector, br: Vector} {
        return {tl: Vector.NULL, br: Vector.NULL};
    }

    draw(delaySeconds: number, textCoords: Vector, labelDir: Rotation): void {
        if (delaySeconds > 0) {
            const label = this;
            window.setTimeout(function() { label.draw(0, textCoords, labelDir); }, delaySeconds * 1000);
            return;
        }
        this.setCoord(this.element, textCoords);
        const labelunitv = Vector.UNIT.rotate(labelDir);
        this.element.style.textAnchor = Utils.trilemma(labelunitv.x, ['end', 'middle', 'start']);
        this.element.style.dominantBaseline = Utils.trilemma(labelunitv.y, ['baseline', 'middle', 'hanging']);
        this.element.style.visibility = 'visible';
        this.element.className.baseVal += ' station';
    }

    erase(delaySeconds: number): void {
        this.element.style.display = 'none';
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

    private setCoord(element: any, coord: Vector): void {
        element.setAttribute('x', coord.x);
        element.setAttribute('y', coord.y);
    }

}