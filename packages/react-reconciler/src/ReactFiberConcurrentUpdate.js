import { HostRoot } from "./ReactWorkTags"


export function markUpdateLaneFromFiberToRoot(sourceFiber){
    let node = sourceFiber
    let parent = sourceFiber.return 
    // 循环遍历到根节点
    while(parent !== null){
        node = parent
        parent = node.return
    }
    // 如果根节点存在，则返回根节点指向的FiberRoot（整个应用程序的RootFiber）
    if(node.tag === HostRoot){
        return node.stateNode
    }
    // 如果根节点不存在，返回null
    return null
}