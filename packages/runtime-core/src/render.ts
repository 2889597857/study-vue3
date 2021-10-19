import { isArray, ShapeFlags } from '@vue/shared'
import { apiCreateApp } from './apiCreateApp'
export function createRender(rendererOptions: any) {
	/**
	 *
	 * @param n1 旧节点
	 * @param n2 新节点
	 * @param container 挂载位置
	 */
	const patch = (n1: any, n2: any, container: any) => {
		let { shapeFlag } = n2
		if (shapeFlag & ShapeFlags.ELEMENT) {
			console.log('元素')
		} else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
		}
	}
	const render = (vnode: any, container: any) => {
		patch(null, vnode, container)
	}
	return {
		createApp: apiCreateApp(render),
	}
}
