import { Vector } from "./Vector";
import { Rotation } from "./Rotation";

export interface Station {
    baseCoords: Vector;
    addLine(line: Line, axis: string, track: number): void;
    assignTrack(axis: string, preferredTrack: number): number;
    rotatedTrackCoordinates(incomingDir: Rotation, assignedTrack: number): void;
}