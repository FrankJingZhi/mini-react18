import { MutationMask, Placement } from "./ReactFiberFlags";
import { HostComponent, HostRoot, HostText } from "./ReactWorkTags";
import {insertBefore, appendInitialChild} from "react-dom-bindings/src/client/ReactDOMHostConfig"

export function commitMutationEffectsOnFiber(finishedWork, root){
    switch (finishedWork.tag) {
        case HostRoot:
        case HostComponent:
        case HostText: 
            recursivelyTraverMutationEffects(root, finishedWork)
            commitReconciliationEffects(finishedWork)
            break;
        default:
            break;
    }
}

// 深度优先遍历子节点
function recursivelyTraverMutationEffects(root, parentFiber){
    // 如果子节点有需要处理的副作用
    if(parentFiber.subtreeFlags & MutationMask){
        let {child} = parentFiber
        while(child){
            commitMutationEffectsOnFiber(child, root)
            child = child.sibling
        }
    }
}

function commitReconciliationEffects(finishedWork){
    const {flags} = finishedWork
    if(flags & Placement){
        commitPlacement(finishedWork)
    }
}

function commitPlacement(finishedWork){
    const parentFiber = getHostParentFiber(finishedWork)
    switch (parentFiber.tag) {
        case HostRoot:{
            const parent = parentFiber.stateNode.containerInfo
            const before = getHostSibling(finishedWork)
            insertOrAppendPlacementNode(finishedWork, before, parent)
            break;
        }
        case HostComponent:{
            const parent = parentFiber.stateNode
            const before = getHostSibling(finishedWork)
            insertOrAppendPlacementNode(finishedWork, before, parent)
            break;
        }
        default:
            break;
    }
}

/**
 * 
 * @param {*} node fiber节点
 * @param {*} parent 
 * @param {*} before 
 */
function insertOrAppendPlacementNode(node, before, parent){
    const {tag} = node
    const isHost = tag === HostComponent || tag === HostText
    if(isHost){
        const stateNode = node.stateNode
        if(before){
            insertBefore(parent, stateNode, before)
        }else{
            appendInitialChild(parent, stateNode)
        }
    }else{
        const {child} = node
        if(child){
            insertOrAppendPlacementNode(child, before, parent)
            let {sibling} = child
            while(sibling){
                insertOrAppendPlacementNode(sibling, before, parent)
                sibling = sibling.sibling
            }
        }
    }
}

// 获取兄弟节点（是真实dom）
function getHostSibling(fiber){
    let node = fiber
    sibling: while(true){
        while(!node.sibling){
            if(!node.return || isHostParent(node.return)){
                return null
            }
            node = node.return
        }
        node = node.sibling
        while(node.tag !== HostComponent && node.tag !== HostText){
            if(node.flags & Placement){
                // 如果有需要插入的副作用，则继续找兄弟节点
                continue sibling
            }else{
                // 
                node = node.child
            }
        }
        if(!(node.flags & Placement)){
            return node.stateNode
        }
    }
}

// 找到父节点（真实dom）
function getHostParentFiber(fiber){
    let parent = fiber.return
    while(parent){
        if(isHostParent(parent)){
            return parent
        }
        parent = parent.return
    }
}

function isHostParent(fiber){
    return fiber.tag === HostComponent || fiber.tag === HostRoot
}