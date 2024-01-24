import {HostRoot,IndeterminateComponent,HostComponent,HostText} from 'react-reconciler/src/ReactWorkTags'
import {NoFlags} from 'react-reconciler/src/ReactFiberFlags'

export function FiberNode(tag, pendingProps, key){
    // 代表fiber节点的类型
    this.tag = tag;
    this.key = key;
    // 代表fiber节点对应虚拟dom的类型
    this.type = null;
    // 当前fiber节点对应的虚拟dom或函数组件
    this.stateNode = null
    // 父节点
    this.return = null
    // 第一个子节点
    this.sibling = null
    // 等待生效的props
    this.pendingProps = pendingProps
    // 目前生效的props
    this.memoizedProps = null
    // 目前生效的state
    this.memoizedState = null
    // 更新队列 - 等待更新的fiber节点
    this.updateQueue = null
    // 更新队列相关
    this.flags = NoFlags
    this.subtreeFlags = NoFlags
    // 双向缓存，
    this.alternate = null
    this.index = 0
}

export function createFiber(tag, pendingProps, key){
    return new FiberNode(tag, pendingProps, key)
}

export function createHostRootFiber(){
    return createFiber(HostRoot, null, null)
}

/**
 * 创建/更新 构建中的RootFiber树
 * @param {*} current 旧的RootFiber树
 * @param {*} pendingProps 准备更新的props
 */
export function createWorkInProgress(current, pendingProps){
    // 构建中的RootFiber树
    let workInProgress = current.alternate
    if(workInProgress === null){
        // 如果构建中的RootFiber树不存在，创建一个
        workInProgress = createFiber(current.tag, pendingProps, current.key)
        // 初始化赋值
        workInProgress.type = current.type
        workInProgress.stateNode = current.stateNode
        workInProgress.alternate = current
    }else{
        // 如果构建中的RootFiber树存在，更新赋值
        workInProgress.pendingProps = current.pendingProps
        workInProgress.type = current.type
        // 这两个是更新相关
        workInProgress.flags = NoFlags
        workInProgress.subtreeFlags = NoFlags
    }
    workInProgress.chid = current.child
    workInProgress.memoizedProps = current.memoizedProps
    workInProgress.memoizedState = current.memoizedState
    workInProgress.updateQueue = current.updateQueue
    workInProgress.sibling = current.sibling
    workInProgress.index = current.index
    return workInProgress
}

// 根据虚拟dom创建fiber节点
export function createFiberFromElement(element){
    const {type,key,props: pendingProps} = element
    return createFiberFromTypeAndProps(type, key, pendingProps)
}

// 根据文本创建fiber节点
export function createFiberFromText(content){
    return createFiber(HostText, content, null)
}

function createFiberFromTypeAndProps(type, key, pendingProps){
    let tag = IndeterminateComponent
    if(typeof type === 'string'){
        tag = HostComponent
    }
    const fiber = createFiber(tag, pendingProps, key)
    fiber.type = type
    return fiber
}