/**
 * To override configuration values, you can access the default instance of this class in your own JavaScript, e.g.:
 * 
 * ```
 * TNA.Config.default.beckStyle = false;
 * ```
 * 
 * Your JavaScript code needs to be included after transport-network-animator itself.
 * This also means that you most likely want to set {@link Config.autoStart} to `false`, which needs to be set directly in the SVG (`data-auto-start="false"`).
 * See a full example here: {@link https://github.com/traines-source/transport-network-animator/blob/master/examples/travel-times-fernverkehr.svg?short_path=c3daf6a#L651}
 */
export class Config {
    private static _default: Config;

    /**
     * Whether to automatically start TNA. Set to false if you want to run custom code (e.g. setting up paths etc. programmatically) beforehand.
     * This needs to be set in the SVG to the SVG tag (`data-auto-start="false"`). Setting it in JavaScript will not have any effect.
     * If set to false, you will need to fire an event from your JavaScript if you eventually want to start TNA:
     * ```
     * document.dispatchEvent(new Event('startTransportNetworkAnimator'));
     * ```
     */
    autoStart = true;

    /**
     * Which map projection to use if you use `data-lon-lat` attributes on stations. For choices and custom projections, see {@link Projection}
     */
    mapProjection = 'epsg3857';

    /**
     * Scale of the map projection when converting to SVG coordinate system.
     */
    mapProjectionScale = 1;

    /**
     * Maximum zoom level.
     */
    zoomMaxScale = 3;

    /**
     * Whether to enable Harry Beck style drawing (only lines in 45 degree steps, as usually done for public transport maps).
     * This can also be set for each SVG path individually (data-beck-style="false").
     */
    beckStyle = true;

    /**
     * Minimum distance of corners for Harry Beck style.
     */
    minNodeDistance = 0;

    /**
     * Animation speed for lines.
     */
    animSpeed = 100;

    /**
     * Distance of neighboring lines at stations.
     */
    lineDistance = 6;

    /**
     * Size of a station with a single line.
     */
    defaultStationDimen = 10;

    /**
     * Height of labels. This influences the spacing of labels to stations.
     */
    labelHeight = 12;

    /**
     * Extra distance of labels from the station.
     */
    labelDistance = 0;

    /**
     * Duration of zoom at the beginning of every instant.
     */
    zoomDuration = 1;

    /**
     * How much padding to add around bounding box of zoomed elements to calculate the actual canvas extent.
     */
    zoomPaddingFactor = 40;

    /**
     * Length of one train section.
     */
    trainWagonLength = 10;

    /**
     * Offset of train relative to line.
     */
    trainTrackOffset = 0;

    /**
     * How fast to animate trains according to given timetables, measured in real seconds per animated second.
     * The default (60) means that if numbers given in the timetables are interpreted as minutes, one minute in reality corresponds to one second in the animation. 
     */
    trainTimetableSpeed = 60;

    /**
     * How much to take into account the original and current positions of nodes/stations to optimize the new positions.
     * This is meant to avoid nodes flapping around and keeping the network in a recognizable layout, even if it is not the optimal layout.
     * This should be adjusted by experimentation depending on how far the nodes move from their starting positions during your animation.
     * Set to 0 to disable.
     */
    gravitatorInertness = 0.1;

    /**
     * Whether to use the inclination-preserving algorithm. This tries to preserve the orientation of edges in space.
     * When false, the location-preserving algorithm is used, which punishes nodes for traveling too far from their original and last position.
     * The inclination-preserving algorithm usually yields better results, but is more computationally intensive.
     * Make sure to experiment with different {@link Config.gravitatorInertness} values as well.
     */
    gravitatorUseInclinationInertness = true;

    /**
     * Gradient scaling to ensure gradient is not extremely large or extremely small.
     * The default value should be fine in most cases.
     * Do experimentally adjust it if the optimization takes a long time or leads to bad results (large deviations). 
     */
    gravitatorGradientScale = 0.01;

    /**
     * When true, distances will be adjusted to the average ratio between all given weights and the sum of euclidian distances between nodes.
     * That means edge lengths will be to scale compared to eachother. A distortion will occur on the first iteration.
     * Suitable if your initial weights are not a universally valid ground truth (e.g. train travel times in a particular year).
     * When false, the initial weight for each edge is taken as ground truth, which means that edges cannot necessarily be compared to eachother visually,
     * they are just scaled relative to their respective ground truth throughout the animation. Consequently, on the first iteration, no distortion will occur.
     * Suitable if your initial weights are universally valid (e.g. geographic linear distance).
     * 
     * If you choose true, you might want to add a copy of every edge to the SVG without specifying a weight at the beginning.
     * This way, you can animate from the undistorted graph with the nodes at their indicated positions
     * to the first iteration where the distances are adjusted according to the weights.
     * Bear in mind that the euclidian distance depends on your chosen map projection and is not the exact geographic linear distance. 
     */
    gravitatorInitializeRelativeToEuclidianDistance = true;

    /**
     * How fast to animate the distortion. Depends on the scale of your map.
     */
    gravitatorAnimSpeed = 250;

    /**
     * Upper bound for animation duration.
     */
    gravitatorAnimMaxDurationSeconds = 6;

    /**
     * Color edges that are unusually long in red and those that are unusually short in blue. Set to 0 to disable, or override it using CSS.
     */
    gravitatorColorDeviation = 0.02;

    /**
     * The default Config that will be used everywhere except when specifically overridden. Access it from your JavaScript code to set config values using `TNA.Config.default`, e.g. `TNA.Config.default.beckStyle = false;` 
     */
    public static get default(): Config {
        return this._default || (this._default = new Config());
    }
}