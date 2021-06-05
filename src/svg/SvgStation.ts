import { StationAdapter, Station } from "../Station";
import { Vector } from "../Vector";
import { Rotation } from "../Rotation";
import { Instant } from "../Instant";
import { Animator } from "../Animator";

export class SvgStation implements StationAdapter {

    constructor(private element: SVGRectElement) {

    }
    get id(): string {
        if (this.element.dataset.station != undefined) {
        return this.element.dataset.station;
        }
        throw new Error('Station needs to have a data-station identifier');
    }
    get baseCoords(): Vector {        
        return new Vector(parseInt(this.element.getAttribute('x') || '') || 0, parseInt(this.element.getAttribute('y') || '') || 0);
    }
    set baseCoords(baseCoords: Vector) {
        this.element.setAttribute('x', baseCoords.x + ''); 
        this.element.setAttribute('y', baseCoords.y + ''); 
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

    get rotation(): Rotation {
        return Rotation.from(this.element.dataset.dir || 'n');
    }
    get labelDir(): Rotation {
        return Rotation.from(this.element.dataset.labelDir || 'n');
    }

    draw(delaySeconds: number, getPositionBoundaries: () => {[id: string]: [number, number]}): void {
        const animator = new Animator();
        animator.wait(delaySeconds*1000, () => {
            const positionBoundaries = getPositionBoundaries();
            const stopDimen = [positionBoundaries.x[1] - positionBoundaries.x[0], positionBoundaries.y[1] - positionBoundaries.y[0]];
            
            if (!this.element.className.baseVal.includes('station')) {
                this.element.className.baseVal += ' station ' + this.id;
            }
            this.element.style.visibility = stopDimen[0] < 0 && stopDimen[1] < 0 ? 'hidden' : 'visible';
    
            this.element.setAttribute('width', (Math.max(stopDimen[0], 0) * Station.LINE_DISTANCE + Station.DEFAULT_STOP_DIMEN) + '');
            this.element.setAttribute('height', (Math.max(stopDimen[1], 0) * Station.LINE_DISTANCE + Station.DEFAULT_STOP_DIMEN) + '');
            this.updateTransformOrigin();
            this.element.setAttribute('transform','rotate(' + this.rotation.degrees + ') translate(' + (Math.min(positionBoundaries.x[0], 0) * Station.LINE_DISTANCE - Station.DEFAULT_STOP_DIMEN / 2) + ',' + (Math.min(positionBoundaries.y[0], 0) * Station.LINE_DISTANCE - Station.DEFAULT_STOP_DIMEN / 2) + ')');
    
        });
    }

    private updateTransformOrigin() {
        this.element.setAttribute('transform-origin', this.baseCoords.x + ' ' + this.baseCoords.y);
    }

    move(delaySeconds: number, animationDurationSeconds: number, from: Vector, to: Vector, callback: () => void): void {
        const animator = new Animator();
        animator.wait(delaySeconds*1000, () => {
            animator
                .animate(animationDurationSeconds*1000, (x, isLast) => this.animateFrameVector(x, isLast, from, to, callback));
        });
    }

    private animateFrameVector(x: number, isLast: boolean, from: Vector, to: Vector, callback: () => void): boolean {
        if (!isLast) {
            this.baseCoords = from.between(to, x);
        } else {
            this.baseCoords = to;
        }
        this.updateTransformOrigin();
        callback();
        return true;
    }

    erase(delaySeconds: number): void {
        const animator = new Animator();
        animator.wait(delaySeconds*1000, () => {
            this.element.style.visibility = 'hidden';
        });
    }
    
}