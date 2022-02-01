[transport-network-animator](../README.md) / SvgAnimator

# Class: SvgAnimator

## Hierarchy

- `Animator`

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

Animator.constructor

#### Defined in

[svg/SvgAnimator.ts:5](https://github.com/traines-source/transport-network-animator/blob/master/src/svg/SvgAnimator.ts#L5)

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

Animator.EASE\_CUBIC

#### Defined in

[Animator.ts:4](https://github.com/traines-source/transport-network-animator/blob/master/src/Animator.ts#L4)

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

Animator.EASE\_NONE

#### Defined in

[Animator.ts:3](https://github.com/traines-source/transport-network-animator/blob/master/src/Animator.ts#L3)

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

Animator.EASE\_SINE

#### Defined in

[Animator.ts:5](https://github.com/traines-source/transport-network-animator/blob/master/src/Animator.ts#L5)

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

Animator.animate

#### Defined in

[Animator.ts:47](https://github.com/traines-source/transport-network-animator/blob/master/src/Animator.ts#L47)

___

### ease

▸ **ease**(`ease`): `Animator`

#### Parameters

| Name | Type |
| :------ | :------ |
| `ease` | (`x`: `number`) => `number` |

#### Returns

`Animator`

#### Inherited from

Animator.ease

#### Defined in

[Animator.ts:34](https://github.com/traines-source/transport-network-animator/blob/master/src/Animator.ts#L34)

___

### from

▸ **from**(`from`): `Animator`

#### Parameters

| Name | Type |
| :------ | :------ |
| `from` | `number` |

#### Returns

`Animator`

#### Inherited from

Animator.from

#### Defined in

[Animator.ts:19](https://github.com/traines-source/transport-network-animator/blob/master/src/Animator.ts#L19)

___

### now

▸ `Protected` **now**(): `number`

#### Returns

`number`

#### Overrides

Animator.now

#### Defined in

[svg/SvgAnimator.ts:9](https://github.com/traines-source/transport-network-animator/blob/master/src/svg/SvgAnimator.ts#L9)

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

Animator.requestFrame

#### Defined in

[svg/SvgAnimator.ts:17](https://github.com/traines-source/transport-network-animator/blob/master/src/svg/SvgAnimator.ts#L17)

___

### timePassed

▸ **timePassed**(`timePassed`): `Animator`

#### Parameters

| Name | Type |
| :------ | :------ |
| `timePassed` | `number` |

#### Returns

`Animator`

#### Inherited from

Animator.timePassed

#### Defined in

[Animator.ts:29](https://github.com/traines-source/transport-network-animator/blob/master/src/Animator.ts#L29)

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

Animator.timeout

#### Defined in

[svg/SvgAnimator.ts:13](https://github.com/traines-source/transport-network-animator/blob/master/src/svg/SvgAnimator.ts#L13)

___

### to

▸ **to**(`to`): `Animator`

#### Parameters

| Name | Type |
| :------ | :------ |
| `to` | `number` |

#### Returns

`Animator`

#### Inherited from

Animator.to

#### Defined in

[Animator.ts:24](https://github.com/traines-source/transport-network-animator/blob/master/src/Animator.ts#L24)

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

Animator.wait

#### Defined in

[Animator.ts:39](https://github.com/traines-source/transport-network-animator/blob/master/src/Animator.ts#L39)
