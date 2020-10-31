import { expect } from 'chai';
import { Instant } from '../src/Instant';
import { LineGroup } from '../src/LineGroup';
import { Stop } from '../src/Station';
import { Line } from '../src/Line';
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
        when(m.termini).thenReturn([new Stop('b', ''), new Stop('a', '')]);
        const l3 = instance(m);
        g.addLine(l3);
        
        expect(g.termini).eql([new Stop('c', '')]);

        g.removeLine(l3);

        expect(g.termini).eql([new Stop('a', ''), new Stop('c', '')]);

        g.removeLine(l1);

        expect(g.termini).eql([new Stop('b', ''), new Stop('c', '')]);
    })
})