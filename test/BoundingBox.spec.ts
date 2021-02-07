import { expect } from 'chai';
import { BoundingBox } from '../src/BoundingBox';

describe('BoundingBox', () => {
    it('whenCalculateBoundingBoxForZoom', () => {
        expect(BoundingBox.from(100, 200, 600, 500).calculateBoundingBoxForZoom(50, 50)).eql(BoundingBox.from(100, 200, 600, 500));
        expect(BoundingBox.from(100, 200, 600, 500).calculateBoundingBoxForZoom(60, 50)).eql(BoundingBox.from(200, 230, 600, 470));
        expect(BoundingBox.from(100, 200, 600, 500).calculateBoundingBoxForZoom(50, 10)).eql(BoundingBox.from(300, 200, 400, 260));
        expect(BoundingBox.from(200, 100, 500, 600).calculateBoundingBoxForZoom(20, 90)).eql(BoundingBox.from(230, 500, 290, 600));
        //expect(BoundingBox.from(0, 0, 300, 100).calculateBoundingBoxForZoom(20, 90)).approximately(BoundingBox.from(30, 80, 90, 100), 0.01);
    })

    
})