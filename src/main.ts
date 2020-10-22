import { SvgNetwork } from "./SvgNetwork";
import { Network } from "./Network";
import { Instant } from "./Instant";

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

    network.drawTimedDrawablesAt(instant, animate);
    const next = network.nextInstant(instant);
    
    if (next) {
        const delay = animate ? instant.delta(next) : 0;
        window.setTimeout(function() { slide(next, animate); }, delay * 1000);
    }
}
