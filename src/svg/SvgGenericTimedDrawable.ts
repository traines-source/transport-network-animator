import { Instant } from "../Instant";
import { Vector } from "../Vector";
import { GenericTimedDrawableAdapter } from "../GenericTimedDrawable";
import { BoundingBox } from "../BoundingBox";
import { Animator } from "../Animator";

export class SvgGenericTimedDrawable implements GenericTimedDrawableAdapter {

    constructor(private element: SVGGraphicsElement) {

    }

    get name(): string {
        return this.element.getAttribute('name') || this.element.getAttribute('src') || '';
    }

    get from(): Instant {
        return this.getInstant('from');
    }

    get to(): Instant {
        return this.getInstant('to');
    }

    get boundingBox(): BoundingBox {
        const r = this.element.getBBox();
        const bbox = new BoundingBox(new Vector(r.x, r.y), new Vector(r.x+r.width, r.y+r.height));
        return bbox;
    }

    get zoom(): Vector {
        if (this.element.dataset['zoom'] != undefined) {
            const center = this.element.dataset['zoom'].split(' ');
            return new Vector(parseInt(center[0]) || 50, parseInt(center[1]) || 50);
        }
        return Vector.NULL;
    }

    draw(delaySeconds: number, animationDurationSeconds: number, zoomCenter: Vector, zoomScale: number): void {
        const animator = new Animator();
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
        const animator = new Animator();
        animator.wait(delaySeconds*1000, () => {
            this.element.style.visibility = 'hidden';
        });
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
}