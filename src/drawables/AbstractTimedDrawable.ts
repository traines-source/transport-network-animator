import { TimedDrawable, Timed } from "./TimedDrawable";
import { BoundingBox } from "../BoundingBox";
import { Instant } from "../Instant";

export interface AbstractTimedDrawableAdapter extends Timed {
    name: string;
    boundingBox: BoundingBox;
}

export abstract class AbstractTimedDrawable implements TimedDrawable {

    constructor(protected adapter: AbstractTimedDrawableAdapter) {

    }

    private _from = this.adapter.from;
    private _to = this.adapter.to;
    private _name = this.adapter.name;
    private _boundingBox = this.adapter.boundingBox;

    get from(): Instant {
        return this._from;
    }

    get to(): Instant {
        return this._to;
    }

    get name(): string {
        return this._name;
    }

    get boundingBox(): BoundingBox {
        return this._boundingBox;
    }

    abstract draw(delay: number, animate: boolean, reverse: boolean): number;

    abstract erase(delay: number, animate: boolean, reverse: boolean): number;

}