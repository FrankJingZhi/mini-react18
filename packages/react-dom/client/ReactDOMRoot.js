import {createContainer, updateContainer} from 'react-reconciler/src/ReactFiberReconciler';

function ReactDOMRoot(inernalRoot){
    this._inernalRoot = inernalRoot
}

ReactDOMRoot.prototype.render = function(children){
    const root = this._inernalRoot
    updateContainer(children, root)
}

export function createRoot(container){
    const root = createContainer(container);
    return new ReactDOMRoot(root);
}