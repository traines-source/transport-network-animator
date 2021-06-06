import { Animator } from "../Animator";

export class SvgAnimator extends Animator {

    constructor() {
        super();
    }

    protected now(): number {
        return performance.now();
    }

    protected timeout(callback: () => void, delayMilliseconds: number): void {
        window.setTimeout(callback, delayMilliseconds);
    }

    protected requestFrame(callback: () => void): void {
        window.requestAnimationFrame(callback);
    }

}
