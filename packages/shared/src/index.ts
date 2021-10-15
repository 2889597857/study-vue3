export const isObject = (val: unknown) => val !== null && typeof val === 'object'
export const isArray = Array.isArray
export const isFunction = (val: unknown): val is Function => typeof val === 'function'
export const isString = (val: unknown): val is string => typeof val === 'string'
export const isIntegerKey = (key: unknown) =>
	isString(key) && key !== 'NaN' && key[0] !== '-' && '' + parseInt(key, 10) === key

const hasOwnProperty = Object.prototype.hasOwnProperty
export const hasOwn = (val: object, key: string | symbol): key is keyof typeof val =>
	hasOwnProperty.call(val, key)
export const hasChanged = (oldValue: any, value: any) => value !== oldValue
