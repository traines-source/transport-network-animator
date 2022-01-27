import { Config } from "./Config";

export class Projection {
    private static _default: Projection;

    constructor(private _projection: string) {
        if (!(_projection in Projection.projections)) {
            console.error('Unknown projection', _projection);
        }
    }

    public static get default(): Projection {
        return this._default || (this._default = new Projection(Config.default.mapProjection));
    }

    static projections: { [name: string]: [(lon: number) => number, (lat: number) => number] } = {
        'epsg3857': [
            lon => Math.round(256/Math.PI*(lon/180*Math.PI+Math.PI)*Config.default.mapProjectionScale*10)/10,
            lat => Math.round(256/Math.PI*(Math.PI-Math.log(Math.tan(Math.PI/4+lat/180*Math.PI/2)))*Config.default.mapProjectionScale*10)/10
        ]
    };
    
    x(lon: number): number {
        return Projection.projections[this._projection][0](lon);
    }
        
    y(lat: number): number {
        return Projection.projections[this._projection][1](lat);
    }
}