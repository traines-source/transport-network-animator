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

[Projection.ts:11](https://github.com/traines-source/transport-network-animator/blob/master/src/Projection.ts#L11)

## Properties

### projections

▪ `Static` **projections**: `Object`

The definitions of available projections, which can be added to.

#### Index signature

▪ [name: `string`]: (`lonlat`: [`Vector`](Vector.md)) => [`Vector`](Vector.md)

#### Defined in

[Projection.ts:27](https://github.com/traines-source/transport-network-animator/blob/master/src/Projection.ts#L27)

## Accessors

### default

• `Static` `get` **default**(): [`Projection`](Projection.md)

The default projection as set by [Config.mapProjection](Config.md#mapprojection)

#### Returns

[`Projection`](Projection.md)

#### Defined in

[Projection.ts:20](https://github.com/traines-source/transport-network-animator/blob/master/src/Projection.ts#L20)

## Methods

### project

▸ **project**(`coords`): [`Vector`](Vector.md)

Project the given coordinates to the target projection.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `coords` | [`Vector`](Vector.md) | The coords in WGS84 / EPSG:4326 |

#### Returns

[`Vector`](Vector.md)

#### Defined in

[Projection.ts:42](https://github.com/traines-source/transport-network-animator/blob/master/src/Projection.ts#L42)
