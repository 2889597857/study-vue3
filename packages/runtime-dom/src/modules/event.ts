interface Invoker extends EventListener {
	value: EventValue
}
type EventValue = Function

export function pathEvent(
	el: Element & { _vei?: Record<string, Invoker | undefined> },
	rawName: string,
	nextValue: EventValue | null
) {
	// 函数缓存
	const invokers = el._vei || (el._vei = {})
	// 获取缓存
	const existingInvoker = invokers[rawName]
	// 缓存和新值都有 更新缓存
	if (existingInvoker && nextValue) {
		existingInvoker.value = nextValue
	} else {
		//  eventName 事件类型 onClick => click
		const eventName = rawName.slice(2).toLocaleLowerCase()
		if (nextValue) {
			//  新值存在
			let invoker = (invokers[rawName] = createInvoker(nextValue))
			addEventListener(el, eventName, invoker)
		} else if (existingInvoker) {
			// 缓存清除缓存 移除事件
			removeEventListener(el, eventName, existingInvoker)
			invokers[rawName] = undefined
		}
	}
}

function createInvoker(initialValue: EventValue) {
	const invoker: Invoker = (e: Event) => {
		invoker.value(e)
	}
	invoker.value = initialValue
	return invoker
}
export function addEventListener(
	el: Element,
	event: string,
	handler: EventListener,
	options?: EventListenerOptions
) {
	el.addEventListener(event, handler)
}

export function removeEventListener(
	el: Element,
	event: string,
	handler: EventListener,
	options?: EventListenerOptions
) {
	el.removeEventListener(event, handler)
}
