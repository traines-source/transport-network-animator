import { Station } from "./Station";
import { Rotation } from "../Rotation";
import { StationProvider } from "../Network";
import { Vector } from "../Vector";
import { AbstractTimedDrawable, AbstractTimedDrawableAdapter } from "./AbstractTimedDrawable";
import { Config } from "../Config";

export interface LabelAdapter extends AbstractTimedDrawableAdapter {
    forStation: string | undefined;
    forLine: string | undefined;
    draw(delaySeconds: number, animationDurationSeconds: number, textCoords: Vector, labelDir: Rotation, children: LabelAdapter[]): void;
    erase(delaySeconds: number, animationDurationSeconds: number): void;
    cloneForStation(stationId: string): LabelAdapter;
}

export class Label extends AbstractTimedDrawable {

    constructor(protected adapter: LabelAdapter, private stationProvider: StationProvider) {
        super(adapter);
    }

    children: Label[] = [];

    hasChildren(): boolean {
        return this.children.length > 0;
    }

    get name(): string {
        return this.adapter.forStation || this.adapter.forLine || '';
    }
    
    get forStation(): Station {
        const s = this.stationProvider.stationById(this.adapter.forStation || '');
        if (s == undefined) {
            throw new Error('Station with ID ' + this.adapter.forStation + ' is undefined');
        }
        return s;
    }

    draw(delay: number, animate: boolean): number {
        const animationDurationSeconds = animate ? Config.default.fadeDurationSeconds : 0;
        if (this.adapter.forStation != undefined) {
            const station = this.forStation;
            station.addLabel(this);
            if (station.linesExisting()) {
                this.drawForStation(delay, animationDurationSeconds, station, false);
            } else {
                this.adapter.erase(delay, animate ? Config.default.fadeDurationSeconds : 0);
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
        } else {
            this.adapter.draw(delay, animationDurationSeconds, Vector.NULL, Rotation.from('n'), []);
        }
        return 0;
    }

    private drawForStation(delaySeconds: number, animationDurationSeconds: number, station: Station, forLine: boolean) {
        const baseCoord = station.baseCoords;
        let yOffset = 0;
        for (let i=0; i<station.labels.length; i++) {
            const l = station.labels[i];
            if (l == this)
                break;
            yOffset += Config.default.labelHeight*1.5;
        }
        const labelDir = station.labelDir;

        yOffset = Math.sign(Vector.UNIT.rotate(labelDir).y)*yOffset - (yOffset>0 ? 2 : 0); //TODO magic numbers
        const stationDir = station.rotation;
        const diffDir = labelDir.add(new Rotation(-stationDir.degrees));
        const unitv = Vector.UNIT.rotate(diffDir);
        const anchor = new Vector(station.stationSizeForAxis('x', unitv.x), station.stationSizeForAxis('y', unitv.y));
        const textCoords = baseCoord.add(anchor.rotate(stationDir)).add(new Vector(0, yOffset));
    
        this.adapter.draw(delaySeconds, animationDurationSeconds, textCoords, labelDir, this.children.map(c => c.adapter));
    }

    erase(delay: number, animate: boolean, reverse: boolean): number {
        if (this.adapter.forStation != undefined) {
            this.forStation.removeLabel(this);
            this.adapter.erase(delay, animate ? Config.default.fadeDurationSeconds : 0);
        } else if (this.adapter.forLine != undefined) {
            this.children.forEach(c => {
                c.erase(delay, animate, reverse);
            });
        } else {
            this.adapter.erase(delay, animate ? Config.default.fadeDurationSeconds : 0);
        }
        return 0;
    }
}