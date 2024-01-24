import { NoFlags } from './ReactFiberFlags'
import {HostComponent, HostText, HostRoot} from './ReactWorkTags'
import {createTextInstance, createInstance, finalizeInitialChildren, appendInitialChild} from 'react-dom-bindings/src/client/ReactDOMHostConfig'

/**
 * 处理当前fiber，生成对应的真实dom
 * @param {*} current 旧fiber
 * @param {*} workInProgress 新fiber
 */
export function completeWork(current, workInProgress){
    const newProps = workInProgress.pendingProps
    switch(workInProgress.tag){
        case HostRoot:
            bubbleProperties(workInProgress)
            break;
        case HostComponent:
            const {type} = workInProgress
            const instance = createInstance(type, newProps, workInProgress)
            appendAllChildren(instance, workInProgress)
            workInProgress.stateNode = instance
            finalizeInitialChildren(instance, type, newProps) // 
            bubbleProperties(workInProgress)
            break
        case HostText:
            const newText = newProps
            workInProgress.stateNode = createTextInstance(newText)
            bubbleProperties(workInProgress)
            break
        default:
            return null
    }
}

/**
 * flags向上冒泡
 * 父节点要记录下面所有子节点的flags，
 * 同级节点的第一个节点要记录所有兄弟节点的flags 以及 兄弟节点的子节点的flags
 * 最终汇总到根节点。用来做后续的更新操作
 *  */ 
function bubbleProperties(completedWork){
    let subtreeFlags = NoFlags
    let child = completedWork.child
    while(child){
        subtreeFlags |= child.subtreeFlags
        subtreeFlags |= child.flags
        child = child.sibling
    }
    completedWork.subtreeFlags = subtreeFlags
}

// 
/**
 * 深度优先遍历
 * 遍历当前节点的所有子孙节点，找到真实的dom节点，并挂载到当前节点的stateNode上
 * @param {*} parent 
 * @param {*} workInProgress 
 * @returns 
 */
function appendAllChildren(parent, workInProgress){
    let node = workInProgress.child
    while(node){
        if(node.tag === HostComponent || node.tag === HostText){
            // 如果当前节点是HostComponent或HostText，则直接添加到父节点中
            appendInitialChild(parent, node.stateNode)
        }else if(node.child){
            // 边界条件A - 如果当前节点有子节点，继续向下遍历子节点
            node = node.child
            continue
        }
        if(node === workInProgress){
            // 边界条件 - 如果当前节点是workInProgress，则直接返回，不再遍历
            return
        }
        while(!node.sibling){
            // 边界条件B - 如果当前节点没有兄弟节点，继续向上遍历父节点
            if(!node.return || node.return === workInProgress){
                return
            }
            node = node.return
        }
        node = node.sibling
    }
}