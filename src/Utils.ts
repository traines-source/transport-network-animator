export class Utils {
    static readonly IMPRECISION: number = 0.001;
    static equals(a: number, b :number): boolean {
        return Math.abs(a - b) < Utils.IMPRECISION;
    }
}