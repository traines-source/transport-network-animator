import { Station } from "./Station";
import { Rotation } from "./Rotation";
import { SvgNetwork } from "./SvgNetwork";
import { Network } from "./Network";
import { Instant } from "./Instant";
import { TimedDrawable } from "./Drawable";

// TODO: erase anim, labels, zoom, negative default tracks based on direction, reuse track of just erased line?

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

function slide(instant: Instant, animate: boolean): void {
    if (instant.epoch == animateFromEpoch)
        animate = true;

    network.setInstant(instant);

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

function shouldAnimate(instant: Instant, animate: boolean): boolean {
    if (!animate)
        return false;
    if (instant.flag == 'noanim')
        return false;
    return animate;
}

