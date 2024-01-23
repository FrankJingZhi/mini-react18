import {createFiberRoot} from 'react-reconciler/src/ReactFiberRoot';
import {createUpdate, enqueueUpdate} from 'react-reconciler/src/ReactFiberClassUpdateQueue';
import {scheduleUpdateOnFiber} from 'react-reconciler/src/ReactFiberWorkLoop';

export function createContainer(containerInfo){
    return createFiberRoot(containerInfo)
}

export function updateContainer(element, container){
    console.log('updateContainer',element,container)
    const {current} = container
    const update = createUpdate()
    update.payload = {
        element
    }
    const root = enqueueUpdate(current, update)
    scheduleUpdateOnFiber(root)
}