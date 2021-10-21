const setupRenderEffect = (instance, initialVNode, container, anchor, parentSuspense, isSVG, optimized) => {
    const componentUpdateFn = () => {
        if (!instance.isMounted) {
            let vnodeHook;
            const { el, props } = initialVNode;
            const { bm, m, parent } = instance;
            effect.allowRecurse = false;
            // beforeMount hook
            if (bm) {
                invokeArrayFns(bm);
            }
            // onVnodeBeforeMount
            if ((vnodeHook = props && props.onVnodeBeforeMount)) {
                invokeVNodeHook(vnodeHook, parent, initialVNode);
            }
            effect.allowRecurse = true;
            if (el && hydrateNode) {
                // vnode has adopted host node - perform hydration instead of mount.
                const hydrateSubTree = () => {
                    {
                        startMeasure(instance, `render`);
                    }
                    instance.subTree = renderComponentRoot(instance);
                    {
                        endMeasure(instance, `render`);
                    }
                    {
                        startMeasure(instance, `hydrate`);
                    }
                    hydrateNode(el, instance.subTree, instance, parentSuspense, null);
                    {
                        endMeasure(instance, `hydrate`);
                    }
                };
                if (isAsyncWrapper(initialVNode)) {
                    initialVNode.type.__asyncLoader().then(
                        // note: we are moving the render call into an async callback,
                        // which means it won't track dependencies - but it's ok because
                        // a server-rendered async wrapper is already in resolved state
                        // and it will never need to change.
                        () => !instance.isUnmounted && hydrateSubTree());
                }
                else {
                    hydrateSubTree();
                }
            }
            else {
                {
                    startMeasure(instance, `render`);
                }
                const subTree = (instance.subTree = renderComponentRoot(instance));
                {
                    endMeasure(instance, `render`);
                }
                {
                    startMeasure(instance, `patch`);
                }
                patch(null, subTree, container, anchor, instance, parentSuspense, isSVG);
                {
                    endMeasure(instance, `patch`);
                }
                initialVNode.el = subTree.el;
            }
            // mounted hook
            if (m) {
                queuePostRenderEffect(m, parentSuspense);
            }
            // onVnodeMounted
            if ((vnodeHook = props && props.onVnodeMounted)) {
                const scopedInitialVNode = initialVNode;
                queuePostRenderEffect(() => invokeVNodeHook(vnodeHook, parent, scopedInitialVNode), parentSuspense);
            }
            // activated hook for keep-alive roots.
            // #1742 activated hook must be accessed after first render
            // since the hook may be injected by a child keep-alive
            if (initialVNode.shapeFlag & 256 /* COMPONENT_SHOULD_KEEP_ALIVE */) {
                instance.a && queuePostRenderEffect(instance.a, parentSuspense);
            }
            instance.isMounted = true;
            {
                devtoolsComponentAdded(instance);
            }
            // #2458: deference mount-only object parameters to prevent memleaks
            initialVNode = container = anchor = null;
        }
        else {
            // updateComponent
            // This is triggered by mutation of component's own state (next: null)
            // OR parent calling processComponent (next: VNode)
            let { next, bu, u, parent, vnode } = instance;
            let originNext = next;
            let vnodeHook;
            {
                pushWarningContext(next || instance.vnode);
            }
            if (next) {
                next.el = vnode.el;
                updateComponentPreRender(instance, next, optimized);
            }
            else {
                next = vnode;
            }
            // Disallow component effect recursion during pre-lifecycle hooks.
            effect.allowRecurse = false;
            // beforeUpdate hook
            if (bu) {
                invokeArrayFns(bu);
            }
            // onVnodeBeforeUpdate
            if ((vnodeHook = next.props && next.props.onVnodeBeforeUpdate)) {
                invokeVNodeHook(vnodeHook, parent, next, vnode);
            }
            effect.allowRecurse = true;
            // render
            {
                startMeasure(instance, `render`);
            }
            const nextTree = renderComponentRoot(instance);
            {
                endMeasure(instance, `render`);
            }
            const prevTree = instance.subTree;
            instance.subTree = nextTree;
            {
                startMeasure(instance, `patch`);
            }
            patch(prevTree, nextTree,
                // parent may have changed if it's in a teleport
                hostParentNode(prevTree.el),
                // anchor may have changed if it's in a fragment
                getNextHostNode(prevTree), instance, parentSuspense, isSVG);
            {
                endMeasure(instance, `patch`);
            }
            next.el = nextTree.el;
            if (originNext === null) {
                // self-triggered update. In case of HOC, update parent component
                // vnode el. HOC is indicated by parent instance's subTree pointing
                // to child component's vnode
                updateHOCHostEl(instance, nextTree.el);
            }
            // updated hook
            if (u) {
                queuePostRenderEffect(u, parentSuspense);
            }
            // onVnodeUpdated
            if ((vnodeHook = next.props && next.props.onVnodeUpdated)) {
                queuePostRenderEffect(() => invokeVNodeHook(vnodeHook, parent, next, vnode), parentSuspense);
            }
            {
                devtoolsComponentUpdated(instance);
            }
            {
                popWarningContext();
            }
        }
    };