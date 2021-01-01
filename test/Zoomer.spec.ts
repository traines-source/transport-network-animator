import { expect } from 'chai';
import { Vector } from '../src/Vector';
import { Zoomer } from '../src/Zoomer';
import { Instant } from '../src/Instant';

describe('Zoomer', () => {

    it('whenInclude_givenValidBoxes', () => {        
        const z = new Zoomer(new Vector(1000, 1000));
        expect(z.center).eql(new Vector(500, 500));
        expect(z.scale).eql(1);

        z.include({tl: new Vector(100, 200), br: new Vector(300, 600)}, Instant.BIG_BANG, false);
        expect(z.center).eql(new Vector(500, 500));
        expect(z.scale).eql(1);

        z.include({tl: new Vector(100, 200), br: new Vector(300, 600)}, new Instant(1, 1, 'nozoom'), true);
        expect(z.center).eql(new Vector(500, 500));
        expect(z.scale).eql(1);

        z.include({tl: new Vector(100, 230), br: new Vector(300, 570)}, new Instant(1, 1, ''), true);
        expect(z.center).eql(new Vector(200, 400));
        expect(z.scale).eql(2);

        z.include({tl: new Vector(100, 200), br: new Vector(800, 600)}, new Instant(1, 1, ''), true);
        expect(z.center).eql(new Vector(450, 400));
        expect(z.scale).lessThan(1.25);

        z.include({tl: new Vector(100, 200), br: new Vector(800, 700)}, new Instant(1, 1, ''), true);
        expect(z.center).eql(new Vector(450, 450));
        expect(z.scale).lessThan(1.25);

        z.include({tl: new Vector(100, 200), br: new Vector(900, 900)}, new Instant(1, 1, 'nozoom'), true);
        expect(z.center).eql(new Vector(450, 450));
        expect(z.scale).lessThan(1.25);
    })

    it('whenInclude_givenInvalidBoxesYAxis', () => {        
        const z = new Zoomer(new Vector(1000, 1000));
        
        z.include({tl: new Vector(100, 230), br: new Vector(200, 230)}, new Instant(1, 1, ''), true);
        expect(z.center).eql(new Vector(150, 230));
        expect(z.scale).eql(3);

        z.include({tl: new Vector(300, 230), br: new Vector(300, 570)}, new Instant(1, 1, ''), true);
        expect(z.center).eql(new Vector(200, 400));
        expect(z.scale).eql(2);
    })

    it('whenInclude_givenInvalidBoxesXAxis', () => {        
        const z = new Zoomer(new Vector(1000, 1000));

        z.include({tl: new Vector(300, 230), br: new Vector(300, 570)}, new Instant(1, 1, ''), true);
        expect(z.center).eql(new Vector(300, 400));
        expect(z.scale).eql(2);
    })

    it('whenInclude_givenInvalidBoxesTwoAxis', () => {        
        const z = new Zoomer(new Vector(1000, 1000));

        z.include({tl: new Vector(100, 200), br: new Vector(100, 200)}, new Instant(1, 1, ''), true);
        expect(z.center).eql(new Vector(100, 200));
        expect(z.scale).eql(3);
    })
})