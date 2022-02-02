[transport-network-animator](../README.md) / Config

# Class: Config

## Table of contents

### Constructors

- [constructor](Config.md#constructor)

### Properties

- [animSpeed](Config.md#animspeed)
- [autoStart](Config.md#autostart)
- [beckStyle](Config.md#beckstyle)
- [defaultStationDimen](Config.md#defaultstationdimen)
- [gravitatorAnimMaxDurationSeconds](Config.md#gravitatoranimmaxdurationseconds)
- [gravitatorAnimSpeed](Config.md#gravitatoranimspeed)
- [gravitatorColorDeviation](Config.md#gravitatorcolordeviation)
- [gravitatorGradientScale](Config.md#gravitatorgradientscale)
- [gravitatorInertness](Config.md#gravitatorinertness)
- [gravitatorInitializeRelativeToEuclidianDistance](Config.md#gravitatorinitializerelativetoeuclidiandistance)
- [gravitatorUseInclinationInertness](Config.md#gravitatoruseinclinationinertness)
- [labelDistance](Config.md#labeldistance)
- [labelHeight](Config.md#labelheight)
- [lineDistance](Config.md#linedistance)
- [mapProjection](Config.md#mapprojection)
- [mapProjectionScale](Config.md#mapprojectionscale)
- [minNodeDistance](Config.md#minnodedistance)
- [trainTimetableSpeed](Config.md#traintimetablespeed)
- [trainTrackOffset](Config.md#traintrackoffset)
- [trainWagonLength](Config.md#trainwagonlength)
- [zoomDuration](Config.md#zoomduration)
- [zoomMaxScale](Config.md#zoommaxscale)
- [zoomPaddingFactor](Config.md#zoompaddingfactor)

### Accessors

- [default](Config.md#default)

## Constructors

### constructor

• **new Config**()

## Properties

### animSpeed

• **animSpeed**: `number` = `100`

Animation speed for lines.

#### Defined in

[Config.ts:43](https://github.com/traines-source/transport-network-animator/blob/master/src/Config.ts#L43)

___

### autoStart

• **autoStart**: `boolean` = `true`

Whether to automatically start TNA. Set to false if you want to run custom code (e.g. setting up paths etc. programmatically) beforehand.
This needs to be set in the SVG to the SVG tag (data-auto-start="false"). Setting it in JavaScript will not have any effect.
If set to false, you will need to fire an event from your JavaScript if you eventually want to start TNA:
```
document.dispatchEvent(new Event('startTransportNetworkAnimator'));
```

#### Defined in

[Config.ts:12](https://github.com/traines-source/transport-network-animator/blob/master/src/Config.ts#L12)

___

### beckStyle

• **beckStyle**: `boolean` = `true`

Whether to enable Harry Beck style drawing (only lines in 45 degree steps, as usually done for public transport maps).
This can also be set for each SVG path individually (data-beck-style="false").

#### Defined in

[Config.ts:33](https://github.com/traines-source/transport-network-animator/blob/master/src/Config.ts#L33)

___

### defaultStationDimen

• **defaultStationDimen**: `number` = `10`

Size of a station with a single line.

#### Defined in

[Config.ts:53](https://github.com/traines-source/transport-network-animator/blob/master/src/Config.ts#L53)

___

### gravitatorAnimMaxDurationSeconds

• **gravitatorAnimMaxDurationSeconds**: `number` = `6`

Upper bound for animation duration.

#### Defined in

[Config.ts:137](https://github.com/traines-source/transport-network-animator/blob/master/src/Config.ts#L137)

___

### gravitatorAnimSpeed

• **gravitatorAnimSpeed**: `number` = `250`

How fast to animate the distortion. Depends on the scale of your map.

#### Defined in

[Config.ts:132](https://github.com/traines-source/transport-network-animator/blob/master/src/Config.ts#L132)

___

### gravitatorColorDeviation

• **gravitatorColorDeviation**: `number` = `0.02`

Color edges that are unusually long in red and those that are unusually short in blue. Set to 0 to disable, or override it using CSS.

#### Defined in

[Config.ts:142](https://github.com/traines-source/transport-network-animator/blob/master/src/Config.ts#L142)

___

### gravitatorGradientScale

• **gravitatorGradientScale**: `number` = `0.01`

Gradient scaling to ensure gradient is not extremely large or extremely small.
The default value should be fine in most cases.
Do experimentally adjust it if the optimization takes a long time or leads to bad results (large deviations).

#### Defined in

[Config.ts:112](https://github.com/traines-source/transport-network-animator/blob/master/src/Config.ts#L112)

___

### gravitatorInertness

• **gravitatorInertness**: `number` = `0.1`

How much to take into account the original and current positions of nodes/stations to optimize the new positions.
This is meant to avoid nodes flapping around and keeping the network in a recognizable layout, even if it is not the optimal layout.
This should be adjusted by experimentation depending on how far the nodes move from their starting positions during your animation.
Set to 0 to disable.

#### Defined in

[Config.ts:97](https://github.com/traines-source/transport-network-animator/blob/master/src/Config.ts#L97)

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

[Config.ts:127](https://github.com/traines-source/transport-network-animator/blob/master/src/Config.ts#L127)

___

### gravitatorUseInclinationInertness

• **gravitatorUseInclinationInertness**: `boolean` = `true`

Whether to use the inclination-preserving algorithm. This tries to preserve the orientation of edges in space.
When false, the location-preserving algorithm is used, which punishes nodes for traveling too far from their original and last position.
The inclination-preserving algorithm usually yields better results, but is more computationally intensive.
Make sure to experiment with different [Config.gravitatorInertness](Config.md#gravitatorinertness) values as well.

#### Defined in

[Config.ts:105](https://github.com/traines-source/transport-network-animator/blob/master/src/Config.ts#L105)

___

### labelDistance

• **labelDistance**: `number` = `0`

Extra distance of labels from the station.

#### Defined in

[Config.ts:63](https://github.com/traines-source/transport-network-animator/blob/master/src/Config.ts#L63)

___

### labelHeight

• **labelHeight**: `number` = `12`

Height of labels. This influences the spacing of labels to stations.

#### Defined in

[Config.ts:58](https://github.com/traines-source/transport-network-animator/blob/master/src/Config.ts#L58)

___

### lineDistance

• **lineDistance**: `number` = `6`

Distance of neighboring lines at stations.

#### Defined in

[Config.ts:48](https://github.com/traines-source/transport-network-animator/blob/master/src/Config.ts#L48)

___

### mapProjection

• **mapProjection**: `string` = `'epsg3857'`

Which map projection to use if you use data-lonlat attributes on stations. For choices and custom projections, see [Projection](Projection.md)

#### Defined in

[Config.ts:17](https://github.com/traines-source/transport-network-animator/blob/master/src/Config.ts#L17)

___

### mapProjectionScale

• **mapProjectionScale**: `number` = `1`

Scale of the map projection when converting to SVG coordinate system.

#### Defined in

[Config.ts:22](https://github.com/traines-source/transport-network-animator/blob/master/src/Config.ts#L22)

___

### minNodeDistance

• **minNodeDistance**: `number` = `0`

Minimum distance of corners for Harry Beck style.

#### Defined in

[Config.ts:38](https://github.com/traines-source/transport-network-animator/blob/master/src/Config.ts#L38)

___

### trainTimetableSpeed

• **trainTimetableSpeed**: `number` = `60`

How fast to animate trains according to given timetables, measured in real seconds per animated second.
The default (60) means that if numbers given in the timetables are interpreted as minutes, one minute in reality corresponds to one second in the animation.

#### Defined in

[Config.ts:89](https://github.com/traines-source/transport-network-animator/blob/master/src/Config.ts#L89)

___

### trainTrackOffset

• **trainTrackOffset**: `number` = `0`

Offset of train relative to line.

#### Defined in

[Config.ts:83](https://github.com/traines-source/transport-network-animator/blob/master/src/Config.ts#L83)

___

### trainWagonLength

• **trainWagonLength**: `number` = `10`

Length of one train section.

#### Defined in

[Config.ts:78](https://github.com/traines-source/transport-network-animator/blob/master/src/Config.ts#L78)

___

### zoomDuration

• **zoomDuration**: `number` = `1`

Duration of zoom at the beginning of every instant.

#### Defined in

[Config.ts:68](https://github.com/traines-source/transport-network-animator/blob/master/src/Config.ts#L68)

___

### zoomMaxScale

• **zoomMaxScale**: `number` = `3`

Maximum zoom level.

#### Defined in

[Config.ts:27](https://github.com/traines-source/transport-network-animator/blob/master/src/Config.ts#L27)

___

### zoomPaddingFactor

• **zoomPaddingFactor**: `number` = `40`

How much padding to add around bounding box of zoomed elements to calculate the actual canvas extent.

#### Defined in

[Config.ts:73](https://github.com/traines-source/transport-network-animator/blob/master/src/Config.ts#L73)

## Accessors

### default

• `Static` `get` **default**(): [`Config`](Config.md)

The default Config that will be used everywhere except when specifically overridden. Access it from your JavaScript code to set config values using `TNA.Config.default`, e.g. `TNA.Config.default.beckStyle = false;`

#### Returns

[`Config`](Config.md)

#### Defined in

[Config.ts:147](https://github.com/traines-source/transport-network-animator/blob/master/src/Config.ts#L147)
