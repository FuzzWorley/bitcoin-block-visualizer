import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import Mempool from './components/Mempool'
import Transaction from './components/Transaction'
import Block from './components/Block'
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Transaction />, document.getElementById('transaction'));
ReactDOM.render(<Mempool />, document.getElementById('mempool'));
ReactDOM.render(<Block />, document.getElementById('block'));
registerServiceWorker();
