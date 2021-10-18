export function patchClass(el: Element, value: string | null, isSVG: boolean = false) {
	if (value == null) {
		el.removeAttribute('class')
	} else if (isSVG) {
		el.setAttribute('class', value)
	} else {
		el.className = value
	}
}
