import { LineAdapter } from "../Line";
import { Vector } from "../Vector";
import { Stop } from "../Station";
import { Instant } from "../Instant";
import { BoundingBox } from "../BoundingBox";
import { Animator } from "../Animator";

export class SvgLine implements LineAdapter {

    private _stops: Stop[] = [];
    boundingBox = new BoundingBox(Vector.NULL, Vector.NULL);

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

    get totalLength(): number {
        return this.element.getTotalLength();
    }

    get speed(): number | undefined {
        if (this.element.dataset.speed == undefined) {
            return undefined;
        }
        return parseInt(this.element.dataset.speed);
    }

    private updateBoundingBox(path: Vector[]): void {
        if (path.length == 0) {
            if (this.element.style.visibility == 'visible') {
                const r = this.element.getBBox();
                this.boundingBox = new BoundingBox(new Vector(r.x, r.y), new Vector(r.x+r.width, r.y+r.height));
                return;
            }
            this.boundingBox = new BoundingBox(Vector.NULL, Vector.NULL);
            return;
        }
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
                    nextStop.trackInfo = tokens[i];
                }
            }
        }
        return this._stops;
    }

    draw(delaySeconds: number, animationDurationSeconds: number, path: Vector[], length: number, colorDeviation: number): void {
        this.updateBoundingBox(path);

        const animator = new Animator();
        animator.wait(delaySeconds * 1000, () => {
            this.element.className.baseVal += ' line ' + this.name;
            this.element.style.visibility = 'visible';
            this.createPath(path);
        
            this.updateDasharray(length);
            if (colorDeviation != 0) {
                this.updateColor(colorDeviation);
            }
            if (animationDurationSeconds == 0) {
                length = 0;
            }
            animator
                .from(length)
                .to(0)
                .animate(animationDurationSeconds * 1000, (x: number, isLast: boolean) => this.animateFrame(x, isLast));
        });
    }

    move(delaySeconds: number, animationDurationSeconds: number, from: Vector[], to: Vector[], colorFrom: number, colorTo: number) {
        this.updateBoundingBox(to);
        const animator = new Animator();
        animator.wait(delaySeconds*1000, () => {
            animator.animate(animationDurationSeconds*1000, (x, isLast) => this.animateFrameVector(from, to, colorFrom, colorTo, x, isLast));
        });
    }

    erase(delaySeconds: number, animationDurationSeconds: number, reverse: boolean, length: number): void {
        const animator = new Animator();
        animator.wait(delaySeconds * 1000, () => {
            let from = 0;
            if (animationDurationSeconds == 0) {
                from = length;
            }
            const direction = reverse ? -1 : 1;
            animator
                .from(from)
                .to(length*direction)
                .animate(animationDurationSeconds*1000, (x, isLast) => this.animateFrame(x, isLast));
        });
    }

    private createPath(path: Vector[]) {
        if (path.length == 0) {
            return;
        }
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

    private updateColor(deviation: number) {
        this.element.style.stroke = 'rgb(' + Math.max(0, deviation) * 256 + ', 0, ' + Math.min(0, deviation) * -256 + ')';
    }
    
    private animateFrame(x: number, isLast: boolean): boolean {
        this.element.style.strokeDashoffset = x + '';
        if (isLast && x != 0) {
            this.element.style.visibility = 'hidden';
        }
        return true;
    }

    private animateFrameVector(from: Vector[], to: Vector[], colorFrom: number, colorTo: number, x: number, isLast: boolean): boolean {
        if (!isLast) {
            const interpolated = [];
            for (let i=0; i<from.length; i++) {
                interpolated.push(from[i].between(to[i], x));
            }
            this.updateDasharray(interpolated[0].delta(interpolated[interpolated.length-1]).length); // TODO arbitrary node count
            this.createPath(interpolated);
            this.updateColor((colorTo-colorFrom)*x+colorFrom);
        } else {
            this.updateDasharray(to[0].delta(to[to.length-1]).length);
            this.createPath(to);
        }
        return true;
    }
}