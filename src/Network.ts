import { TimedDrawable } from "./Drawable";
import { Instant } from "./Instant";
import { Station } from "./Station";
import { Vector } from "./Vector";
import { Rotation } from "./Rotation";

export interface StationProvider {
    stationById(id: string): Station | undefined;
    createVirtualStop(id: string, baseCoords: Vector, rotation: Rotation): Station;
}
export interface NetworkAdapter {
    initialize(network: Network): void;
    stationById(id: string): Station | null;
    createVirtualStop(id: string, baseCoords: Vector, rotation: Rotation): Station;
}

export class Network implements StationProvider {
    private slideIndex: {[id: string] : {[id: string]: TimedDrawable[]}} = {};
    private stations: { [id: string] : Station } = {};

    constructor(private adapter: NetworkAdapter) {

    }

    initialize(): void {
        this.adapter.initialize(this);
    }

    stationById(id: string): Station | undefined {
        if (this.stations[id] == undefined) {
            const station = this.adapter.stationById(id)
            if (station != null)
                this.stations[id] = station;
        }
        return this.stations[id];
    }

    createVirtualStop(id: string, baseCoords: Vector, rotation: Rotation): Station {
        const stop = this.adapter.createVirtualStop(id, baseCoords, rotation);
        this.stations[id] = stop;
        return stop;
    }

    timedDrawablesAt(now: Instant): TimedDrawable[] {
        return this.slideIndex[now.epoch][now.second];
    }

    isEpochExisting(epoch: string): boolean {
        return this.slideIndex[epoch] != undefined;
    }

    public addToIndex(element: TimedDrawable): void {
        this.setSlideIndexElement(element.from, element);
        if (!Instant.BIG_BANG.equals(element.to))
            this.setSlideIndexElement(element.to, element);
    }

    private setSlideIndexElement(instant: Instant, element: TimedDrawable): void {
        if (this.slideIndex[instant.epoch] == undefined)
            this.slideIndex[instant.epoch] = {};
        if (this.slideIndex[instant.epoch][instant.second] == undefined)
            this.slideIndex[instant.epoch][instant.second] = [];
        this.slideIndex[instant.epoch][instant.second].push(element);
    }

    nextInstant(now: Instant): Instant | null {
        let epoch: number | null = now.epoch;
        let second: number | null = this.findSmallestAbove(now.second, this.slideIndex[now.epoch]);
        if (second == null) {
            epoch = this.findSmallestAbove(now.epoch, this.slideIndex);
            if (epoch == undefined)
                return null;
            second = this.findSmallestAbove(-1, this.slideIndex[epoch]);
            if (second == undefined)
                return null;
        }
        return new Instant(epoch, second, '');
    }
    
    private findSmallestAbove(threshold: number, dict: {[id: number]: any}): number | null {
        let smallest = null;
        for (const [key, value] of Object.entries(dict)) {
            if (parseInt(key) > threshold && (smallest == undefined || parseInt(key) < smallest)) {
                smallest = parseInt(key);
            }
        }
        return smallest;
    }
}
