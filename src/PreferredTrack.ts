import { LineAtStation } from "./Station";

export class PreferredTrack {
    private value: string;

    constructor(value: string) {
        this.value = value;
    }
    
    fromString(value: string): PreferredTrack {
        if (value != '') {
            return new PreferredTrack(value);
        }
        return this;
    }

    fromNumber(value: number): PreferredTrack {
        const prefix = value >= 0 ? '+' : '';
        return new PreferredTrack(prefix + value);
    }

    fromExistingLineAtStation(atStation: LineAtStation | undefined) {
        if (atStation == undefined) {
            return this;
        }
        if(this.hasTrackNumber())
            return this;
        return this.fromNumber(atStation.track);        
    }

    keepOnlySign(): PreferredTrack {
        const v = this.value[0];
        return new PreferredTrack(v == '-' ? v : '+');
    }

    hasTrackNumber(): boolean {
        return this.value.length > 1;
    }

    get trackNumber(): number {
        return parseInt(this.value.replace('*', ''))
    }

    isPositive(): boolean {
        return this.value[0] != '-';
    }

}
