[transport-network-animator](../README.md) / Config

# Class: Config

To override configuration values, you can access the default instance of this class in your own JavaScript, e.g.:

```
TNA.Config.default.beckStyle = false;
```

Your JavaScript code needs to be included after transport-network-animator itself.
This also means that you most likely want to set [Config.autoStart](Config.md#autostart) to `false`, which needs to be set directly in the SVG (`data-auto-start="false"`).
See a full example here: [https://github.com/traines-source/transport-network-animator/blob/master/examples/travel-times-fernverkehr.svg?short_path=c3daf6a#L651](https://github.com/traines-source/transport-network-animator/blob/master/examples/travel-times-fernverkehr.svg?short_path=c3daf6a#L651)

## Table of contents

### Constructors

- [constructor](Config.md#constructor)

### Properties

- [animSpeed](Config.md#animspeed)
- [autoStart](Config.md#autostart)
- [beckStyle](Config.md#beckstyle)
- [defaultStationDimen](Config.md#defaultstationdimen)
- [fadeDurationSeconds](Config.md#fadedurationseconds)
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

[Config.ts:54](https://github.com/traines-source/transport-network-animator/blob/master/src/Config.ts#L54)

___

### autoStart

• **autoStart**: `boolean` = `true`

Whether to automatically start TNA. Set to false if you want to run custom code (e.g. setting up paths etc. programmatically) beforehand.
This needs to be set in the SVG to the SVG tag (`data-auto-start="false"`). Setting it in JavaScript will not have any effect.
If set to false, you will need to fire an event from your JavaScript if you eventually want to start TNA:
```
document.dispatchEvent(new Event('startTransportNetworkAnimator'));
```

#### Defined in

[Config.ts:23](https://github.com/traines-source/transport-network-animator/blob/master/src/Config.ts#L23)

___

### beckStyle

• **beckStyle**: `boolean` = `true`

Whether to enable Harry Beck style drawing (only lines in 45 degree steps, as usually done for public transport maps).
This can also be set for each SVG path individually (data-beck-style="false").

#### Defined in

[Config.ts:44](https://github.com/traines-source/transport-network-animator/blob/master/src/Config.ts#L44)

___

### defaultStationDimen

• **defaultStationDimen**: `number` = `10`

Size of a station with a single line.

#### Defined in

[Config.ts:71](https://github.com/traines-source/transport-network-animator/blob/master/src/Config.ts#L71)

___

### fadeDurationSeconds

• **fadeDurationSeconds**: `number` = `0.2`

How long to fade in/out elements that are not specially animated.
This applies to Labels, Stations, Trains and generic SVG elements.
Albeit an animation, this does not delay consecutive animations.

#### Defined in

[Config.ts:61](https://github.com/traines-source/transport-network-animator/blob/master/src/Config.ts#L61)

___

### gravitatorAnimMaxDurationSeconds

• **gravitatorAnimMaxDurationSeconds**: `number` = `6`

Upper bound for animation duration.

#### Defined in

[Config.ts:155](https://github.com/traines-source/transport-network-animator/blob/master/src/Config.ts#L155)

___

### gravitatorAnimSpeed

• **gravitatorAnimSpeed**: `number` = `250`

How fast to animate the distortion. Depends on the scale of your map.

#### Defined in

[Config.ts:150](https://github.com/traines-source/transport-network-animator/blob/master/src/Config.ts#L150)

___

### gravitatorColorDeviation

• **gravitatorColorDeviation**: `number` = `0.02`

Color edges that are unusually long in red and those that are unusually short in blue. Set to 0 to disable, or override it using CSS.

#### Defined in

[Config.ts:160](https://github.com/traines-source/transport-network-animator/blob/master/src/Config.ts#L160)

___

### gravitatorGradientScale

• **gravitatorGradientScale**: `number` = `0.01`

Gradient scaling to ensure gradient is not extremely large or extremely small.
The default value should be fine in most cases.
Do experimentally adjust it if the optimization takes a long time or leads to bad results (large deviations).

#### Defined in

[Config.ts:130](https://github.com/traines-source/transport-network-animator/blob/master/src/Config.ts#L130)

___

### gravitatorInertness

• **gravitatorInertness**: `number` = `0.1`

How much to take into account the original and current positions of nodes/stations to optimize the new positions.
This is meant to avoid nodes flapping around and keeping the network in a recognizable layout, even if it is not the optimal layout.
This should be adjusted by experimentation depending on how far the nodes move from their starting positions during your animation.
Set to 0 to disable.

#### Defined in

[Config.ts:115](https://github.com/traines-source/transport-network-animator/blob/master/src/Config.ts#L115)

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

[Config.ts:145](https://github.com/traines-source/transport-network-animator/blob/master/src/Config.ts#L145)

___

### gravitatorUseInclinationInertness

• **gravitatorUseInclinationInertness**: `boolean` = `true`

Whether to use the inclination-preserving algorithm. This tries to preserve the orientation of edges in space.
When false, the location-preserving algorithm is used, which punishes nodes for traveling too far from their original and last position.
The inclination-preserving algorithm usually yields better results, but is more computationally intensive.
Make sure to experiment with different [Config.gravitatorInertness](Config.md#gravitatorinertness) values as well.

#### Defined in

[Config.ts:123](https://github.com/traines-source/transport-network-animator/blob/master/src/Config.ts#L123)

___

### labelDistance

• **labelDistance**: `number` = `0`

Extra distance of labels from the station.

#### Defined in

[Config.ts:81](https://github.com/traines-source/transport-network-animator/blob/master/src/Config.ts#L81)

___

### labelHeight

• **labelHeight**: `number` = `12`

Height of labels. This influences the spacing of labels to stations.

#### Defined in

[Config.ts:76](https://github.com/traines-source/transport-network-animator/blob/master/src/Config.ts#L76)

___

### lineDistance

• **lineDistance**: `number` = `6`

Distance of neighboring lines at stations.

#### Defined in

[Config.ts:66](https://github.com/traines-source/transport-network-animator/blob/master/src/Config.ts#L66)

___

### mapProjection

• **mapProjection**: `string` = `'epsg3857'`

Which map projection to use if you use `data-lon-lat` attributes on stations. For choices and custom projections, see [Projection](Projection.md)

#### Defined in

[Config.ts:28](https://github.com/traines-source/transport-network-animator/blob/master/src/Config.ts#L28)

___

### mapProjectionScale

• **mapProjectionScale**: `number` = `1`

Scale of the map projection when converting to SVG coordinate system.

#### Defined in

[Config.ts:33](https://github.com/traines-source/transport-network-animator/blob/master/src/Config.ts#L33)

___

### minNodeDistance

• **minNodeDistance**: `number` = `0`

Minimum distance of corners for Harry Beck style.

#### Defined in

[Config.ts:49](https://github.com/traines-source/transport-network-animator/blob/master/src/Config.ts#L49)

___

### trainTimetableSpeed

• **trainTimetableSpeed**: `number` = `60`

How fast to animate trains according to given timetables, measured in real seconds per animated second.
The default (60) means that if numbers given in the timetables are interpreted as minutes, one minute in reality corresponds to one second in the animation.

#### Defined in

[Config.ts:107](https://github.com/traines-source/transport-network-animator/blob/master/src/Config.ts#L107)

___

### trainTrackOffset

• **trainTrackOffset**: `number` = `0`

Offset of train relative to line.

#### Defined in

[Config.ts:101](https://github.com/traines-source/transport-network-animator/blob/master/src/Config.ts#L101)

___

### trainWagonLength

• **trainWagonLength**: `number` = `10`

Length of one train section.

#### Defined in

[Config.ts:96](https://github.com/traines-source/transport-network-animator/blob/master/src/Config.ts#L96)

___

### zoomDuration

• **zoomDuration**: `number` = `1`

Duration of zoom at the beginning of every instant.

#### Defined in

[Config.ts:86](https://github.com/traines-source/transport-network-animator/blob/master/src/Config.ts#L86)

___

### zoomMaxScale

• **zoomMaxScale**: `number` = `3`

Maximum zoom level.

#### Defined in

[Config.ts:38](https://github.com/traines-source/transport-network-animator/blob/master/src/Config.ts#L38)

___

### zoomPaddingFactor

• **zoomPaddingFactor**: `number` = `40`

How much padding to add around bounding box of zoomed elements to calculate the actual canvas extent.

#### Defined in

[Config.ts:91](https://github.com/traines-source/transport-network-animator/blob/master/src/Config.ts#L91)

## Accessors

### default

• `Static` `get` **default**(): [`Config`](Config.md)

The default Config that will be used everywhere except when specifically overridden. Access it from your JavaScript code to set config values using `TNA.Config.default`, e.g. `TNA.Config.default.beckStyle = false;`

#### Returns

[`Config`](Config.md)

#### Defined in

[Config.ts:165](https://github.com/traines-source/transport-network-animator/blob/master/src/Config.ts#L165)
