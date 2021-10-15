import { hasChanged, isArray, isObject } from '@vue/shared'
import { reactive } from '.'
import { track, trigger } from './effect'
import { TrackOpTypes, TriggerOpTypes } from './operations'

export function ref(value: any) {
	return new RefImpl(value)
}
export function shallowRef(value: any) {
	return new RefImpl(value, true)
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
