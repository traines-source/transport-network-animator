import { Config } from "./Config";
import { Vector } from "./Vector";


export class Projection {
    private static _default: Projection;

    constructor(private _projection: string) {
        if (!(_projection in Projection.projections)) {
            throw new Error('Unknown projection: ' + _projection);
        }
    }

    /**
     * The default projection as set by {@link Config.mapProjection} 
     */
    public static get default(): Projection {
        return this._default || (this._default = new Projection(Config.default.mapProjection));
    }

    /**
     * The definitions of available projections, which can be added to.
     */
    static projections: { [name: string]: (lonlat: Vector) => Vector } = {
        'epsg3857': lonlat => new Vector(
            256/Math.PI*(lonlat.x/180*Math.PI+Math.PI),
            256/Math.PI*(Math.PI-Math.log(Math.tan(Math.PI/4+lonlat.y/180*Math.PI/2)))
        )
    };

    /**
     * Project the given coordinates to the target projection.
     * @param coords The coords in WGS84 / EPSG:4326
     */
    project(coords: Vector): Vector {
        return Projection.projections[this._projection](coords).scale(Config.default.mapProjectionScale).round(1);
    }

    
}