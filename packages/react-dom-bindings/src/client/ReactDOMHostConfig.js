import {setInitialProperties} from './ReactDOMComponent'

export function shouldSetTextContent(type, props){
    return typeof props.children === 'string' || typeof props.children === 'number'
}

export function createTextInstance(text){
    return document.createTextNode(text)
}

export function createInstance(type){
    return document.createElement(type)
}

export function appendInitialChild(parent, child){
    parent.appendChild(child)
}

// 将属性挂载到真实dom上
export function finalizeInitialChildren(domElement, type, props){
    setInitialProperties(domElement, type, props)
} 

export function insertBefore(parentInstance, child, beforeChild){
    parentInstance.insertBefore(child, beforeChild)
}