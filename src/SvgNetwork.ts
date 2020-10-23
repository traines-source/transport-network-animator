import { NetworkAdapter, Network, StationProvider } from "./Network";
import { TimedDrawable } from "./Drawable";
import { Vector } from "./Vector";
import { Rotation } from "./Rotation";
import { Station } from "./Station";
import { Line } from "./Line";
import { SvgLine } from "./SvgLine";
import { SvgStation } from "./SvgStation";
import { Label } from "./Label";
import { SvgLabel } from "./SvgLabel";

export class SvgNetwork implements NetworkAdapter {

    static FPS = 60;
    private readonly svgns = "http://www.w3.org/2000/svg";

    private currentZoomCenter: Vector = Vector.NULL;
    private currentZoomScale: number = 1;

    get canvasSize(): Vector {
        const svg = document.querySelector('svg');
        const box = svg?.viewBox.baseVal;
        if (box) {
            return new Vector(box.width, box.height);
        }
        return Vector.NULL;        
    }

    initialize(network: Network): void {
        let elements = document.getElementById('elements')?.children;
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
        if (element.localName == 'path') {
            return new Line(new SvgLine(element), network);
        } else if (element.localName == 'text') {
            return new Label(new SvgLabel(element), network);
        }
        return null;
    }

    stationById(id: string): Station | null {
        const element = document.getElementById(id);
        if (element != undefined) {
            return new Station(new SvgStation(<SVGRectElement> <unknown>element));
        }
        return null;
    }

    createVirtualStop(id: string, baseCoords: Vector, rotation: Rotation): Station {
        const helpStop = document.createElementNS(this.svgns, 'rect');
        helpStop.id = id;    
        helpStop.setAttribute('data-dir', rotation.name);
        this.setCoord(helpStop, baseCoords);
        helpStop.className.baseVal = 'helper';
        document.getElementById('stations')?.appendChild(helpStop);
        return new Station(new SvgStation(helpStop));  
    };

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
        this.setCoord(document.getElementById('tmp'), zoomCenter);
        this.animateFrame(0, animationDurationSeconds/SvgNetwork.FPS, this.currentZoomCenter, zoomCenter, this.currentZoomScale, zoomScale);
        this.currentZoomCenter = zoomCenter;
        this.currentZoomScale = zoomScale;
    }

    private animateFrame(x: number, animationPerFrame: number, fromCenter: Vector, toCenter: Vector, fromScale: number, toScale: number): void {
        if (x < 1) {
            x += animationPerFrame;
            const ease = this.ease(x);
            const delta = fromCenter.delta(toCenter)
            const center = new Vector(delta.x * ease, delta.y * ease).add(fromCenter);
            const scale = (toScale - fromScale) * ease + fromScale;
            this.updateZoom(center, scale);
            const network = this;
            window.requestAnimationFrame(function() { network.animateFrame(x, animationPerFrame, fromCenter, toCenter, fromScale, toScale); });
        } else {
            this.updateZoom(toCenter, toScale);
        }
    }

    private ease(x : number) {
        return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;;
    }

    private updateZoom(center: Vector, scale: number) {
        const zoomable = document.getElementById('zoomable');
        if (zoomable != undefined) {
            console.log('zoom', center, scale);

            zoomable.style.transformOrigin = '500px 500px';
            zoomable.style.transform = 'scale(' + scale + ') translate(' + (this.canvasSize.x / 2 - center.x) + 'px,' + (this.canvasSize.y / 2 - center.y) + 'px)';
        }
    }
}
