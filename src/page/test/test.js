import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from 'src/registerServiceWorker';
import './test.css';

const element = <h2>Hello, world! I am wushaobin</h2>

ReactDOM.render(element, document.getElementById('root'));
registerServiceWorker();
