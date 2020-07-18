export class Rotation {
    constructor(private _degrees: number) {

    }

    get degrees(): number {
        return this._degrees;
    }

    get radians(): number {
        return this.degrees / 180 * Math.PI;
    }
}