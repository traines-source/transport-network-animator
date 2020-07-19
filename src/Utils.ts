export class Utils {
    static readonly IMPRECISION: number = 0.001;

    static equals(a: number, b: number): boolean {
        return Math.abs(a - b) < Utils.IMPRECISION;
    }

    static trilemma(int: number, options: [string, string, string]): string {
        if (Utils.equals(int, 0)) {
            return options[1];
        } else if (int > 0) {
            return options[2];
        }
        return options[0];
    }

    static alphabeticId(a: string, b: string): string {
        if (a < b)
            return a + '_' + b;
        return b + '_' + a;
    }
}