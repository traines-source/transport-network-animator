import { expect } from 'chai';
import { NetworkAdapter, Network } from '../src/Network';
import { Station, StationAdapter } from '../src/Station';
import { Vector } from '../src/Vector';
import { Rotation } from '../src/Rotation';
import { instance, mock, when, verify, anything } from 'ts-mockito';
import { TimedDrawable } from '../src/Drawable';
import { BoundingBox } from "../src/BoundingBox";
import { Instant } from '../src/Instant';

describe('Network', () => {
    let networkAdapter: NetworkAdapter;
    let timedDrawable: TimedDrawable;
    let stationAdapter: StationAdapter;

    beforeEach(() => {
        networkAdapter = mock();
        when(networkAdapter.canvasSize).thenReturn(new BoundingBox(new Vector(0,0), new Vector(1000,1000)));
        timedDrawable = mock();
        stationAdapter = mock();
    })

    it('whenNextInstant', () => {
        const underTest = new Network(instance(networkAdapter));

        when(timedDrawable.from).thenReturn(new Instant(1, 1, ''));
        when(timedDrawable.to).thenReturn(new Instant(1, 2, ''));
        underTest.addToIndex(instance(timedDrawable));
        timedDrawable = mock();
        when(timedDrawable.from).thenReturn(new Instant(2, 2, ''));
        when(timedDrawable.to).thenReturn(new Instant(3, 0, ''));
        underTest.addToIndex(instance(timedDrawable));

        expect(underTest.nextInstant(Instant.BIG_BANG)).eql(new Instant(1, 1, ''));
        expect(underTest.nextInstant(new Instant(1, 1, ''))).eql(new Instant(1, 2, ''));
        expect(underTest.nextInstant(new Instant(1, 2, ''))).eql(new Instant(2, 2, ''));
        expect(underTest.nextInstant(new Instant(2, 2, ''))).eql(new Instant(3, 0, ''));
        expect(underTest.nextInstant(new Instant(3, 0, ''))).eql(null);
    })

    it('whenInitialize', () => {
        const underTest = new Network(instance(networkAdapter));
        underTest.initialize()
        verify(networkAdapter.initialize(underTest)).called();
    })

    it('whenGetStationbyId', () => {
        const a = new Station(instance(stationAdapter));
        when(networkAdapter.stationById('a')).thenReturn(a);
        const underTest = new Network(instance(networkAdapter));

        expect(underTest.stationById('a')).eql(a);
        expect(underTest.stationById('a')).eql(a);
        expect(underTest.stationById('b')).eql(undefined);
    })

    it('whenDrawTimedDrawableAt_givenNotExistingInstant_thenDoNothing', () => {
        const underTest = new Network(instance(networkAdapter));

        expect(underTest.drawTimedDrawablesAt(Instant.BIG_BANG, true)).eql(1);
    })

    it('whenDrawTimedDrawableAt_givenAnimatedInstantButAnimateFalse_thenDontAnimate', () => {
        const underTest = new Network(instance(networkAdapter));

        when(timedDrawable.from).thenReturn(new Instant(1, 1, ''));
        when(timedDrawable.to).thenReturn(new Instant(2, 3, 'reverse'));
        when(timedDrawable.draw(1, false)).thenReturn(0);
        when(timedDrawable.erase(1, false, true)).thenReturn(0);
        underTest.addToIndex(instance(timedDrawable));

        expect(underTest.drawTimedDrawablesAt(new Instant(1, 1, ''), false)).eql(1);
        expect(underTest.drawTimedDrawablesAt(new Instant(2, 3, ''), false)).eql(1);

        verify(timedDrawable.draw(1, false)).called();
        verify(timedDrawable.erase(1, false, true)).called();
    })

    it('whenDrawTimedDrawableAt_givenDrawableAtBigBang_thenDrawForever', () => {
        const underTest = new Network(instance(networkAdapter));

        when(timedDrawable.from).thenReturn(Instant.BIG_BANG);
        when(timedDrawable.to).thenReturn(Instant.BIG_BANG);
        when(timedDrawable.boundingBox).thenReturn(new BoundingBox(new Vector(50, 50), new Vector(450, 850)));
        when(timedDrawable.draw(1, true)).thenReturn(5);
        underTest.addToIndex(instance(timedDrawable));

        expect(underTest.drawTimedDrawablesAt(Instant.BIG_BANG, true)).eql(6);

        verify(timedDrawable.draw(1, true)).called();
    })

    it('whenDrawTimedDrawableAt_givenAnimatedInstantButAnimateTrue_thenAnimate', () => {
        const underTest = new Network(instance(networkAdapter));

        when(timedDrawable.from).thenReturn(new Instant(1, 1, ''));
        when(timedDrawable.to).thenReturn(new Instant(2, 3, ''));
        when(timedDrawable.boundingBox).thenReturn(new BoundingBox(new Vector(50, 50), new Vector(450, 850)));
        when(timedDrawable.draw(1, true)).thenReturn(2);
        when(timedDrawable.erase(1, true, false)).thenReturn(3);
        underTest.addToIndex(instance(timedDrawable));

        const timedDrawable1: TimedDrawable = mock();
        when(timedDrawable1.from).thenReturn(new Instant(1, 1, ''));
        when(timedDrawable1.to).thenReturn(new Instant(2, 4, 'noanim'));
        when(timedDrawable1.boundingBox).thenReturn(new BoundingBox(new Vector(500, 400), new Vector(450, 850)));
        when(timedDrawable1.draw(3, true)).thenReturn(4);
        when(timedDrawable1.erase(1, false, false)).thenReturn(0);
        underTest.addToIndex(instance(timedDrawable1));

        expect(underTest.drawTimedDrawablesAt(new Instant(1, 1, ''), true)).eql(7);
        expect(underTest.drawTimedDrawablesAt(new Instant(2, 3, ''), true)).eql(4);
        expect(underTest.drawTimedDrawablesAt(new Instant(2, 4, ''), true)).eql(1);

        verify(timedDrawable.draw(1, true)).called();
        verify(timedDrawable1.draw(3, true)).called();
        verify(timedDrawable.erase(1, true, false)).called();
        verify(timedDrawable1.erase(1, false, false)).called();
    })

    it('whenDrawTimedDrawableAt_givenDrawAndEraseForSameInstant_thenObeyOrder', () => {
        const underTest = new Network(instance(networkAdapter));

        when(timedDrawable.from).thenReturn(new Instant(2, 3, ''));
        when(timedDrawable.to).thenReturn(new Instant(2, 4, ''));
        when(timedDrawable.boundingBox).thenReturn(new BoundingBox(new Vector(50, 50), new Vector(450, 850)));
        when(timedDrawable.draw(1, true)).thenReturn(3);
        when(timedDrawable.erase(1, true, false)).thenReturn(5);
        underTest.addToIndex(instance(timedDrawable));

        const timedDrawable1: TimedDrawable = mock();
        when(timedDrawable1.from).thenReturn(new Instant(1, 2, ''));
        when(timedDrawable1.to).thenReturn(new Instant(2, 3, ''));
        when(timedDrawable1.boundingBox).thenReturn(new BoundingBox(new Vector(500, 400), new Vector(450, 850)));
        when(timedDrawable1.draw(1, true)).thenReturn(2);
        when(timedDrawable1.erase(4, true, false)).thenReturn(4);
        underTest.addToIndex(instance(timedDrawable1));

        expect(underTest.drawTimedDrawablesAt(new Instant(1, 2, ''), true)).eql(3);
        expect(underTest.drawTimedDrawablesAt(new Instant(2, 3, ''), true)).eql(8);

        verify(timedDrawable1.draw(1, true)).called();
        verify(timedDrawable.draw(1, true)).called();
        verify(timedDrawable1.erase(4, true, false)).called();
        verify(timedDrawable.erase(anything(), anything(), anything())).never();
    })

    it('whenDrawTimedDrawableAt_givenMultipleDrawAndEraseForSameInstant_thenObeyOrder', () => {
        const underTest = new Network(instance(networkAdapter));

        when(timedDrawable.name).thenReturn("01");
        when(timedDrawable.from).thenReturn(new Instant(1, 1, ''));
        when(timedDrawable.to).thenReturn(new Instant(2, 3, ''));
        when(timedDrawable.boundingBox).thenReturn(new BoundingBox(new Vector(50, 50), new Vector(450, 850)));
        when(timedDrawable.draw(1, true)).thenReturn(2);
        when(timedDrawable.erase(6, true, false)).thenReturn(6);
        underTest.addToIndex(instance(timedDrawable));

        const timedDrawable1: TimedDrawable = mock();
        when(timedDrawable1.name).thenReturn("01");
        when(timedDrawable1.from).thenReturn(new Instant(1, 2, ''));
        when(timedDrawable1.to).thenReturn(new Instant(2, 3, 'noanim'));
        when(timedDrawable1.boundingBox).thenReturn(new BoundingBox(new Vector(500, 400), new Vector(450, 850)));
        when(timedDrawable1.draw(1, true)).thenReturn(3);
        when(timedDrawable1.erase(1, false, false)).thenReturn(5);
        underTest.addToIndex(instance(timedDrawable1));

        const timedDrawable2: TimedDrawable = mock();
        when(timedDrawable2.name).thenReturn("2");
        when(timedDrawable2.from).thenReturn(new Instant(2, 3, ''));
        when(timedDrawable2.to).thenReturn(Instant.BIG_BANG);
        when(timedDrawable2.boundingBox).thenReturn(new BoundingBox(new Vector(900, 400), new Vector(1000, 1000)));
        when(timedDrawable2.draw(12, true)).thenReturn(7);
        underTest.addToIndex(instance(timedDrawable2));

        const timedDrawable3: TimedDrawable = mock();
        when(timedDrawable3.name).thenReturn("3");
        when(timedDrawable3.from).thenReturn(new Instant(1, 2, ''));
        when(timedDrawable3.to).thenReturn(new Instant(2, 3, ''));
        when(timedDrawable3.boundingBox).thenReturn(new BoundingBox(new Vector(500, 400), new Vector(450, 850)));
        when(timedDrawable3.draw(4, true)).thenReturn(4);
        when(timedDrawable3.erase(19, true, false)).thenReturn(8);
        underTest.addToIndex(instance(timedDrawable3));

        expect(underTest.drawTimedDrawablesAt(new Instant(1, 1, ''), true)).eql(3);
        expect(underTest.drawTimedDrawablesAt(new Instant(1, 2, ''), true)).eql(8);
        expect(underTest.drawTimedDrawablesAt(new Instant(2, 3, ''), true)).eql(27);

        verify(timedDrawable.draw(1, true)).called();
        verify(timedDrawable1.draw(1, true)).called();
        verify(timedDrawable3.draw(4, true)).called();
        verify(timedDrawable1.erase(1, false, false)).called();
        verify(timedDrawable.erase(6, true, false)).called();
        verify(timedDrawable2.draw(12, true)).called();
        verify(timedDrawable3.erase(19, true, false)).called();
    })

    it('whenCreateVirtualStop', () => {
        const a = new Station(instance(stationAdapter));
        const v = new Vector(1, 1);
        const r = new Rotation(90);
        when(networkAdapter.createVirtualStop('a', v, r)).thenReturn(a);
        const underTest = new Network(instance(networkAdapter));

        expect(underTest.createVirtualStop('a', v, r)).eql(a);
        expect(underTest.stationById('a')).eql(a);
    })
})