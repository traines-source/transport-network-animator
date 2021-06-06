import { expect } from 'chai';
import { instance, mock, when, verify, anything } from 'ts-mockito';
import { DrawableSorter } from '../src/DrawableSorter';
import { Line } from '../src/drawables/Line';
import { Rotation } from '../src/Rotation';
import { Vector } from '../src/Vector';

describe('DrawableSorter', () => {

    it('givenDrawBoolean_thenReverseOnlyForFalse', () => {
        const underTest = new DrawableSorter();

        const timedDrawable1: Line = instance(mock());
        const timedDrawable2: Line = instance(mock());
        const list = [timedDrawable1, timedDrawable2];
        expect(underTest.sort(list, true)).eql([]);
        expect(list).eql([timedDrawable1, timedDrawable2]);
        expect(underTest.sort(list, false)).eql([]);
        expect(list).eql([timedDrawable2, timedDrawable1]);
    })

    it('givenAnimOrderSE_thenSortDespiteDelete', () => {
        const underTest = new DrawableSorter();

        const line1: Line = mock();
        when(line1.animOrder).thenReturn(Rotation.from("se"));
        when(line1.path).thenReturn([new Vector(6, 5), new Vector(-10, 2)]);
        when(line1.animationDurationSeconds).thenReturn(1);
        when(line1.speed).thenReturn(Line.SPEED);
        const line2: Line = mock();
        when(line2.animOrder).thenReturn(Rotation.from("se"));
        when(line2.path).thenReturn([new Vector(7, 9), new Vector(10, 20)]);
        when(line2.animationDurationSeconds).thenReturn(2);
        when(line2.speed).thenReturn(Line.SPEED);

        const l1 = instance(line1);
        const l2 = instance(line2);
        Object.setPrototypeOf(l1, Line.prototype);
        Object.setPrototypeOf(l2, Line.prototype);
        const list = [l1, l2];
        const delays = underTest.sort(list, false);
        expect(delays[0]).eql({delay: 0, reverse: true});
        expect(delays[1].delay).approximately(2+4/Line.SPEED, 0.01);
        expect(delays[1].reverse).eql(false);
        expect(list).eql([l2, l1]);
    })

    it('givenAnimOrderNorth_thenSort', () => {
        const underTest = new DrawableSorter();

        const line1: Line = mock();
        when(line1.animOrder).thenReturn(Rotation.from("n"));
        when(line1.path).thenReturn([new Vector(6, 5), new Vector(-10, 2)]);
        when(line1.animationDurationSeconds).thenReturn(1);
        when(line1.speed).thenReturn(Line.SPEED);
        const line2: Line = mock();
        when(line2.animOrder).thenReturn(Rotation.from("n"));
        when(line2.path).thenReturn([new Vector(10, 20), new Vector(3, 4)]);
        when(line2.animationDurationSeconds).thenReturn(2);
        when(line2.speed).thenReturn(Line.SPEED);
        const line3: Line = mock();
        when(line3.animOrder).thenReturn(Rotation.from("n"));
        when(line3.path).thenReturn([new Vector(-5, -4), new Vector(-10, 2)]);
        when(line3.animationDurationSeconds).thenReturn(3);
        when(line3.speed).thenReturn(Line.SPEED);
        const line4: Line = mock();
        when(line4.animOrder).thenReturn(Rotation.from("n"));
        when(line4.path).thenReturn([new Vector(-10, 3), new Vector(-10, 20)]);
        when(line4.animationDurationSeconds).thenReturn(4);
        when(line4.speed).thenReturn(Line.SPEED);

        const l1 = instance(line1);
        const l2 = instance(line2);
        const l3 = instance(line3);
        const l4 = instance(line4);
        Object.setPrototypeOf(l1, Line.prototype);
        Object.setPrototypeOf(l2, Line.prototype);
        Object.setPrototypeOf(l3, Line.prototype);
        Object.setPrototypeOf(l4, Line.prototype);
        const list = [l1, l2, l3, l4];
        expect(underTest.sort(list, true)).eql([{delay: 0, reverse: false}, {delay: 3, reverse: true}, {delay: 3+1/Line.SPEED, reverse: false}, {delay: 4-1/Line.SPEED, reverse: true}]);
        expect(list).eql([l3, l1, l4, l2]);
    })

    
})