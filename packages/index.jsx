import {createRoot} from 'react-dom/client';

let element = <div>
    <div>hello, mini-react18</div>
    <div>
        作者：Frank
    </div>
    <div>
        github地址：<a href="https://github.com/FrankJingZhi/mini-react18" style={{color: 'blue'}}>https://github.com/FrankJingZhi/mini-react18</a>
    </div>
</div>
console.log('element',element)
const root = createRoot(document.getElementById('root'))
root.render(element)