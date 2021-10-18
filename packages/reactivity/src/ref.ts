import { hasChanged, hasOwn, isArray, isObject } from '@vue/shared'
import { reactive } from '.'
import { track, trigger } from './effect'
import { TrackOpTypes, TriggerOpTypes } from './operations'

export function ref(value: any) {
	return new RefImpl(value)
}
export function shallowRef(value: any) {
	return new RefImpl(value, true)
}
export function toRef(target: any, key: string) {
	hasOwn(target, key)
	return new ObjectRefImpl(target, key)
}
export function toRefs(object: object) {
	let ret = isArray(object) ? new Array(object.length) : {}
	for (let key in object) {
		ret[key] = toRef(object, key)
	}
	return ret
}

const convert = (value: unknown) => (isObject(value) ? reactive(value) : value)

class RefImpl {
	public _value: any
	public _is_Ref = true
	constructor(public rawValue: any, public shallow: boolean = false) {
		this._value = shallow ? rawValue : convert(rawValue)
	}
	get value() {
		track(this, TrackOpTypes.GET, 'value')
		return this._value
	}
	set value(newValue) {
		if (hasChanged(newValue, this.rawValue)) {
			trigger(this, TriggerOpTypes.SET, 'value', newValue, this.rawValue)
			this.rawValue = newValue
			this._value = newValue
		}
	}
}
class ObjectRefImpl {
	public is_Ref = true
	constructor(public target: any, public key: string) {}
	get value() {
		return this.target[this.key]
	}
	set value(newValue) {
		this.target[this.key] = newValue
	}
}
