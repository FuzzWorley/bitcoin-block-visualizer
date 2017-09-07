import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import Mempool from './components/Mempool'
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
ReactDOM.render(<Mempool />, document.getElementById('mempool'));
registerServiceWorker();
