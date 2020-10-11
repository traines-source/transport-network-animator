import { TimedDrawable, Timed } from "./Drawable";
import { Station, Stop } from "./Station";
import { Vector } from "./Vector";
import { StationProvider } from "./Network";
import { Rotation } from "./Rotation";
import { Utils } from "./Utils";
import { PreferredTrack } from "./PreferredTrack";

export interface LineAdapter extends Timed  {
    stops: Stop[];
    name: string;
    draw(delaySeconds: number, animationDurationSeconds: number, path: Vector[]): void;
    erase(delaySeconds: number, animationDurationSeconds: number, reverse: boolean): void;
}

export class Line implements TimedDrawable {
    static NODE_DISTANCE = 0;
    static SPEED = 100;

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
        
        let track = new PreferredTrack('+');
        for (let j=0; j<stops.length; j++) {
            track = track.fromString(stops[j].preferredTrack);
            const stop = this.stationProvider.stationById(stops[j].stationId);
            if (stop == undefined)
                throw new Error('Station with ID ' + stops[j].stationId + ' is undefined');
            track = track.fromExistingLineAtStation(stop.getAxisAndTrackForExistingLine(this.name));
            this.createConnection(stop, this.nextStopBaseCoord(stops, j, stop.baseCoords), track, path, delay, animate, true);
            track = track.keepOnlySign();
        }
        let duration = this.getAnimationDuration(path, animate);
        this.adapter.draw(delay, duration, path);
        return duration;
    }

    erase(delay: number, animate: boolean, reverse: boolean): number {
        this.adapter.erase(delay, 0, reverse);
        const stops = this.adapter.stops;
        for (let j=0; j<stops.length; j++) {
            const stop = this.stationProvider.stationById(stops[j].stationId);
            if (stop == undefined)
                throw new Error('Station with ID ' + stops[j].stationId + ' is undefined');
            stop.removeLine(this);
            stop.draw(delay);
        }
        return 0;
    }

    private nextStopBaseCoord(stops: Stop[], currentStopIndex: number, defaultCoords: Vector) {
        if (currentStopIndex+1 < stops.length) {
            const id = stops[currentStopIndex+1].stationId;
            const stop = this.stationProvider.stationById(id);
            if (stop == undefined)
                throw new Error('Station with ID ' + id + ' is undefined');
            return stop.baseCoords;            
        }
        return defaultCoords;
    }

    private createConnection(station: Station, nextStopBaseCoord: Vector, track: PreferredTrack, path: Vector[], delay: number, animate: boolean, recurse: boolean): void {
        const dir = station.rotation;
        const baseCoord = station.baseCoords;
        const newDir = this.getStopOrientationBasedOnThreeStops(station, nextStopBaseCoord, dir, path);
        const newPos = station.assignTrack(newDir.isVertical() ? 'x' : 'y', track);

        const newCoord = station.rotatedTrackCoordinates(newDir, newPos);
    
        if (path.length != 0) {
            const oldCoord = path[path.length-1];
    
            this.precedingDir = this.getPrecedingDir(this.precedingDir, this.precedingStop, oldCoord, newCoord);
    
            const stationDir = newDir.add(dir);
            const found = this.insertNode(oldCoord, this.precedingDir, newCoord, stationDir, path);
    
            if (!found && recurse && this.precedingStop != undefined) {
                const helpStop = this.getOrCreateHelperStop(this.precedingDir, this.precedingStop, station);
                
                this.precedingDir = this.precedingDir.add(new Rotation(180));
                this.createConnection(helpStop, baseCoord, track.keepOnlySign(), path, delay, animate, false);
                this.createConnection(station, nextStopBaseCoord, track, path, delay, animate, false);
                return;
            } else if (!found) {
                console.warn('path to fix on line', this.adapter.name, 'at station', station.id);
            }
            this.precedingDir = stationDir;
        }
        station.addLine(this, newDir.isVertical() ? 'x' : 'y', newPos);
        path.push(newCoord);
        delay = this.getAnimationDuration(path, animate) + delay;
        station.draw(delay);
        this.precedingStop = station;
    }

    private getStopOrientationBasedOnThreeStops(station: Station, nextStopBaseCoord: Vector, dir: Rotation, path: Vector[]): Rotation {
        if (path.length != 0) {
            const oldCoord = path[path.length-1];
            return nextStopBaseCoord.delta(oldCoord).inclination().quarterDirection(dir);
        }
        const delta = station.baseCoords.delta(nextStopBaseCoord);
        const existingAxis = station.getAxisAndTrackForExistingLine(this.name)?.axis;
        if (existingAxis != undefined) {
            return delta.inclination().halfDirection(dir, existingAxis == 'x' ? new Rotation(90) : new Rotation(0));           
        }
        return delta.inclination().quarterDirection(dir);
    }
    

    private getPrecedingDir(precedingDir: Rotation | undefined, precedingStop: Station | undefined, oldCoord: Vector, newCoord: Vector): Rotation {
        if (precedingDir == undefined) {
            const precedingStopRotation = precedingStop?.rotation ?? new Rotation(0);
            precedingDir = oldCoord.delta(newCoord).inclination().quarterDirection(precedingStopRotation).add(precedingStopRotation);
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

    private getAnimationDuration(path: Vector[], animate: boolean): number {
        if (!animate)
            return 0;
        return this.getTotalLength(path) / Line.SPEED;
    }
    
    private getTotalLength(path: Vector[]): number {
        let length = 0;
        for (let i=0; i<path.length-1; i++) {
            length += path[i].delta(path[i+1]).length;
        }
        return length;
    }
}