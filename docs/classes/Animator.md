[transport-network-animator](../README.md) / Animator

# Class: Animator

## Hierarchy

- **`Animator`**

  ↳ [`SvgAnimator`](SvgAnimator.md)

## Table of contents

### Constructors

- [constructor](Animator.md#constructor)

### Properties

- [EASE\_CUBIC](Animator.md#ease_cubic)
- [EASE\_NONE](Animator.md#ease_none)
- [EASE\_SINE](Animator.md#ease_sine)

### Methods

- [animate](Animator.md#animate)
- [ease](Animator.md#ease)
- [from](Animator.md#from)
- [now](Animator.md#now)
- [requestFrame](Animator.md#requestframe)
- [timePassed](Animator.md#timepassed)
- [timeout](Animator.md#timeout)
- [to](Animator.md#to)
- [wait](Animator.md#wait)

## Constructors

### constructor

• **new Animator**()

#### Defined in

[Animator.ts:16](https://github.com/traines-source/transport-network-animator/blob/eb636e3/src/Animator.ts#L16)

## Properties

### EASE\_CUBIC

▪ `Static` **EASE\_CUBIC**: (`x`: `number`) => `number`

#### Type declaration

▸ (`x`): `number`

##### Parameters

| Name | Type |
| :------ | :------ |
| `x` | `number` |

##### Returns

`number`

#### Defined in

[Animator.ts:4](https://github.com/traines-source/transport-network-animator/blob/eb636e3/src/Animator.ts#L4)

___

### EASE\_NONE

▪ `Static` **EASE\_NONE**: (`x`: `number`) => `number`

#### Type declaration

▸ (`x`): `number`

##### Parameters

| Name | Type |
| :------ | :------ |
| `x` | `number` |

##### Returns

`number`

#### Defined in

[Animator.ts:3](https://github.com/traines-source/transport-network-animator/blob/eb636e3/src/Animator.ts#L3)

___

### EASE\_SINE

▪ `Static` **EASE\_SINE**: (`x`: `number`) => `number`

#### Type declaration

▸ (`x`): `number`

##### Parameters

| Name | Type |
| :------ | :------ |
| `x` | `number` |

##### Returns

`number`

#### Defined in

[Animator.ts:5](https://github.com/traines-source/transport-network-animator/blob/eb636e3/src/Animator.ts#L5)

## Methods

### animate

▸ **animate**(`durationMilliseconds`, `callback`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `durationMilliseconds` | `number` |
| `callback` | (`x`: `number`, `isLast`: `boolean`) => `boolean` |

#### Returns

`void`

#### Defined in

[Animator.ts:47](https://github.com/traines-source/transport-network-animator/blob/eb636e3/src/Animator.ts#L47)

___

### ease

▸ **ease**(`ease`): [`Animator`](Animator.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `ease` | (`x`: `number`) => `number` |

#### Returns

[`Animator`](Animator.md)

#### Defined in

[Animator.ts:34](https://github.com/traines-source/transport-network-animator/blob/eb636e3/src/Animator.ts#L34)

___

### from

▸ **from**(`from`): [`Animator`](Animator.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `from` | `number` |

#### Returns

[`Animator`](Animator.md)

#### Defined in

[Animator.ts:19](https://github.com/traines-source/transport-network-animator/blob/eb636e3/src/Animator.ts#L19)

___

### now

▸ `Protected` `Abstract` **now**(): `number`

#### Returns

`number`

#### Defined in

[Animator.ts:70](https://github.com/traines-source/transport-network-animator/blob/eb636e3/src/Animator.ts#L70)

___

### requestFrame

▸ `Protected` `Abstract` **requestFrame**(`callback`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `callback` | () => `void` |

#### Returns

`void`

#### Defined in

[Animator.ts:74](https://github.com/traines-source/transport-network-animator/blob/eb636e3/src/Animator.ts#L74)

___

### timePassed

▸ **timePassed**(`timePassed`): [`Animator`](Animator.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `timePassed` | `number` |

#### Returns

[`Animator`](Animator.md)

#### Defined in

[Animator.ts:29](https://github.com/traines-source/transport-network-animator/blob/eb636e3/src/Animator.ts#L29)

___

### timeout

▸ `Protected` `Abstract` **timeout**(`callback`, `delayMilliseconds`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `callback` | () => `void` |
| `delayMilliseconds` | `number` |

#### Returns

`void`

#### Defined in

[Animator.ts:72](https://github.com/traines-source/transport-network-animator/blob/eb636e3/src/Animator.ts#L72)

___

### to

▸ **to**(`to`): [`Animator`](Animator.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `to` | `number` |

#### Returns

[`Animator`](Animator.md)

#### Defined in

[Animator.ts:24](https://github.com/traines-source/transport-network-animator/blob/eb636e3/src/Animator.ts#L24)

___

### wait

▸ **wait**(`delayMilliseconds`, `callback`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `delayMilliseconds` | `number` |
| `callback` | () => `void` |

#### Returns

`void`

#### Defined in

[Animator.ts:39](https://github.com/traines-source/transport-network-animator/blob/eb636e3/src/Animator.ts#L39)
