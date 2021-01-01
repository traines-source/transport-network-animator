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
    set baseCoords(baseCoords: Vector) {
        this.element.setAttribute('x', baseCoords.x + ''); 
        this.element.setAttribute('y', baseCoords.y + ''); 
    }

    get rotation(): Rotation {
        return Rotation.from(this.element.dataset.dir || 'n');
    }
    get labelDir(): Rotation {
        return Rotation.from(this.element.dataset.labelDir || 'n');
    }

    draw(delaySeconds: number, getPositionBoundaries: () => {[id: string]: [number, number]}): void {
        if (delaySeconds > 0) {
            const station = this;
            window.setTimeout(function() { station.draw(0, getPositionBoundaries); }, delaySeconds * 1000);
            return;
        }
        const positionBoundaries = getPositionBoundaries();
        const baseCoord = this.baseCoords;
        const stopDimen = [positionBoundaries.x[1] - positionBoundaries.x[0], positionBoundaries.y[1] - positionBoundaries.y[0]];
        
        this.element.style.visibility = stopDimen[0] < 0 && stopDimen[1] < 0 ? 'hidden' : 'visible';

        this.element.setAttribute('width', (Math.max(stopDimen[0], 0) * Station.LINE_DISTANCE + Station.DEFAULT_STOP_DIMEN) + '');
        this.element.setAttribute('height', (Math.max(stopDimen[1], 0) * Station.LINE_DISTANCE + Station.DEFAULT_STOP_DIMEN) + '');
        this.element.setAttribute('transform','rotate(' + this.rotation.degrees + ' ' + baseCoord.x + ' ' + baseCoord.y + ') translate(' + (Math.min(positionBoundaries.x[0], 0) * Station.LINE_DISTANCE - Station.DEFAULT_STOP_DIMEN / 2) + ',' + (Math.min(positionBoundaries.y[0], 0) * Station.LINE_DISTANCE - Station.DEFAULT_STOP_DIMEN / 2) + ')');
    }
    
}