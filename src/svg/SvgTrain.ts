import { Vector } from "../Vector";
import { Stop } from "../drawables/Station";
import { BoundingBox } from "../BoundingBox";
import { TrainAdapter } from "../drawables/Train";
import { Rotation } from "../Rotation";
import { SvgAnimator } from "./SvgAnimator";
import { SvgAbstractTimedDrawable } from "./SvgAbstractTimedDrawable";
import { SvgUtils } from "./SvgUtils";
import { Config } from "../Config";
import { SvgTrainAttributes } from "./SvgApi";

export class SvgTrain extends SvgAbstractTimedDrawable implements TrainAdapter, SvgTrainAttributes {

    private _stops: Stop[] = [];

    constructor(protected element: SVGPathElement) {
        super(element);
    }

    get name(): string {
        return this.element.dataset.train || '';
    }

    get boundingBox(): BoundingBox {
        return new BoundingBox(Vector.NULL, Vector.NULL);
    }

    get length(): number {
        if (this.element.dataset.length == undefined) {
            return 2;
        }
        return parseInt(this.element.dataset.length);
    }

    get stops(): Stop[] {
        if (this._stops.length == 0) {
            this._stops = SvgUtils.readStops(this.element.dataset.stops);
        }
        return this._stops;
    }

    draw(delaySeconds: number, animationDurationSeconds: number, follow: { path: Vector[], from: number, to: number }): void {
        this.element.className.baseVal += ' train';
        this.setPath(this.calcTrainHinges(this.getPathLength(follow).lengthToStart, follow.path));
        if (!this.from.flag.includes('autoshow')) {
            const animator = new SvgAnimator();
            animator.wait(delaySeconds*1000, () => {
                this.show(animationDurationSeconds);
            });
        }
    }

    move(delaySeconds: number, animationDurationSeconds: number, follow: { path: Vector[], from: number, to: number }) {
        const animator = new SvgAnimator();
        animator.wait(delaySeconds*1000, () => {
            this.show(animationDurationSeconds != 0 ? Config.default.fadeDurationSeconds : 0);
            const pathLength = this.getPathLength(follow);
            animator
                .ease(SvgAnimator.EASE_SINE)
                .from(pathLength.lengthToStart)
                .to(pathLength.lengthToStart+pathLength.totalBoundedLength)
                .timePassed(delaySeconds < 0 ? (-delaySeconds*1000) : 0)
                .animate(animationDurationSeconds*1000, (x, isLast) => this.animateFrame(x, isLast, follow.path, animationDurationSeconds));
        });
    }

    private getPathLength(follow: { path: Vector[], from: number, to: number }): { lengthToStart: number, totalBoundedLength: number } {
        let lengthToStart = 0;
        let totalBoundedLength = 0;
        for (let i = 0; i < follow.path.length - 1; i++) {
            const l = follow.path[i].delta(follow.path[i + 1]).length;
            if (i < follow.from) {
                lengthToStart += l;
            } else if (i < follow.to) {
                totalBoundedLength += l;
            }
        }
        return { lengthToStart: lengthToStart, totalBoundedLength: totalBoundedLength };
    }

    private getPositionByLength(current: number, path: Vector[]): Vector {
        let thresh = 0;
        for (let i = 0; i < path.length - 1; i++) {
            const delta = path[i].delta(path[i + 1]);
            const l = delta.length;
            if (thresh + l >= current) {
                return path[i].between(path[i + 1], (current - thresh) / l).add(delta.rotate(new Rotation(90)).withLength(Config.default.trainTrackOffset));
            }
            thresh += l;
        }
        return path[path.length - 1];
    }

    erase(delaySeconds: number, animationDurationSeconds: number): void {
        const animator = new SvgAnimator();
        animator.wait(delaySeconds*1000, () => {
            this.hide(animationDurationSeconds);
        });
    }

    private setPath(path: Vector[]) {
        const d = 'M' + path.map(v => v.x + ',' + v.y).join(' L');
        this.element.setAttribute('d', d);
    }

    private calcTrainHinges(front: number, path: Vector[]): Vector[] {
        const newTrain: Vector[] = [];
        for (let i = 0; i < this.length + 1; i++) {
            newTrain.push(this.getPositionByLength(front - i * Config.default.trainWagonLength, path));
        }
        return newTrain;
    }

    private animateFrame(x: number, isLast: boolean, path: Vector[], animationDurationSeconds: number): boolean {
        const trainPath = this.calcTrainHinges(x, path);
        this.setPath(trainPath);
        if (isLast && this.from.flag.includes('autoshow')) {
            this.hide(animationDurationSeconds != 0 ? Config.default.fadeDurationSeconds : 0);
        }
        return true;
    }
}