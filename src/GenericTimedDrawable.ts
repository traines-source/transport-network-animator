import { AbstractTimedDrawable, AbstractTimedDrawableAdapter } from "./AbstractTimedDrawable";

export interface GenericTimedDrawableAdapter extends AbstractTimedDrawableAdapter {
    draw(delaySeconds: number, animationDurationSeconds: number): void;
    erase(delaySeconds: number): void;
}

export class GenericTimedDrawable extends AbstractTimedDrawable {

    constructor(protected adapter: GenericTimedDrawableAdapter) {
        super(adapter);
    }

    draw(delay: number, animate: boolean): number {
        this.adapter.draw(delay, !animate ? 0 : this.adapter.from.delta(this.adapter.to));
        return 0;
    }

    erase(delay: number, animate: boolean, reverse: boolean): number {
        this.adapter.erase(delay);
        return 0;
    }

}