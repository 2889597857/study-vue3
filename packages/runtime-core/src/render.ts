import { effect } from '@vue/reactivity'
import { ShapeFlags } from '@vue/shared'
import { apiCreateApp } from './apiCreateApp'
import { createComponentInstance, setupComponent } from './component'

export function createRender(rendererOptions: any) {
	const {
		insert: hostInsert,
		remove: hostRemove,
		patchProp: hostPatchProp,
		createElement: hostCreateElement,
		createText: hostCreateText,
		createComment: hostCreateComment,
		setText: hostSetText,
		setElementText: hostSetElementText,
		parentNode: hostParentNode,
		nextSibling: hostNextSibling,
		setScopeId: hostSetScopeId,
		cloneNode: hostCloneNode,
		insertStaticContent: hostInsertStaticContent,
	} = rendererOptions

	const setupRenderEffect = (instance: any, container: any) => {
		effect(() => {
			if (!instance.isMounted) {
				const proxy = instance.proxy
				const subTree = instance.render.call(proxy, proxy)
				patch(null, subTree, container)
			}
		})
	}
	const mountComponent = (initialVnode: any, container: any) => {
		const instance = (initialVnode.component = createComponentInstance(initialVnode))
		setupComponent(instance)
		setupRenderEffect(instance, container)
	}

	const processComponent = (n1: any, n2: any, container: any) => {
		if (n1 == null) {
			// 加载
			mountComponent(n2, container)
		} else {
			// 更新
		}
	}

	const patchElement = (n1: any, n2: any) => {}
	const mountElement = (vnode: any, container: any) => {
		let { props, shapeFlag, type, children } = vnode
		let el = hostCreateElement(type)
		if (props) {
			for (let key in props) {
				hostPatchProp(el, key, null, props[key])
			}
		}
		hostInsert(el, container)
	}

	const processElement = (n1: any, n2: any, container: any) => {
		if (n1 == null) {
			mountElement(n2, container)
		} else {
			patchElement(n1, n2)
		}
	}

	/**
	 * @param n1 旧节点
	 * @param n2 新节点
	 * @param container 挂载位置
	 */
	const patch = (n1: any, n2: any, container: any) => {
		let { shapeFlag } = n2
		if (shapeFlag & ShapeFlags.ELEMENT) {
			processElement(n1, n2, container)
		} else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
			// 组件
			processComponent(n1, n2, container)
		}
	}

	const render = (vnode: any, container: any) => {
		patch(null, vnode, container)
	}

	return {
		createApp: apiCreateApp(render),
	}
}
