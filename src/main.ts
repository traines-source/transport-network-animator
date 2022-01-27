import { SvgNetwork } from "./svg/SvgNetwork";
import { Network } from "./Network";
import { Instant } from "./Instant";
import { SvgAnimator } from "./svg/SvgAnimator";
import { DrawableSorter } from "./DrawableSorter";
import { Config } from "./Config";

export { SvgAnimator } from "./svg/SvgAnimator";
export { Config } from "./Config";
export { Projection } from "./Projection";

let timePassed = 0;

const network: Network = new Network(new SvgNetwork(), new DrawableSorter());
const animateFromInstant: Instant = getStartInstant();
let started = false;

if (Config.default.autoStart) {
    started = true;
    startTransportNetworkAnimator();
}

document.addEventListener('startTransportNetworkAnimator', function(e) {
    if (started) {
        console.warn('transport-network-animator already started. You should probably set data-auto-start="false". Starting anyways.')
    }
    started = true;
    startTransportNetworkAnimator();
});

function startTransportNetworkAnimator() {
    network.initialize();    
    slide(Instant.BIG_BANG, false);
}

function getStartInstant(): Instant {
    if(window.location.hash) {
        const animateFromInstant: string[] = window.location.hash.replace('#', '').split('-');
        const instant = new Instant(parseInt(animateFromInstant[0]) || 0, parseFloat(animateFromInstant[1]) || 0, '');
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
        const animator = new SvgAnimator();
        animator.wait(delay*1000, () => slide(next, animate));
    }
}
