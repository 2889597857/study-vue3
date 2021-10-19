import { isArray, isFunction, isObject, isString, ShapeFlags } from '@vue/shared'

export const createVnode = (type: any, props: any, children = null) => {
	let shapeFlag = isString(type)
		? ShapeFlags.ELEMENT
		: isObject(type)
		? ShapeFlags.STATEFUL_COMPONENT
		: 0
	const vnode = {
		_is_vnode: true,
		type,
		props,
		children,
		key: props && props.key,
		el: null,
		shapeFlag,
	}
	normalizeChildren(vnode, children)
	return vnode
}
export function normalizeChildren(vnode: any, children: unknown) {
	let type = 0
	const { shapeFlag } = vnode
	if (children == null) {
		children = null
	} else if (isArray(children)) {
		type = ShapeFlags.ARRAY_CHILDREN
	} else {
	}
	vnode.children = children
	vnode.shapeFlag |= type
}
