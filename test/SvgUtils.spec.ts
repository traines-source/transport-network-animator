import { expect } from 'chai';
import { SvgUtils } from '../src/svg/SvgUtils';
import { Vector } from '../src/Vector';

describe('SvgUtils', () => {

    it('whenReadTermini', () => {
        const input = "M 2690475.7 1762814 L 2690478.7 1762793.1 L 2690486.9 1762452 L 2690477.8 1762435.6 L 2690473.5 1762429";

        expect(SvgUtils.readTermini(input)).eql([new Vector(2690475.7, 1762814), new Vector(2690473.5, 1762429)]);       
    })
})