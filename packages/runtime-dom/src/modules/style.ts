import { isString } from '@vue/shared'

export function patchStyle(el: Element, prev: any, next: any) {
	const style = (el as HTMLElement).style
	if (!next) {
		el.removeAttribute('style')
	} else {
		for (const key in next) {
			style[key] = next[key]
		}
		if (prev && !isString(prev)) {
			for (const key in prev) {
				if (next[key] == null) {
					style[key] = ''
				}
			}
		}
	}
}
// v-show - display
// !important
// 各浏览器前缀
