import { hasOwn } from '@vue/shared'

export const PublicInstanceProxyHandlers = {
	get({ _: instance }: any, key: any) {
		const { props, data, setupState } = instance
		if (key[0] == '$') return
		else if (hasOwn(props, key)) return props[key]
		else if (hasOwn(setupState, key)) return setupState[key]
		else return
	},
	set({ _: instance }: any, key: any, value: any) {
		const { props, data, setupState } = instance
		if (hasOwn(props, key)) props[key] = value
		else if (hasOwn(setupState, key)) setupState[key] = value
		else return
	},
}
