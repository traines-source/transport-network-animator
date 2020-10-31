import { expect } from 'chai';
import { StationProvider } from '../src/Network';
import { Station, StationAdapter, Stop } from '../src/Station';
import { Vector } from '../src/Vector';
import { Rotation } from '../src/Rotation';
import { Line, LineAdapter } from '../src/Line';
import {instance, mock, when, verify, anyString, anyNumber, anything, between} from 'ts-mockito';

describe('Line', () => {
    let stationAdapter: StationAdapter;
    let lineAdapter: LineAdapter;
    let stationProvider: StationProvider;

    beforeEach(() => {
        stationAdapter = mock();
        lineAdapter = mock();
        stationProvider = mock();
    })

    it('givenStationNotExistsThrow', () => {
        when(lineAdapter.stops).thenReturn([new Stop('a', ''), new Stop('b', ''), new Stop('c', '')]);
        when(stationProvider.stationById('a')).thenReturn(mockStation(stationAdapter, 'a', new Vector(1, 0), new Rotation(0)));
        when(stationProvider.stationById('b')).thenReturn(mockStation(stationAdapter, 'b', new Vector(0, 50), new Rotation(0)));
        const l = new Line(instance(lineAdapter), instance(stationProvider));
        expect(() => l.draw(2, false)).to.throw(Error);
    })
    
    it('givenSimpleLineWithoutAnimation', () => {
        when(lineAdapter.stops).thenReturn([new Stop('a', ''), new Stop('b', '')]);
        when(lineAdapter.draw(2, anyNumber(), anything())).thenCall((delay: number, duration: number, path: Vector[]) => {
            expect(duration).eql(0);
            expect(path).eql([new Vector(10, 0), new Vector(10, 50)]);
        })
        when(stationProvider.stationById('a')).thenReturn(mockStation(stationAdapter, 'a', new Vector(10, 0), new Rotation(0)));
        when(stationProvider.stationById('b')).thenReturn(mockStation(stationAdapter, 'b', new Vector(10, 50), new Rotation(0)));
        const l = new Line(instance(lineAdapter), instance(stationProvider));
        expect(l.draw(2, false)).eql(0);
    })

    it('givenSimpleLineWithAnimation', () => {
        when(lineAdapter.stops).thenReturn([new Stop('a', ''), new Stop('b', '')]);
        when(lineAdapter.draw(2, anyNumber(), anything())).thenCall((delay: number, duration: number, path: Vector[]) => {
            expect(duration).approximately(50 / Line.SPEED, 0.1);
            expect(path).eql([new Vector(0, 10), new Vector(50, 10)]);
        })
        when(stationProvider.stationById('a')).thenReturn(mockStation(stationAdapter, 'a', new Vector(0, 10), new Rotation(0)));
        when(stationProvider.stationById('b')).thenReturn(mockStation(stationAdapter, 'b', new Vector(50, 10), new Rotation(0)));
        const l = new Line(instance(lineAdapter), instance(stationProvider));
        expect(l.draw(2, true)).approximately(50 / Line.SPEED, 0.1);
    })

    it('givenFourStopLineWithAnimation', () => {
        when(lineAdapter.stops).thenReturn([new Stop('a', ''), new Stop('b', ''), new Stop('c', ''), new Stop('d', '')]);
        when(lineAdapter.draw(2, anyNumber(), anything())).thenCall((delay: number, duration: number, p: Vector[]) => {
            const path = [...p];
            expect(path.shift()).eql(new Vector(0, 0));
            expect(path.shift()?.delta(new Vector(0, 50)).length).lessThan(0.1);
            expect(path.shift()).eql(new Vector(50, 100));
            expect(path.shift()?.delta(new Vector(100, 150)).length).lessThan(0.1);
            expect(path.shift()).eql(new Vector(200, 150));
            expect(path.shift()).eql(new Vector(300, 150));
        })
        when(stationProvider.stationById('a')).thenReturn(mockStation(stationAdapter, 'a', new Vector(0, 0), Rotation.from('n')));
        when(stationProvider.stationById('b')).thenReturn(mockStation(stationAdapter, 'b', new Vector(50, 100), Rotation.from('nw')));
        when(stationProvider.stationById('c')).thenReturn(mockStation(stationAdapter, 'c', new Vector(200, 150), Rotation.from('w')));
        when(stationProvider.stationById('d')).thenReturn(mockStation(stationAdapter, 'd', new Vector(300, 150), Rotation.from('w')));
        const l = new Line(instance(lineAdapter), instance(stationProvider));
        expect(l.draw(2, true)).approximately(400 / Line.SPEED, 0.1);
    })

    it('givenFourStopLineWithHelperStop', () => {
        when(lineAdapter.stops).thenReturn([new Stop('a', ''), new Stop('b', ''), new Stop('c', ''), new Stop('d', '')]);
        when(lineAdapter.draw(2, anyNumber(), anything())).thenCall((delay: number, duration: number, p: Vector[]) => {
            const path = [...p];
            expect(path.shift()).eql(new Vector(500, 500));
            expect(path.shift()?.delta(new Vector(450, 500)).length).lessThan(0.1);
            expect(path.shift()).eql(new Vector(400, 450));
            expect(path.shift()?.delta(new Vector(325, 375)).length).lessThan(0.1);
            expect(path.shift()).eql(new Vector(250, 375));
            expect(path.shift()?.delta(new Vector(175, 375)).length).lessThan(0.1);
            expect(path.shift()).eql(new Vector(100, 300));
            expect(path.shift()?.delta(new Vector(0, 200)).length).lessThan(0.1);
            expect(path.shift()).eql(new Vector(0, 100));
        })
        when(stationProvider.stationById('a')).thenReturn(mockStation(stationAdapter, 'a', new Vector(500, 500), Rotation.from('n')));
        when(stationProvider.stationById('b')).thenReturn(mockStation(stationAdapter, 'b', new Vector(400, 450), Rotation.from('ne')));
        when(stationProvider.stationById('c')).thenReturn(mockStation(stationAdapter, 'c', new Vector(100, 300), Rotation.from('ne')));
        when(stationProvider.stationById('d')).thenReturn(mockStation(stationAdapter, 'd', new Vector(0, 100), Rotation.from('w')));
        when(stationProvider.createVirtualStop('h_b_c', anything(), anything())).thenCall((id: string, v: Vector, r: Rotation) => {
            expect(r).eql(new Rotation(0));
            expect(v).eql(new Vector(250, 375));
            return mockStation(stationAdapter, 'h_b_c', new Vector(250, 375), new Rotation(0));
        });
        const l = new Line(instance(lineAdapter), instance(stationProvider));
        expect(l.draw(2, true)).approximately(725 / Line.SPEED, 0.1);
    })

    it('givenFourStopLineWithRightAngle', () => {
        when(lineAdapter.stops).thenReturn([new Stop('d', ''), new Stop('c', ''), new Stop('b', ''), new Stop('a', '')]);
        when(lineAdapter.draw(2, anyNumber(), anything())).thenCall((delay: number, duration: number, p: Vector[]) => {
            const path = [...p];
            expect(path.shift()).eql(new Vector(500, 500));
            expect(path.shift()?.delta(new Vector(500, 475)).length).lessThan(0.1);
            expect(path.shift()).eql(new Vector(525, 450));
            expect(path.shift()?.delta(new Vector(550, 425)).length).lessThan(0.1);
            expect(path.shift()).eql(new Vector(550, 400));
            expect(path.shift()).eql(new Vector(550, 350));
            expect(path.shift()).eql(new Vector(475, 350));
            expect(path.shift()?.delta(new Vector(450, 350)).length).lessThan(0.1);
            expect(path.shift()).eql(new Vector(400, 300));
            expect(path.shift()?.delta(new Vector(387.5, 287.5)).length).lessThan(0.1);
            expect(path.shift()).eql(new Vector(350, 325));
            expect(path.shift()?.delta(new Vector(325, 350)).length).lessThan(0.1);
            expect(path.shift()).eql(new Vector(300, 350));
        })
        when(stationProvider.stationById('d')).thenReturn(mockStation(stationAdapter, 'd', new Vector(500, 500), Rotation.from('n')));
        when(stationProvider.stationById('c')).thenReturn(mockStation(stationAdapter, 'c', new Vector(550, 400), Rotation.from('e')));
        when(stationProvider.stationById('b')).thenReturn(mockStation(stationAdapter, 'b', new Vector(400, 300), Rotation.from('ne')));
        when(stationProvider.stationById('a')).thenReturn(mockStation(stationAdapter, 'a', new Vector(300, 350), Rotation.from('n')));
        when(stationProvider.createVirtualStop('h_c_d', anything(), anything())).thenCall((id: string, v: Vector, r: Rotation) => {
            expect(r).eql(new Rotation(45));
            expect(v).eql(new Vector(525, 450));
            return mockStation(stationAdapter, id, v, r);
        });
        when(stationProvider.createVirtualStop('h_b_c', anything(), anything())).thenCall((id: string, v: Vector, r: Rotation) => {
            expect(r).eql(new Rotation(0));
            expect(v).eql(new Vector(475, 350));
            return mockStation(stationAdapter, id, v, r);
        });
        when(stationProvider.createVirtualStop('h_a_b', anything(), anything())).thenCall((id: string, v: Vector, r: Rotation) => {
            expect(r).eql(new Rotation(45));
            expect(v).eql(new Vector(350, 325));
            return mockStation(stationAdapter, id, v, r);
        });
        const l = new Line(instance(lineAdapter), instance(stationProvider));
        expect(l.draw(2, true)).approximately(470 / Line.SPEED, 0.1);
    })

    it('givenLineForkWithSameName', () => {
        const a = mockStation(stationAdapter, 'a', new Vector(500, 500), Rotation.from('n'));
        const b = mockStation(stationAdapter, 'b', new Vector(500, 400), Rotation.from('n'));
        const c = mockStation(stationAdapter, 'c', new Vector(400, 200), Rotation.from('nw'));
        const d = mockStation(stationAdapter, 'd', new Vector(600, 200), Rotation.from('nw'));

        createAndAssertStandardLine(lineAdapter, stationProvider, a, b, c);

        when(lineAdapter.stops).thenReturn([new Stop('b', ''), new Stop('d', '')]);
        when(lineAdapter.name).thenReturn('l1');
        when(lineAdapter.draw(2, anyNumber(), anything())).thenCall((delay: number, duration: number, p: Vector[]) => {
            const path = [...p];
            expect(path.shift()).eql(new Vector(500, 400));
            expect(path.shift()?.delta(new Vector(500, 300)).length).lessThan(0.1);
            expect(path.shift()).eql(new Vector(600, 200));
        })
        when(stationProvider.stationById('a')).thenReturn(a);
        when(stationProvider.stationById('b')).thenReturn(b);
        when(stationProvider.stationById('d')).thenReturn(d);
        const l2 = new Line(instance(lineAdapter), instance(stationProvider));
        expect(l2.draw(2, true)).approximately(240 / Line.SPEED, 0.1);
    })

    it('givenLineForkWithDifferentName', () => {
        const a = mockStation(stationAdapter, 'a', new Vector(500, 500), Rotation.from('n'));
        const b = mockStation(stationAdapter, 'b', new Vector(500, 400), Rotation.from('n'));
        const c = mockStation(stationAdapter, 'c', new Vector(400, 200), Rotation.from('nw'));
        const d = mockStation(stationAdapter, 'd', new Vector(600, 200), Rotation.from('nw'));

        createAndAssertStandardLine(lineAdapter, stationProvider, a, b, c);

        when(lineAdapter.stops).thenReturn([new Stop('b', ''), new Stop('d', '')]);
        when(lineAdapter.name).thenReturn('l2');
        when(lineAdapter.draw(2, anyNumber(), anything())).thenCall((delay: number, duration: number, p: Vector[]) => {
            const path = [...p];
            expect(path.shift()).eql(new Vector(500+Station.LINE_DISTANCE, 400));
            expect(path.shift()?.delta(new Vector(500+Station.LINE_DISTANCE, 300-Station.LINE_DISTANCE)).length).lessThan(0.1);
            expect(path.shift()).eql(new Vector(600, 200));
        })
        when(stationProvider.stationById('a')).thenReturn(a);
        when(stationProvider.stationById('b')).thenReturn(b);
        when(stationProvider.stationById('d')).thenReturn(d);
        const l2 = new Line(instance(lineAdapter), instance(stationProvider));
        expect(l2.draw(2, true)).approximately(240 / Line.SPEED, 0.1);
    })

    it('givenLineJoin', () => {
        const a = mockStation(stationAdapter, 'a', new Vector(500, 500), Rotation.from('n'));
        const b = mockStation(stationAdapter, 'b', new Vector(500, 400), Rotation.from('n'));
        const c = mockStation(stationAdapter, 'c', new Vector(400, 200), Rotation.from('nw'));
        const d = mockStation(stationAdapter, 'd', new Vector(600, 200), Rotation.from('nw'));

        createAndAssertStandardLine(lineAdapter, stationProvider, a, b, c);

        when(lineAdapter.stops).thenReturn([new Stop('d', ''), new Stop('b', '')]);
        when(lineAdapter.name).thenReturn('l1');
        when(lineAdapter.draw(2, anyNumber(), anything())).thenCall((delay: number, duration: number, p: Vector[]) => {
            const path = [...p];
            expect(path.shift()).eql(new Vector(600, 200));
            expect(path.shift()?.delta(new Vector(500+Station.LINE_DISTANCE, 300-Station.LINE_DISTANCE)).length).lessThan(0.1);
            expect(path.shift()).eql(new Vector(500+Station.LINE_DISTANCE, 400));
        })
        when(stationProvider.stationById('a')).thenReturn(a);
        when(stationProvider.stationById('b')).thenReturn(b);
        when(stationProvider.stationById('d')).thenReturn(d);
        const l2 = new Line(instance(lineAdapter), instance(stationProvider));
        expect(l2.draw(2, true)).approximately(240 / Line.SPEED, 0.1);
    })

    it('givenLineCross', () => {
        const a = mockStation(stationAdapter, 'a', new Vector(500, 500), Rotation.from('n'));
        const b = mockStation(stationAdapter, 'b', new Vector(500, 400), Rotation.from('n'));
        const c = mockStation(stationAdapter, 'c', new Vector(400, 200), Rotation.from('nw'));
        const d = mockStation(stationAdapter, 'd', new Vector(600, 350), Rotation.from('nw'));

        createAndAssertStandardLine(lineAdapter, stationProvider, a, b, c);

        when(lineAdapter.stops).thenReturn([new Stop('d', ''), new Stop('b', ''), new Stop('c', '')]);
        when(lineAdapter.name).thenReturn('l2');
        when(lineAdapter.draw(2, anyNumber(), anything())).thenCall((delay: number, duration: number, p: Vector[]) => {
            const path = [...p];
            expect(path.shift()).eql(new Vector(600, 350));
            expect(path.shift()).eql(new Vector(550, 400));
            expect(path.shift()).eql(new Vector(500, 400));
            expect(path.shift()).eql(new Vector(450, 400));
            expect(path.shift()).eql(new Vector(450, 300));
            expect(path.shift()?.delta(new Vector(450, 242)).length).lessThan(0.5);
            expect(path.shift()).eql(new Vector(400+Station.LINE_DISTANCE/Math.sqrt(2), 200-Station.LINE_DISTANCE/Math.sqrt(2)));
        })
        when(stationProvider.stationById('a')).thenReturn(a);
        when(stationProvider.stationById('b')).thenReturn(b);
        when(stationProvider.stationById('d')).thenReturn(d);
        when(stationProvider.createVirtualStop('h_b_c', anything(), anything())).thenCall((id: string, v: Vector, r: Rotation) => {
            expect(r).eql(new Rotation(-0));
            expect(v).eql(new Vector(450, 300));
            return mockStation(stationAdapter, id, v, r);
        });
        const l2 = new Line(instance(lineAdapter), instance(stationProvider));
        expect(l2.draw(2, true)).approximately(390 / Line.SPEED, 0.1);
    })

    it('givenLineCrossWithTrackPreference', () => {
        const a = mockStation(stationAdapter, 'a', new Vector(500, 500), Rotation.from('n'));
        const b = mockStation(stationAdapter, 'b', new Vector(500, 400), Rotation.from('n'));
        const c = mockStation(stationAdapter, 'c', new Vector(400, 200), Rotation.from('nw'));
        const d = mockStation(stationAdapter, 'd', new Vector(600, 350), Rotation.from('nw'));

        createAndAssertStandardLine(lineAdapter, stationProvider, a, b, c);

        when(lineAdapter.stops).thenReturn([new Stop('d', '-'), new Stop('b', ''), new Stop('c', '')]);
        when(lineAdapter.name).thenReturn('l2');
        when(lineAdapter.draw(2, anyNumber(), anything())).thenCall((delay: number, duration: number, p: Vector[]) => {
            const path = [...p];
            expect(path.shift()).eql(new Vector(600, 350));
            expect(path.shift()).eql(new Vector(550, 400));
            expect(path.shift()).eql(new Vector(500, 400));
            expect(path.shift()).eql(new Vector(450, 400));
            expect(path.shift()).eql(new Vector(450, 300));
            expect(path.shift()?.delta(new Vector(450, 258)).length).lessThan(0.5);
            expect(path.shift()).eql(new Vector(400-Station.LINE_DISTANCE/Math.sqrt(2), 200+Station.LINE_DISTANCE/Math.sqrt(2)));
        })
        when(stationProvider.stationById('a')).thenReturn(a);
        when(stationProvider.stationById('b')).thenReturn(b);
        when(stationProvider.stationById('d')).thenReturn(d);
        when(stationProvider.createVirtualStop('h_b_c', anything(), anything())).thenCall((id: string, v: Vector, r: Rotation) => {
            expect(r).eql(new Rotation(-0));
            expect(v).eql(new Vector(450, 300));
            return mockStation(stationAdapter, id, v, r);
        });
        const l2 = new Line(instance(lineAdapter), instance(stationProvider));
        expect(l2.draw(2, true)).approximately(390 / Line.SPEED, 0.1);
    })

    it('givenParallelLinesWithManuallySetTracks', () => {
        const a = mockStation(stationAdapter, 'a', new Vector(500, 500), Rotation.from('n'));
        const b = mockStation(stationAdapter, 'b', new Vector(500, 400), Rotation.from('w'));
        const c = mockStation(stationAdapter, 'c', new Vector(400, 200), Rotation.from('nw'));
        const d = mockStation(stationAdapter, 'd', new Vector(600, 200), Rotation.from('nw'));
        
        createAndAssertStandardLine(lineAdapter, stationProvider, a, b, c);

        when(lineAdapter.stops).thenReturn([new Stop('d', ''), new Stop('b', '-1'), new Stop('a', '+1')]);
        when(lineAdapter.name).thenReturn('l2');
        when(lineAdapter.draw(2, anyNumber(), anything())).thenCall((delay: number, duration: number, p: Vector[]) => {
            const path = [...p];
            expect(path.shift()).eql(new Vector(600, 200));
            expect(path.shift()).eql(new Vector(500+Station.LINE_DISTANCE, 300-Station.LINE_DISTANCE));

            expect(path.shift()).eql(new Vector(500+Station.LINE_DISTANCE, 400));
            expect(path.shift()).eql(new Vector(500+Station.LINE_DISTANCE, 500));
        })
        when(stationProvider.stationById('a')).thenReturn(mockStation(stationAdapter, 'a', new Vector(500, 500), Rotation.from('n')));
        when(stationProvider.stationById('b')).thenReturn(mockStation(stationAdapter, 'b', new Vector(500, 400), Rotation.from('e')));
        when(stationProvider.stationById('d')).thenReturn(mockStation(stationAdapter, 'd', new Vector(600, 200), Rotation.from('nw')));
        const l2 = new Line(instance(lineAdapter), instance(stationProvider));
        expect(l2.draw(2, true)).approximately(340 / Line.SPEED, 0.1);

        when(lineAdapter.stops).thenReturn([new Stop('d', '+1'), new Stop('b', '-2')]);
        when(lineAdapter.name).thenReturn('l3');
        when(lineAdapter.draw(4, anyNumber(), anything())).thenCall((delay: number, duration: number, p: Vector[]) => {
            const path = [...p];
            expect(path.shift()).eql(new Vector(600+Station.LINE_DISTANCE/Math.sqrt(2), 200+Station.LINE_DISTANCE/Math.sqrt(2)));
            expect(path.shift()?.delta(new Vector(500+2*Station.LINE_DISTANCE, 296)).length).lessThan(0.5);
            expect(path.shift()).eql(new Vector(500+2*Station.LINE_DISTANCE, 400));
        })
        when(stationProvider.stationById('a')).thenReturn(mockStation(stationAdapter, 'a', new Vector(500, 500), Rotation.from('n')));
        when(stationProvider.stationById('b')).thenReturn(mockStation(stationAdapter, 'b', new Vector(500, 400), Rotation.from('e')));
        when(stationProvider.stationById('d')).thenReturn(mockStation(stationAdapter, 'd', new Vector(600, 200), Rotation.from('nw')));
        const l3 = new Line(instance(lineAdapter), instance(stationProvider));
        expect(l3.draw(4, true)).approximately(240 / Line.SPEED, 0.1);
    })

    it('givenParallelLinesWithAutomaticTracks', () => {
        const a = mockStation(stationAdapter, 'a', new Vector(500, 500), Rotation.from('n'));
        const b = mockStation(stationAdapter, 'b', new Vector(500, 400), Rotation.from('w'));
        const c = mockStation(stationAdapter, 'c', new Vector(400, 200), Rotation.from('nw'));
        const d = mockStation(stationAdapter, 'd', new Vector(600, 200), Rotation.from('nw'));

        createAndAssertStandardLine(lineAdapter, stationProvider, a, b, c);

        when(lineAdapter.stops).thenReturn([new Stop('d', ''), new Stop('b', ''), new Stop('a', '')]);
        when(lineAdapter.name).thenReturn('l2');
        when(lineAdapter.draw(2, anyNumber(), anything())).thenCall((delay: number, duration: number, p: Vector[]) => {
            const path = [...p];
            expect(path.shift()).eql(new Vector(600, 200));
            expect(path.shift()).eql(new Vector(500+Station.LINE_DISTANCE, 300-Station.LINE_DISTANCE));
            expect(path.shift()).eql(new Vector(500+Station.LINE_DISTANCE, 400));
            expect(path.shift()).eql(new Vector(500+Station.LINE_DISTANCE, 500));
        })
        when(stationProvider.stationById('a')).thenReturn(a);
        when(stationProvider.stationById('b')).thenReturn(b);
        when(stationProvider.stationById('d')).thenReturn(d);
        const l2 = new Line(instance(lineAdapter), instance(stationProvider));
        expect(l2.draw(2, true)).approximately(340 / Line.SPEED, 0.1);

        when(lineAdapter.stops).thenReturn([new Stop('d', ''), new Stop('b', '')]);
        when(lineAdapter.name).thenReturn('l3');
        when(lineAdapter.draw(4, anyNumber(), anything())).thenCall((delay: number, duration: number, p: Vector[]) => {
            const path = [...p];
            expect(path.shift()).eql(new Vector(600+Station.LINE_DISTANCE/Math.sqrt(2), 200+Station.LINE_DISTANCE/Math.sqrt(2)));
            expect(path.shift()?.delta(new Vector(500+2*Station.LINE_DISTANCE, 296)).length).lessThan(0.5);
            expect(path.shift()).eql(new Vector(500+2*Station.LINE_DISTANCE, 400));
        })
        when(stationProvider.stationById('a')).thenReturn(a);
        when(stationProvider.stationById('b')).thenReturn(b);
        when(stationProvider.stationById('d')).thenReturn(d);
        const l3 = new Line(instance(lineAdapter), instance(stationProvider));
        expect(l3.draw(4, true)).approximately(240 / Line.SPEED, 0.1);
    })

    it('givenParallelLinesWithStationRotationNotMatchingLeadingToPathToFix', () => {
        const a = mockStation(stationAdapter, 'a', new Vector(500, 500), Rotation.from('n'));
        const b = mockStation(stationAdapter, 'b', new Vector(500, 400), Rotation.from('e'));
        const c = mockStation(stationAdapter, 'c', new Vector(400, 200), Rotation.from('nw'));
        const d = mockStation(stationAdapter, 'd', new Vector(600, 200), Rotation.from('nw'));

        createAndAssertStandardLine(lineAdapter, stationProvider, a, b, c);

        when(lineAdapter.stops).thenReturn([new Stop('d', ''), new Stop('b', ''), new Stop('a', '')]);
        when(lineAdapter.name).thenReturn('l2');
        when(lineAdapter.draw(2, anyNumber(), anything())).thenCall((delay: number, duration: number, p: Vector[]) => {
            const path = [...p];
            expect(path.shift()).eql(new Vector(600, 200));
            expect(path.shift()).eql(new Vector(500-Station.LINE_DISTANCE, 300+Station.LINE_DISTANCE));
            expect(path.shift()).eql(new Vector(500-Station.LINE_DISTANCE, 400));
            expect(path.shift()).eql(new Vector(500, 450));
            expect(path.shift()).eql(new Vector(500+Station.LINE_DISTANCE, 500));
        })
        when(stationProvider.stationById('a')).thenReturn(a);
        when(stationProvider.stationById('b')).thenReturn(b);
        when(stationProvider.stationById('d')).thenReturn(d);
        when(stationProvider.createVirtualStop('h_a_b', anything(), anything())).thenCall((id: string, v: Vector, r: Rotation) => {
            expect(r).eql(new Rotation(0));
            expect(v).eql(new Vector(500, 450));
            return mockStation(stationAdapter, id, v, r);
        });
        const l2 = new Line(instance(lineAdapter), instance(stationProvider));
        expect(l2.draw(2, true)).approximately(340 / Line.SPEED, 0.1);
    })

})

function mockStation(stationAdapter: StationAdapter, id: string, baseCoords: Vector, rotation: Rotation): Station {
    when(stationAdapter.id).thenReturn(id);
    when(stationAdapter.baseCoords).thenReturn(baseCoords);
    when(stationAdapter.rotation).thenReturn(rotation);
    return new Station(instance(stationAdapter));
}

function createAndAssertStandardLine(lineAdapter: LineAdapter, stationProvider: StationProvider, a: Station, b: Station, c: Station): void {
    when(lineAdapter.stops).thenReturn([new Stop('a', ''), new Stop('b', ''), new Stop('c', '')]);
    when(lineAdapter.name).thenReturn('l1');
    when(lineAdapter.draw(0, anyNumber(), anything())).thenCall((delay: number, duration: number, p: Vector[]) => {
        const path = [...p];
        expect(path.shift()).eql(new Vector(500, 500));
        expect(path.shift()).eql(new Vector(500, 400));
        expect(path.shift()?.delta(new Vector(500, 300)).length).lessThan(0.1);
        expect(path.shift()).eql(new Vector(400, 200));
    })
    when(stationProvider.stationById('a')).thenReturn(a);
    when(stationProvider.stationById('b')).thenReturn(b);
    when(stationProvider.stationById('c')).thenReturn(c);
    const l1 = new Line(instance(lineAdapter), instance(stationProvider));
    expect(l1.draw(0, true)).approximately(340 / Line.SPEED, 0.1);
}