import {markUpdateLaneFromFiberToRoot} from 'react-reconciler/src/ReactFiberConcurrentUpdate'
import assign from 'shared/assign'

// 初始化更新队列
export function initailUpdateQueue(fiber){
    const queue = {
        shared: {
            pending: null
        }
    }
    fiber.updateQueue = queue
}

/**
 * 将待更新的队列添加到fiber对象的更新队列中
 * @param {*} fiber 
 * @param {*} update 待更新的队列
 * @returns fiber根节点
 */
export function enqueueUpdate(fiber, update){
    const updateQueue = fiber.updateQueue
    const pending = updateQueue.shared.pending
    // 建立单向循环链表
    if(pending === null){
        // 没有更新队列，更新队列指向自己
        update.next = update
    }else{
        // 如果有更新队列，更新队列指向下一个更新队列
        update.next = pending.next
        // pending始终指向最新入队的队列
        pending.next = update
    }
    updateQueue.shared.pending = update
    return markUpdateLaneFromFiberToRoot(fiber)
}

// 创建更新对象
export function createUpdate(){
    const update = {}
    return update
}

export function processUpdateQueue(workInProgress){
    const queue = workInProgress.updateQueue
    const pendingQueue = queue.shared.pending
    if(pendingQueue !== null){
        queue.shared.pending = null
        // lastPendingUpdate 最后一个节点
        const lastPendingUpdate = pendingQueue
        // firstPendingUpdate 第一个节点
        const firstPendingUpdate = lastPendingUpdate.next
        // 剪断
        lastPendingUpdate.next = null
        let newState = workInProgress.memoizedState
        // 从第一个节点开始遍历
        let update = firstPendingUpdate
        while(update){
            newState = getStateFromUpdate(update, newState)
            update = update.next
        }
        workInProgress.memoizedState = newState
    }else{

    }
}

/**
 * 根据update处理state
 * @param {*} update 新增的更新队列
 * @param {*} prevState 旧的state
 * @returns 处理后的state
 */
function getStateFromUpdate(update, prevState){
    const {payload} = update
    return assign({}, prevState, payload)
}