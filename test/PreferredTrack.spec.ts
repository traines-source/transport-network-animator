import { expect } from 'chai';
import { PreferredTrack } from '../src/PreferredTrack';

describe('PreferredTrack', () => {
    it('whenFromString', () => {
        expect(new PreferredTrack('-1').fromString('')).eql(new PreferredTrack('-1'));
        expect(new PreferredTrack('-1').fromString('2')).eql(new PreferredTrack('2'));
        expect(new PreferredTrack('-1').fromString('*0')).eql(new PreferredTrack('*0'));
    })

    it('whenFromNumber', () => {
        expect(new PreferredTrack('-0').fromNumber(0)).eql(new PreferredTrack('+0'));
        expect(new PreferredTrack('-0').fromNumber(1)).eql(new PreferredTrack('+1'));
        expect(new PreferredTrack('-0').fromNumber(-2)).eql(new PreferredTrack('-2'));
    })

    it('whenExistingFromLineAtStation', () => {
        expect(new PreferredTrack('-1').fromExistingLineAtStation(undefined)).eql(new PreferredTrack('-1'));
        expect(new PreferredTrack('-1').fromExistingLineAtStation({axis: 'x', track: 2})).eql(new PreferredTrack('-1'));
        expect(new PreferredTrack('-').fromExistingLineAtStation({axis: 'x', track: 2})).eql(new PreferredTrack('+2'));
    })

    it('whenIsPositive', () => {
        expect(new PreferredTrack('-0').isPositive()).eql(false);
        expect(new PreferredTrack('+2').isPositive()).eql(true);
        expect(new PreferredTrack('*0').isPositive()).eql(true);
        expect(new PreferredTrack('-0*').isPositive()).eql(false);
        expect(new PreferredTrack('-4').isPositive()).eql(false);
    })

    it('whenHasTrackNumber', () => {
        expect(new PreferredTrack('-0').hasTrackNumber()).eql(true);
        expect(new PreferredTrack('-').hasTrackNumber()).eql(false);
        expect(new PreferredTrack('*1').hasTrackNumber()).eql(true);
        expect(new PreferredTrack('1*').hasTrackNumber()).eql(true);
    })

    it('whenGetTrackNumber', () => {
        expect(new PreferredTrack('-0').trackNumber).eql(-0);
        expect(new PreferredTrack('-1').trackNumber).eql(-1);
        expect(new PreferredTrack('+3').trackNumber).eql(3);
        expect(new PreferredTrack('*3').trackNumber).eql(3);
        expect(new PreferredTrack('-2*').trackNumber).eql(-2);
    })

    it('whenKeepOnlySign', () => {
        expect(new PreferredTrack('-0').keepOnlySign()).eql(new PreferredTrack('-'));
        expect(new PreferredTrack('-1').keepOnlySign()).eql(new PreferredTrack('-'));
        expect(new PreferredTrack('+3').keepOnlySign()).eql(new PreferredTrack('+'));
        expect(new PreferredTrack('4').keepOnlySign()).eql(new PreferredTrack('+'));
        expect(new PreferredTrack('*3').keepOnlySign()).eql(new PreferredTrack('+'));
        expect(new PreferredTrack('-3*').keepOnlySign()).eql(new PreferredTrack('-'));
    })
})