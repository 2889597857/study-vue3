import { isArray, isObject, isString, ShapeFlags } from '@vue/shared'

export const createVNode = (type: any, props: any, children: unknown = null) => {
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
		component: {},
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

export function isVNode(vnode: any): boolean {
	return vnode ? vnode.__v_isVNode === true : false
}
