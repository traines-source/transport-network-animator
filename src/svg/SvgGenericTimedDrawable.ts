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
            this.show(animationDurationSeconds);

            if (this.element.localName == 'g') {
                if (animationDurationSeconds == 0) {
                    this.element.style.opacity = '1';
                }
                if (this.element.onfocus != undefined) {
                    this.element.focus();
                }
            }
        });
    }

    erase(delaySeconds: number, animationDurationSeconds: number): void {
        const animator = new SvgAnimator();
        animator.wait(delaySeconds*1000, () => {
            this.hide(animationDurationSeconds);
            if (this.element.localName == 'g') {
                this.element.style.opacity = '0';
            }
        });
    }
}