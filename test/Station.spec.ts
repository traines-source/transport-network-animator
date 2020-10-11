import { expect } from 'chai';
import { StationProvider } from '../src/Network';
import { Station, StationAdapter } from '../src/Station';
import { Vector } from '../src/Vector';
import { Rotation } from '../src/Rotation';
import { Line, LineAdapter } from '../src/Line';
import { Instant } from '../src/Instant';

const stationProvider: StationProvider = {
    stationById(id: string): Station | undefined {
        return undefined;
    },
    createVirtualStop(id: string, baseCoords: Vector, rotation: Rotation): Station {
        return new Station(stationAdapter);
    }
}   
const stationAdapter: StationAdapter = {
    baseCoords: new Vector(0, 0),
    rotation: new Rotation(0),
    labelDir: new Rotation(0),
    id: 'id',
    draw(delaySeconds: number, getPositionBoundaries: () => {[id: string]: [number, number]}):void {}
}
const lineAdapter: LineAdapter = {
    stops: [],
    name: 'name',
    from: Instant.BIG_BANG,
    to: Instant.BIG_BANG,
    draw(delaySeconds: number, animationDurationSeconds: number, path: Vector[]): void {},
    erase(delaySeconds: number, animationDurationSeconds: number, reverse: boolean): void {}
}

describe('Station', () => {   

    it('whenGetAxisAndTrackForExistingLine', () => {
        const s = new Station(stationAdapter);
        const l = new Line(lineAdapter, stationProvider);
        expect(s.getAxisAndTrackForExistingLine(l.name)).eql(undefined);

        s.addLine(l, 'x', 4);
        const result = s.getAxisAndTrackForExistingLine('name');
        expect(result?.axis).eql('x');
        expect(result?.track).eql(4);
    })
})