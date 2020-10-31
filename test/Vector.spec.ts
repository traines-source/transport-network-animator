import { expect } from 'chai';
import { Vector } from '../src/Vector';
import { Rotation } from '../src/Rotation';
import { Utils } from '../src/Utils';

describe('Vector', () => {
    it('whenAdd', () => {
        expect(new Vector(-1, 2).add(new Vector(3, 4))).eql(new Vector(2, 6));
        expect(Vector.UNIT.add(new Vector(-1, 4))).eql(new Vector(-1, 3));
    })

    it('whenDelta', () => {
        expect(new Vector(-1, 2).delta(new Vector(3, 4))).eql(new Vector(4, 2));
        expect(Vector.UNIT.delta(new Vector(-1, 4))).eql(new Vector(-1, 5));
    })

    it('whenLength', () => {
        expect(new Vector(-3, 4).length).eql(5);
    })

    it('whenWithLength', () => {
        expect(new Vector(-15, 20).withLength(1)).eql(new Vector(-0.6, 0.8));
    })
    it('whenWithLength_givenZeroVector', () => {
        expect(new Vector(0, 0).withLength(1)).eql(new Vector(NaN, NaN));
    })
    it('whenWithLength_givenZeroLength', () => {
        expect(new Vector(-15, 20).withLength(0)).eql(new Vector(-0, 0));
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

    it('whenDotProduct', () => {
        const v = Vector.UNIT.rotate(new Rotation(540));
        expect(new Vector(3, 4).dotProduct(new Vector(5, 6))).eql(39);
    })

    it('whenSolveForIntersection_givenTopLeft', () => {
        const result = new Vector(-28, -78).solveDeltaForIntersection(new Vector(0,-1), new Vector(0.7071067811865476, 0.7071067811865476));
        expect(Utils.equals(result.a, 50)).to.be.true;
        expect(Utils.equals(result.b, 39.5979)).to.be.true;
    })
    it('whenSolveForIntersection_givenBottomRight', () => {
        expect(new Vector(3, 2).solveDeltaForIntersection(new Vector(1, 0), new Vector(0, -1))).eql({a: 3, b: 2});
    })
    it('whenSolveForIntersection_givenBottomLeft', () => {
        expect(new Vector(-2, 3).solveDeltaForIntersection(new Vector(0, 2), new Vector(2, 0))).eql({a: 1.5, b: 1});
    })
    it('whenSolveForIntersection_givenTopRightFuzzy', () => {
        const result = new Vector(-10, 5).solveDeltaForIntersection(new Vector(-0.7071067811865476, 0.7071067811865476), new Vector(1, 0.00001));
        expect(Utils.equals(result.a, 7.0711)).to.be.true;
        expect(Utils.equals(result.b, 5)).to.be.true;
    })
    it('whenSolveForIntersection_givenTop', () => {
        expect(new Vector(0, -7).solveDeltaForIntersection(new Vector(-1, 1), new Vector(2, 2))).eql({a: -3.5, b: 1.75});
    })
    it('whenSolveForIntersection_givenParallel', () => {
        expect(new Vector(0, -7).solveDeltaForIntersection(new Vector(0, 1), new Vector(0, 2))).eql({a: NaN, b: NaN});
    })

    it('whenIsDeltaMatchingParallel', () => {
        expect(new Vector(0.0001, -7).isDeltaMatchingParallel(new Vector(0, 1), new Vector(0, 2))).is.true;
        expect(new Vector(1, 0.0001).isDeltaMatchingParallel(new Vector(0.0001, 0.0001), new Vector(1, 0.00001))).is.true;
        expect(new Vector(7, -7).isDeltaMatchingParallel(new Vector(0, 1), new Vector(0, 2))).is.false;
    })

    it('whenInclination', () => {
        expect(new Vector(0.0001, -7).inclination().degrees).eql(0);
        expect(new Vector(0.7, 0.7).inclination().degrees).eql(135);
        expect(new Vector(-0.7, 0).inclination().degrees).eql(-90);
        expect(new Vector(-0.7, 0.7).inclination().degrees).eql(-135);
    })

    it('whenBothAxisMins', () => {
        expect(new Vector(1, -7).bothAxisMins(new Vector(2, -8))).eql(new Vector(1, -8));
        expect(new Vector(0.7, 7).bothAxisMins(new Vector(0, 8))).eql(new Vector(0, 7));
        expect(new Vector(0.7, 0.8).bothAxisMins(new Vector(7, 8))).eql(new Vector(0.7, 0.8));
        expect(new Vector(0.7, 0.8).bothAxisMins(new Vector(-1, -8))).eql(new Vector(-1, -8));
        expect(Vector.NULL.bothAxisMins(new Vector(-1, -8))).eql(new Vector(-1, -8));
        expect(new Vector(-1, -8).bothAxisMins(Vector.NULL)).eql(new Vector(-1, -8));
    })

    it('whenBothAxisMaxs', () => {
        expect(new Vector(0.0001, -7).bothAxisMaxs(new Vector(1, -8))).eql(new Vector(1, -7));
        expect(new Vector(0.7, 0.7).bothAxisMaxs(new Vector(0, 8))).eql(new Vector(0.7, 8));
        expect(new Vector(0.7, 0.8).bothAxisMaxs(new Vector(7, 8))).eql(new Vector(7, 8));
        expect(new Vector(0.7, 0.8).bothAxisMaxs(new Vector(-1, -8))).eql(new Vector(0.7, 0.8));
        expect(Vector.NULL.bothAxisMaxs(new Vector(-1, -8))).eql(new Vector(-1, -8));
        expect(new Vector(-1, -8).bothAxisMaxs(Vector.NULL)).eql(new Vector(-1, -8));
    })
})