export class Instant {
    static BIG_BANG: Instant = new Instant(0, 0, '');
    
    constructor(private _epoch: number, private _second: number, private _flag: string) {

    }
    get epoch(): number {
        return this._epoch;
    }
    get second(): number {
        return this._second;
    }
    get flag(): string {
        return this._flag;
    }

    static from(array: string[]): Instant {
        return new Instant(parseInt(array[0]), parseFloat(array[1]), array[2] ?? '')
    }

    equals(that: Instant): boolean {
        if (this.epoch == that.epoch && this.second == that.second) {
            return true;
        }
        return false;
    }

    delta(that: Instant): number {
        if (this.epoch == that.epoch) {
            return that.second - this.second;
        }
        return that.second;
    }

}
