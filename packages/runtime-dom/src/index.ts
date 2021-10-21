import { nodeOps } from './nodeOps'
import { patchProp } from './patchProp'
import { extend } from '@vue/shared'
import { createRender } from '@vue/runtime-core'

const rendererOptions = extend({ patchProp }, nodeOps)

export const createApp = (rootComponent: any, rootProps: any) => {
	let app: any = createRender(rendererOptions).createApp(rootComponent, rootProps)
	let { mount } = app
	app.mount = (container: any) => {
		container = nodeOps.querySelector(container)
		container.innerHTML = ''
		mount(container)
	}
	return app
}

export * from '@vue/runtime-core'
