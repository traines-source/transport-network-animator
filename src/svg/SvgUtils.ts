import { Stop } from "../drawables/Station";

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

}