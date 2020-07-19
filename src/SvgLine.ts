import { TimedDrawable } from "./Drawable";
import { LineProvider, Line } from "./Line";
import { Vector } from "./Vector";
import { Stop } from "./Station";
import { Instant } from "./Instant";

export class SvgLine implements LineProvider {
    private _stops: Stop[] = [];

    constructor(private element: SVGPathElement) {

    }

    get name(): string {
        return this.element.dataset.line || '';
    }

    get from(): Instant {
        return this.getInstant('from');
    }

    get to(): Instant {
        return this.getInstant('to');
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


    get stops(): Stop[] {
        if (this._stops.length == 0) {
            const tokens = this.element.dataset.stops?.split(/\s+/) || [];
            let nextStop = new Stop('', '');
            for(var i=0;i<tokens?.length;i++) {                
                if (tokens[i][0] != '-' && tokens[i][0] != '+') {
                    nextStop.stationId = tokens[i];
                    this._stops.push(nextStop);
                    nextStop = new Stop('', '');
                } else {
                    nextStop.preferredTrack = tokens[i];
                }
            }
        }
        return this._stops;
    }

    rerenderLine(path: Vector[], animate: boolean) {
        let length = this.getTotalLength(path);
    
        const d = 'M' + path.map(v => v.x+','+v.y).join(' L');
        this.element.setAttribute('d', d);
    
        let dashedPart = length + '';
        const presetDash = getComputedStyle(this.element).strokeDasharray.replace(/[^0-9\s,]+/g, '');
        if (presetDash.length > 0) {
            let presetArray = presetDash.split(/[\s,]+/);
            if (presetArray.length % 2 == 1)
                presetArray = presetArray.concat(presetArray);
            const presetLength = presetArray.map(a => parseInt(a) || 0).reduce((a, b) => a+b, 0);
            dashedPart = new Array(Math.ceil(length / presetLength + 1)).join(presetArray.join(' ') + ' ') + '0';
        }
        this.element.style.strokeDasharray = dashedPart + ' ' + length;
        if (!animate) {
            length = 0;
        }
        this.animateFrame(length);
    }
    
    private animateFrame(length: number) {
        if (length > 0) {
            this.element.style.strokeDashoffset = length + '';
            length -= Line.SPEED;
            const line = this;
            window.requestAnimationFrame(function() { line.animateFrame(length); });
        } else {
            this.element.style.strokeDashoffset = '0';
        }
    }

    private getTotalLength(path: Vector[]) {
        let length = 0;
        for (let i=0; i<path.length-1; i++) {
            length += path[i].delta(path[i+1]).length;
        }
        return length;
    }
    
}