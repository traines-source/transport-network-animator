import { TimedDrawable, Timed } from "./Drawable";
import { Station } from "./Station";
import { Rotation } from "./Rotation";
import { StationProvider } from "./Network";
import { Vector } from "./Vector";

export interface LabelAdapter extends Timed {
    forStation: string | undefined;
    draw(textCoords: Vector, labelDir: Rotation): void;
}

export class Label implements TimedDrawable {

    constructor(private adapter: LabelAdapter, private stationProvider: StationProvider) {

    }

    from = this.adapter.from;
    to = this.adapter.to;

    get forStation(): Station {
        return this.stationProvider.stationById(this.adapter.forStation || '');
    }

    draw(delay: number, animate: boolean): number {
        if (delay > 0) {
            const label = this;
            window.setTimeout(function() { label.draw(0, animate); }, delay * 1000);
            return 0;
        }
        if (this.adapter.forStation != undefined) {
            const station = this.forStation;
            const baseCoord = station.baseCoords;
            const labelDir = station.labelDir;
            const stationDir = station.rotation;
            const diffDir = labelDir.add(new Rotation(-stationDir.degrees));
            const unitv = Vector.UNIT.rotate(diffDir);
            const anchor = new Vector(station.stationSizeForAxis('x', unitv.x), station.stationSizeForAxis('y', unitv.y));
            const textCoords = baseCoord.add(anchor.rotate(stationDir));
            this.adapter.draw(textCoords, labelDir);
        }
        return 0;
    }
    erase(delay: number, animate: boolean, reverse: boolean): number {
        throw new Error("Method not implemented.");
    }
    

   
}