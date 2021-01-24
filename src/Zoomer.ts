import { Instant } from "./Instant";
import { Vector } from "./Vector";
import { Rotation } from "./Rotation";
import { TimedDrawable, BoundingBox } from "./Drawable";



export class Zoomer {
    static ZOOM_DURATION = 1;
    static ZOOM_MAX_SCALE = 3;
    static PADDING_FACTOR = 25;
    
    private boundingBox = new BoundingBox(Vector.NULL, Vector.NULL);
    private customDuration = -1;
    
    constructor(private canvasSize: BoundingBox) {
        console.log('canvas', this.canvasSize);
    }

    include(boundingBox: BoundingBox, from: Instant, to: Instant, draw: boolean, shouldAnimate: boolean) {
        const now = draw ? from : to;
        if (shouldAnimate && !now.flag.includes('nozoom')) {
            if (now.flag.includes('slowzoom') && draw) {
                this.customDuration = from.delta(to) - Zoomer.ZOOM_DURATION;
            } else if (now.flag.includes('slowzoom') && !draw) {
                this.customDuration = 0;
                boundingBox = new BoundingBox(Vector.NULL, Vector.NULL);
            } else if (!boundingBox.isNull()) {
                boundingBox = this.paddedBoundingBox(boundingBox);
            }
            this.boundingBox.tl = this.boundingBox.tl.bothAxisMins(boundingBox.tl);
            this.boundingBox.br = this.boundingBox.br.bothAxisMaxs(boundingBox.br);
        }
    }

    private enforcedBoundingBox(): BoundingBox {
        if (!this.boundingBox.isNull()) {
            const paddedBoundingBox = this.boundingBox;
            const zoomSize = paddedBoundingBox.dimensions;
            const canvasSize = this.canvasSize.dimensions;
            const minZoomSize = new Vector(canvasSize.x / Zoomer.ZOOM_MAX_SCALE, canvasSize.y / Zoomer.ZOOM_MAX_SCALE);
            const delta = zoomSize.delta(minZoomSize);
            const additionalSpacing = new Vector(Math.max(0, delta.x/2), Math.max(0, delta.y/2))
            return new BoundingBox(
                paddedBoundingBox.tl.add(additionalSpacing.rotate(new Rotation(180))),
                paddedBoundingBox.br.add(additionalSpacing)
            );
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
        if (!enforcedBoundingBox.isNull()) {
            return new Vector(
                Math.round((enforcedBoundingBox.tl.x + enforcedBoundingBox.br.x)/2), 
                Math.round((enforcedBoundingBox.tl.y + enforcedBoundingBox.br.y)/2));
        }
        return this.canvasSize.tl.between(this.canvasSize.br, 0.5);
    }

    get scale(): number {
        const enforcedBoundingBox = this.enforcedBoundingBox();
        if (!enforcedBoundingBox.isNull()) {
            const zoomSize = enforcedBoundingBox.dimensions;
            const delta = this.canvasSize.dimensions;
            return Math.min(delta.x / zoomSize.x, delta.y / zoomSize.y);
        }
        return 1;
    }

    get duration(): number {
        if (this.customDuration == -1) {
            return Zoomer.ZOOM_DURATION;
        }
        return this.customDuration;
    }
}
