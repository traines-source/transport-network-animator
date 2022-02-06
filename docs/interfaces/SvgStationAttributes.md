[transport-network-animator](../README.md) / SvgStationAttributes

# Interface: SvgStationAttributes

A Station through which Lines can run.

SVG: `rect`

**`example`**
```
<rect data-station="Istanbul" x="28.9603" y="41.01" data-dir="ne" data-label-dir="w" />
```

## Hierarchy

- [`SvgAbstractTimedDrawableAttributes`](SvgAbstractTimedDrawableAttributes.md)

  ↳ **`SvgStationAttributes`**

## Table of contents

### Properties

- [baseCoords](SvgStationAttributes.md#basecoords)
- [from](SvgStationAttributes.md#from)
- [id](SvgStationAttributes.md#id)
- [labelDir](SvgStationAttributes.md#labeldir)
- [lonLat](SvgStationAttributes.md#lonlat)
- [name](SvgStationAttributes.md#name)
- [rotation](SvgStationAttributes.md#rotation)
- [to](SvgStationAttributes.md#to)

## Properties

### baseCoords

• **baseCoords**: [`Vector`](../classes/Vector.md)

The position of the station.

SVG: standard `x` and `y` attributes

#### Defined in

[svg/SvgApi.ts:212](https://github.com/traines-source/transport-network-animator/blob/master/src/svg/SvgApi.ts#L212)

___

### from

• **from**: `Instant`

Indicates when this element shall appear.

Pattern: `(?<epoch>\d+) (?<second>\d+)(?<flag> [\w-]+)?` e.g. `2020 5 noanim-nozoom`

`epoch`: Epochs will be executed in order. Years can be used as epochs.
`second`: Seconds reset to 0 with every epoch.
`flag`: Optional. `reverse`, `noanim`, `nozoom`, `keepzoom`. Can be combined with `-`.

See further explanations in root Readme.

SVG: `data-from`

#### Inherited from

[SvgAbstractTimedDrawableAttributes](SvgAbstractTimedDrawableAttributes.md).[from](SvgAbstractTimedDrawableAttributes.md#from)

#### Defined in

[svg/SvgApi.ts:31](https://github.com/traines-source/transport-network-animator/blob/master/src/svg/SvgApi.ts#L31)

___

### id

• **id**: `string`

The Station identifier. Attention! This is not the SVG `id` attribute!

Required.

SVG: `data-station`

#### Defined in

[svg/SvgApi.ts:205](https://github.com/traines-source/transport-network-animator/blob/master/src/svg/SvgApi.ts#L205)

___

### labelDir

• **labelDir**: [`Rotation`](../classes/Rotation.md)

The direction in which labels for that Station appear, e.g. `n`, `sw`.

**`defaultvalue`** `n`

SVG: `data-label-dir`

#### Defined in

[svg/SvgApi.ts:240](https://github.com/traines-source/transport-network-animator/blob/master/src/svg/SvgApi.ts#L240)

___

### lonLat

• **lonLat**: `undefined` \| [`Vector`](../classes/Vector.md)

The position of the station in WGS84 / EPSG:4326, i.e. GPS coordinates.
Longitude and latitude are to be separated by a space, e.g. `28.9603 41.01`.
This will be automatically projected to SVG coordinates using [Projection.default](../classes/Projection.md#default).
If set, this overrides the [baseCoords](SvgStationAttributes.md#basecoords) coordinates.

SVG: `data-lon-lat`

#### Defined in

[svg/SvgApi.ts:222](https://github.com/traines-source/transport-network-animator/blob/master/src/svg/SvgApi.ts#L222)

___

### name

• **name**: `string`

The name. In certain circumstances, this will be used a grouping identifier.

SVG: `name`, the standard SVG name attribute

#### Inherited from

[SvgAbstractTimedDrawableAttributes](SvgAbstractTimedDrawableAttributes.md).[name](SvgAbstractTimedDrawableAttributes.md#name)

#### Defined in

[svg/SvgApi.ts:16](https://github.com/traines-source/transport-network-animator/blob/master/src/svg/SvgApi.ts#L16)

___

### rotation

• **rotation**: [`Rotation`](../classes/Rotation.md)

The orientation of the station, e.g. `n`, `sw`.

**`defaultvalue`** `n`

SVG: `data-dir`

#### Defined in

[svg/SvgApi.ts:231](https://github.com/traines-source/transport-network-animator/blob/master/src/svg/SvgApi.ts#L231)

___

### to

• **to**: `Instant`

Indicates when this element shall disappear.

Pattern: `(?<epoch>\d+) (?<second>\d+)(?<flag> [\w-]+)?` e.g. `2020 5 noanim-nozoom`

`epoch`: Epochs will be executed in order. Years can be used as epochs.
`second`: Seconds reset to 0 with every epoch.
`flag`: Optional. `reverse`, `noanim`, `nozoom`, `keepzoom`. Can be combined with `-`.

See further explanations in root Readme.

SVG: `data-to`

#### Inherited from

[SvgAbstractTimedDrawableAttributes](SvgAbstractTimedDrawableAttributes.md).[to](SvgAbstractTimedDrawableAttributes.md#to)

#### Defined in

[svg/SvgApi.ts:46](https://github.com/traines-source/transport-network-animator/blob/master/src/svg/SvgApi.ts#L46)
