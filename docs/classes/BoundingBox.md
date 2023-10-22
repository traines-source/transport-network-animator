[transport-network-animator](../README.md) / BoundingBox

# Class: BoundingBox

## Table of contents

### Constructors

- [constructor](BoundingBox.md#constructor)

### Properties

- [br](BoundingBox.md#br)
- [tl](BoundingBox.md#tl)

### Accessors

- [dimensions](BoundingBox.md#dimensions)

### Methods

- [add](BoundingBox.md#add)
- [calculateBoundingBoxForZoom](BoundingBox.md#calculateboundingboxforzoom)
- [isNull](BoundingBox.md#isnull)
- [from](BoundingBox.md#from)

## Constructors

### constructor

• **new BoundingBox**(`tl`, `br`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `tl` | [`Vector`](Vector.md) |
| `br` | [`Vector`](Vector.md) |

#### Defined in

[BoundingBox.ts:4](https://github.com/traines-source/transport-network-animator/blob/master/src/BoundingBox.ts#L4)

## Properties

### br

• **br**: [`Vector`](Vector.md)

___

### tl

• **tl**: [`Vector`](Vector.md)

## Accessors

### dimensions

• `get` **dimensions**(): [`Vector`](Vector.md)

#### Returns

[`Vector`](Vector.md)

#### Defined in

[BoundingBox.ts:11](https://github.com/traines-source/transport-network-animator/blob/master/src/BoundingBox.ts#L11)

## Methods

### add

▸ **add**(...`coords`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `...coords` | [`Vector`](Vector.md)[] |

#### Returns

`void`

#### Defined in

[BoundingBox.ts:29](https://github.com/traines-source/transport-network-animator/blob/master/src/BoundingBox.ts#L29)

___

### calculateBoundingBoxForZoom

▸ **calculateBoundingBoxForZoom**(`percentX`, `percentY`): [`BoundingBox`](BoundingBox.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `percentX` | `number` |
| `percentY` | `number` |

#### Returns

[`BoundingBox`](BoundingBox.md)

#### Defined in

[BoundingBox.ts:18](https://github.com/traines-source/transport-network-animator/blob/master/src/BoundingBox.ts#L18)

___

### isNull

▸ **isNull**(): `boolean`

#### Returns

`boolean`

#### Defined in

[BoundingBox.ts:14](https://github.com/traines-source/transport-network-animator/blob/master/src/BoundingBox.ts#L14)

___

### from

▸ `Static` **from**(`tl_x`, `tl_y`, `br_x`, `br_y`): [`BoundingBox`](BoundingBox.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `tl_x` | `number` |
| `tl_y` | `number` |
| `br_x` | `number` |
| `br_y` | `number` |

#### Returns

[`BoundingBox`](BoundingBox.md)

#### Defined in

[BoundingBox.ts:7](https://github.com/traines-source/transport-network-animator/blob/master/src/BoundingBox.ts#L7)
