import { Instant } from "./Instant";
import { Vector } from "./Vector";

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

export class BoundingBox {    
    constructor(public tl: Vector, public br: Vector) {
    }

    get dimensions(): Vector {
        return this.tl.delta(this.br);
    }
}