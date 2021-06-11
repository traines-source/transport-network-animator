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
import { DrawableSorter } from "./DrawableSorter";

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

    constructor(private adapter: NetworkAdapter, private drawableSorter: DrawableSorter) {
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

    private populateDrawableBuffer(element: TimedDrawable, delay: number, animate: boolean, now: Instant): number {
        if (!this.isDrawableEliglibleForSameBuffer(element, now)) {
            delay = this.flushDrawableBuffer(delay, animate, now);
        }
        this.drawableBuffer.push(element);
        return delay;
    }

    private sortDrawableBuffer(now: Instant): {delay: number, reverse: boolean}[] {
        if (this.drawableBuffer.length == 0) {
            return [];
        }
        return this.drawableSorter.sort(this.drawableBuffer, this.isDraw(this.drawableBuffer[this.drawableBuffer.length-1], now));
    }

    private flushDrawableBuffer(delay: number, animate: boolean, now: Instant): number {
        const delays = this.sortDrawableBuffer(now);
        const override = delays.length == this.drawableBuffer.length;
        let maxDelay = delay;
        for (let i=0; i<this.drawableBuffer.length; i++) {
            const specificDelay = override ? delay + delays[i].delay : maxDelay;
            const overrideReverse = override ? delays[i].reverse : false;
            const newDelay = this.drawOrEraseElement(this.drawableBuffer[i], specificDelay, animate, overrideReverse, now)
            maxDelay = Math.max(newDelay, maxDelay);
        }
        this.drawableBuffer = [];
        return maxDelay;
    }

    private isDraw(element: TimedDrawable, now: Instant) {
        return now.equals(element.from);
    }

    private isDrawableEliglibleForSameBuffer(element: TimedDrawable, now: Instant): boolean {
        if (this.drawableBuffer.length == 0) {
            return true;
        }
        const lastElement = this.drawableBuffer[this.drawableBuffer.length-1];
        if (element.name != lastElement.name) {
            return false;
        }
        if (this.isDraw(element, now) != this.isDraw(lastElement, now)) {
            return false;
        }
        if (element instanceof Line && lastElement instanceof Line && element.animOrder?.degrees != lastElement.animOrder?.degrees) {
            return false;
        }
        return true;
    }

    private drawOrEraseElement(element: TimedDrawable, delay: number, animate: boolean, overrideReverse: boolean, now: Instant): number {
        const draw = this.isDraw(element, now);
        const instant = draw ? element.from : element.to;
        const shouldAnimate = this.shouldAnimate(instant, animate);
        const reverse = overrideReverse != instant.flag.includes('reverse');
        delay += draw
            ? this.drawElement(element, delay, shouldAnimate, reverse)
            : this.eraseElement(element, delay, shouldAnimate, reverse);
        this.zoomer.include(element.boundingBox, element.from, element.to, draw, animate);
        return delay;
    }
    
    private drawElement(element: TimedDrawable, delay: number, animate: boolean, reverse: boolean): number {
        if (element instanceof Line) {
            this.gravitator.addEdge(element);
        }
        return element.draw(delay, animate, reverse);
    }
    
    private eraseElement(element: TimedDrawable, delay: number, animate: boolean, reverse: boolean): number {
        return element.erase(delay, animate, reverse);
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
