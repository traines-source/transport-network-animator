import { Line } from "./Line";
import { Stop } from "./Station";
import { Vector } from "./Vector";

export class LineGroup {
    private _lines: Line[] = [];
    private _termini: Stop[] = [];
    strokeColor = 0;
    
    addLine(line: Line): void {
        if (!this._lines.includes(line))
            this._lines.push(line);
        this.updateTermini();
    }

    removeLine(line: Line): void {
        let i = 0;
        while (i < this._lines.length) {
            if (this._lines[i] == line) {
                this._lines.splice(i, 1);
            } else {
                i++;
            }
        }
        this.updateTermini();
    }

    get termini(): Stop[] {
        return this._termini;
    }

    getPathBetween(stationIdFrom: string, stationIdTo: string): {path: Vector[], from: number, to: number} | null {
        const from = this.getLinesWithStop(stationIdFrom);
        const to = this.getLinesWithStop(stationIdTo);

        if (from.length == 0 || to.length == 0) {
            return null;
        }

        for (const a of Object.values(from)) {
            for (const b of Object.values(to)) {
                if (a.line == b.line) {
                    return this.getPathBetweenStops(a.line, a.stop, b.stop);
                }
            }
        }
        for (const a of Object.values(from)) {
            for (const b of Object.values(to)) {
                const common = this.findCommonStop(a.line, b.line);
                if (common != null) {
                    const firstPart = this.getPathBetweenStops(a.line, a.stop, common);
                    const secondPart = this.getPathBetweenStops(b.line, common, b.stop);
                    const firstPartSlice = firstPart.path.slice(0, firstPart.to+1);
                    const secondPartSlice = secondPart.path.slice(secondPart.from);
                    return { path: firstPartSlice.concat(secondPartSlice), from: firstPart.from, to: firstPartSlice.length + secondPart.to};
                }
            }
        }
        throw new Error("Complex Train routing for Lines of LineGroups not yet implemented");
    }

    private getLinesWithStop(stationId: string): {line: Line, stop: Stop}[] {
        const arr: {line: Line, stop: Stop}[] = [];
        for (const line of Object.values(this._lines)) {
            const stop = line.getStop(stationId);
            if (stop != null) {
                arr.push({line: line, stop: stop});
            }
        }
        return arr;
    }

    private getPathBetweenStops(line: Line, from: Stop, to: Stop): {path: Vector[], from: number, to: number} {
        const path = line.path;
        let fromIdx = this.indexOf(path, from.coord || Vector.NULL);
        let toIdx = this.indexOf(path, to.coord || Vector.NULL);
        if (fromIdx == -1 || toIdx == -1) {
            throw new Error("Stop that should be present is not present on line " + line.name);
        }
        //const slice = path.slice(Math.min(fromIdx, toIdx), Math.max(fromIdx, toIdx)+1);
        const slice = path.slice();
        if (fromIdx > toIdx) {
            slice.reverse();
            fromIdx = slice.length - 1 - fromIdx;
            toIdx = slice.length - 1 - toIdx;
        }
        return { path: slice, from: fromIdx, to: toIdx };
    }

    private indexOf(array: Vector[], element: Vector) {
        for (let i=0; i<array.length; i++) {
            if (array[i].equals(element)) {
                return i;
            }
        }
        return -1;
    }

    private findCommonStop(line1: Line, line2: Line): Stop | null {
        for (const terminus1 of Object.values(line1.termini)) {
            for (const terminus2 of Object.values(line2.termini)) {
                if (terminus1.stationId == terminus2.stationId) {
                    return terminus1;
                }
            }
        }
        return null;
    }

    private updateTermini() {
        const candidates: {[id: string] : number} = {};
        this._lines.forEach(l => {
            const lineTermini = l.termini;
            lineTermini.forEach(t => {
                if (!t.trackInfo.includes('*')) {
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
