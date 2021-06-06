import { expect } from 'chai';
import { LabelAdapter, Label } from '../../src/drawables/Label';
import {instance, mock, when, anything, verify, between} from 'ts-mockito';
import { StationProvider } from '../../src/Network';
import { Vector } from '../../src/Vector';
import { Rotation } from '../../src/Rotation';
import { Station } from '../../src/drawables/Station';

describe('Label', () => {
    let labelAdapter: LabelAdapter;
    let stationProvider: StationProvider;
    let station: Station;

    beforeEach(() => {
        stationProvider = mock();
        labelAdapter = mock();
        station = mock();
    })

    it('givenNoLinesExisting_thenCallErase', () => {
        when(labelAdapter.forStation).thenReturn('a');
        
        when(station.rotation).thenReturn(Rotation.from('n'));
        when(station.labelDir).thenReturn(Rotation.from('n'));
        when(station.baseCoords).thenReturn(new Vector(30, 10));
        when(station.linesExisting).thenReturn(() => false);
        when(station.stationSizeForAxis('x', 0)).thenReturn(0);
        when(station.stationSizeForAxis('y', -1)).thenReturn(-3);
        when(stationProvider.stationById('a')).thenReturn(instance(station));
        const l = new Label(instance(labelAdapter), instance(stationProvider));
        expect(l.draw(2, false)).eql(0);
        verify(labelAdapter.draw(anything(), anything(), anything(), anything())).never();
        verify(labelAdapter.erase(anything())).called();        
    })

    it('givenNorthStationWithNorthLabel', () => {
        when(labelAdapter.forStation).thenReturn('a');
        when(labelAdapter.draw(anything(), anything(), anything(), anything())).thenCall((d: number, v: Vector, r: Rotation) => {
            expect(v).eql(new Vector(30, 7));
            expect(r).eql(Rotation.from('n'));
        });
        when(station.rotation).thenReturn(Rotation.from('n'));
        when(station.labelDir).thenReturn(Rotation.from('n'));
        when(station.baseCoords).thenReturn(new Vector(30, 10));
        when(station.linesExisting).thenReturn(() => true);
        when(station.stationSizeForAxis('x', 0)).thenReturn(0);
        when(station.stationSizeForAxis('y', -1)).thenReturn(-3);
        when(stationProvider.stationById('a')).thenReturn(instance(station));
        const l = new Label(instance(labelAdapter), instance(stationProvider));
        expect(l.draw(2, false)).eql(0);       
    })

    it('givenNorthStationWithNorthEastLabel', () => {
        when(labelAdapter.forStation).thenReturn('a');
        when(labelAdapter.draw(anything(), anything(), anything(), anything())).thenCall((d: number, v: Vector, r: Rotation) => {
            expect(v).eql(new Vector(15, 27));
            expect(r).eql(Rotation.from('ne'));
        });
        when(station.rotation).thenReturn(Rotation.from('n'));
        when(station.labelDir).thenReturn(Rotation.from('ne'));
        when(station.baseCoords).thenReturn(new Vector(10, 30));
        when(station.linesExisting).thenReturn(() => true);
        when(station.stationSizeForAxis('x', between(0, 1))).thenReturn(5);
        when(station.stationSizeForAxis('y', between(-1, 0))).thenReturn(-3);
        when(stationProvider.stationById('a')).thenReturn(instance(station));
        const l = new Label(instance(labelAdapter), instance(stationProvider));
        expect(l.draw(2, false)).eql(0);    
    })

    it('givenNorthEastStationWithNorthWestLabel', () => {
        when(labelAdapter.forStation).thenReturn('a');
        when(labelAdapter.draw(anything(), anything(), anything(), anything())).thenCall((d: number, v: Vector, r: Rotation) => {
            expect(v.x).greaterThan(12);
            expect(v.x).lessThan(13);
            expect(v.y).greaterThan(-1);
            expect(v.y).lessThan(0);
            expect(r).eql(Rotation.from('w'));
        });
        when(station.rotation).thenReturn(Rotation.from('ne'));
        when(station.labelDir).thenReturn(Rotation.from('w'));
        when(station.baseCoords).thenReturn(new Vector(30, 10));
        when(station.linesExisting).thenReturn(() => true);
        when(station.stationSizeForAxis('x', between(-1, 0))).thenReturn(-20);
        when(station.stationSizeForAxis('y', between(0, 1))).thenReturn(5);
        when(stationProvider.stationById('a')).thenReturn(instance(station));
        const l = new Label(instance(labelAdapter), instance(stationProvider));
        expect(l.draw(2, false)).eql(0);    
    })
   
})