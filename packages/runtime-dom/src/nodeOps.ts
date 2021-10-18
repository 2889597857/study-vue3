const doc = (typeof document !== 'undefined' ? document : null) as Document
const staticTemplateCache = new Map<string, DocumentFragment>()
const svgNS = 'http://www.w3.org/2000/svg'

export const nodeOps = {
	// 元素
	// 创建元素
	createElement: (tag: string, isSVG: Boolean = false, is?: any, props?: any) => {
		const el = isSVG
			? doc.createElementNS(svgNS, tag)
			: doc.createElement(tag, is ? { is } : undefined)
		if (tag === 'select' && props && props.multiple != null) {
			el.setAttribute('multiple', props.multiple)
		}
		return el
	},
	// 插入元素
	insert: (child: any, parent: any, anchor = null) => {
		parent.insertBefore(child, anchor || null)
	},
	// 删除元素
	remove: (child: any) => {
		const parent = child.parentNode
		if (parent) {
			parent.removeChild(child)
		}
	},
	// 选择元素
	querySelector: (selector: any) => doc.querySelector(selector),

	// 文本内容
	// 文本节点
	createText: (text: string) => doc.createTextNode(text),
	// 注释节点
	createComment: (text: string) => doc.createComment(text),

	setText: (node: any, text: any) => {
		node.nodeValue = text
	},
	setElementText: (el: any, text: any) => {
		el.textContent = text
	},

	parentNode: (node: any) => node.parentNode,

	nextSibling: (node: any) => node.nextSibling,

	setScopeId(el: any, id: any) {
		el.setAttribute(id, '')
	},
}
