import { TimedDrawable, Timed } from "./Drawable";
import { Station } from "./Station";
import { Rotation } from "./Rotation";
import { StationProvider } from "./Network";
import { Vector } from "./Vector";

export interface LabelAdapter extends Timed {
    forStation: string | undefined;
    forLine: string | undefined;
    boundingBox: {tl: Vector, br: Vector};
    draw(delaySeconds: number, textCoords: Vector, labelDir: Rotation, children: LabelAdapter[]): void;
    erase(delaySeconds: number): void;
    cloneForStation(stationId: string): LabelAdapter;
}

export class Label implements TimedDrawable {
    static LABEL_HEIGHT = 12;

    constructor(private adapter: LabelAdapter, private stationProvider: StationProvider) {

    }

    from = this.adapter.from;
    to = this.adapter.to;
    boundingBox = this.adapter.boundingBox;
    children: Label[] = [];

    hasChildren(): boolean {
        return this.children.length > 0;
    }

    get forStation(): Station {
        const s = this.stationProvider.stationById(this.adapter.forStation || '');
        if (s == undefined) {
            throw new Error('Station with ID ' + this.adapter.forStation + ' is undefined');
        }
        return s;
    }

    draw(delay: number, animate: boolean): number {
        if (this.adapter.forStation != undefined) {
            const station = this.forStation;
            station.addLabel(this);
            if (station.linesExisting()) {
                this.drawForStation(delay, station, false);
            } else {
                this.adapter.erase(delay);
            }
        } else if (this.adapter.forLine != undefined) {
            const termini = this.stationProvider.lineGroupById(this.adapter.forLine).termini;
            termini.forEach(t => {
                const s = this.stationProvider.stationById(t.stationId);
                if (s != undefined) {
                    let found = false;
                    s.labels.forEach(l => {
                        if (l.hasChildren()) {
                            found = true;
                            l.children.push(this);
                            l.draw(delay, animate);                            
                        }
                    });
                    if (!found) {
                        const newLabelForStation = new Label(this.adapter.cloneForStation(s.id), this.stationProvider);
                        newLabelForStation.children.push(this);
                        s.addLabel(newLabelForStation);
                        newLabelForStation.draw(delay, animate);
                        this.children.push(newLabelForStation);
                    }
                }
            
            });
        }
        return 0;
    }

    private drawForStation(delaySeconds: number, station: Station, forLine: boolean) {
        const baseCoord = station.baseCoords;
        let yOffset = 0;
        for (let i=0; i<station.labels.length; i++) {
            const l = station.labels[i];
            if (l == this)
                break;
            yOffset += Label.LABEL_HEIGHT*1.5;
        }
        const labelDir = station.labelDir;
        const stationDir = station.rotation;
        const diffDir = labelDir.add(new Rotation(-stationDir.degrees));
        const unitv = Vector.UNIT.rotate(diffDir);
        const anchor = new Vector(station.stationSizeForAxis('x', unitv.x), station.stationSizeForAxis('y', unitv.y));
        const textCoords = baseCoord.add(anchor.rotate(stationDir)).add(new Vector(0, Math.sign(Vector.UNIT.rotate(labelDir).y)*yOffset));
    
        this.adapter.draw(delaySeconds, textCoords, labelDir, this.children.map(c => c.adapter));
    }

    erase(delay: number, animate: boolean, reverse: boolean): number {
        if (this.adapter.forStation != undefined) {
            this.forStation.removeLabel(this);
            this.adapter.erase(delay);
        } else if (this.adapter.forLine != undefined) {
            this.children.forEach(c => {
                c.erase(delay, animate, reverse);
            });
        }
        return 0;
    }
}