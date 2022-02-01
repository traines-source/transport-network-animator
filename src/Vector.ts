import { Rotation } from "./Rotation";
import { Utils } from "./Utils";

export class Vector {
    static UNIT: Vector = new Vector(0, -1);
    static NULL: Vector = new Vector(0, 0);

    constructor(private _x: number, private _y: number) {

    }

    static fromArray(arr: number[]) {
        return new Vector(arr[0], arr[1]);
    }

    get x(): number {
        return this._x;
    }

    get y(): number {
        return this._y;
    }

    get length(): number {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }

    withLength(length: number): Vector {
        const ratio = this.length != 0 ? length/this.length : 0;
        return new Vector(this.x*ratio, this.y*ratio);
    }

    signedLengthProjectedAt(direction: Rotation): number {
        const s = Vector.UNIT.rotate(direction);
        return this.dotProduct(s)/s.dotProduct(s);
    }

    add(that: Vector): Vector {
        return new Vector(this.x + that.x, this.y + that.y);
    }

    scale(factor: number) {
        return new Vector(this.x*factor, this.y*factor);
    }

    delta(that: Vector): Vector {
        return new Vector(that.x - this.x, that.y - this.y);
    }

    rotate(theta: Rotation): Vector {
        let rad: number = theta.radians;
        return new Vector(this.x * Math.cos(rad) - this.y * Math.sin(rad), this.x * Math.sin(rad) + this.y * Math.cos(rad));
    }

    dotProduct(that: Vector): number {
        return this.x*that.x+this.y*that.y;
    }

    solveDeltaForIntersection(dir1: Vector, dir2: Vector): {a: number, b: number} {
        const delta: Vector = this;
        const swapZeroDivision = Utils.equals(dir2.y, 0);
        const x = swapZeroDivision ? 'y' : 'x';
        const y = swapZeroDivision ? 'x' : 'y';
        const denominator = (dir1[y]*dir2[x]-dir1[x]*dir2[y]);
        if (Utils.equals(denominator, 0)) {
            return {a: NaN, b: NaN};
        }
        const a = (delta[y]*dir2[x]-delta[x]*dir2[y])/denominator;
        const b = (a*dir1[y]-delta[y])/dir2[y];
        return {a, b};
    }

    isDeltaMatchingParallel(dir1: Vector, dir2: Vector): boolean {
        const a = this.angle(dir1).degrees;
        const b = dir1.angle(dir2).degrees;
        return Utils.equals(a % 180, 0) && Utils.equals(b % 180, 0);
    }

    inclination(): Rotation {
        if (Utils.equals(this.x, 0))
            return new Rotation(this.y > 0 ? 180 : 0);
        if (Utils.equals(this.y, 0))
            return new Rotation(this.x > 0 ? 90 : -90);
        const adjacent = new Vector(0,-Math.abs(this.y));
        return new Rotation(Math.sign(this.x)*Math.acos(this.dotProduct(adjacent)/adjacent.length/this.length)*180/Math.PI);
    }

    angle(other: Vector): Rotation {
        return this.inclination().delta(other.inclination());
    }

    bothAxisMins(other: Vector) {
        if (this == Vector.NULL)
            return other;
        if (other == Vector.NULL)
            return this;
        return new Vector(this.x < other.x ? this.x : other.x, this.y < other.y ? this.y : other.y)
    }

    bothAxisMaxs(other: Vector) {
        if (this == Vector.NULL)
            return other;
        if (other == Vector.NULL)
            return this;
        return new Vector(this.x > other.x ? this.x : other.x, this.y > other.y ? this.y : other.y)
    }

    between(other: Vector, x: number) {
        const delta = this.delta(other);
        return this.add(delta.withLength(delta.length*x));
    }

    equals(other: Vector) {
        return this.x == other.x && this.y == other.y;
    }

    round(decimals: number) {
        return new Vector(this.roundNumber(this.x, decimals), this.roundNumber(this.y, decimals));
    }

    private roundNumber(n: number, decimals: number): number {
        const precision = Math.pow(10, decimals);
        return Math.round(n*precision)/precision;
    }
}