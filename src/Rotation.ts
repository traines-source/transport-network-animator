import { Utils } from "./Utils";

export class Rotation {
    private static DIRS: { [id: string]: number } = {'sw': -135, 'w': -90, 'nw': -45, 'n': 0, 'ne': 45, 'e': 90, 'se': 135, 's': 180};

    constructor(private _degrees: number) {

    }

    static from(direction: string): Rotation {
        return new Rotation(Rotation.DIRS[direction])
    }

    get name(): string {
        for (const [key, value] of Object.entries(Rotation.DIRS)) {
            if (Utils.equals(value, this.degrees)) {
                return key;
            }
        }
        return 'n';
    }

    get degrees(): number {
        return this._degrees;
    }

    get radians(): number {
        return this.degrees / 180 * Math.PI;
    }

    add(that: Rotation): Rotation {
        let sum = this.degrees + that.degrees;
        if (sum <= -180)
            sum += 360;
        if (sum > 180)
            sum -= 360;
        return new Rotation(sum);
    }

    delta(that: Rotation): Rotation {
        let a = this.degrees;
        let b = that.degrees;
        let dist = b-a;
        if (Math.abs(dist) > 180) {
            if (a < 0)
                a += 360;
            if (b < 0)
                b += 360;
            dist = b-a;
        }
        return new Rotation(dist);
    }

    normalize(): Rotation {
        let dir = this.degrees;
        if (Utils.equals(dir, -90))
            dir = 0;
        else if (dir < -90)
            dir += 180;
        else if (dir > 90)
            dir -= 180;
        return new Rotation(dir);
    }

    isVertical(): boolean {
        return this.degrees % 180 == 0;
    }

    quarterDirection(relativeTo: Rotation) {
        const deltaDir = relativeTo.delta(this).degrees;
        const deg = deltaDir < 0 ? Math.ceil((deltaDir-45)/90) : Math.floor((deltaDir+45)/90);
        return new Rotation(deg*90);
    }

    halfDirection(relativeTo: Rotation, splitAxis: Rotation) {
        const deltaDir = relativeTo.delta(this).degrees;
        let deg;
        if (splitAxis.isVertical()) {
            if (deltaDir < 0 && deltaDir >= -180)
                deg = -90;
            else
                deg = 90;
        } else {
            if (deltaDir < 90 && deltaDir >= -90)
                deg = 0;
            else
                deg = 180;
        }
        return new Rotation(deg);
    }
}