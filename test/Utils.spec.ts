import { expect } from 'chai';
import { Utils } from '../src/Utils';

describe('Utils', () => {
    it('whenEquals', () => {
        expect(Utils.equals(0, 0.0001)).to.be.true;
        expect(Utils.equals(0, -0.0001)).to.be.true;
        expect(Utils.equals(0, -0.1)).to.be.false;
    })

    it('whenTripleDecision', () => {
        expect(Utils.trilemma(-50, ['a', 'b', 'c'])).eql('a');
        expect(Utils.trilemma(0.0001, ['a', 'b', 'c'])).eql('b');
        expect(Utils.trilemma(1, ['a', 'b', 'c'])).eql('c');
    })

    it('whenAlphabeticId', () => {
        expect(Utils.alphabeticId('a', 'b')).eql('a_b');
        expect(Utils.alphabeticId('c', 'b')).eql('b_c');
    })
})