import { expect } from 'chai';
import { Instant } from '../src/Instant';

describe('Instant', () => {
    it('whenFrom', () => {
        expect(Instant.from(['1990', '1'])).eql(new Instant(1990, 1, ''));
        expect(Instant.from(['1990', '1', 'noanim'])).eql(new Instant(1990, 1, 'noanim'));
    })

    it('whenDelta', () => {
        expect(new Instant(1990, 5, '').delta(new Instant(1990, 7, ''))).eql(2);
        expect(new Instant(1990, 5, '').delta(new Instant(1991, 7, 'noanim'))).eql(7);
        expect(new Instant(1990, 5, '').delta(new Instant(1990, 5, ''))).eql(0);
        expect(new Instant(1991, 5, 'reverse').delta(new Instant(1990, 5, ''))).eql(5);
        expect(new Instant(1990, 4, '').delta(new Instant(1990, 0, ''))).eql(-4);
    })

    it('whenEquals', () => {
        expect(new Instant(1990, 0, '').equals(new Instant(1990, 0, 'noanim'))).eql(true);
        expect(new Instant(1990, 1, '').equals(new Instant(1990, 0, ''))).eql(false);
        expect(new Instant(1990, 0, '').equals(new Instant(1991, 0, ''))).eql(false);
    })
})