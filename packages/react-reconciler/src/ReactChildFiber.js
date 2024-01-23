import {createFiberFromElement, createFiberFromText} from 'react-reconciler/src/ReactFiber'
import { Placement } from './ReactFiberFlags'
import isArray from 'shared/isArray'
import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbols'

function createChildReconciler(shouldTrackSideEffects){
    function reconcileSingleElement(returnFiber, currentFirstChild, element){
        const created = createFiberFromElement(element)
        created.return = returnFiber
        return created
    }
    function placeChild(newFiber, newIdx){
        newFiber.index = newIdx
        if(shouldTrackSideEffects){
            newFiber.flags |= Placement
        }
    }
    function createChild(returnFiber, newChild){
        if((typeof newChild === 'string' && newChild !== '') || typeof newChild === 'number'){
            const created = createFiberFromText(newChild)
            created.return = returnFiber
            return created
        }
        if(typeof newChild === 'object' && newChild !== null){
            switch(newChild.$$typeof){
                case REACT_ELEMENT_TYPE:
                    const created = createFiberFromElement(newChild)
                    created.return = returnFiber
                    return created
                default: 
                    break;
            }
        }
        return null
    }
    function reconcileChildrenArray(returnFiber, currentFirstChild, newChild){
        // 第一个子节点
        let resultingFirstChild = null
        // 上次遍历的子节点
        let previousNewFiber = null
        // 从头开始遍历子节点，构建单向循环链表
        let newIdx = 0
        for(;newIdx < newChild.length; newIdx++){
            // 创建新的子节点
            const newFiber = createChild(returnFiber, newChild[newIdx])
            // 如果新的子节点为空，则跳过
            if(newFiber === null) continue
            placeChild(newFiber, newIdx)
            if(previousNewFiber === null){
                // 如果previousNewFiber为空，说明是第一次遍历
                resultingFirstChild = newFiber
            }else{
                // 如果previousNewFiber不为空，说明是第二次及以后遍历，将上一个遍历的fiber的sibling指向新的fiber
                // previousNewFiber：上一次遍历的fiber
                previousNewFiber.sibling = newFiber
            }
            // 当前fiber节点处理完成后，将previousNewFiber指向新的fiber，供下次遍历使用
            previousNewFiber = newFiber
        }
        return resultingFirstChild
    }
    function placeSingleChild(newFiber){
        if(shouldTrackSideEffects){
            newFiber.flags |= Placement
        }
        return newFiber
    }
    /**
     * 对比新旧节点
     * @param {*} returnFiber 父节点
     * @param {*} currentFirstFiber 旧的子节点
     * @param {*} newChild 新的子节点
     */
    function reconcileChildFibers(returnFiber, currentFirstFiber, newChild){
        // 如果newChild是单个虚拟dom
        if(typeof newChild === 'object' && newChild !== null){
            switch(newChild.$$typeof){
                case REACT_ELEMENT_TYPE:
                    return placeSingleChild(reconcileSingleElement(returnFiber, currentFirstFiber, newChild))
                default: 
                    break;
            }
        }
        // 如果newChild是数组
        if(isArray(newChild)){
            return reconcileChildrenArray(returnFiber, currentFirstFiber, newChild)
        }
    }
    return reconcileChildFibers
}

// 挂载子fiber
export const mountChildFibers = createChildReconciler(false)

// 更新子fiber
export const reconcileChildFibers = createChildReconciler(true)