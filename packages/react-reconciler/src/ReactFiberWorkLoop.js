import {scheduleCallback} from 'scheduler'
import { createWorkInProgress } from './ReactFiber'
import {beginWork} from 'react-reconciler/src/ReactFiberBeginWork'

let workInProgress = null; // 整个RootFiber树：正在构建的RootFiber树 or 构建完成的RootFiber树

/**
 * 执行任务调度，更新fiber树
 * @param {*} root: FiberRoot整个应用的根节点 
 */
export function scheduleUpdateOnFiber(root){
    ensureRootIsScheduled(root)
}

function ensureRootIsScheduled(root){
    scheduleCallback(performConcurrentWorkOnRoot.bind(null, root))
}

function performConcurrentWorkOnRoot(root){
    renderRootSync(root)
    // root.current.alternate：正在构建的RootFiber树
    // root.finishedWork：构建完成的RootFiber树
    // 这里是指正在构建的RootFiber树构建完成后，给到构建完成的RootFiber树，准备替换
    root.finishedWork = root.current.alternate
    // commitRoot(root)
}

function renderRootSync(root){
    prepareFreshStack(root)
    workLoopSync()
}

function prepareFreshStack(root){
    workInProgress = createWorkInProgress(root.current,null)
}

function workLoopSync(){
    while(workInProgress !== null){
        performUnitOfWork(workInProgress)
    }
}

function performUnitOfWork(unitOfWork){
    const current = unitOfWork.alternate
    const next = beginWork(current, unitOfWork)
    unitOfWork.memoizedProps = unitOfWork.pendingProps
    workInProgress = null // TODO：记得删掉，否则逻辑会出问题
    // if(next === null){
    //     completeUnitOfWork(unitOfWork)
    // }else {
    //     workInProgress = next
    // }
}

