[transport-network-animator](../README.md) / Vector

# Class: Vector

## Table of contents

### Constructors

- [constructor](Vector.md#constructor)

### Properties

- [NULL](Vector.md#null)
- [UNIT](Vector.md#unit)

### Accessors

- [length](Vector.md#length)
- [x](Vector.md#x)
- [y](Vector.md#y)

### Methods

- [add](Vector.md#add)
- [angle](Vector.md#angle)
- [between](Vector.md#between)
- [bothAxisMaxs](Vector.md#bothaxismaxs)
- [bothAxisMins](Vector.md#bothaxismins)
- [delta](Vector.md#delta)
- [dotProduct](Vector.md#dotproduct)
- [equals](Vector.md#equals)
- [inclination](Vector.md#inclination)
- [isDeltaMatchingParallel](Vector.md#isdeltamatchingparallel)
- [rotate](Vector.md#rotate)
- [round](Vector.md#round)
- [scale](Vector.md#scale)
- [signedLengthProjectedAt](Vector.md#signedlengthprojectedat)
- [solveDeltaForIntersection](Vector.md#solvedeltaforintersection)
- [withLength](Vector.md#withlength)
- [fromArray](Vector.md#fromarray)

## Constructors

### constructor

• **new Vector**(`_x`, `_y`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `_x` | `number` |
| `_y` | `number` |

#### Defined in

[Vector.ts:8](https://github.com/traines-source/transport-network-animator/blob/master/src/Vector.ts#L8)

## Properties

### NULL

▪ `Static` **NULL**: [`Vector`](Vector.md)

#### Defined in

[Vector.ts:6](https://github.com/traines-source/transport-network-animator/blob/master/src/Vector.ts#L6)

___

### UNIT

▪ `Static` **UNIT**: [`Vector`](Vector.md)

#### Defined in

[Vector.ts:5](https://github.com/traines-source/transport-network-animator/blob/master/src/Vector.ts#L5)

## Accessors

### length

• `get` **length**(): `number`

#### Returns

`number`

#### Defined in

[Vector.ts:24](https://github.com/traines-source/transport-network-animator/blob/master/src/Vector.ts#L24)

___

### x

• `get` **x**(): `number`

#### Returns

`number`

#### Defined in

[Vector.ts:16](https://github.com/traines-source/transport-network-animator/blob/master/src/Vector.ts#L16)

___

### y

• `get` **y**(): `number`

#### Returns

`number`

#### Defined in

[Vector.ts:20](https://github.com/traines-source/transport-network-animator/blob/master/src/Vector.ts#L20)

## Methods

### add

▸ **add**(`that`): [`Vector`](Vector.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `that` | [`Vector`](Vector.md) |

#### Returns

[`Vector`](Vector.md)

#### Defined in

[Vector.ts:38](https://github.com/traines-source/transport-network-animator/blob/master/src/Vector.ts#L38)

___

### angle

▸ **angle**(`other`): [`Rotation`](Rotation.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `other` | [`Vector`](Vector.md) |

#### Returns

[`Rotation`](Rotation.md)

#### Defined in

[Vector.ts:88](https://github.com/traines-source/transport-network-animator/blob/master/src/Vector.ts#L88)

___

### between

▸ **between**(`other`, `x`): [`Vector`](Vector.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `other` | [`Vector`](Vector.md) |
| `x` | `number` |

#### Returns

[`Vector`](Vector.md)

#### Defined in

[Vector.ts:108](https://github.com/traines-source/transport-network-animator/blob/master/src/Vector.ts#L108)

___

### bothAxisMaxs

▸ **bothAxisMaxs**(`other`): [`Vector`](Vector.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `other` | [`Vector`](Vector.md) |

#### Returns

[`Vector`](Vector.md)

#### Defined in

[Vector.ts:100](https://github.com/traines-source/transport-network-animator/blob/master/src/Vector.ts#L100)

___

### bothAxisMins

▸ **bothAxisMins**(`other`): [`Vector`](Vector.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `other` | [`Vector`](Vector.md) |

#### Returns

[`Vector`](Vector.md)

#### Defined in

[Vector.ts:92](https://github.com/traines-source/transport-network-animator/blob/master/src/Vector.ts#L92)

___

### delta

▸ **delta**(`that`): [`Vector`](Vector.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `that` | [`Vector`](Vector.md) |

#### Returns

[`Vector`](Vector.md)

#### Defined in

[Vector.ts:46](https://github.com/traines-source/transport-network-animator/blob/master/src/Vector.ts#L46)

___

### dotProduct

▸ **dotProduct**(`that`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `that` | [`Vector`](Vector.md) |

#### Returns

`number`

#### Defined in

[Vector.ts:55](https://github.com/traines-source/transport-network-animator/blob/master/src/Vector.ts#L55)

___

### equals

▸ **equals**(`other`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `other` | [`Vector`](Vector.md) |

#### Returns

`boolean`

#### Defined in

[Vector.ts:113](https://github.com/traines-source/transport-network-animator/blob/master/src/Vector.ts#L113)

___

### inclination

▸ **inclination**(): [`Rotation`](Rotation.md)

#### Returns

[`Rotation`](Rotation.md)

#### Defined in

[Vector.ts:79](https://github.com/traines-source/transport-network-animator/blob/master/src/Vector.ts#L79)

___

### isDeltaMatchingParallel

▸ **isDeltaMatchingParallel**(`dir1`, `dir2`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `dir1` | [`Vector`](Vector.md) |
| `dir2` | [`Vector`](Vector.md) |

#### Returns

`boolean`

#### Defined in

[Vector.ts:73](https://github.com/traines-source/transport-network-animator/blob/master/src/Vector.ts#L73)

___

### rotate

▸ **rotate**(`theta`): [`Vector`](Vector.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `theta` | [`Rotation`](Rotation.md) |

#### Returns

[`Vector`](Vector.md)

#### Defined in

[Vector.ts:50](https://github.com/traines-source/transport-network-animator/blob/master/src/Vector.ts#L50)

___

### round

▸ **round**(`decimals`): [`Vector`](Vector.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `decimals` | `number` |

#### Returns

[`Vector`](Vector.md)

#### Defined in

[Vector.ts:117](https://github.com/traines-source/transport-network-animator/blob/master/src/Vector.ts#L117)

___

### scale

▸ **scale**(`factor`): [`Vector`](Vector.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `factor` | `number` |

#### Returns

[`Vector`](Vector.md)

#### Defined in

[Vector.ts:42](https://github.com/traines-source/transport-network-animator/blob/master/src/Vector.ts#L42)

___

### signedLengthProjectedAt

▸ **signedLengthProjectedAt**(`direction`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `direction` | [`Rotation`](Rotation.md) |

#### Returns

`number`

#### Defined in

[Vector.ts:33](https://github.com/traines-source/transport-network-animator/blob/master/src/Vector.ts#L33)

___

### solveDeltaForIntersection

▸ **solveDeltaForIntersection**(`dir1`, `dir2`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `dir1` | [`Vector`](Vector.md) |
| `dir2` | [`Vector`](Vector.md) |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `a` | `number` |
| `b` | `number` |

#### Defined in

[Vector.ts:59](https://github.com/traines-source/transport-network-animator/blob/master/src/Vector.ts#L59)

___

### withLength

▸ **withLength**(`length`): [`Vector`](Vector.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `length` | `number` |

#### Returns

[`Vector`](Vector.md)

#### Defined in

[Vector.ts:28](https://github.com/traines-source/transport-network-animator/blob/master/src/Vector.ts#L28)

___

### fromArray

▸ `Static` **fromArray**(`arr`): [`Vector`](Vector.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `arr` | `number`[] |

#### Returns

[`Vector`](Vector.md)

#### Defined in

[Vector.ts:12](https://github.com/traines-source/transport-network-animator/blob/master/src/Vector.ts#L12)
