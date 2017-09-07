import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Mempool from './Mempool'
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
ReactDOM.render(<Mempool />, document.getElementById('mempool'));
registerServiceWorker();
