import { SvgNetwork } from "./svg/SvgNetwork";
import { Network } from "./Network";
import { Instant } from "./Instant";

// TODO: erase anim, labels, negative default tracks based on direction, rejoin lines track selection

let timePassed = 0;

const network: Network = new Network(new SvgNetwork());
network.initialize();

const animateFromInstant: Instant = getStartInstant();
slide(Instant.BIG_BANG, false);

function getStartInstant(): Instant {
    if(window.location.hash) {
        const animateFromInstant: string[] = window.location.hash.replace('#', '').split('-');
        const instant = new Instant(parseInt(animateFromInstant[0]) || 0, parseInt(animateFromInstant[1]) || 0, '');
        console.log('fast forward to', instant);
        return instant;
    }
    return Instant.BIG_BANG;
}

function slide(instant: Instant, animate: boolean): void {
    if (instant != Instant.BIG_BANG && instant.epoch >= animateFromInstant.epoch && instant.second >= animateFromInstant.second)
        animate = true;

    console.log(instant, 'time: ' + Math.floor(timePassed / 60) + ':' + timePassed % 60);

    network.drawTimedDrawablesAt(instant, animate);
    const next = network.nextInstant(instant);
    
    if (next) {
        const delta = instant.delta(next);
        timePassed += delta;
        const delay = animate ? delta : 0;
        window.setTimeout(function() { slide(next, animate); }, delay * 1000);
    }
}
