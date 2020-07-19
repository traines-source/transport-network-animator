import { expect } from 'chai';
import { Rotation } from '../src/Rotation';
import { Utils } from '../src/Utils';

describe('Rotation', () => {
    it('whenAdd', () => {
        expect(new Rotation(-135).add(new Rotation(90)).degrees).eql(-45);
        expect(new Rotation(135).add(new Rotation(90)).degrees).eql(-135);
        expect(new Rotation(1).add(new Rotation(-90)).degrees).eql(-89);
        expect(new Rotation(180).add(new Rotation(1)).degrees).eql(-179);
        expect(new Rotation(170).add(new Rotation(-360)).degrees).eql(170);
    })

    it('whenFrom', () => {
        expect(Rotation.from('n').degrees).eql(0);
        expect(Rotation.from('sw').degrees).eql(-135);
        expect(Rotation.from('e').degrees).eql(90);
    })

    it('whenRadians', () => {
        expect(new Rotation(-90).radians).closeTo(-1.5707, Utils.IMPRECISION);
        expect(new Rotation(135).radians).closeTo(2.3561, Utils.IMPRECISION);
    })

    it('whenDelta', () => {
        expect(new Rotation(-135).delta(new Rotation(90)).degrees).eql(-135);
        expect(new Rotation(-45).delta(new Rotation(135)).degrees).eql(180);
        expect(new Rotation(-10).delta(new Rotation(160)).degrees).eql(170);
        expect(new Rotation(10).delta(new Rotation(-160)).degrees).eql(-170);
        expect(new Rotation(200).delta(new Rotation(-150)).degrees).eql(10);
        expect(new Rotation(-175).delta(new Rotation(175)).degrees).eql(-10);
        expect(new Rotation(170).delta(new Rotation(-170)).degrees).eql(20);
        expect(new Rotation(150).delta(new Rotation(20)).degrees).eql(-130);
    })

    it('whenNormalize', () => {
        expect(new Rotation(-135).normalize().degrees).eql(45);
        //expect(new Rotation(-90).normalize().degrees).eql(0);
        // TODO
        expect(new Rotation(-45).normalize().degrees).eql(-45);
        expect(new Rotation(0).normalize().degrees).eql(0);
        expect(new Rotation(45).normalize().degrees).eql(45);
    })

    it('whenName', () => {
        expect(new Rotation(-135).name).eql('sw');
        expect(new Rotation(99).name).eql('n');
        expect(new Rotation(90).name).eql('e');
    })
})