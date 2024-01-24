import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbols'
import hasOwnProperty from 'shared/hasOwnProperty'

// 保留关键字
const RESOLVED_PROPS = {
    key: true,
    ref: true,
    __source: true,
    __self: true
}

function ReactElement(type, key, ref, props){
    return {
        $$typeof: REACT_ELEMENT_TYPE,
        type,
        key,
        ref,
        props
    }
}

function hasValidKey(config){
    return config.key !== undefined
}

function hasValidRef(config){
    return config.ref !== undefined
}

export function jsxDEV(type, config, maybekey){
    debugger
    const props = {};
    let key = null;
    let ref = null;
    if(maybekey !== undefined){
        key = '' + maybekey;
    }
    if(hasValidKey(config)){
        key = '' + config.key
    }
    if(hasValidRef(config)){
        ref = config.ref
    }
    for (const propName in config) {
        if(hasOwnProperty.call(config, propName) && !RESOLVED_PROPS.hasOwnProperty(propName)){
            props[propName] = config[propName]
        }
    }

    return ReactElement(type, key, ref, props)
}
