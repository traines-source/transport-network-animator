export class ArrivalDepartureTime {
    private value: string;

    constructor(value: string) {
        this.value = value;
    }

    private parse(offset: number): number {
        const split = this.value.split(/([-+])/);
        return parseFloat(split[offset]) * (split[offset-1] == '-' ? -1 : 1)
    }

    get departure(): number {
        return this.parse(2);
    }

    get arrival(): number {
        return this.parse(4);
    }

}
