import { StationAdapter } from "../drawables/Station";
import { Vector } from "../Vector";
import { Rotation } from "../Rotation";
import { SvgAnimator } from "./SvgAnimator";
import { SvgAbstractTimedDrawable } from "./SvgAbstractTimedDrawable";
import { Config } from "../Config";
import { SvgStationAttributes } from "./SvgApi";

export class SvgStation extends SvgAbstractTimedDrawable implements StationAdapter, SvgStationAttributes {

    constructor(protected element: SVGRectElement) {
        super(element);
    }

    get id(): string {
        if (this.element.dataset.station != undefined) {
        return this.element.dataset.station;
        }
        throw new Error('Station needs to have a data-station identifier');
    }

    get baseCoords(): Vector {
        return new Vector(parseFloat(this.element.getAttribute('x') || '') || 0, parseFloat(this.element.getAttribute('y') || '') || 0);
    }

    set baseCoords(baseCoords: Vector) {
        this.element.setAttribute('x', baseCoords.x + ''); 
        this.element.setAttribute('y', baseCoords.y + ''); 
    }
    
    get lonLat(): Vector | undefined {
        const str = this.element.dataset.lonLat?.split(' ');
        if (str == undefined)
            return undefined;
        return new Vector(parseFloat(str[0]), parseFloat(str[1]));
    }

    get rotation(): Rotation {
        return Rotation.from(this.element.dataset.dir || 'n');
    }
    /**
     * öasdfkljsdfklj
     */
    get labelDir(): Rotation {
        return Rotation.from(this.element.dataset.labelDir || 'n');
    }

    draw(delaySeconds: number, getPositionBoundaries: () => {[id: string]: [number, number]}): void {
        const animator = new SvgAnimator();
        animator.wait(delaySeconds*1000, () => {
            const positionBoundaries = getPositionBoundaries();
            const stopDimen = [positionBoundaries.x[1] - positionBoundaries.x[0], positionBoundaries.y[1] - positionBoundaries.y[0]];
            
            if (!this.element.className.baseVal.includes('station')) {
                this.element.className.baseVal += ' station ' + this.id;
            }
            this.element.style.visibility = stopDimen[0] < 0 && stopDimen[1] < 0 ? 'hidden' : 'visible';
    
            this.element.setAttribute('width', (Math.max(stopDimen[0], 0) * Config.default.lineDistance + Config.default.defaultStationDimen) + '');
            this.element.setAttribute('height', (Math.max(stopDimen[1], 0) * Config.default.lineDistance + Config.default.defaultStationDimen) + '');
            this.updateTransformOrigin();
            const x = Math.min(positionBoundaries.x[0], 0) * Config.default.lineDistance - Config.default.defaultStationDimen / 2;
            const y = Math.min(positionBoundaries.y[0], 0) * Config.default.lineDistance - Config.default.defaultStationDimen / 2;
            this.element.setAttribute('transform','rotate(' + this.rotation.degrees + ') translate(' + x + ',' + y + ')');
    
        });
    }

    private updateTransformOrigin() {
        this.element.setAttribute('transform-origin', this.baseCoords.x + ' ' + this.baseCoords.y);
    }

    move(delaySeconds: number, animationDurationSeconds: number, from: Vector, to: Vector, callback: () => void): void {
        const animator = new SvgAnimator();
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
        const animator = new SvgAnimator();
        animator.wait(delaySeconds*1000, () => {
            this.element.style.visibility = 'hidden';
        });
    }
    
}