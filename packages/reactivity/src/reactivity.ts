import { isObject } from '@vue/shared'

import {
	reactiveHandler,
	shallowReactiveHandler,
	readonlyHandler,
	shallowReadonlyHandler,
} from './baseHandler'

const reactiveMap = new WeakMap()
const readonlyMap = new WeakMap()

export function reactive(target: unknown) {
	return createReactiveObject(target, false, reactiveHandler)
}
export function shallowReactive(target: unknown) {
	return createReactiveObject(target, false, shallowReactiveHandler)
}
export function readonly(target: unknown) {
	return createReactiveObject(target, true, readonlyHandler)
}
export function shallowReadonly(target: unknown) {
	return createReactiveObject(target, true, shallowReadonlyHandler)
}

/**
 *
 * @param target 创建代理对象
 * @param isReadonly 对象是否可读
 * @param baseHandler 创建代理方式
 */
function createReactiveObject(target: any, isReadonly: boolean, baseHandler: any) {
	if (!isObject(target)) return target

	const proxyMap = isReadonly ? readonlyMap : reactiveMap
	const proxyEs = proxyMap.get(target)

	if (proxyEs) return proxyEs

	const proxy = new Proxy(target, baseHandler)
	proxyMap.set(target, proxy)
	return proxy
}

export default {
	reactive,
	shallowReactive,
	readonly,
	shallowReadonly,
}
