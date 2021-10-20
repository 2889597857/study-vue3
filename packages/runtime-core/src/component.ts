import { isFunction, isObject, ShapeFlags } from '@vue/shared'
import { PublicInstanceProxyHandlers } from './componentPublicInstance'
let uid$1 = 0
export const createComponentInstance = (vnode: any) => {
	const instance = {
		uid: uid$1++,
		vnode,
		type: vnode.type,
		props: {},
		attrs: {},
		setupState: {}, // setup 返回值
		ctx: {},
		render: null,
		data: { value: '兼容vue2' },
		proxy: {},
		isMounted: false,
	}
	instance.ctx = { _: instance }
	return instance
}
export const setupComponent = (instance: any) => {
	const { props, children } = instance.vnode

	instance.props = props
	instance.children = children

	const shapeFlag = instance.vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT
	if (shapeFlag) {
		// 有状态的组件
		setupStatefulComponent(instance)
	}
}

export const setupStatefulComponent = (instance: any) => {
	instance.proxy = new Proxy(instance.ctx, PublicInstanceProxyHandlers as any)
	const Component = instance.type
	const { setup } = Component
	if (setup) {
		const setupContext = createContext(instance)
		const setupResult = setup(instance.props, setupContext)
		handleSetupResult(instance, setupResult)
	} else {
		finishComponentSetup(instance)
	}

	Component.render(instance.proxy)
}
export function handleSetupResult(instance: any, setupResult: unknown) {
	if (isFunction(setupResult)) {
		instance.render = setupResult
	} else if (isObject(setupResult)) {
		instance.setupState = setupResult
	}
	finishComponentSetup(instance)
}
export const finishComponentSetup = (instance: any) => {
	const Component = instance.type
	// template / render function normalization
	console.log(instance.render)

	if (!instance.render) {
		// could be set from setup()
		if (!Component.render) {
			const template = Component.template
			if (template) {
			}
		}
		instance.render = Component.render
	}

	// warn missing template/render
	// the runtime compilation of template in SSR is done by server-render
	// if (!Component.render && instance.render === NOOP && !isSSR) {
	// 	/* istanbul ignore if */
	// 	if (!compile && Component.template) {
	// 		warn$1(
	// 			`Component provided template option but ` +
	// 				`runtime compilation is not supported in this build of Vue.` +
	// 				` Use "vue.esm-browser.js" instead.` /* should not happen */
	// 		)
	// 	} else {
	// 		warn$1(`Component is missing template or render function.`)
	// 	}
	// }
}
const createContext = (instance: any) => {
	return {
		arrts: instance.arrts,
		slots: instance.slots,
		emit: () => {},
		expose: () => {},
	}
}

export const setupRenderEffect = () => {}
