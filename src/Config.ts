export class Config {
    private static _default: Config;

    autoStart = true;
    mapProjection = 'epsg3857';
    mapProjectionScale = 200;
    zoomMaxScale = 3;
    beckStyle = true;
    trainTimetableSpeed = 60;

    public static get default(): Config {
        return this._default || (this._default = new Config());
    }
}