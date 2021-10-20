import { ShapeFlags } from '@vue/shared'
import { apiCreateApp } from './apiCreateApp'
import { createComponentInstance, setupComponent, setupRenderEffect } from './component'

export function createRender(rendererOptions: any) {
	const mountComponent = (initialVnode: any, container: any) => {
		const instance = (initialVnode.component = createComponentInstance(initialVnode))
		setupComponent(instance)
		setupRenderEffect()
	}

	const processComponent = (n1: any, n2: any, container: any) => {
		if (n1 == null) {
			// 加载
			mountComponent(n2, container)
		} else {
			// 更新
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
			console.log('元素')
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
