import { Line } from "./Line";
import { Stop } from "./Station";

export class LineGroup {
    private lines: Line[] = [];
    private _termini: Stop[] = [];
    strokeColor = 0;
    
    addLine(line: Line): void {
        if (!this.lines.includes(line))
            this.lines.push(line);
        this.updateTermini();
    }

    removeLine(line: Line): void {
        let i = 0;
        while (i < this.lines.length) {
            if (this.lines[i] == line) {
                this.lines.splice(i, 1);
            } else {
                i++;
            }
        }
        this.updateTermini();
    }

    get termini(): Stop[] {
        return this._termini;
    }

    private updateTermini() {
        const candidates: {[id: string] : number} = {};
        this.lines.forEach(l => {
            const lineTermini = l.termini;
            lineTermini.forEach(t => {
                if (!t.preferredTrack.includes('*')) {
                    if (candidates[t.stationId] == undefined) {
                        candidates[t.stationId] = 1;
                    } else {
                        candidates[t.stationId]++;
                    }
                }
            });
        });
        const termini: Stop[] = [];
        for (const [stationId, occurences] of Object.entries(candidates)) {
            if (occurences == 1) {
                termini.push(new Stop(stationId, ''));
            }
        }
        this._termini = termini;
    }

}
