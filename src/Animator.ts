export class Animator {

    static EASE_NONE: (x: number) => number = x => x;
    static EASE_CUBIC: (x: number) => number = x => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    static EASE_SINE: (x: number) => number = x => -(Math.cos(Math.PI * x) - 1) / 2;
    
    private _from: number = 0;
    private _to: number = 1;
    private _offset: number = 0;
    private _ease: (x: number) => number = Animator.EASE_NONE;

    private callback: (x: number, isLast: boolean) => boolean = x => true;
    private startTime: number = 0;
    private durationMilliseconds: number = 0;

    constructor() {
        
    }

    public from(from: number): Animator {
        this._from = from;
        return this;
    }

    public to(to: number): Animator {
        this._to = to;
        return this;
    }

    public offset(offset: number): Animator {
        this._offset = offset;
        return this;
    }

    public ease(ease: (x: number) => number): Animator {
        this._ease = ease;
        return this;
    }

    public wait(delayMilliseconds: number, callback: () => void): void {
        if (delayMilliseconds > 0) {
            this.timeout(callback, delayMilliseconds);
            return;
        }
        callback();
    }

    public animate(durationMilliseconds: number, callback: (x: number, isLast: boolean) => boolean): void {
        this.durationMilliseconds = durationMilliseconds;
        this.callback = callback;
        this.startTime = this.now();
        this.frame();
    }

    private frame() {
        const now = this.now();
        let x = 1;
        if (this.durationMilliseconds > 0) {
            x = (now-this.startTime) / this.durationMilliseconds + this._offset;
        }
        x = Math.max(0, Math.min(1, x));
        const y = this._from + (this._to-this._from) * this._ease(x);
        const cont = this.callback(y, x == 1);
        if (cont && x < 1) {
            this.requestFrame(() => this.frame());
        }
    }

    private now(): number {
        return performance.now();
    }

    private timeout(callback: () => void, delayMilliseconds: number): void {
        window.setTimeout(callback, delayMilliseconds);
    }

    private requestFrame(callback: () => void): void {
        window.requestAnimationFrame(callback);
    }

}
