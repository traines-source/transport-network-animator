export class Config {
    private static _default: Config;

    autoStart = true;
    mapProjection = 'epsg3857';
    mapProjectionScale = 200;
    zoomMaxScale = 3;
    beckStyle = true;
    trainTimetableSpeed = 60;

    gravitatorInertness = 100;
    gravitatorGradientScale = 0.1;
    gravitatorInitializeRelativeToEuclidianDistance = true;
    gravitatorAnimSpeed = 250;
    gravitatorAnimMaxDurationSeconds = 6;
    gravitatorColorDeviation = 0.02;
    
    public static get default(): Config {
        return this._default || (this._default = new Config());
    }
}