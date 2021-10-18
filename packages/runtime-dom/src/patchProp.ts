import { patchAttr } from './modules/arrt'
import { patchClass } from './modules/class'
import { patchStyle } from './modules/style'
import { isOn } from '@vue/shared'
import { pathEvent } from './modules/event'

export const patchProp = (el: Element, key: string, prevValue: string, nextValue: string) => {
	switch (key) {
		case 'class':
			patchClass(el, nextValue)
			break
		case 'style':
			patchStyle(el, prevValue, nextValue)
			break

		default:
			if (isOn(key)) {
				pathEvent(el, key, nextValue)
			} else {
				patchAttr(el, key, nextValue)
			}
			break
	}
}
