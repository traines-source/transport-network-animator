import { expect } from 'chai';
import { Utils } from '../src/Utils';

describe('Utils', () => {
    it('whenEquals', () => {
        expect(Utils.equals(0, 0.0001)).to.be.true;
        expect(Utils.equals(0, -0.0001)).to.be.true;
        expect(Utils.equals(0, -0.1)).to.be.false;
    })
})