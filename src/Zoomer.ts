import { Instant } from "./Instant";
import { Vector } from "./Vector";
import { Rotation } from "./Rotation";
import { TimedDrawable } from "./Drawable";



export class Zoomer {
    static ZOOM_DURATION = 1;
    static ZOOM_MAX_SCALE = 3;
    static PADDING_FACTOR = 25;
    
    private boundingBox = {tl: Vector.NULL, br: Vector.NULL};
    private customDuration = 0;
    
    constructor(private canvasSize: Vector) {

    }

    include(element: TimedDrawable, draw: boolean, shouldAnimate: boolean) {
        let boundingBox = element.boundingBox;
        const now = draw ? element.from : element.to;
        if (shouldAnimate && !now.flag.includes('nozoom')) {
            if (now.flag.includes('slowzoom') && draw) {
                this.customDuration = element.from.delta(element.to);
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

    private paddedBoundingBox(boundingBox: {tl: Vector, br: Vector}): {tl: Vector, br: Vector} {
        const padding = (this.canvasSize.x + this.canvasSize.y)/Zoomer.PADDING_FACTOR;
        return {
            tl: boundingBox.tl.add(new Vector(-padding, -padding)),
            br: boundingBox.br.add(new Vector(padding, padding))
        };
    }

    get center(): Vector {
        const enforcedBoundingBox = this.enforcedBoundingBox();
        if (enforcedBoundingBox.tl != Vector.NULL && enforcedBoundingBox.br != Vector.NULL) {
            return new Vector(
                Math.round((enforcedBoundingBox.tl.x + enforcedBoundingBox.br.x)/2), 
                Math.round((enforcedBoundingBox.tl.y + enforcedBoundingBox.br.y)/2));
        }
        return new Vector(this.canvasSize.x / 2, this.canvasSize.y / 2);
    }

    get scale(): number {
        const enforcedBoundingBox = this.enforcedBoundingBox();
        if (enforcedBoundingBox.tl != Vector.NULL && enforcedBoundingBox.br != Vector.NULL) {
            const zoomSize = enforcedBoundingBox.tl.delta(enforcedBoundingBox.br);
            return Math.min(this.canvasSize.x / zoomSize.x, this.canvasSize.y / zoomSize.y);
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
