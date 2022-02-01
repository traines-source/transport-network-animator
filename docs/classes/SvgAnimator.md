[transport-network-animator](../README.md) / SvgAnimator

# Class: SvgAnimator

## Hierarchy

- [`Animator`](Animator.md)

  ↳ **`SvgAnimator`**

## Table of contents

### Constructors

- [constructor](SvgAnimator.md#constructor)

### Properties

- [EASE\_CUBIC](SvgAnimator.md#ease_cubic)
- [EASE\_NONE](SvgAnimator.md#ease_none)
- [EASE\_SINE](SvgAnimator.md#ease_sine)

### Methods

- [animate](SvgAnimator.md#animate)
- [ease](SvgAnimator.md#ease)
- [from](SvgAnimator.md#from)
- [now](SvgAnimator.md#now)
- [requestFrame](SvgAnimator.md#requestframe)
- [timePassed](SvgAnimator.md#timepassed)
- [timeout](SvgAnimator.md#timeout)
- [to](SvgAnimator.md#to)
- [wait](SvgAnimator.md#wait)

## Constructors

### constructor

• **new SvgAnimator**()

#### Overrides

[Animator](Animator.md).[constructor](Animator.md#constructor)

#### Defined in

[svg/SvgAnimator.ts:5](https://github.com/traines-source/transport-network-animator/blob/eb636e3/src/svg/SvgAnimator.ts#L5)

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

#### Inherited from

[Animator](Animator.md).[EASE_CUBIC](Animator.md#ease_cubic)

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

#### Inherited from

[Animator](Animator.md).[EASE_NONE](Animator.md#ease_none)

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

#### Inherited from

[Animator](Animator.md).[EASE_SINE](Animator.md#ease_sine)

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

#### Inherited from

[Animator](Animator.md).[animate](Animator.md#animate)

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

#### Inherited from

[Animator](Animator.md).[ease](Animator.md#ease)

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

#### Inherited from

[Animator](Animator.md).[from](Animator.md#from)

#### Defined in

[Animator.ts:19](https://github.com/traines-source/transport-network-animator/blob/eb636e3/src/Animator.ts#L19)

___

### now

▸ `Protected` **now**(): `number`

#### Returns

`number`

#### Overrides

[Animator](Animator.md).[now](Animator.md#now)

#### Defined in

[svg/SvgAnimator.ts:9](https://github.com/traines-source/transport-network-animator/blob/eb636e3/src/svg/SvgAnimator.ts#L9)

___

### requestFrame

▸ `Protected` **requestFrame**(`callback`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `callback` | () => `void` |

#### Returns

`void`

#### Overrides

[Animator](Animator.md).[requestFrame](Animator.md#requestframe)

#### Defined in

[svg/SvgAnimator.ts:17](https://github.com/traines-source/transport-network-animator/blob/eb636e3/src/svg/SvgAnimator.ts#L17)

___

### timePassed

▸ **timePassed**(`timePassed`): [`Animator`](Animator.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `timePassed` | `number` |

#### Returns

[`Animator`](Animator.md)

#### Inherited from

[Animator](Animator.md).[timePassed](Animator.md#timepassed)

#### Defined in

[Animator.ts:29](https://github.com/traines-source/transport-network-animator/blob/eb636e3/src/Animator.ts#L29)

___

### timeout

▸ `Protected` **timeout**(`callback`, `delayMilliseconds`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `callback` | () => `void` |
| `delayMilliseconds` | `number` |

#### Returns

`void`

#### Overrides

[Animator](Animator.md).[timeout](Animator.md#timeout)

#### Defined in

[svg/SvgAnimator.ts:13](https://github.com/traines-source/transport-network-animator/blob/eb636e3/src/svg/SvgAnimator.ts#L13)

___

### to

▸ **to**(`to`): [`Animator`](Animator.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `to` | `number` |

#### Returns

[`Animator`](Animator.md)

#### Inherited from

[Animator](Animator.md).[to](Animator.md#to)

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

#### Inherited from

[Animator](Animator.md).[wait](Animator.md#wait)

#### Defined in

[Animator.ts:39](https://github.com/traines-source/transport-network-animator/blob/eb636e3/src/Animator.ts#L39)
