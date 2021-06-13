import { TimedDrawable } from "./drawables/TimedDrawable";
import { Line } from "./drawables/Line";
import { Vector } from "./Vector";
import { Rotation } from "./Rotation";

export class DrawableSorter {
    constructor() {

    }

    sort(elements: TimedDrawable[], draw: boolean, animate: boolean): {delay: number, reverse: boolean}[] {
        if (elements.length == 0) {
            return [];
        }
        const representativeElement = elements[0];
        if (representativeElement instanceof Line && representativeElement.animOrder != undefined) {
            return this.orderByGeometricDirection(elements, representativeElement.animOrder, draw, animate);
        }
        if (!draw) {
            elements.reverse();
        }
        return [];
    }

    private buildSortableCache(elements: TimedDrawable[], direction: Rotation): {element: Line, termini: Vector[], projection: number, reverse: boolean, animationDuration: number}[] {
        const cache : {element: Line, termini: Vector[], projection: number, reverse: boolean, animationDuration: number}[] = [];
        for (let i=0;i<elements.length;i++) {
            if (elements[i] instanceof Line) {
                const element = <Line>elements[i];
                let termini = [Vector.NULL, Vector.NULL];
                if (element.path.length > 1) {
                    termini = [element.path[0], element.path[element.path.length-1]];
                }
                
                const proj1 = termini[0].signedLengthProjectedAt(direction);
                const proj2 = termini[1].signedLengthProjectedAt(direction);
                const reverse = proj1 < proj2;
                if (reverse) {
                    termini.reverse();
                }
                cache.push({
                    element: element,
                    termini: termini,
                    projection: Math.max(proj1, proj2),
                    reverse: reverse,
                    animationDuration: element.animationDurationSeconds
                });
            }
        }
        return cache;
    }

    private orderByGeometricDirection(elements: TimedDrawable[], direction: Rotation, draw: boolean, animate: boolean): {delay: number, reverse: boolean}[] {
        const cache = this.buildSortableCache(elements, direction);
        cache.sort((a, b) => (a.projection < b.projection) ? 1 : -1);
        elements.splice(0, elements.length);

        const delays: {delay: number, reverse: boolean}[] = [];
        for (let i=0;i<cache.length;i++) {
            const refPoint = cache[i].termini[0];
            let shortest = refPoint.delta(cache[0].termini[0]).length;
            let projectionForShortest = 0;
            let delayForShortest = 0;
            for (let j=0;j<i;j++) {
                for (let k=0;k<2;k++) {
                    const delta = refPoint.delta(cache[j].termini[k]);
                    const potentialShortest = delta.length;
                    if (potentialShortest <= shortest) {
                        shortest = potentialShortest;
                        projectionForShortest = delta.signedLengthProjectedAt(direction);                        
                        delayForShortest = delays[j].delay + (k == 1 ? cache[j].animationDuration : 0);
                    }
                }
            }
            const noanim = !animate || cache[i].element[draw ? 'from' : 'to']?.flag.includes('noanim');
            const delay = noanim ? 0 : (delayForShortest + projectionForShortest/cache[i].element.speed);
            delays.push({delay: delay, reverse: cache[i].reverse == draw});
            elements.push(cache[i].element);
        }
        return delays;
    }
}