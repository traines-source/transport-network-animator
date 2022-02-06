[transport-network-animator](../README.md) / SvgCrumpledImageAttributes

# Interface: SvgCrumpledImageAttributes

A crumpled, i.e. distorted image, usually a background map, used in conjunction with the Gravitator.

SVG: `foreignObject`

**`example`**
```
<foreignObject x="500" y="400" width="8000" height="5000" data-crumpled-image="image.png" />
```

## Hierarchy

- [`SvgAbstractTimedDrawableAttributes`](SvgAbstractTimedDrawableAttributes.md)

  ↳ **`SvgCrumpledImageAttributes`**

## Table of contents

### Properties

- [crumpledImage](SvgCrumpledImageAttributes.md#crumpledimage)
- [from](SvgCrumpledImageAttributes.md#from)
- [name](SvgCrumpledImageAttributes.md#name)
- [to](SvgCrumpledImageAttributes.md#to)

## Properties

### crumpledImage

• **crumpledImage**: `string`

URL to an image to be used for crumpling.

Required.

SVG: `data-crumpled-image`

#### Defined in

svg/SvgApi.ts:84

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

svg/SvgApi.ts:28

___

### name

• **name**: `string`

The name. In certain circumstances, this will be used a grouping identifier.

SVG: `name`, the standard SVG name attribute

#### Inherited from

[SvgAbstractTimedDrawableAttributes](SvgAbstractTimedDrawableAttributes.md).[name](SvgAbstractTimedDrawableAttributes.md#name)

#### Defined in

svg/SvgApi.ts:16

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

svg/SvgApi.ts:40
