import { Instant } from "./Instant";

export interface Drawable {
    draw(delay: number, animate: boolean): number;
    erase(delay: number, animate: boolean, reverse: boolean): number;
}

export interface Timed {
    from: Instant;
    to: Instant;
}

export interface TimedDrawable extends Drawable, Timed {
}