[transport-network-animator](../README.md) / SvgAbstractTimedDrawableAttributes

# Interface: SvgAbstractTimedDrawableAttributes

There is no need to access this interfaces and its child interfaces and classes directly.
The attributes documented here should be used in the SVG code as attributes to the respective SVG element tags, while converting the attribute name from `camelCase` to `data-kebap-case`.

## Hierarchy

- **`SvgAbstractTimedDrawableAttributes`**

  ↳ [`SvgKenImageAttributes`](SvgKenImageAttributes.md)

  ↳ [`SvgCrumpledImageAttributes`](SvgCrumpledImageAttributes.md)

  ↳ [`SvgLabelAttributes`](SvgLabelAttributes.md)

  ↳ [`SvgLineAttributes`](SvgLineAttributes.md)

  ↳ [`SvgStationAttributes`](SvgStationAttributes.md)

  ↳ [`SvgTrainAttributes`](SvgTrainAttributes.md)

## Table of contents

### Properties

- [from](SvgAbstractTimedDrawableAttributes.md#from)
- [name](SvgAbstractTimedDrawableAttributes.md#name)
- [to](SvgAbstractTimedDrawableAttributes.md#to)

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

#### Defined in

[svg/SvgApi.ts:30](https://github.com/traines-source/transport-network-animator/blob/master/src/svg/SvgApi.ts#L30)

___

### name

• **name**: `string`

The name. In certain circumstances, this will be used a grouping identifier.

SVG: `name`, the standard SVG name attribute

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

#### Defined in

[svg/SvgApi.ts:44](https://github.com/traines-source/transport-network-animator/blob/master/src/svg/SvgApi.ts#L44)
