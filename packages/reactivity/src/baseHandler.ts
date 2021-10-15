import { hasChanged, hasOwn, isArray, isIntegerKey, isObject } from '@vue/shared'
import { readonly, reactive } from '@vue/reactivity'
import { track, trigger, effect } from './effect'
import { TrackOpTypes, TriggerOpTypes } from './operations'
/**
 * @param isReadonly 是否只读
 * @param shallow 是否浅代理
 * @returns get 函数
 */
function createGetter(isReadonly: boolean = false, shallow: boolean = false) {
	return function get(target: any, key: any, receiver: any) {
		const res = Reflect.get(target, key, receiver)
		// 不是只读
		if (!isReadonly) {
			// 收集依赖
			track(target, TrackOpTypes.GET, key)
		}
		// 懒代理
		if (shallow) return res

		// 递归 object array
		if (isObject(res)) return isReadonly ? readonly(res) : reactive(res)

		return res
	}
}

const get = createGetter()
const shallowGet = createGetter(false, true)
const readonlyGet = createGetter(true)
const shallowReadonlyGet = createGetter(true, true)
/**
 *
 * @param shallow 是否是浅的
 * @returns
 */
function createSetter(shallow: boolean = false) {
	return function set(target: any, key: any, value: any, receiver: any) {
		const oldValue = target[key]

		let hasKey =
			isArray(target) && isIntegerKey(key) ? Number(key) < target.length - 1 : hasOwn(target, key)

		const res = Reflect.set(target, key, value, receiver)

		if (!hasKey) {
			// 新增
			trigger(target, TriggerOpTypes.ADD, key, value)
		} else if (hasChanged(oldValue, value)) {
			// 修改
			trigger(target, TriggerOpTypes.SET, key, value, oldValue)
		}
		return res
	}
}
const set = createSetter()
const shallowSet = createSetter(true)

export const reactiveHandler = {
	get,
	set,
}
export const shallowReactiveHandler = {
	get: shallowGet,
	set: shallowSet,
}
export const readonlyHandler = {
	get: readonlyGet,
	set: () => console.error('只读'),
}
export const shallowReadonlyHandler = {
	get: shallowReadonlyGet,
	set: () => console.error('只读'),
}
