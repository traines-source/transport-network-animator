[transport-network-animator](../README.md) / SvgKenImageAttributes

# Interface: SvgKenImageAttributes

An image with a Ken Burns effect, i.e. slowly zooming in on the image.

SVG: `image`

**`example`**
```
<image href="image.jpg" preserveAspectRatio="xMidYMid slice" data-from="2020 1 keepzoom" data-to="2020 10 keepzoom" data-zoom="40 50" />
```

## Hierarchy

- [`SvgAbstractTimedDrawableAttributes`](SvgAbstractTimedDrawableAttributes.md)

  ↳ **`SvgKenImageAttributes`**

## Table of contents

### Properties

- [from](SvgKenImageAttributes.md#from)
- [name](SvgKenImageAttributes.md#name)
- [to](SvgKenImageAttributes.md#to)
- [zoom](SvgKenImageAttributes.md#zoom)

## Properties

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

### name

• **name**: `string`

The name. In certain circumstances, this will be used a grouping identifier.

SVG: `name`, the standard SVG name attribute

#### Inherited from

[SvgAbstractTimedDrawableAttributes](SvgAbstractTimedDrawableAttributes.md).[name](SvgAbstractTimedDrawableAttributes.md#name)

#### Defined in

[svg/SvgApi.ts:16](https://github.com/traines-source/transport-network-animator/blob/master/src/svg/SvgApi.ts#L16)

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

___

### zoom

• **zoom**: [`Vector`](../classes/Vector.md)

The center of where to zoom to, e.g. `60 50`.
This influences both the direction of the zoom and how far to zoom in.
The zoom factor will be kept as low as possible while ensuring that the image is covering the entire screen canvas at all times.

Required.

SVG: `data-zoom`

#### Defined in

[svg/SvgApi.ts:69](https://github.com/traines-source/transport-network-animator/blob/master/src/svg/SvgApi.ts#L69)
