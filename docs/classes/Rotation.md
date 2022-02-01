[transport-network-animator](../README.md) / Rotation

# Class: Rotation

## Table of contents

### Constructors

- [constructor](Rotation.md#constructor)

### Accessors

- [degrees](Rotation.md#degrees)
- [name](Rotation.md#name)
- [radians](Rotation.md#radians)

### Methods

- [add](Rotation.md#add)
- [delta](Rotation.md#delta)
- [halfDirection](Rotation.md#halfdirection)
- [isVertical](Rotation.md#isvertical)
- [nearestRoundedInDirection](Rotation.md#nearestroundedindirection)
- [normalize](Rotation.md#normalize)
- [quarterDirection](Rotation.md#quarterdirection)
- [from](Rotation.md#from)

## Constructors

### constructor

• **new Rotation**(`_degrees`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `_degrees` | `number` |

#### Defined in

[Rotation.ts:6](https://github.com/traines-source/transport-network-animator/blob/eb636e3/src/Rotation.ts#L6)

## Accessors

### degrees

• `get` **degrees**(): `number`

#### Returns

`number`

#### Defined in

[Rotation.ts:23](https://github.com/traines-source/transport-network-animator/blob/eb636e3/src/Rotation.ts#L23)

___

### name

• `get` **name**(): `string`

#### Returns

`string`

#### Defined in

[Rotation.ts:14](https://github.com/traines-source/transport-network-animator/blob/eb636e3/src/Rotation.ts#L14)

___

### radians

• `get` **radians**(): `number`

#### Returns

`number`

#### Defined in

[Rotation.ts:27](https://github.com/traines-source/transport-network-animator/blob/eb636e3/src/Rotation.ts#L27)

## Methods

### add

▸ **add**(`that`): [`Rotation`](Rotation.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `that` | [`Rotation`](Rotation.md) |

#### Returns

[`Rotation`](Rotation.md)

#### Defined in

[Rotation.ts:31](https://github.com/traines-source/transport-network-animator/blob/eb636e3/src/Rotation.ts#L31)

___

### delta

▸ **delta**(`that`): [`Rotation`](Rotation.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `that` | [`Rotation`](Rotation.md) |

#### Returns

[`Rotation`](Rotation.md)

#### Defined in

[Rotation.ts:40](https://github.com/traines-source/transport-network-animator/blob/eb636e3/src/Rotation.ts#L40)

___

### halfDirection

▸ **halfDirection**(`relativeTo`, `splitAxis`): [`Rotation`](Rotation.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `relativeTo` | [`Rotation`](Rotation.md) |
| `splitAxis` | [`Rotation`](Rotation.md) |

#### Returns

[`Rotation`](Rotation.md)

#### Defined in

[Rotation.ts:75](https://github.com/traines-source/transport-network-animator/blob/eb636e3/src/Rotation.ts#L75)

___

### isVertical

▸ **isVertical**(): `boolean`

#### Returns

`boolean`

#### Defined in

[Rotation.ts:65](https://github.com/traines-source/transport-network-animator/blob/eb636e3/src/Rotation.ts#L65)

___

### nearestRoundedInDirection

▸ **nearestRoundedInDirection**(`relativeTo`, `direction`): [`Rotation`](Rotation.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `relativeTo` | [`Rotation`](Rotation.md) |
| `direction` | `number` |

#### Returns

[`Rotation`](Rotation.md)

#### Defined in

[Rotation.ts:92](https://github.com/traines-source/transport-network-animator/blob/eb636e3/src/Rotation.ts#L92)

___

### normalize

▸ **normalize**(): [`Rotation`](Rotation.md)

#### Returns

[`Rotation`](Rotation.md)

#### Defined in

[Rotation.ts:54](https://github.com/traines-source/transport-network-animator/blob/eb636e3/src/Rotation.ts#L54)

___

### quarterDirection

▸ **quarterDirection**(`relativeTo`): [`Rotation`](Rotation.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `relativeTo` | [`Rotation`](Rotation.md) |

#### Returns

[`Rotation`](Rotation.md)

#### Defined in

[Rotation.ts:69](https://github.com/traines-source/transport-network-animator/blob/eb636e3/src/Rotation.ts#L69)

___

### from

▸ `Static` **from**(`direction`): [`Rotation`](Rotation.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `direction` | `string` |

#### Returns

[`Rotation`](Rotation.md)

#### Defined in

[Rotation.ts:10](https://github.com/traines-source/transport-network-animator/blob/eb636e3/src/Rotation.ts#L10)
