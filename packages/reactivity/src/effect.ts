import { isArray, isIntegerKey } from '@vue/shared'
import { TrackOpTypes, TriggerOpTypes } from './operations'

export function effect(fn: Function, options: any = {}) {
	const effect = createReactEffect(fn, options)
	if (!options.lazy) {
		effect()
	}
	return effect
}

let effectUid = 0 // effect 全局标识
let activeEffect: any // 当前的 effect
const effectStack: Function[] = []

function createReactEffect(fn: Function, options: any = {}) {
	const effect = function reactiveEffect() {
		// 判断当前 effect 是否已经在栈里面
		if (!effectStack.includes(effect)) {
			try {
				effectStack.push(effect)
				activeEffect = effect
				return fn()
			} finally {
				effectStack.pop()
				activeEffect = effectStack[effectStack.length - 1]
			}
		}
	}
	effect.id = effectUid++ // effect 标识，用于区分 不同的effect
	effect.__isEffect = true // effect 是否是响应式effect
	effect.raw = fn // 原始函数
	effect.options = options // 用户配置
	return effect
}

const targetMap = new WeakMap()

// {name:'zs'} => name => [effect effect]
// weakMap key {name:'zs'} value map => {name=>set }

export function track(target: any, type: TrackOpTypes, key: any) {
	// 属性没有在 effect 使用
	if (activeEffect === undefined) return

	let depMap = targetMap.get(target)
	if (!depMap) targetMap.set(target, (depMap = new Map()))
	let dep = depMap.get(key)
	if (!dep) depMap.set(key, (dep = new Set()))
	if (!dep.has(activeEffect)) dep.add(activeEffect)
}
export function trigger(
	target: any,
	type: TriggerOpTypes,
	key?: any,
	newValue?: any,
	oldValue?: any
) {
	const depsMap = targetMap.get(target)

	if (!depsMap) return
	// 储存所有要执行的 effect，一起执行
	const effects = new Set()
	console.log(target, key, newValue, oldValue)
	const add = (effectToAdd: any) => {
		if (effectToAdd) {
			effectToAdd.forEach((effect: unknown) => {
				effects.add(effect)
			})
		}
	}
	// 修改的是否是数组长度
	if (key === 'length' && isArray(target)) {
		depsMap.forEach((dep: any, key: string | number) => {
			if (key === 'length' || key > newValue) {
				add(dep)
			}
		})
	} else {
		// 对象
		if (key != undefined) {
			// 修改值
			add(depsMap.get(key))
		}

		switch (type) {
			case TriggerOpTypes.ADD:
				if (isArray(target) && isIntegerKey(key)) {
					add(depsMap.get('length'))
				}
		}
	}

	effects.forEach((effect: any) => effect())
}
