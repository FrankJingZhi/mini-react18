import {createFiberRoot} from 'react-reconciler/src/ReactFiberRoot';
import {createUpdate, enqueueUpdate} from 'react-reconciler/src/ReactFiberClassUpdateQueue';
import {scheduleUpdateOnFiber} from 'react-reconciler/src/ReactFiberWorkLoop';

export function createContainer(containerInfo){
    return createFiberRoot(containerInfo)
}

export function updateContainer(element, container){
    console.log('updateContainer',element,container)
    const {current} = container
    current.type = element.type; // FIXME:这行代码是我自己加的，因为阻塞了我的调试，我不知道根节点是什么时候被赋上type值的
    const update = createUpdate()
    update.payload = {
        element
    }
    const root = enqueueUpdate(current, update)
    scheduleUpdateOnFiber(root)
}