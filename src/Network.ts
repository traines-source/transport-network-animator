import { TimedDrawable } from "./drawables/TimedDrawable";
import { BoundingBox } from "./BoundingBox";
import { Instant } from "./Instant";
import { Station } from "./drawables/Station";
import { Vector } from "./Vector";
import { Rotation } from "./Rotation";
import { Zoomer } from "./Zoomer";
import { LineGroup } from "./LineGroup";
import { Gravitator } from "./Gravitator";
import { Line } from "./drawables/Line";

export interface StationProvider {
    stationById(id: string): Station | undefined;
    lineGroupById(id: string): LineGroup;
    createVirtualStop(id: string, baseCoords: Vector, rotation: Rotation): Station;
}
export interface NetworkAdapter {
    canvasSize: BoundingBox;
    autoStart: boolean;
    zoomMaxScale: number;
    initialize(network: Network): void;
    createVirtualStop(id: string, baseCoords: Vector, rotation: Rotation): Station;
    drawEpoch(epoch: string): void;
    zoomTo(zoomCenter: Vector, zoomScale: number, animationDurationSeconds: number): void;
}

export class Network implements StationProvider {
    private slideIndex: {[id: string] : {[id: string]: TimedDrawable[]}} = {};
    private stations: { [id: string] : Station } = {};
    private lineGroups: { [id: string] : LineGroup } = {};
    private drawableBuffer: TimedDrawable[] = [];
    private gravitator: Gravitator;
    private zoomer: Zoomer;

    constructor(private adapter: NetworkAdapter) {
        this.gravitator = new Gravitator(this);
        this.zoomer = new Zoomer(this.adapter.canvasSize, this.adapter.zoomMaxScale);
    }

    get autoStart(): boolean {
        return this.adapter.autoStart;
    }

    initialize(): void {
        this.adapter.initialize(this);
    }

    stationById(id: string): Station | undefined {
        return this.stations[id];
    }

    lineGroupById(id: string): LineGroup {
        if (this.lineGroups[id] == undefined) {
            this.lineGroups[id] = new LineGroup();
        }
        return this.lineGroups[id];
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
        if (!this.isEpochExisting(now.epoch + ''))
            return [];
        return this.slideIndex[now.epoch][now.second];
    }

    drawTimedDrawablesAt(now: Instant, animate: boolean): number {
        this.displayInstant(now);
        console.log(now);
        const elements: TimedDrawable[] = this.timedDrawablesAt(now);
        let delay = Zoomer.ZOOM_DURATION;
        for (let i=0; i<elements.length; i++) {
            delay = this.populateDrawableBuffer(elements[i], delay, animate, now);
        }
        delay = this.flushDrawableBuffer(delay, animate, now);
        delay = this.gravitator.gravitate(delay, animate);
        this.adapter.zoomTo(this.zoomer.center, this.zoomer.scale, this.zoomer.duration);
        this.zoomer.reset();
        return delay;
    }

    private populateDrawableBuffer(element: TimedDrawable, delay: number, animate: boolean, instant: Instant): number {
        if (!this.isDrawableEliglibleForSameBuffer(element, instant)) {
            delay = this.flushDrawableBuffer(delay, animate, instant);
        }
        this.drawableBuffer.push(element);
        return delay;
    }

    private sortDrawableBuffer(instant: Instant) {
        if (this.drawableBuffer.length == 0) {
            return;
        }
        if (!this.isDraw(this.drawableBuffer[this.drawableBuffer.length-1], instant)) {
            this.drawableBuffer.reverse();
        }
    }

    private flushDrawableBuffer(delay: number, animate: boolean, instant: Instant): number {
        this.sortDrawableBuffer(instant);
        for (let i=0; i<this.drawableBuffer.length; i++) {
            delay = this.drawOrEraseElement(this.drawableBuffer[i], delay, animate, instant)
        }
        this.drawableBuffer = [];
        return delay;
    }

    private isDraw(element: TimedDrawable, instant: Instant) {
        return instant.equals(element.from);
    }

    private isDrawableEliglibleForSameBuffer(element: TimedDrawable, instant: Instant): boolean {
        if (this.drawableBuffer.length == 0) {
            return true;
        }
        const lastElement = this.drawableBuffer[this.drawableBuffer.length-1];
        if (element.name != lastElement.name) {
            return false;
        }
        if (this.isDraw(element, instant) != this.isDraw(lastElement, instant)) {
            return false;
        }
        return true;
    }

    private drawOrEraseElement(element: TimedDrawable, delay: number, animate: boolean, instant: Instant): number {
        const draw = this.isDraw(element, instant);
        const shouldAnimate = this.shouldAnimate(draw ? element.from : element.to, animate);
        delay += draw
            ? this.drawElement(element, delay, shouldAnimate)
            : this.eraseElement(element, delay, shouldAnimate);
        this.zoomer.include(element.boundingBox, element.from, element.to, draw, animate);
        return delay;
    }
    
    private drawElement(element: TimedDrawable, delay: number, animate: boolean): number {
        if (element instanceof Line) {
            this.gravitator.addEdge(element);
        }
        return element.draw(delay, animate, element.from.flag.includes('reverse'));
    }
    
    private eraseElement(element: TimedDrawable, delay: number, animate: boolean): number {
        return element.erase(delay, animate, element.to.flag.includes('reverse'));
    }
    
    private shouldAnimate(instant: Instant, animate: boolean): boolean {
        if (!animate)
            return false;
        if (instant.flag.includes('noanim'))
            return false;
        return animate;
    }

    isEpochExisting(epoch: string): boolean {
        return this.slideIndex[epoch] != undefined;
    }

    addToIndex(element: TimedDrawable): void {
        this.setSlideIndexElement(element.from, element);
        if (!Instant.BIG_BANG.equals(element.to))
            this.setSlideIndexElement(element.to, element);
        if (element instanceof Station) {
            this.stations[element.id] = element;
        }
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
        if (dict == undefined)
            return null;
        let smallest = null;
        for (const [key, value] of Object.entries(dict)) {
            if (parseInt(key) > threshold && (smallest == null || parseInt(key) < smallest)) {
                smallest = parseInt(key);
            }
        }
        return smallest;
    }
}
