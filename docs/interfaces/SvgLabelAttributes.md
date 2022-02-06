[transport-network-animator](../README.md) / SvgLabelAttributes

# Interface: SvgLabelAttributes

A Label for a Station or a Line.

SVG: `text`

**`example`**
```
<text data-station="Dublin">Dublin</text>
```

## Hierarchy

- [`SvgAbstractTimedDrawableAttributes`](SvgAbstractTimedDrawableAttributes.md)

  ↳ **`SvgLabelAttributes`**

## Table of contents

### Properties

- [forLine](SvgLabelAttributes.md#forline)
- [forStation](SvgLabelAttributes.md#forstation)
- [from](SvgLabelAttributes.md#from)
- [name](SvgLabelAttributes.md#name)
- [to](SvgLabelAttributes.md#to)

## Properties

### forLine

• **forLine**: `undefined` \| `string`

If the Label should be for a Line, the name of the Line defined elsewhere in the SVG ([SvgLineAttributes.name](SvgLineAttributes.md#name)).
The Label will appear at all termini Stations of the Line. One of forStation or forLine is required.

SVG: `data-line`

#### Defined in

svg/SvgApi.ts:112

___

### forStation

• **forStation**: `undefined` \| `string`

If the Label should be for a Station, the identifier of the Station defined elsewhere in the SVG ([SvgStationAttributes.id](SvgStationAttributes.md#id)).
One of forStation or forLine is required.

SVG: `data-station`

#### Defined in

svg/SvgApi.ts:104

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
