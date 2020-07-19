import { TimedDrawable, Timed } from "./Drawable";
import { Instant } from "./Instant";
import { Station, Stop } from "./Station";
import { Vector } from "./Vector";
import { StationProvider } from "./Network";
import { Rotation } from "./Rotation";
import { Utils } from "./Utils";



export interface LineAdapter extends Timed  {
    stops: Stop[];
    name: string;
    rerenderLine(path: Vector[], animate: boolean): void;
    erase(animate: boolean, reverse: boolean): void;
}

export class Line implements TimedDrawable {
    static NODE_DISTANCE = 0;
    static SPEED = 3;
    static FPS = 60;

    constructor(private adapter: LineAdapter, private stationProvider: StationProvider) {

    }

    from = this.adapter.from;
    to = this.adapter.to;
    name = this.adapter.name;
    
    private precedingStop: Station | undefined = undefined;
    private precedingDir: Rotation | undefined = undefined;


    draw(delay: number, animate: boolean): number {
        const stops = this.adapter.stops;
        const path: Vector[] = [];
        
        let track = '+';
        for (let j=0; j<stops.length; j++) {
            const trackAssignment = stops[j].preferredTrack;
            if (trackAssignment != '') {
                track = trackAssignment;
            }
            const stop = this.stationProvider.stationById(stops[j].stationId);
            this.createConnection(stop, this.nextStopBaseCoord(stops, j, stop.baseCoords), track, path, delay, animate, true);
            track = track[0];
        }
        let duration = this.getAnimationDuration(path, animate);
        this.rerenderLine(path, delay, animate);
        return duration;
    }

    private nextStopBaseCoord(stops: Stop[], currentStopIndex: number, defaultCoords: Vector) {
        if (currentStopIndex+1 < stops.length) {
            return this.stationProvider.stationById(stops[currentStopIndex+1].stationId).baseCoords;
        }
        return defaultCoords;
    }

    private createConnection(station: Station, nextStopBaseCoord: Vector, track: string, path: Vector[], delay: number, animate: boolean, recurse: boolean) {
        const dir = station.rotation;
        const baseCoord = station.baseCoords;
        const newDir = this.getStopOrientationBasedOnThreeStops(baseCoord, nextStopBaseCoord, dir, path);
        const newPos = station.assignTrack(newDir.degrees % 180 == 0 ? 'x' : 'y', track);

        const newCoord = station.rotatedTrackCoordinates(newDir, newPos);
    
        if (path.length != 0) {
            const oldCoord = path[path.length-1];
    
            this.precedingDir = this.getPrecedingDir(this.precedingDir, this.precedingStop, oldCoord, newCoord);
    
            const stationDir = newDir.add(dir);
            const found = this.insertNode(oldCoord, this.precedingDir, newCoord, stationDir, path);
    
            if (!found && recurse && this.precedingStop != undefined) {
                const helpStop = this.getOrCreateHelperStop(this.precedingDir, this.precedingStop, station);
                
                this.precedingDir = this.precedingDir.add(new Rotation(180));
                this.createConnection(helpStop, baseCoord, track[0], path, delay, animate, false);
                this.createConnection(station, nextStopBaseCoord, track, path, delay, animate, false);
                return;
            } else if (!found) {
                console.log('path to fix on line', this.adapter.name, 'at station', station.id);
            }
            this.precedingDir = stationDir;
        }
        station.addLine(this, newDir.degrees % 180 == 0 ? 'x' : 'y', newPos);
        path.push(newCoord);
        delay = this.getAnimationDuration(path, animate) + delay;
        station.rerenderStation(delay);    
        this.precedingStop = station;
    }

    erase(delay: number, animate: boolean, reverse: boolean): number {
        if (delay > 0) {
            const line = this;
            window.setTimeout(function() { line.erase(0, animate, reverse); }, delay * 1000);
            return 0;
        }
        this.adapter.erase(false, reverse);
        const stops = this.adapter.stops;
        for (let j=0; j<stops.length; j++) {
            const stop = this.stationProvider.stationById(stops[j].stationId);
            stop.removeLine(this);
            stop.rerenderStation(0);
        }
        return 0;        
    }

    private getStopOrientationBasedOnThreeStops(baseCoord: Vector, nextStopBaseCoord: Vector, dir: Rotation, path: Vector[]) {
        let newDir;
        if (path.length != 0) {
            const oldCoord = path[path.length-1];
            newDir = this.getStopOrientation(nextStopBaseCoord.delta(oldCoord), dir);
        } else {
            newDir = this.getStopOrientation(baseCoord.delta(nextStopBaseCoord), dir);
        }
        return newDir;
    }

    private getStopOrientation(delta: Vector, dir: Rotation): Rotation {
        const deltaDir = dir.delta(delta.inclination()).degrees;
        const deg = deltaDir < 0 ? Math.ceil((deltaDir-45)/90) : Math.floor((deltaDir+45)/90);
        return new Rotation(deg*90);
    }

    private getPrecedingDir(precedingDir: Rotation | undefined, precedingStop: Station | undefined, oldCoord: Vector, newCoord: Vector): Rotation {
        if (precedingDir == undefined) {
            const precedingStopRotation = precedingStop?.rotation ?? new Rotation(0);
            precedingDir = this.getStopOrientation(oldCoord.delta(newCoord), precedingStopRotation).add(precedingStopRotation);
        } else {
            precedingDir = precedingDir.add(new Rotation(180));
        }
        return precedingDir;
    }


    private insertNode(fromCoord: Vector, fromDir: Rotation, toCoord: Vector, toDir: Rotation, path: Vector[]): boolean {
        const delta: Vector = fromCoord.delta(toCoord);
        const oldDirV = Vector.UNIT.rotate(fromDir);
        const newDirV = Vector.UNIT.rotate(toDir);
        if (delta.isDeltaMatchingParallel(oldDirV, newDirV)) {
            return true;
        }
        const solution = delta.solveDeltaForIntersection(oldDirV, newDirV)
        if (solution.a > Line.NODE_DISTANCE && solution.b > Line.NODE_DISTANCE) {
            path.push(new Vector(fromCoord.x+oldDirV.x*solution.a, fromCoord.y+oldDirV.y*solution.a));
            return true;
        }
        return false;
    }



    private getOrCreateHelperStop(fromDir: Rotation, fromStop: Station, toStop: Station): Station {
        const helpStopId = 'h_' + Utils.alphabeticId(fromStop.id, toStop.id);
        let helpStop = this.stationProvider.stationById(helpStopId);
        if (helpStop == undefined) {
            const oldCoord = fromStop.baseCoords;
            const newCoord = toStop.baseCoords;
            const delta = newCoord.delta(oldCoord);
            const deg = oldCoord.delta(newCoord).inclination();
            console.log(helpStopId, deg, fromDir);
            const intermediateDir = new Rotation((deg.delta(fromDir).degrees >= 0 ? Math.floor(deg.degrees / 45) : Math.ceil(deg.degrees / 45)) * 45).normalize();
            const intermediateCoord = delta.withLength(delta.length/2).add(newCoord);

            helpStop = this.stationProvider.createVirtualStop(helpStopId, intermediateCoord, intermediateDir);
        }
        return helpStop;
    }

    private getAnimationDuration(path: Vector[], animate: boolean) {
        if (!animate)
            return 0;
        return this.getTotalLength(path) / Line.SPEED / Line.FPS;
    }
    private getTotalLength(path: Vector[]) {
        let length = 0;
        for (let i=0; i<path.length-1; i++) {
            length += path[i].delta(path[i+1]).length;
        }
        return length;
    }

    private rerenderLine(path: Vector[], delay: number, animate: boolean) {
        const line = this;
        window.setTimeout(function () { line.adapter.rerenderLine(path, animate); }, delay * 1000);
    }
}