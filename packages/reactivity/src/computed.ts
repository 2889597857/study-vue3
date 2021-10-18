import { isFunction } from '@vue/shared'
import { effect } from './effect'

export function computed(getterOrOptions: any) {
	let getter
	let setter
	if (isFunction(getterOrOptions)) {
		// 函数
		// 只能获取值
		getter = getterOrOptions
		setter = () => {
			console.warn('Write operation failed: computed value is readonly')
		}
	} else {
		// 对象
		getter = getterOrOptions.get
		setter = getterOrOptions.set
	}

	const cRef = new ComputedRefImpl(getter, setter)
	return cRef
}

class ComputedRefImpl {
	public dirty = true
	public _value: any
	public _is_Ref = true
	public effect: any
	constructor(getter: any, public setter: any) {
		this.effect = effect(getter, {
			lazy: true,
			sch: () => {
				if (!this.dirty) this.dirty = true
			},
		})
	}
	get value() {
		if (this.dirty) {
			this._value = this.effect()
			this.dirty = false
		}
		return this._value
	}
	set value(newValue) {
		this.setter(newValue)
	}
}
