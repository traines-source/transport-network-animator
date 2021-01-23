import { Instant } from "./Instant";
import { Vector } from "./Vector";

export interface Drawable {
    name: string;
    boundingBox: {tl: Vector, br: Vector};
    draw(delaySeconds: number, animate: boolean): number;
    erase(delaySeconds: number, animate: boolean, reverse: boolean): number;
}

export interface Timed {
    from: Instant;
    to: Instant;
}

export interface TimedDrawable extends Drawable, Timed {
}

export interface BoundingBox {
    tl: Vector;
    br: Vector;
}