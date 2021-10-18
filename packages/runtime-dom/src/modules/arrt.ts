export const xlinkNS = 'http://www.w3.org/1999/xlink'

export function patchAttr(el: Element, key: string, value: any, isSVG: boolean = false) {
	if (isSVG && key.startsWith('xlink:')) {
		if (value == null) {
			el.removeAttributeNS(xlinkNS, key.slice(6, key.length))
		} else {
			el.setAttributeNS(xlinkNS, key, value)
		}
	} else {
		if (value == null) {
			el.removeAttribute(value)
		} else {
			el.setAttribute(key, value)
		}
	}
}
