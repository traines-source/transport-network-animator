import { Stop } from "../drawables/Station";
import { Vector } from "../Vector";
import { Instant } from "../Instant";
import { Rotation } from "../Rotation";

/**
 * There is no need to access this class and its subclasses directly.
 * The attributes documented here should be used directly in the SVG code as attributes to the respective SVG element tags, while converting the attribute name from `camelCase` to `data-kebap-case`. 
 */
export interface SvgAbstractTimedDrawableAttributes {
    /**
     * The name. In certain circumstances, this will be used a grouping identifier.
     * 
     * SVG: `name`, the standard SVG name attribute
     */
    name: string;
    
    /**
     * Indicates when this element shall appear.
     * Pattern: `(?<epoch>\d+) (?<second>\d+)(?<flag> [\w-]+)?` e.g. `2020 5 noanim-nozoom`
     * `epoch`: Epochs will be executed in order. Years can be used as epochs. 
     * `second`: Seconds reset to 0 with every epoch.
     * `flag`: Optional. `reverse`, `noanim`, `nozoom`, `keepzoom`. Can be combined with `-`.
     * See further explanations in root Readme.
     * 
     * SVG: `data-from`
     */
    from: Instant;

    /**
     * Indicates when this element shall disappear.
     * Pattern: `(?<epoch>\d+) (?<second>\d+)(?<flag> [\w-]+)?` e.g. `2020 5 noanim-nozoom`
     * `epoch`: Epochs will be executed in order. Years can be used as epochs. 
     * `second`: Seconds reset to 0 with every epoch.
     * `flag`: Optional. `reverse`, `noanim`, `nozoom`, `keepzoom`. Can be combined with `-`.
     * See further explanations in root Readme.
     *  
     * SVG: `data-to`
     */
    to: Instant;
}

/**
 * An image with a Ken Burns effect, i.e. slowly zooming in on the image.
 * 
 * SVG: `image`
 * 
 * @example
 * ```
 * <image href="image.jpg" preserveAspectRatio="xMidYMid slice" data-from="2020 1 keepzoom" data-to="2020 10 keepzoom" data-zoom="40 50" />
 * ```
 */
export interface SvgKenImageAttributes extends SvgAbstractTimedDrawableAttributes {
    /**
     * The center of where to zoom to, e.g. `60 50`.
     * This influences both the direction of the zoom and how far to zoom in.
     * The zoom factor will be kept as low as possible while ensuring that the image is covering the entire screen canvas at all times.
     * 
     * Required.
     * 
     * SVG: `data-zoom`
     */
    zoom: Vector;
}

/**
 * A crumpled, i.e. distorted image, usually a background map, used in conjunction with the Gravitator.
 * 
 * SVG: `foreignObject`
 * 
 * @example
 * ```
 * <foreignObject x="500" y="400" width="8000" height="5000" data-crumpled-image="image.png" />
 * ```
 */
export interface SvgCrumpledImageAttributes extends SvgAbstractTimedDrawableAttributes {
    /**
     * URL to an image to be used for crumpling.
     * 
     * Required.
     * 
     * SVG: `data-crumpled-image`
     */
    crumpledImage: string;
}

/**
 * A Label for a Station or a Line.
 * 
 * SVG: `text`
 * 
 * @example
 * ```
 * <text data-station="Dublin">Dublin</text>
 * ```
 */
export interface SvgLabelAttributes extends SvgAbstractTimedDrawableAttributes {
    /**
     * If the Label should be for a Station, the identifier of the Station defined elsewhere in the SVG ({@link SvgStationAttributes.id}).
     * One of forStation or forLine is required.
     * 
     * SVG: `data-station`
     */
    forStation: string | undefined;

    /**
     * If the Label should be for a Line, the name of the Line defined elsewhere in the SVG ({@link SvgLineAttributes.name}).
     * The Label will appear at all termini Stations of the Line. One of forStation or forLine is required.
     * 
     * SVG: `data-line`
     */
    forLine: string | undefined;
}

/**
 * An animated Line.
 * 
 * SVG: `path`
 * 
 * @example
 * ```
 * <path data-line="IR2013" data-stops="- Bern Olten Liestal BaselSBB" data-from="2022 0 noanim-nozoom" data-to="2022 120 noanim-nozoom" data-speed="300" />
 * ```
 */
export interface SvgLineAttributes extends SvgAbstractTimedDrawableAttributes {
    /**
     * The name. In certain circumstances, this will be used a grouping identifier.
     * Attention: The SVG attribute is different for Lines!
     * 
     * Required.
     * 
     * SVG: `data-line`
     */
    name: string;

    /**
     * A space-separated list of Station identifiers, and, optionally, a preceding track info.
     * Pattern: `((?<trackInfo>[-+]\d*\*? )?(?<stationId>\w+( |$)))+` e.g. `+1 Frankfurt - Hannover +2* Berlin`
     * `stationId`: The identifier of a station defined elsewhere in the SVG ({@link SvgStationAttributes.id}).
     * `trackInfo`: see {@link https://github.com/traines-source/transport-network-animator#tracks}
     * 
     * Required.
     * 
     * SVG: `data-stops`
     */
    stops: Stop[];

    /**
     * The graph weight of that Line segment, used for Gravitator.
     * 
     * `data-weight`
     */
    weight: number | undefined;

    /**
     * The animation speed of that Line segment. This overrides {@link Config.animSpeed}.
     * 
     * SVG: `data-speed`
     */
    speed: number | undefined;

    /**
     * If set, indicates the geographical animation order, e.g. from north to south,
     * instead of animating elements with the same name and for the same Instant by the order in which they appear in the SVG.
     * e.g. `n`, `sw`.
     * 
     * SVG: `data-anim-order`
     */
    animOrder: Rotation | undefined;

    /**
     * Whether to use the "Harry Beck style" for this Line segment. If set to false, overrides {@link Config.beckStyle}.
     * 
     * SVG: `data-beck-style`
     */
    beckStyle: boolean;
}

/**
 * A Station through which Lines can run.
 * 
 * SVG: `rect`
 * 
 * @example
 * ```
 * <rect data-station="Istanbul" x="28.9603" y="41.01" data-dir="ne" data-label-dir="w" />
 * ```
 */
export interface SvgStationAttributes extends SvgAbstractTimedDrawableAttributes {
    /**
     * The Station identifier. Attention! This is not the SVG `id` attribute!
     * 
     * Required.
     * 
     * SVG: `data-station`
     */
    id: string;

    /**
     * The position of the station.
     * 
     * SVG: standard `x` and `y` attributes
     */
    baseCoords: Vector;

    /**
     * The position of the station in WGS84 / EPSG:4326, i.e. GPS coordinates.
     * This will be automatically projected to SVG coordinates using {@link Projection.default}.
     * If set, this overrides the {@link baseCoords} coordinates.
     * 
     * SVG: `data-lon-lat`
     */
    lonLat: Vector | undefined;

    /**
     * The orientation of the station, e.g. `n`, `sw`.
     * 
     * @defaultValue `n`
     * 
     * SVG: `data-dir`
     */
    rotation: Rotation;

    /**
     * The direction in which labels for that Station appear, e.g. `n`, `sw`.
     * 
     * @defaultValue `n`
     * 
     * SVG: `data-label-dir`
     */
    labelDir: Rotation;
}

/**
 * An animated Train that runs on a Line.
 * 
 * SVG: `path`
 * 
 * @example
 * ``` 
 * <path data-train="IR2013" data-stops="Bern -4+30 Olten +33+61 BaselSBB" data-from="2022 2 keepzoom" data-to="2022 120 keepzoom" data-length="4" />
 * ```
 */
export interface SvgTrainAttributes extends SvgAbstractTimedDrawableAttributes {
     /**
     * The name, referring to a Line name defined elsewhere in the SVG ({@link SvgLineAttributes.name}).
     * The Train will run on this Line.
     * Attention: The SVG attribute is different for Trains!
     * 
     * Required.
     * 
     * SVG: `data-train`
     */
    name: string;

    /**
     * Stops of the Line given above at which the Train is supposed to stop, with departure and arrival times in between.
     * Pattern: `(?<stationId>\w+( (?<depArrInfo>[-+]\d+[-+]\d+) |$))+` e.g. `Berlin +11+50 Hannover +56+120 Frankfurt`
     * `stationId`: The identifier of a station defined elsewhere in the SVG ({@link SvgStationAttributes.id}). Must be a stop of the Line on which the train runs.
     * `depArrInfo`: see {@link https://github.com/traines-source/transport-network-animator#trains-beta}
     * 
     * Required.
     * 
     * SVG: `data-stops`
     */
    stops: Stop[];

    /**
     * The length of the train (i.e. how many "carriages").
     * 
     * @defaultValue `2`
     * 
     * SVG: `data-length`
     */
    length: number;
}