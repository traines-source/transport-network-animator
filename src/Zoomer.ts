import { Instant } from "./Instant";
import { Vector } from "./Vector";
import { Rotation } from "./Rotation";
import { TimedDrawable, BoundingBox } from "./Drawable";



export class Zoomer {
    static ZOOM_DURATION = 1;
    static ZOOM_MAX_SCALE = 3;
    static PADDING_FACTOR = 25;
    
    private boundingBox = {tl: Vector.NULL, br: Vector.NULL};
    private customDuration = 0;
    
    constructor(private canvasSize: BoundingBox) {
        console.log('canvas', this.canvasSize);
    }

    include(boundingBox: BoundingBox, from: Instant, to: Instant, draw: boolean, shouldAnimate: boolean) {
        const now = draw ? from : to;
        if (shouldAnimate && !now.flag.includes('nozoom')) {
            if (now.flag.includes('slowzoom') && draw) {
                this.customDuration = from.delta(to);
            } else {
                boundingBox = this.paddedBoundingBox(boundingBox);
            }
            this.boundingBox.tl = this.boundingBox.tl.bothAxisMins(boundingBox.tl);
            this.boundingBox.br = this.boundingBox.br.bothAxisMaxs(boundingBox.br);
        }
    }

    private enforcedBoundingBox(): {tl: Vector, br: Vector} {
        if (this.boundingBox.tl != Vector.NULL && this.boundingBox.br != Vector.NULL) {
            const paddedBoundingBox = this.boundingBox;
            const zoomSize = paddedBoundingBox.tl.delta(paddedBoundingBox.br);
            const canvasSize = this.canvasSize.dimensions;
            const minZoomSize = new Vector(canvasSize.x / Zoomer.ZOOM_MAX_SCALE, canvasSize.y / Zoomer.ZOOM_MAX_SCALE);
            const delta = zoomSize.delta(minZoomSize);
            const additionalSpacing = new Vector(Math.max(0, delta.x/2), Math.max(0, delta.y/2))
            return {
                tl: paddedBoundingBox.tl.add(additionalSpacing.rotate(new Rotation(180))),
                br: paddedBoundingBox.br.add(additionalSpacing)
            };
        }
        return this.boundingBox;
    }

    private paddedBoundingBox(boundingBox: BoundingBox): BoundingBox {

        const padding = (this.canvasSize.dimensions.x + this.canvasSize.dimensions.y)/Zoomer.PADDING_FACTOR;
        return new BoundingBox(
            boundingBox.tl.add(new Vector(-padding, -padding)),
            boundingBox.br.add(new Vector(padding, padding))
        );
    }

    get center(): Vector {
        const enforcedBoundingBox = this.enforcedBoundingBox();
        if (enforcedBoundingBox.tl != Vector.NULL && enforcedBoundingBox.br != Vector.NULL) {
            return new Vector(
                Math.round((enforcedBoundingBox.tl.x + enforcedBoundingBox.br.x)/2), 
                Math.round((enforcedBoundingBox.tl.y + enforcedBoundingBox.br.y)/2));
        }
        return this.canvasSize.tl.between(this.canvasSize.br, 0.5);
    }

    get scale(): number {
        const enforcedBoundingBox = this.enforcedBoundingBox();
        if (enforcedBoundingBox.tl != Vector.NULL && enforcedBoundingBox.br != Vector.NULL) {
            const zoomSize = enforcedBoundingBox.tl.delta(enforcedBoundingBox.br);
            const delta = this.canvasSize.tl.delta(this.canvasSize.br);
            return Math.min(delta.x / zoomSize.x, delta.y / zoomSize.y);
        }
        return 1;
    }

    get duration(): number {
        if (this.customDuration == 0) {
            return Zoomer.ZOOM_DURATION;
        }
        return this.customDuration;
    }
}
