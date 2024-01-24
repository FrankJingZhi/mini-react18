import {scheduleCallback} from 'scheduler'
import { createWorkInProgress } from './ReactFiber'
import {beginWork} from 'react-reconciler/src/ReactFiberBeginWork'
import {completeWork} from 'react-reconciler/src/ReactFiberCompleteWork'
import {commitMutationEffectsOnFiber} from 'react-reconciler/src/ReactFiberCommitWork'

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
    commitRoot(root)
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
    // workInProgress = null // TODO：记得删掉，否则逻辑会出问题
    if(!next){
        completeUnitOfWork(unitOfWork)
    }else {
        workInProgress = next
    }
}

function completeUnitOfWork(unitOfWork){
    let completedWork = unitOfWork
    do {
        const returnFiber = completedWork.return
        const current = completedWork.alternate
        completeWork(current, completedWork)
        const siblingFiber = completedWork.sibling
        // 如果有兄弟节点，则返回，继续遍历下一个兄弟节点
        if(siblingFiber !== null){
            workInProgress = siblingFiber
            return
        }
        // 如果没有兄弟节点，则将该节点的return指向父节点
        completedWork = returnFiber
        workInProgress = completedWork
    } while (completedWork !== null);
}

function commitRoot(root){
    const {finishedWork} = root
    // 判断子节点是否有副作用
    const subtreeHasEffects = (finishedWork.subtreeFlags & MutationMask) !== NoFlags
    // 判断根节点是否有副作用
    const rootHasEffects = (finishedWork.flags & MutationMask) !== NoFlags
    if(subtreeHasEffects || rootHasEffects){
        commitMutationEffectsOnFiber(finishedWork, root)
    }
    // 用构建好的RootFiber树替换当前的RootFiber树
    root.current = finishedWork
}