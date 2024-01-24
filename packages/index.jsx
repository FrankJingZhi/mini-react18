import {createRoot} from 'react-dom/client';

let element = <div>
    <div>
        <span>hello, mini-react18</span>
        <span>----</span>
    </div>
    <div>
        作者：Frank
    </div>
    <div>
        <p>
            <span>简介：</span>
            <span>github地址：</span>
        </p>
        <a href="https://github.com/FrankJingZhi/mini-react18" style={{color: 'blue'}}>https://github.com/FrankJingZhi/mini-react18</a>
    </div>
</div>
console.log('element',element)
const root = createRoot(document.getElementById('root'))
root.render(element)