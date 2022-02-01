import { Rotation } from "../Rotation";
import { LabelAdapter } from "../drawables/Label";
import { Vector } from "../Vector";
import { Utils } from "../Utils";
import { BoundingBox } from "../BoundingBox";
import { SvgAnimator } from "./SvgAnimator";
import { SvgAbstractTimedDrawable } from "./SvgAbstractTimedDrawable";
import { Config } from "../Config";

export class SvgLabel extends SvgAbstractTimedDrawable implements LabelAdapter {

    constructor(protected element: SVGGraphicsElement) {
        super(element);
    }

    get forStation(): string | undefined {
        return this.element.dataset.station;
    }

    get forLine(): string | undefined {
        return this.element.dataset.line;
    }

    get boundingBox(): BoundingBox {
        if (this.element.style.visibility == 'visible') {
            return super.boundingBox;
        }
        return new BoundingBox(Vector.NULL, Vector.NULL);
    }

    draw(delaySeconds: number, textCoords: Vector, labelDir: Rotation, children: LabelAdapter[]): void {
        const animator = new SvgAnimator();
        animator.wait(delaySeconds*1000, () => {
            if (textCoords != Vector.NULL) {
                this.setCoord(this.element, textCoords);
                if (children.length > 0) {
                    this.drawLineLabels(labelDir, children);
                } else {
                    this.drawStationLabel(labelDir);
                }
            } else {
                this.element.style.visibility = 'visible';
            }
        });
    }

    private translate(boxDimen: Vector, labelDir: Rotation) {
        const labelunitv = Vector.UNIT.rotate(labelDir);
        this.element.style.transform = 'translate('
            + Utils.trilemma(labelunitv.x, [-boxDimen.x + 'px', -boxDimen.x/2 + 'px', '0px'])
            + ','
            + Utils.trilemma(labelunitv.y, [-Config.default.labelHeight + 'px', -Config.default.labelHeight/2 + 'px', '0px']) // TODO magic numbers
            + ')';
        this.element.style.visibility = 'visible';
    }

    private drawLineLabels(labelDir: Rotation, children: LabelAdapter[]) {
        this.element.children[0].innerHTML = '';
        children.forEach(c => {
            if (c instanceof SvgLabel) {
                this.drawLineLabel(c);
            }
        })
        const scale = this.element.getBoundingClientRect().width/Math.max(this.element.getBBox().width, 1);
        const bbox = this.element.children[0].getBoundingClientRect();
        this.translate(new Vector(bbox.width/scale, bbox.height/scale), labelDir);
    }

    private drawLineLabel(label: SvgLabel) {
        const lineLabel = document.createElementNS('http://www.w3.org/1999/xhtml', 'div');
        lineLabel.className = label.classNames;
        lineLabel.innerHTML = label.text;
        this.element.children[0].appendChild(lineLabel);
    }

    private drawStationLabel(labelDir: Rotation) {
        if (!this.element.className.baseVal.includes('for-station'))
            this.element.className.baseVal += ' for-station';
        this.element.style.dominantBaseline = 'hanging';
        this.translate(new Vector(this.element.getBBox().width, this.element.getBBox().height), labelDir);
    }

    erase(delaySeconds: number): void {
        const animator = new SvgAnimator();
        animator.wait(delaySeconds*1000, () => {
            this.element.style.visibility = 'hidden';
        });
    }

    private setCoord(element: any, coord: Vector): void {
        element.setAttribute('x', coord.x);
        element.setAttribute('y', coord.y);
    }

    get classNames(): string {
        return this.element.className.baseVal + ' ' + this.forLine;
    }

    get text(): string {
        return this.element.innerHTML;
    }

    cloneForStation(stationId: string): LabelAdapter {
        const lineLabel: SVGGraphicsElement = <SVGGraphicsElement>document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
        lineLabel.className.baseVal += ' for-line';
        lineLabel.dataset.station = stationId;
        lineLabel.setAttribute('width', '1');
        const container = document.createElementNS('http://www.w3.org/1999/xhtml', 'div');
        lineLabel.appendChild(container);
       
        document.getElementById('elements')?.appendChild(lineLabel);
        return new SvgLabel(lineLabel)
    }
    
}