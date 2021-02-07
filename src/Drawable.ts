import { Instant } from "./Instant";
import { BoundingBox } from "./BoundingBox";

export interface Drawable {
    name: string;
    boundingBox: BoundingBox;
    draw(delaySeconds: number, animate: boolean): number;
    erase(delaySeconds: number, animate: boolean, reverse: boolean): number;
}

export interface Timed {
    from: Instant;
    to: Instant;
}

export interface TimedDrawable extends Drawable, Timed {
}

