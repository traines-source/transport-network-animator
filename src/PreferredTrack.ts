export class PreferredTrack {
    private value: string;

    constructor(value: string) {
        this.value = value;
    }
    
    update(value: string): PreferredTrack {
        if (value != '') {
            return new PreferredTrack(value);
        }
        return this;
    }

    keepOnlySign(): PreferredTrack {
        return new PreferredTrack(this.value[0]);
    }

    hasTrackNumber(): boolean {
        return this.value.length > 1;
    }

    get trackNumber(): number {
        return parseInt(this.value)
    }

    isPositive(): boolean {
        return this.value[0] == '+';
    }

}
