## 实现 jsxDev

## render 函数的阶段划分

- 渲染阶段

  - beginWork：按照广度优先遍历的方式，遍历虚拟 dom 树，并构建 fiber 节点
  - completeWork：把 fiber 节点对应的真实 dom 创建出来。具体执行时机可以理解为遍历到真实 dom 节点时
  - beginWork 和 completeWork 交替执行。

  提交阶段 commitWork
