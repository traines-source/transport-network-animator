import { expect } from 'chai';
import { Vector } from '../src/Vector';
import { Rotation } from '../src/Rotation';
import { Utils } from '../src/Utils';

describe('Vector', () => {
    it('whenAdd', () => {
        expect(new Vector(-1, 2).add(new Vector(3, 4))).eql(new Vector(2, 6));
        expect(Vector.UNIT.add(new Vector(-1, 4))).eql(new Vector(-1, 3));
    })
    it('whenRotate_given45', () => {
        const v = Vector.UNIT.rotate(new Rotation(45));
        expect(Utils.equals(v.x, 0.7071067811865475)).to.be.true;
        expect(Utils.equals(v.y, -0.7071067811865475)).to.be.true;
    })
    it('whenRotate_given90', () => {
        const v = new Vector(0, 55).rotate(new Rotation(90));
        expect(Utils.equals(v.x, -55)).to.be.true;
        expect(Utils.equals(v.y, 0)).to.be.true;
    })
    it('whenRotate_given-90', () => {
        const v = Vector.UNIT.rotate(new Rotation(-90));
        expect(Utils.equals(v.x, -1)).to.be.true;
        expect(Utils.equals(v.y, 0)).to.be.true;
    })
    it('whenRotate_given540', () => {
        const v = Vector.UNIT.rotate(new Rotation(540));
        expect(Utils.equals(v.x, 0)).to.be.true;
        expect(Utils.equals(v.y, 1)).to.be.true;
    })
})