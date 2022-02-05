import { Vector } from "../Vector";
import { SvgAnimator } from "./SvgAnimator";
import { KenImageAdapter } from "../drawables/KenImage";
import { SvgAbstractTimedDrawable } from "./SvgAbstractTimedDrawable";
import { BoundingBox } from "../BoundingBox";

export class SvgKenImage extends SvgAbstractTimedDrawable implements KenImageAdapter {

    constructor(protected element: SVGGraphicsElement) {
        super(element);
    }
    
    get boundingBox(): BoundingBox {
        const r = this.element.getBBox();
        return new BoundingBox(new Vector(r.x, r.y), new Vector(r.x+r.width, r.y+r.height));
    }

    get zoom(): Vector {
        if (this.element.dataset['zoom'] != undefined) {
            const center = this.element.dataset['zoom'].split(' ');
            return new Vector(parseInt(center[0]) || 50, parseInt(center[1]) || 50);
        }
        return Vector.NULL;
    }

    draw(delaySeconds: number, animationDurationSeconds: number, zoomCenter: Vector, zoomScale: number): void {
        const animator = new SvgAnimator();
        animator.wait(delaySeconds*1000, () => {
            this.element.style.visibility = 'visible';
            if (animationDurationSeconds > 0) {
                const fromCenter = this.boundingBox.tl.between(this.boundingBox.br, 0.5)
                animator
                    .animate(animationDurationSeconds*1000, (x, isLast) => this.animateFrame(x, isLast, fromCenter, zoomCenter, 1, zoomScale));
            }
        });
    }

    private animateFrame(x: number, isLast: boolean, fromCenter: Vector, toCenter: Vector, fromScale: number, toScale: number): boolean {
        if (!isLast) {
            const delta = fromCenter.delta(toCenter)
            const center = new Vector(delta.x * x, delta.y * x).add(fromCenter);
            const scale = (toScale - fromScale) * x + fromScale;
            this.updateZoom(center, scale);            
        } else {
            this.updateZoom(toCenter, toScale);
        }
        return true;
    }

    private updateZoom(center: Vector, scale: number) {
        const zoomable = this.element;
        if (zoomable != undefined) {
            const origin = this.boundingBox.tl.between(this.boundingBox.br, 0.5);
            zoomable.style.transformOrigin = origin.x + 'px ' + origin.y + 'px';
            zoomable.style.transform = 'scale(' + scale + ') translate(' + (origin.x - center.x) + 'px,' + (origin.y - center.y) + 'px)';
        }
    }

    erase(delaySeconds: number): void {
        const animator = new SvgAnimator();
        animator.wait(delaySeconds*1000, () => {
            this.element.style.visibility = 'hidden';
        });
    }
}