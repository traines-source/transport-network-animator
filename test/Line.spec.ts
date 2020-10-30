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
        when(lineAdapter.draw(2, anyNumber(), anything())).thenCall((delay: number, duration: number, path: Vector[]) => {
            expect(path[0]).eql(new Vector(0, 0));
            expect(path[1].delta(new Vector(0, 50)).length).lessThan(0.1);
            expect(path[2]).eql(new Vector(50, 100));
            expect(path[3].delta(new Vector(100, 150)).length).lessThan(0.1);
            expect(path[4]).eql(new Vector(200, 150));
            expect(path[5]).eql(new Vector(300, 150));
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
        when(lineAdapter.draw(2, anyNumber(), anything())).thenCall((delay: number, duration: number, path: Vector[]) => {
            expect(path[0]).eql(new Vector(500, 500));
            expect(path[1].delta(new Vector(450, 500)).length).lessThan(0.1);
            expect(path[2]).eql(new Vector(400, 450));
            expect(path[3].delta(new Vector(325, 375)).length).lessThan(0.1);
            expect(path[4]).eql(new Vector(250, 375));
            expect(path[5].delta(new Vector(175, 375)).length).lessThan(0.1);
            expect(path[6]).eql(new Vector(100, 300));
            expect(path[7].delta(new Vector(0, 200)).length).lessThan(0.1);
            expect(path[8]).eql(new Vector(0, 100));
        })
        when(stationProvider.stationById('a')).thenReturn(mockStation(stationAdapter, 'a', new Vector(500, 500), Rotation.from('n')));
        when(stationProvider.stationById('b')).thenReturn(mockStation(stationAdapter, 'b', new Vector(400, 450), Rotation.from('ne')));
        when(stationProvider.stationById('c')).thenReturn(mockStation(stationAdapter, 'c', new Vector(100, 300), Rotation.from('ne')));
        when(stationProvider.stationById('d')).thenReturn(mockStation(stationAdapter, 'd', new Vector(0, 100), Rotation.from('w')));
        when(stationProvider.createVirtualStop('h_b_c', anything(), anything())).thenCall((id: string, v: Vector, r: Rotation) => {
            expect(r).eql(new Rotation(0));
            expect(v).eql(new Vector(250, 375));
            return mockStation(stationAdapter, 'h_b_c', new Vector(250, 375), Rotation.from('e'));
        });
        const l = new Line(instance(lineAdapter), instance(stationProvider));
        expect(l.draw(2, true)).approximately(725 / Line.SPEED, 0.1);
    })

})

function mockStation(stationAdapter: StationAdapter, id: string, baseCoords: Vector, rotation: Rotation): Station {
    when(stationAdapter.id).thenReturn(id);
    when(stationAdapter.baseCoords).thenReturn(baseCoords);
    when(stationAdapter.rotation).thenReturn(rotation);
    return new Station(instance(stationAdapter));
}