import { Config } from "./Config";
import { Vector } from "./Vector";

const proj4 = require('proj4');

export class Projection {
    private static _default: Projection;

    private static proj4_3035 = '+proj=laea +lat_0=52 +lon_0=10 +x_0=4321000 +y_0=3210000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs';

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
            256/Math.PI*(lonlat.x/180*Math.PI+Math.PI)*Config.default.mapProjectionScale,
            256/Math.PI*(Math.PI-Math.log(Math.tan(Math.PI/4+lonlat.y/180*Math.PI/2)))*Config.default.mapProjectionScale
        ),
        'epsg3035': lonlat => {
            const p = proj4.default(Projection.proj4_3035, [lonlat.x, lonlat.y])
            return new Vector(p[0]*Config.default.mapProjectionScale, -p[1]*Config.default.mapProjectionScale);
        }
    };

    /**
     * Project the given coordinates to the target projection.
     * @param coords The coords in WGS84 / EPSG:4326
     */
    project(coords: Vector): Vector {
        return Projection.projections[this._projection](coords).round(1);
    }

    
}