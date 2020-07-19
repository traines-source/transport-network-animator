import { TimedDrawable } from "./Drawable";
import { LineAdapter } from "./Line";
import { StationAdapter, Station } from "./Station";
import { Vector } from "./Vector";
import { Rotation } from "./Rotation";

export class SvgStation implements StationAdapter {
    constructor(private element: SVGRectElement) {

    }
    get id(): string {
        return this.element.id;
    }
    get baseCoords(): Vector {        
        return new Vector(parseInt(this.element.getAttribute('x') || '') || 0, parseInt(this.element.getAttribute('y') || '') || 0);
    }
    get rotation(): Rotation {
        return Rotation.from(this.element.dataset.dir || 'n');
    }
    get labelDir(): Rotation {
        return Rotation.from(this.element.dataset.labelDir || 'n');
    }

    public rerenderStation(positionBoundaries: {[id: string]: [number, number]}) {
        const baseCoord = this.baseCoords;
        const stopDimen = [Math.max(positionBoundaries.x[1] - positionBoundaries.x[0], 0), Math.max(positionBoundaries.y[1] - positionBoundaries.y[0], 0)];
        
        this.element.setAttribute('width', (stopDimen[0] * Station.LINE_DISTANCE + Station.DEFAULT_STOP_DIMEN) + '');
        this.element.setAttribute('height', (stopDimen[1] * Station.LINE_DISTANCE + Station.DEFAULT_STOP_DIMEN) + '');
        this.element.setAttribute('transform','rotate(' + this.rotation.degrees + ' ' + baseCoord.x + ' ' + baseCoord.y + ') translate(' + (Math.min(positionBoundaries.x[0], 0) * Station.LINE_DISTANCE - Station.DEFAULT_STOP_DIMEN / 2) + ',' + (Math.min(positionBoundaries.y[0], 0) * Station.LINE_DISTANCE - Station.DEFAULT_STOP_DIMEN / 2) + ')');
    }
    
}