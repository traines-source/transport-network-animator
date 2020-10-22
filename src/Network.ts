import { TimedDrawable, Timed } from "./Drawable";
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
    drawEpoch(epoch: string): void;
}

export class Network implements StationProvider {
    private slideIndex: {[id: string] : {[id: string]: TimedDrawable[]}} = {};
    private stations: { [id: string] : Station } = {};
    private currentZoomScale: number = 1;
    private currentZoomCenter: Vector = Vector.NULL;

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

    private displayInstant(instant: Instant) {
        if (!instant.equals(Instant.BIG_BANG)) {
            this.adapter.drawEpoch(instant.epoch + '')
        }
    }

    private timedDrawablesAt(now: Instant): TimedDrawable[] {
        return this.slideIndex[now.epoch][now.second];
    }

    drawTimedDrawablesAt(now: Instant, animate: boolean): number {
        const boundingBox = {tl: Vector.NULL, br: Vector.NULL};
        this.displayInstant(now);
        const elements: TimedDrawable[] = this.timedDrawablesAt(now);
        let delay = 0;
        for (let i=0; i<elements.length; i++) {
            delay += this.drawOrEraseElement(elements[i], delay, animate, now, boundingBox);
        }
        //this.zoomTo(boundingBox);
        return delay;
    }

    private drawOrEraseElement(element: TimedDrawable, delay: number, animate: boolean, instant: Instant, boundingBox: {tl: Vector, br: Vector}): number {
        if (instant.equals(element.to) && !element.from.equals(element.to)) {
            delay = this.eraseElement(element, delay, this.shouldAnimate(element.to, animate));
            this.updateBoundingBox(boundingBox, element, element.to);
            return delay;
        }
        delay = this.drawElement(element, delay, this.shouldAnimate(element.from, animate));
        this.updateBoundingBox(boundingBox, element, element.from);
        return delay;
    }
    
    private drawElement(element: TimedDrawable, delay: number, animate: boolean): number {
        return element.draw(delay, animate);
    }
    
    private eraseElement(element: TimedDrawable, delay: number, animate: boolean): number {
        return element.erase(delay, animate, false);
    }
    
    private shouldAnimate(instant: Instant, animate: boolean): boolean {
        if (!animate)
            return false;
        if (instant.flag == 'noanim')
            return false;
        return animate;
    }

    private updateBoundingBox(boundingBox: {tl: Vector, br: Vector}, element: TimedDrawable, now: Instant) {
        if (now.flag != 'nozoom' && now.flag != 'noanim') {
            const box = element.boundingBox;
            boundingBox.tl.bothAxisMins(box.tl);
            boundingBox.br.bothAxisMaxs(box.br);
        }
    }

    isEpochExisting(epoch: string): boolean {
        return this.slideIndex[epoch] != undefined;
    }

    addToIndex(element: TimedDrawable): void {
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
