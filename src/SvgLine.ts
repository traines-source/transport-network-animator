import { LineAdapter, Line } from "./Line";
import { Vector } from "./Vector";
import { Stop } from "./Station";
import { Instant } from "./Instant";
import { SvgNetwork } from "./SvgNetwork";

export class SvgLine implements LineAdapter {

    private _stops: Stop[] = [];
    boundingBox = {tl: Vector.NULL, br: Vector.NULL};

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

    get weight(): number | undefined {
        if (this.element.dataset.length == undefined) {
            return undefined;
        }
        return parseInt(this.element.dataset.length);
    }

    private updateBoundingBox(path: Vector[]): void {
        for(let i=0;i<path.length;i++) {
            this.boundingBox.tl = this.boundingBox.tl.bothAxisMins(path[i]);
            this.boundingBox.br = this.boundingBox.br.bothAxisMaxs(path[i]);
        }
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
                if (tokens[i][0] != '-' && tokens[i][0] != '+' && tokens[i][0] != '*') {
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

    draw(delaySeconds: number, animationDurationSeconds: number, path: Vector[], length: number): void {
        this.updateBoundingBox(path);
        if (delaySeconds > 0) {
            const line = this;
            window.setTimeout(function () { line.draw(0, animationDurationSeconds, path, length); }, delaySeconds * 1000);
            return;
        }
    
        this.element.className.baseVal += ' ' + this.name;
        this.createPath(path);
    
        this.updateDasharray(length);        
        if (animationDurationSeconds == 0) {
            length = 0;
        }
        this.animateFrame(length, 0, -length/animationDurationSeconds/SvgNetwork.FPS);
    }

    move(delaySeconds: number, animationDurationSeconds: number, from: Vector[], to: Vector[]) {
        this.updateBoundingBox(to);
        if (delaySeconds > 0) {
            const line = this;
            window.setTimeout(function () { line.move(0, animationDurationSeconds, from, to); }, delaySeconds * 1000);
            return;
        }
        this.animateFrameVector(from, to, 0, 1/animationDurationSeconds/SvgNetwork.FPS);
    }

    erase(delaySeconds: number, animationDurationSeconds: number, reverse: boolean, length: number): void {
        if (delaySeconds > 0) {
            const line = this;
            window.setTimeout(function() { line.erase(0, animationDurationSeconds, reverse, length); }, delaySeconds * 1000);
            return;
        }
        let from = 0;
        if (animationDurationSeconds == 0) {
            from = length;
        }
        const direction = reverse ? -1 : 1;
        this.animateFrame(from, length * direction, length/animationDurationSeconds/SvgNetwork.FPS * direction);
    }

    private createPath(path: Vector[]) {
        const d = 'M' + path.map(v => v.x+','+v.y).join(' L');
        this.element.setAttribute('d', d);
    }

    private updateDasharray(length: number) {
        let dashedPart = length + '';
        if (this.element.dataset.dashInitial == undefined) {
            this.element.dataset.dashInitial = getComputedStyle(this.element).strokeDasharray.replace(/[^0-9\s,]+/g, '');
        }
        if (this.element.dataset.dashInitial.length > 0) {
            let presetArray = this.element.dataset.dashInitial.split(/[\s,]+/);
            if (presetArray.length % 2 == 1)
                presetArray = presetArray.concat(presetArray);
            const presetLength = presetArray.map(a => parseInt(a) || 0).reduce((a, b) => a + b, 0);
            dashedPart = new Array(Math.ceil(length / presetLength + 1)).join(presetArray.join(' ') + ' ') + '0';
        }
        this.element.style.strokeDasharray = dashedPart + ' ' + length;
    }
    
    private animateFrame(from: number, to: number, animationPerFrame: number): void {
        if (animationPerFrame < 0 && from > to || animationPerFrame > 0 && from < to) {
            this.element.style.strokeDashoffset = from + '';
            from += animationPerFrame;
            const line = this;
            window.requestAnimationFrame(function() { line.animateFrame(from, to, animationPerFrame); });
        } else {
            this.element.style.strokeDashoffset = to + '';
            if (to != 0) {
                this.element.style.visibility = 'hidden';
            }
        }
    }

    private animateFrameVector(from: Vector[], to: Vector[], x: number, animationPerFrame: number): void {
        if (x < 1) {
            const interpolated = [];
            for (let i=0; i<from.length; i++) {
                interpolated.push(from[i].between(to[i], x));
            }
            this.updateDasharray(interpolated[0].delta(interpolated[interpolated.length-1]).length); // TODO arbitrary node count
            this.createPath(interpolated);

            x += animationPerFrame;
            const line = this;
            window.requestAnimationFrame(function() { line.animateFrameVector(from, to, x, animationPerFrame); });
        } else {
            this.updateDasharray(to[0].delta(to[to.length-1]).length);
            this.createPath(to);
        }
    }
}