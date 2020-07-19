import { Station } from "./Station";
import { Rotation } from "./Rotation";
import { SvgNetwork } from "./SvgNetwork";
import { Network } from "./Network";
import { Instant } from "./Instant";
import { TimedDrawable } from "./Drawable";

// TODO: ts refactor, labels, zoom, negative default tracks based on direction,


var precedingStop : Station | undefined = undefined;
var precedingDir : Rotation | undefined = undefined;

const network: Network = new Network(new SvgNetwork());
network.initialize();

const animateFromEpoch: number = getStartEpoch();
slide(Instant.BIG_BANG, false);

function getStartEpoch(): number {
    if(window.location.hash && network.isEpochExisting(window.location.hash.replace('#', ''))) {
        const animateFromEpoch: string = window.location.hash.replace('#', '');
        console.log('fast forward to ' + animateFromEpoch);
        return parseInt(animateFromEpoch) || 0;
    }
    return 0;
}

function slide(instant: Instant, animate: boolean) {
    if (instant.epoch == animateFromEpoch)
        animate = true;

    const elements: TimedDrawable[] = network.timedDrawablesAt(instant);
    let delay = 0;
    for (let i=0; i<elements.length; i++) {
        delay += drawOrEraseElement(elements[i], delay, animate, instant);
    }
    const next = network.nextInstant(instant);
    
    if (next) {
        const delay = animate ? instant.delta(next) : 0;
        window.setTimeout(function() { slide(next, animate); }, delay * 1000);
    }
}

function drawOrEraseElement(element: TimedDrawable, delay: number, animate: boolean, instant: Instant): number {

    if (instant.equals(element.to) && !element.from.equals(element.to)) {
        return eraseElement(element, delay, shouldAnimate(element.to, animate));
    }
    return drawElement(element, delay, shouldAnimate(element.from, animate));
}

function drawElement(element: TimedDrawable, delay: number, animate: boolean): number {
    return element.draw(delay, animate);
}

function eraseElement(element: TimedDrawable, delay: number, animate: boolean): number {
    return element.erase(delay, animate, false);
}

function shouldAnimate(instant: Instant, animate: boolean) {
    if (!animate)
        return false;
    if (instant.flag == 'noanim')
        return false;
    return animate;
}

/*
function eraseLine(line, delay) {
    if (delay > 0) {
        window.setTimeout(function() { eraseLine(line, 0); }, delay * 1000);
        return 0;
    }
    line.setAttribute('d', '');
    const stops = line.dataset.stops.split(' ');
    for (let j=0; j<stops.length; j++) {
        if (getTrackAssignment(stops[j])) {
            continue;
        }
        const stop = document.getElementById(stops[j]);
        const dir = DIRS[stop.getAttribute('data-dir')];
        const baseCoord = getStopBaseCoord(stop);
        const existingLinesAtStation = getExistingLinesAtStation(stops[j]);
        removeExistingLineAtStationAxis(existingLinesAtStation.x, line.dataset.line);
        removeExistingLineAtStationAxis(existingLinesAtStation.y, line.dataset.line);
        rerenderStation(existingLinesAtStation, dir, baseCoord, stop);
    }
    return 0;
}


function removeExistingLineAtStationAxis(existingLinesAtStationAxis, lineId) {
    let i = 0;
    while (i < existingLinesAtStationAxis.length) {
        if (existingLinesAtStationAxis[i].line == lineId) {
            existingLinesAtStationAxis.splice(i, 1);
        } else {
            i++;
        }
    }
}


*/


