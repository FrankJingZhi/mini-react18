import { createHostRootFiber } from "./ReactFiber"
import {initailUpdateQueue } from './ReactFiberClassUpdateQueue'

function FiberRootNode(containerInfo){
    this.containerInfo = containerInfo
}

export function createFiberRoot(containerInfo){
    // 生成FiberRoot，应用程序的根节点
    const root = new FiberRootNode(containerInfo)
    // 生成RootFiber，fiber树的根节点
    const uninitializedRoot = createHostRootFiber()
    // FiberRoot 指向 RootFiber
    root.current = uninitializedRoot
    // RootFiber 指向 FiberRoot
    uninitializedRoot.stateNode = root
    // 初始化更新队列
    initailUpdateQueue(uninitializedRoot)
    return root
}