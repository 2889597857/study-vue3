import { createVnode } from './vnode'

export function apiCreateApp(render: Function) {
	return function createApp(rootComponent: any, rootProps: any) {
		let app = {
			_component: rootComponent,
			_prop: rootProps,
			_container: null,
			mount(container: any) {
				// 挂载位置
				let vnode = createVnode(rootComponent, rootProps)
				console.log(vnode)
				render(vnode, container)
				app._container = container
			},
		}
		return app
	}
}
