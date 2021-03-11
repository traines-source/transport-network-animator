import { NetworkAdapter, Network, StationProvider } from "../Network";
import { TimedDrawable } from "../Drawable";
import { BoundingBox } from "../BoundingBox";
import { Vector } from "../Vector";
import { Rotation } from "../Rotation";
import { Station } from "../Station";
import { Line } from "../Line";
import { SvgLine } from "./SvgLine";
import { SvgStation } from "./SvgStation";
import { Label } from "../Label";
import { SvgLabel } from "./SvgLabel";
import { GenericTimedDrawable } from "../GenericTimedDrawable";
import { SvgGenericTimedDrawable } from "./SvgGenericTimedDrawable";
import { Zoomer } from "../Zoomer";
import { Train } from "../Train";
import { SvgTrain } from "./SvgTrain";
import { Utils } from "../Utils";

export class SvgNetwork implements NetworkAdapter {

    static FPS = 60;
    static SVGNS = "http://www.w3.org/2000/svg";

    private currentZoomCenter: Vector = Vector.NULL;
    private currentZoomScale: number = 1;

    get canvasSize(): BoundingBox {
        const svg = document.querySelector('svg');
        const box = svg?.viewBox.baseVal;
        if (box) {
            return new BoundingBox(new Vector(box.x, box.y), new Vector(box.x+box.width, box.y+box.height));
        }
        return new BoundingBox(Vector.NULL, Vector.NULL);        
    }

    get beckStyle(): boolean {
        const svg = document.querySelector('svg');
        return svg?.dataset.beckStyle != 'false';
    }

    initialize(network: Network): void {
        let elements = document.getElementsByTagName("*");
        if (elements == undefined)
        {
            console.error('Please define the "elements" group.');
            return;
        }
        for (let i=0; i<elements.length; i++) {
            const element: TimedDrawable | null = this.mirrorElement(elements[i], network);
            if (element != null) {
                network.addToIndex(element);
            }
        }
    }

    private mirrorElement(element: any, network: StationProvider): TimedDrawable | null {
        if (element.localName == 'path' && element.dataset.line != undefined) {
            return new Line(new SvgLine(element), network, this.beckStyle);
        } else if (element.localName == 'path' && element.dataset.train != undefined) {
            return new Train(new SvgTrain(element), network);
        } else if (element.localName == 'rect' && element.dataset.station != undefined) {
            return new Station(new SvgStation(element));
        } else if (element.localName == 'text') {
            return new Label(new SvgLabel(element), network);
        } else if (element.dataset.from != undefined || element.dataset.to != undefined) {
            return new GenericTimedDrawable(new SvgGenericTimedDrawable(element));
        }
        return null;
    }

    createVirtualStop(id: string, baseCoords: Vector, rotation: Rotation): Station {
        const helpStop = <SVGRectElement> document.createElementNS(SvgNetwork.SVGNS, 'rect');
        helpStop.setAttribute('data-station', id);
        helpStop.setAttribute('data-dir', rotation.name);
        this.setCoord(helpStop, baseCoords);
        helpStop.className.baseVal = 'helper';
        document.getElementById('stations')?.appendChild(helpStop);
        return new Station(new SvgStation(helpStop));  
    }

    private setCoord(element: any, coord: Vector): void {
        element.setAttribute('x', coord.x);
        element.setAttribute('y', coord.y);
    }

    drawEpoch(epoch: string): void {
        let epochLabel;
        if (document.getElementById('epoch-label') != undefined) {
            epochLabel = <SVGTextElement> <unknown> document.getElementById('epoch-label');
            epochLabel.textContent = epoch;       
        }
    }
   
    zoomTo(zoomCenter: Vector, zoomScale: number, animationDurationSeconds: number) {
        const network = this;
        window.setTimeout(function() { network.doZoom(zoomCenter, zoomScale, animationDurationSeconds); },
        animationDurationSeconds <= Zoomer.ZOOM_DURATION ? 0 : Zoomer.ZOOM_DURATION * 1000);
        return;
    }

    private doZoom(zoomCenter: Vector, zoomScale: number, animationDurationSeconds: number) {
        this.animateFrame(0, 1/animationDurationSeconds/SvgNetwork.FPS, animationDurationSeconds <= Zoomer.ZOOM_DURATION, this.currentZoomCenter, zoomCenter, this.currentZoomScale, zoomScale);
        this.currentZoomCenter = zoomCenter;
        this.currentZoomScale = zoomScale;
    }

    private animateFrame(x: number, animationPerFrame: number, ease: boolean, fromCenter: Vector, toCenter: Vector, fromScale: number, toScale: number): void {
        if (x < 1) {
            x += animationPerFrame;
            const fx = ease ? Utils.ease(x) : x;
            const delta = fromCenter.delta(toCenter)
            const center = new Vector(delta.x * fx, delta.y * fx).add(fromCenter);
            const scale = (toScale - fromScale) * fx + fromScale;
            this.updateZoom(center, scale);
            const network = this;
            window.requestAnimationFrame(function() { network.animateFrame(x, animationPerFrame, ease, fromCenter, toCenter, fromScale, toScale); });
        } else {
            this.updateZoom(toCenter, toScale);
        }
    }

    private updateZoom(center: Vector, scale: number) {
        const zoomable = document.getElementById('zoomable');
        if (zoomable != undefined) {
            const origin = this.canvasSize.tl.between(this.canvasSize.br, 0.5);
            zoomable.style.transformOrigin = origin.x + 'px ' + origin.y + 'px';
            zoomable.style.transform = 'scale(' + scale + ') translate(' + (origin.x - center.x) + 'px,' + (origin.y - center.y) + 'px)';
        }
    }
}
