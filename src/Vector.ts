import { Rotation } from "./Rotation";

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

    add(other : Vector): Vector {
        return new Vector(this.x + other.x, this.y + other.y);
    }

    delta(other: Vector): Vector {
        return new Vector(other.x - this.x, other.y - this.y);
    }

    rotate(theta: Rotation): Vector {
        let rad: number = theta.radians;
        return new Vector(this.x * Math.cos(rad) - this.y * Math.sin(rad), this.x * Math.sin(rad) + this.y * Math.cos(rad));
    }

    withLength(length: number) {

    }



   

}