import { Vector } from "./Vector";
import { Rotation } from "./Rotation";
import { Drawable } from "./Drawable";
import { Line } from "./Line";
import { Utils } from "./Utils";

export interface StationAdapter {
    baseCoords: Vector;
    rotation: Rotation;
    labelDir: Rotation;
    id: string;
    rerenderStation(positionBoundaries: {[id: string]: [number, number]}): void;
}

export class Stop {
    constructor(public stationId: string, public preferredTrack: string) {

    }
}

export class Station {
    static LINE_DISTANCE = 6;
    static DEFAULT_STOP_DIMEN = 10;
    static LABEL_DISTANCE = 0;

    existingLines: {[id: string]: {line: Line, track: number}[]} = {x: [], y: []};
    baseCoords = this.adapter.baseCoords;
    rotation = this.adapter.rotation;
    labelDir = this.adapter.labelDir;
    id = this.adapter.id;

    constructor(private adapter: StationAdapter) {

    }

    addLine(line: Line, axis: string, track: number): void {
        this.existingLines[axis].push({line: line, track: track});
    }

    removeLine(line: Line) {
        this.removeLineAtAxis(line, this.existingLines.x);
        this.removeLineAtAxis(line, this.existingLines.y);
    }

    private removeLineAtAxis(line: Line, existingLinesForAxis: {line: Line, track: number}[]) {
        let i = 0;
        while (i < existingLinesForAxis.length) {
            if (existingLinesForAxis[i].line == line) {
                existingLinesForAxis.splice(i, 1);
            } else {
                i++;
            }
        }
    }

    assignTrack(axis: string, preferredTrack: string): number { 
        const positionBoundariesForAxis = this.positionBoundaries()[axis];
        if (preferredTrack.length > 1) {
            return parseInt(preferredTrack);
        }
        return preferredTrack == '+' ? positionBoundariesForAxis[1] + 1 : positionBoundariesForAxis[0] - 1;
    }

    rotatedTrackCoordinates(incomingDir: Rotation, assignedTrack: number): Vector { 
        let newCoord: Vector;
        if (incomingDir.degrees % 180 == 0) {
            newCoord = new Vector(assignedTrack * Station.LINE_DISTANCE, 0);
        } else {
            newCoord = new Vector(0, assignedTrack * Station.LINE_DISTANCE);
        }
        newCoord = newCoord.rotate(this.rotation);
        newCoord = this.baseCoords.add(newCoord);
        return newCoord;
    }

    private positionBoundaries(): {[id: string]: [number, number]} {
        return {
            x: this.positionBoundariesForAxis(this.existingLines.x),
            y: this.positionBoundariesForAxis(this.existingLines.y)
        };
    }
    
    private positionBoundariesForAxis(existingLinesForAxis: {line: Line, track: number}[]): [number, number] {
        if (existingLinesForAxis.length == 0) {
            return [1, -1];
        }
        let left = 0;
        let right = 0;
        for (let i=0; i<existingLinesForAxis.length; i++) {
            if (right < existingLinesForAxis[i].track) {
                right = existingLinesForAxis[i].track;
            }
            if (left > existingLinesForAxis[i].track) {
                left = existingLinesForAxis[i].track;
            }
        }
        return [left, right];
    }

    rerenderStation(delay: number) {
        const station = this;
        window.setTimeout(function() { station.adapter.rerenderStation(station.positionBoundaries()); }, delay * 1000);        
    }

    stationSizeForAxis(axis: string, vector: number) {
        if (Utils.equals(vector, 0))
            return 0;
        const size = this.positionBoundariesForAxis(this.existingLines[axis])[vector < 0 ? 0 : 1] * Station.LINE_DISTANCE;
        return size + Math.sign(vector) * (Station.DEFAULT_STOP_DIMEN + Station.LABEL_DISTANCE);
    }
}