import { expect } from 'chai';
import { LineGroup } from '../src/LineGroup';
import { Stop } from '../src/drawables/Station';
import { Line } from '../src/drawables/Line';
import { instance, mock, when, anyNumber, anything } from 'ts-mockito';

describe('LineGroup', () => {

    it('whenTermini', () => {
        const g = new LineGroup();

        let m: Line = mock();
        when(m.termini).thenReturn([new Stop('a', ''), new Stop('b', '')]);
        const l1 = instance(m);
        g.addLine(l1);
        
        expect(g.termini).eql([new Stop('a', ''), new Stop('b', '')]);

        m = mock();
        when(m.termini).thenReturn([new Stop('b', ''), new Stop('c', '')]);
        const l2 = instance(m);
        g.addLine(l2);
        
        expect(g.termini).eql([new Stop('a', ''), new Stop('c', '')]);

        m = mock();
        when(m.termini).thenReturn([new Stop('b', ''), new Stop('a', ''), new Stop('g', 'g*')]);
        const l3 = instance(m);
        g.addLine(l3);
        
        expect(g.termini).eql([new Stop('c', '')]);

        g.removeLine(l3);

        expect(g.termini).eql([new Stop('a', ''), new Stop('c', '')]);

        g.removeLine(l1);

        expect(g.termini).eql([new Stop('b', ''), new Stop('c', '')]);
    })

    it('whenTerminiWithFork', () => {
        const g = new LineGroup();

        let m: Line = mock();
        when(m.termini).thenReturn([new Stop('a', ''), new Stop('b', ''), new Stop('c', '')]);
        const l1 = instance(m);
        g.addLine(l1);

        m = mock();
        when(m.termini).thenReturn([new Stop('b', ''), new Stop('d', '')]);
        const l2 = instance(m);
        g.addLine(l2);
        
        expect(g.termini).eql([new Stop('a', ''), new Stop('c', ''), new Stop('d', '')]);
    })
})