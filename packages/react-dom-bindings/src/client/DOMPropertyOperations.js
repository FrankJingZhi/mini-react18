export function setValueForProperty(node, name, value){
    if(value === null){
        node.removeArribute(name)
    } else {
        node.setAttribute(name, value)
    }
}