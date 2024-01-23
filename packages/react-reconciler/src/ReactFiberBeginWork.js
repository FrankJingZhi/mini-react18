import { HostRoot, HostComponent, HostText } from "./ReactWorkTags";
import {mountChildFibers, reconcileChildFibers} from './ReactChildFiber'
import { processUpdateQueue} from './ReactFiberClassUpdateQueue'
import {shouldSetTextContent} from 'react-dom-bindings/src/client/ReactDOMHostConfig'

/**
 * ✨处理当前节点
 * @param {*} current 老RootFiber节点 
 * @param {*} workInProgress 新RootFiber节点
 * @returns 当前节点的子节点
 */
export function beginWork(current, workInProgress){
    switch(workInProgress.tag){
        case HostRoot:
            return updateHostRoot(current, workInProgress)
        case HostComponent:
            return updateHostComponent(current, workInProgress)
        case HostText:
            // 后续对文本节点有优化
            return null
        default:
            return null
    }
}

/**
 * 更新原始dom节点
 */
function updateHostRoot(current, workInProgress){
    processUpdateQueue(workInProgress)
    const nextState = workInProgress.memoizedState
    const nextChildren = nextState.element
    reconcileChildren(current, workInProgress, nextChildren)
    return workInProgress.child
}

function reconcileChildren(current, workInProgress, nextChildren){
    if(current === null){
        workInProgress.child = mountChildFibers(workInProgress, null, nextChildren)
    }else{
        workInProgress.child = reconcileChildFibers(workInProgress, current.child, nextChildren)
    }
}

/**
 * ✨处理当前Component节点
 * @param {*} current 老RootFiber节点 
 * @param {*} workInProgress 新RootFiber节点
 * @returns 当前节点的子节点
 */
function updateHostComponent(current, workInProgress){
    // type：fiber节点对应的原生节点的类型
    const {type} = workInProgress
    const nextProps = workInProgress.pendingProps
    let nextChildren = nextProps.children
    const isDirectTextChild = shouldSetTextContent(type, nextProps)
    if(isDirectTextChild){
        nextChildren = null
    }
    reconcileChildren(current, workInProgress, nextChildren)
    return workInProgress.child
}