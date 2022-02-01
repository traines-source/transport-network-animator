[transport-network-animator](../README.md) / Projection

# Class: Projection

## Table of contents

### Constructors

- [constructor](Projection.md#constructor)

### Properties

- [projections](Projection.md#projections)

### Accessors

- [default](Projection.md#default)

### Methods

- [project](Projection.md#project)

## Constructors

### constructor

• **new Projection**(`_projection`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `_projection` | `string` |

#### Defined in

[Projection.ts:11](https://github.com/traines-source/transport-network-animator/blob/eb636e3/src/Projection.ts#L11)

## Properties

### projections

▪ `Static` **projections**: `Object`

#### Index signature

▪ [name: `string`]: (`lonlat`: [`Vector`](Vector.md)) => [`Vector`](Vector.md)

#### Defined in

[Projection.ts:21](https://github.com/traines-source/transport-network-animator/blob/eb636e3/src/Projection.ts#L21)

## Accessors

### default

• `Static` `get` **default**(): [`Projection`](Projection.md)

#### Returns

[`Projection`](Projection.md)

#### Defined in

[Projection.ts:17](https://github.com/traines-source/transport-network-animator/blob/eb636e3/src/Projection.ts#L17)

## Methods

### project

▸ **project**(`c`): [`Vector`](Vector.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `c` | [`Vector`](Vector.md) |

#### Returns

[`Vector`](Vector.md)

#### Defined in

[Projection.ts:32](https://github.com/traines-source/transport-network-animator/blob/eb636e3/src/Projection.ts#L32)
