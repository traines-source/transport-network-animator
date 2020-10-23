import { Instant } from "./Instant";
import { Vector } from "./Vector";
import { Rotation } from "./Rotation";



export class Zoomer {
    static ZOOM_DURATION = 1;
    static ZOOM_MAX_SCALE = 3;
    static PADDING_FACTOR = 40;
    
    private boundingBox = {tl: Vector.NULL, br: Vector.NULL};
    
    constructor(private canvasSize: Vector) {

    }

    include(boundingBox: { tl: Vector, br: Vector }, now: Instant, shouldAnimate: boolean) {
        if (shouldAnimate && now.flag != 'nozoom') {
            this.boundingBox.tl = this.boundingBox.tl.bothAxisMins(boundingBox.tl);
            this.boundingBox.br = this.boundingBox.br.bothAxisMaxs(boundingBox.br);
        }
    }

    private enforcedBoundingBox(): {tl: Vector, br: Vector} {
        if (this.boundingBox.tl != Vector.NULL && this.boundingBox.br != Vector.NULL) {
            const paddedBoundingBox = this.paddedBoundingBox();
            const zoomSize = paddedBoundingBox.tl.delta(paddedBoundingBox.br);
            const minZoomSize = new Vector(this.canvasSize.x / Zoomer.ZOOM_MAX_SCALE, this.canvasSize.y / Zoomer.ZOOM_MAX_SCALE);
            const delta = zoomSize.delta(minZoomSize);
            const additionalSpacing = new Vector(Math.max(0, delta.x/2), Math.max(0, delta.y/2))
            return {
                tl: paddedBoundingBox.tl.add(additionalSpacing.rotate(new Rotation(180))),
                br: paddedBoundingBox.br.add(additionalSpacing)
            };
        }
        return this.boundingBox;
    }

    private paddedBoundingBox(): {tl: Vector, br: Vector} {
        const padding = (this.canvasSize.x + this.canvasSize.y)/Zoomer.PADDING_FACTOR;
        return {
            tl: this.boundingBox.tl.add(new Vector(-padding, -padding)),
            br: this.boundingBox.br.add(new Vector(padding, padding))
        };
    }

    get center(): Vector {
        const enforcedBoundingBox = this.enforcedBoundingBox();
        if (enforcedBoundingBox.tl != Vector.NULL && enforcedBoundingBox.br != Vector.NULL) {
            return new Vector(
                Math.round((enforcedBoundingBox.tl.x + enforcedBoundingBox.br.x)/2), 
                Math.round((enforcedBoundingBox.tl.y + enforcedBoundingBox.br.y)/2));
        }
        return new Vector(this.canvasSize.x / 2, this.canvasSize.y / 2);;
    }

    get scale(): number {
        const enforcedBoundingBox = this.enforcedBoundingBox();
        if (enforcedBoundingBox.tl != Vector.NULL && enforcedBoundingBox.br != Vector.NULL) {
            const zoomSize = enforcedBoundingBox.tl.delta(enforcedBoundingBox.br);
            return Math.min(this.canvasSize.x / zoomSize.x, this.canvasSize.y / zoomSize.y);
        }
        return 1;
    }
}
