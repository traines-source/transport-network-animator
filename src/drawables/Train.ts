import { Stop } from "./Station";
import { StationProvider } from "../Network";
import { Vector } from "../Vector";
import { ArrivalDepartureTime } from "../ArrivalDepartureTime";
import { AbstractTimedDrawableAdapter, AbstractTimedDrawable } from "./AbstractTimedDrawable";
import { Config } from "../Config";

export interface TrainAdapter extends AbstractTimedDrawableAdapter {
    stops: Stop[];
    draw(delaySeconds: number, animate: boolean, follow: {path: Vector[], from: number, to: number}): void;
    move(delaySeconds: number, animationDurationSeconds: number, follow: {path: Vector[], from: number, to: number}): void;
    erase(delaySeconds: number): void;
}

export class Train extends AbstractTimedDrawable {

    constructor(protected adapter: TrainAdapter, private stationProvider: StationProvider, private config: Config) {
        super(adapter);
    }

    draw(delay: number, animate: boolean): number {
        const lineGroup = this.stationProvider.lineGroupById(this.name)
        const stops = this.adapter.stops;
        if (stops.length < 2) {
            throw new Error("Train " + this.name + " needs at least 2 stops");
        }
        for (let i=1; i<stops.length; i++) {
            const arrdep = new ArrivalDepartureTime(stops[i].trackInfo);
            const path = lineGroup.getPathBetween(stops[i-1].stationId, stops[i].stationId);
            if (path != null) {
                if (i == 1) {
                    this.adapter.draw(delay, animate, path);
                }
                if (animate) {
                    this.adapter.move(delay + this.scaleSpeed(arrdep.departure) - this.from.second, this.scaleSpeed(arrdep.arrival - arrdep.departure), path);
                }
            } else {
                throw new Error(this.name + ': No path found between ' + stops[i-1].stationId + ' ' + stops[i].stationId)
            }
        }
        return 0;
    }

    erase(delay: number, animate: boolean, reverse: boolean): number {
        this.adapter.erase(delay);
        return 0;
    }

    private scaleSpeed(time: number): number {
        return time / this.config.trainTimetableSpeed * 60;
    }
}