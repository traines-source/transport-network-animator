import { Rotation } from "./Rotation";
import { Utils } from "./Utils";

export class Vector {
    static UNIT: Vector = new Vector(0, -1);

    constructor(private _x: number, private _y: number) {

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
        const ratio = length/this.length;
        return new Vector(this.x*ratio, this.y*ratio);
    }

    add(that : Vector): Vector {
        return new Vector(this.x + that.x, this.y + that.y);
    }

    delta(that: Vector): Vector {
        return new Vector(that.x - this.x, that.y - this.y);
    }

    rotate(theta: Rotation): Vector {
        let rad: number = theta.radians;
        return new Vector(this.x * Math.cos(rad) - this.y * Math.sin(rad), this.x * Math.sin(rad) + this.y * Math.cos(rad));
    }

    dotProduct(that: Vector) {
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
        return this.allEqualZero(this.x, dir1.x, dir2.x) || this.allEqualZero(this.y, dir1.y, dir2.y);
    }

    private allEqualZero(n1: number, n2: number, n3: number): boolean {
        return Utils.equals(n1, 0) && Utils.equals(n2, 0) && Utils.equals(n3, 0);
    }

    inclination(): Rotation {
        if (Utils.equals(this.x, 0))
            return new Rotation(this.y > 0 ? 180 : 0);
        if (Utils.equals(this.y, 0))
            return new Rotation(this.x > 0 ? 90 : -90);
        const adjacent = new Vector(0,-Math.abs(this.y));
        return new Rotation((Math.sign(this.x)*Math.acos(this.dotProduct(adjacent)/adjacent.length/this.length)*180/Math.PI));
    }

   

}