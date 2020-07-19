import { NetworkProvider, Network, StationHolder } from "./Network";
import { Drawable, TimedDrawable } from "./Drawable";
import { Instant } from "./Instant";
import { Vector } from "./Vector";
import { Rotation } from "./Rotation";
import { Station } from "./Station";
import { Line } from "./Line";
import { SvgLine } from "./SvgLine";
import { SvgStation } from "./SvgStation";

export class SvgNetwork implements NetworkProvider {


    private readonly svgns = "http://www.w3.org/2000/svg";

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

    private mirrorElement(element: any, network: StationHolder): TimedDrawable | null {
        if (element.localName == 'path') {
            return new Line(new SvgLine(element), network);
        } /*else if (element.localName == 'text') {
            return new Label(new SvgLabel(element));
        }*/
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

    private setCoord(element: any, coord: Vector) {
        element.setAttribute('x', coord.x);
        element.setAttribute('y', coord.y);
    }
   
}
