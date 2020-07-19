import { TimedDrawable, Timed } from "./Drawable";
import { Station } from "./Station";
import { Rotation } from "./Rotation";
import { LabelAdapter } from "./Label";
import { Instant } from "./Instant";
import { StationProvider } from "./Network";
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

    draw(textCoords: Vector, labelDir: Rotation): void {
        this.setCoord(this.element, textCoords);
        const labelunitv = Vector.UNIT.rotate(labelDir);
        this.element.style.textAnchor = Utils.tripleDecision(labelunitv.x, ['end', 'middle', 'start']);
        this.element.style.dominantBaseline = Utils.tripleDecision(labelunitv.y, ['baseline', 'middle', 'hanging']);
        this.element.style.visibility = 'visible';
        this.element.className.baseVal += ' station';
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

    private setCoord(element: any, coord: Vector) {
        element.setAttribute('x', coord.x);
        element.setAttribute('y', coord.y);
    }


}