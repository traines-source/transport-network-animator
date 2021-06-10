import { Stop } from "../drawables/Station";
import { Vector } from "../Vector";

export class SvgUtils {

    static readStops(stopsString: string | undefined): Stop[] {
        const stops : Stop[] = [];
        const tokens = stopsString?.split(/\s+/) || [];
        let nextStop = new Stop('', '');
        for (var i = 0; i < tokens?.length; i++) {
            if (tokens[i][0] != '-' && tokens[i][0] != '+' && tokens[i][0] != '*') {
                nextStop.stationId = tokens[i];
                stops.push(nextStop);
                nextStop = new Stop('', '');
            } else {
                nextStop.trackInfo = tokens[i];
            }
        }
        return stops;
    }

    static readTermini(terminiString: string | undefined): Vector[] {
        const numbers = terminiString?.trim().split(/[^\d.]+/);
        if (numbers != undefined) {
            return [
                new Vector(parseFloat(numbers[1]), parseFloat(numbers[2])),
                new Vector(parseFloat(numbers[numbers.length-2]), parseFloat(numbers[numbers.length-1]))
            ];
        }
        return [];
    }

}