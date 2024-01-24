export function setValueForStyles(node, styles){
    const style = node.style
    for(const styleName in styles){
        if(styles.hasOwnProperty(styleName)){
            node.setProperty(styleName, styles[styleName])
        }
    }
}