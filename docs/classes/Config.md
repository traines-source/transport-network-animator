[transport-network-animator](../README.md) / Config

# Class: Config

## Table of contents

### Constructors

- [constructor](Config.md#constructor)

### Properties

- [autoStart](Config.md#autostart)
- [beckStyle](Config.md#beckstyle)
- [gravitatorAnimMaxDurationSeconds](Config.md#gravitatoranimmaxdurationseconds)
- [gravitatorAnimSpeed](Config.md#gravitatoranimspeed)
- [gravitatorColorDeviation](Config.md#gravitatorcolordeviation)
- [gravitatorGradientScale](Config.md#gravitatorgradientscale)
- [gravitatorInertness](Config.md#gravitatorinertness)
- [gravitatorInitializeRelativeToEuclidianDistance](Config.md#gravitatorinitializerelativetoeuclidiandistance)
- [mapProjection](Config.md#mapprojection)
- [mapProjectionScale](Config.md#mapprojectionscale)
- [trainTimetableSpeed](Config.md#traintimetablespeed)
- [zoomMaxScale](Config.md#zoommaxscale)

### Accessors

- [default](Config.md#default)

## Constructors

### constructor

• **new Config**()

## Properties

### autoStart

• **autoStart**: `boolean` = `true`

Whether to automatically start TNA. Set to false if you want to run custom code (e.g. setting up paths etc. programmatically) beforehand.
This needs to be set in the SVG to the SVG tag (data-auto-start="false"). Setting it in JavaScript will not have any effect.
If set to false, you will need to fire an event from your JavaScript if you eventually want to start TNA: `document.dispatchEvent(new Event('startTransportNetworkAnimator'));`

#### Defined in

[Config.ts:9](https://github.com/traines-source/transport-network-animator/blob/master/src/Config.ts#L9)

___

### beckStyle

• **beckStyle**: `boolean` = `true`

Whether to enable Harry Beck style drawing (only lines in 45 degree steps, as usually done for public transport maps).
This can also be set for each SVG path individually (data-beck-style="false").

#### Defined in

[Config.ts:30](https://github.com/traines-source/transport-network-animator/blob/master/src/Config.ts#L30)

___

### gravitatorAnimMaxDurationSeconds

• **gravitatorAnimMaxDurationSeconds**: `number` = `6`

Upper bound for animation duration.

#### Defined in

[Config.ts:76](https://github.com/traines-source/transport-network-animator/blob/master/src/Config.ts#L76)

___

### gravitatorAnimSpeed

• **gravitatorAnimSpeed**: `number` = `250`

How fast to animate the distortion. Depends on the scale of your map.

#### Defined in

[Config.ts:71](https://github.com/traines-source/transport-network-animator/blob/master/src/Config.ts#L71)

___

### gravitatorColorDeviation

• **gravitatorColorDeviation**: `number` = `0.02`

Color edges that are unusually long in red and those that are unusually short in blue. Set to 0 to disable, or override it using CSS.

#### Defined in

[Config.ts:81](https://github.com/traines-source/transport-network-animator/blob/master/src/Config.ts#L81)

___

### gravitatorGradientScale

• **gravitatorGradientScale**: `number` = `0.1`

Gradient scaling to ensure gradient is not extremely large or extremely small.
The default value should be fine in most cases.
Do experimentally adjust it if the optimization takes a long time or leads to bad results (large deviations).

#### Defined in

[Config.ts:51](https://github.com/traines-source/transport-network-animator/blob/master/src/Config.ts#L51)

___

### gravitatorInertness

• **gravitatorInertness**: `number` = `100`

How much to take into account the original and current positions of nodes/stations to optimize the new positions.
This is meant to avoid nodes flapping around and keeping the network in a recognizable layout, even if it is not the optimal layout.
This should be adjusted by experimentation depending on how far the nodes move from their starting positions during your animation.
Set to 0 to disable.

#### Defined in

[Config.ts:44](https://github.com/traines-source/transport-network-animator/blob/master/src/Config.ts#L44)

___

### gravitatorInitializeRelativeToEuclidianDistance

• **gravitatorInitializeRelativeToEuclidianDistance**: `boolean` = `true`

When true, distances will be adjusted to the average ratio between all given weights and the sum of euclidian distances between nodes.
That means edge lengths will be to scale compared to eachother. A distortion will occur on the first iteration.
Suitable if your initial weights are not a universally valid ground truth (e.g. train travel times in a particular year).
When false, the initial weight for each edge is taken as ground truth, which means that edges cannot necessarily be compared to eachother visually,
they are just scaled relative to their respective ground truth throughout the animation. Consequently, on the first iteration, no distortion will occur.
Suitable if your initial weights are universally valid (e.g. geographic linear distance).

If you choose true, you might want to add a copy of every edge to the SVG without specifying a weight at the beginning.
This way, you can animate from the undistorted graph with the nodes at their indicated positions
to the first iteration where the distances are adjusted according to the weights.
Bear in mind that the euclidian distance depends on your chosen map projection and is not the exact geographic linear distance.

#### Defined in

[Config.ts:66](https://github.com/traines-source/transport-network-animator/blob/master/src/Config.ts#L66)

___

### mapProjection

• **mapProjection**: `string` = `'epsg3857'`

Which map projection to use if you use data-lonlat attributes on stations. For choices and custom projections, see [Projection](Projection.md)

#### Defined in

[Config.ts:14](https://github.com/traines-source/transport-network-animator/blob/master/src/Config.ts#L14)

___

### mapProjectionScale

• **mapProjectionScale**: `number` = `200`

Scale of the map projection when converting to SVG coordinate system.

#### Defined in

[Config.ts:19](https://github.com/traines-source/transport-network-animator/blob/master/src/Config.ts#L19)

___

### trainTimetableSpeed

• **trainTimetableSpeed**: `number` = `60`

How fast to animate trains according to given timetables, measured in real seconds per animated second.
The default (60) means that if numbers given in the timetables are interpreted as minutes, one minute in reality corresponds to one second in the animation.

#### Defined in

[Config.ts:36](https://github.com/traines-source/transport-network-animator/blob/master/src/Config.ts#L36)

___

### zoomMaxScale

• **zoomMaxScale**: `number` = `3`

Maximum zoom level.

#### Defined in

[Config.ts:24](https://github.com/traines-source/transport-network-animator/blob/master/src/Config.ts#L24)

## Accessors

### default

• `Static` `get` **default**(): [`Config`](Config.md)

The default Config that will be used everywhere except when specifically overriden. Access it from your JavaScript code to set config values using `TNA.Config.default`, e.g. `TNA.Config.default.beckStyle = false;`

#### Returns

[`Config`](Config.md)

#### Defined in

[Config.ts:86](https://github.com/traines-source/transport-network-animator/blob/master/src/Config.ts#L86)
