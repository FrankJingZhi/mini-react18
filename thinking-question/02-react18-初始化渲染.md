## 实现 jsxDev

## render 函数的阶段划分

- 渲染阶段

  - beginWork：按照广度优先遍历的方式，遍历虚拟 dom 树，并构建 fiber 节点
  - completeWork：把 fiber 节点对应的虚拟 dom 创建出来。具体执行时机可以理解为遍历到虚拟 dom 节点时
  - beginWork 和 completeWork 交替执行。

- 提交阶段 commitWork

  - 遍历 fiber 节点，把 fiber 节点中的虚拟 dom 对应的真实 dom 创建出来，并替换 RootFiber

## 思考

1. 虚拟 dom 和 fiber 有什么区别

它们是两个对象，fiber 中包含了虚拟 dom 的信息，两者的遍历方式不同

2. RootFiber 和 FiberRoot 有什么区别
   一个是 fiber，是 fiber 树的根节点
   一个是 root，是整个应用程序的根节点
