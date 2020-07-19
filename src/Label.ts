import { TimedDrawable } from "./Drawable";

export interface Label extends TimedDrawable {
    
}

export class GenericLabel {
    /*function drawLabel(text, delay, animate) {
        if (delay > 0) {
            window.setTimeout(function() { drawLabel(text, 0); }, delay * 1000);
            return 0;
        }
        if (text.dataset.station != undefined) {
            const station = document.getElementById(text.dataset.station);
            const baseCoord = getStopBaseCoord(station);
            const positionBoundaries = getPositionBoundaries(getExistingLinesAtStation(station.id));
            const labelDir = DIRS[station.dataset.labelDir || 'n'];
            const stationDir = DIRS[station.dataset.dir];
            const diffDir = addDeg(labelDir , -stationDir);
            const unitv = rotateUnitV(diffDir)
            const anchor = [getStationSizeForAxis(positionBoundaries.x, unitv[0]), getStationSizeForAxis(positionBoundaries.y, unitv[1])]
            const textCoord = vadd(baseCoord, rotate(anchor, stationDir));
            setCoord(text, textCoord);
            const labelunitv = rotateUnitV(labelDir);
            text.style.textAnchor = makeTripleDecision(labelunitv[0], ['end', 'middle', 'start']);
            text.style.dominantBaseline = makeTripleDecision(labelunitv[1], ['baseline', 'middle', 'hanging']);
            text.style.visibility = 'visible';
            text.className.baseVal += ' station';
        }
        return 0;
    }*/
}