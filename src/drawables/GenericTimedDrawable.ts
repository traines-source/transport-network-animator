import { AbstractTimedDrawable, AbstractTimedDrawableAdapter } from "./AbstractTimedDrawable";
import { Config } from "../Config";

export interface GenericTimedDrawableAdapter extends AbstractTimedDrawableAdapter {
    draw(delaySeconds: number, animationDurationSeconds: number): void;
    erase(delaySeconds: number, animationDurationSeconds: number): void;
}

export class GenericTimedDrawable extends AbstractTimedDrawable {

    constructor(protected adapter: GenericTimedDrawableAdapter) {
        super(adapter);
    }

    draw(delay: number, animate: boolean): number {
        this.adapter.draw(delay, animate ? Config.default.fadeDurationSeconds : 0);
        return 0;
    }

    erase(delay: number, animate: boolean, reverse: boolean): number {
        this.adapter.erase(delay, animate ? Config.default.fadeDurationSeconds : 0);
        return 0;
    }

}