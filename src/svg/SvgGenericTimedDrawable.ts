import { GenericTimedDrawableAdapter } from "../drawables/GenericTimedDrawable";
import { SvgAnimator } from "./SvgAnimator";
import { SvgAbstractTimedDrawable } from "./SvgAbstractTimedDrawable";

export class SvgGenericTimedDrawable extends SvgAbstractTimedDrawable implements GenericTimedDrawableAdapter {

    constructor(protected element: SVGGraphicsElement) {
        super(element);
    }

    draw(delaySeconds: number, animationDurationSeconds: number): void {
        const animator = new SvgAnimator();
        animator.wait(delaySeconds*1000, () => {
            this.element.style.visibility = 'visible';
        });
    }

    erase(delaySeconds: number): void {
        const animator = new SvgAnimator();
        animator.wait(delaySeconds*1000, () => {
            this.element.style.visibility = 'hidden';
        });
    }
}