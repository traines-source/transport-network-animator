import { Instant } from "./Instant";
import { Vector } from "./Vector";
import { Rotation } from "./Rotation";
import { BoundingBox } from "./BoundingBox";
import { Config } from "./Config";

export class Zoomer {
    
    private boundingBox = new BoundingBox(Vector.NULL, Vector.NULL);
    private customDuration = -1;
    private resetFlag = false;
    
    constructor(private canvasSize: BoundingBox, private zoomMaxScale = 3) {
    }

    include(boundingBox: BoundingBox, from: Instant, to: Instant, draw: boolean, shouldAnimate: boolean, pad: boolean = true) {
        const now = draw ? from : to;
        if (now.flag.includes('keepzoom')) {
            this.resetFlag = false;
        } else {
            if (this.resetFlag) {
                this.doReset();
            }
            if (shouldAnimate && !now.flag.includes('nozoom')) {
                if (pad && !boundingBox.isNull()) {
                    boundingBox = this.paddedBoundingBox(boundingBox);
                }
                this.boundingBox.add(boundingBox.tl, boundingBox.br);
            }
        }
    }

    private enforcedBoundingBox(): BoundingBox {
        if (!this.boundingBox.isNull()) {
            const paddedBoundingBox = this.boundingBox;
            const zoomSize = paddedBoundingBox.dimensions;
            const canvasSize = this.canvasSize.dimensions;
            const minZoomSize = new Vector(canvasSize.x / this.zoomMaxScale, canvasSize.y / this.zoomMaxScale);
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
        const padding = Config.default.zoomPaddingFactor*Math.min(this.zoomMaxScale, 8);
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
            return Config.default.zoomDuration;
        }
        return this.customDuration;
    }

    private doReset() {
        this.boundingBox = new BoundingBox(Vector.NULL, Vector.NULL);
        this.customDuration = -1;
        this.resetFlag = false;
    }

    public reset() {
        this.resetFlag = true;
    }
}
