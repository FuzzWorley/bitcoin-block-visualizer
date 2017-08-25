import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      unconfirmedTxs: [],
      blocks: [],
      unconfirmedTxSize: 0,
      currentBlockIndex: 0
    };
  }

  componentDidMount(){
    var i = 0
    this.connection = new WebSocket('wss://ws.blockchain.info/inv');
    this.connection.onmessage = evt => { 
      var msgObj = JSON.parse(evt.data)
      // use to debug block data
      // if (i > 10) {
      //   this.connection.send(JSON.stringify({"op":"ping_block"}));
      //   i = 0
      // }
      // i += 1
      if (msgObj.op === 'utx') {
        this.setState({
          unconfirmedTxs: this.state.unconfirmedTxs.concat([msgObj]),
          unconfirmedTxSize: this.state.unconfirmedTxSize + msgObj.x.size
        })
      }
      else if (msgObj.op === 'block'){
        this.setState({
          unconfirmedTxs: [],
          blocks: this.state.blocks.concat([msgObj]),
          unconfirmedTxSize: 0,
          currentBlockIndex: msgObj.x.blockIndex
        })
      }
    };
    
    this.connection.onopen = () => {
      // subscribe to unconfirmed transactions
      this.connection.send(JSON.stringify({"op":"unconfirmed_sub"}));
      // subscribe to blocks
      this.connection.send(JSON.stringify({"op":"blocks_sub"}));
    }
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <div className="unconf-tx-size">
          <p>Total Size of Unconfirmed Transactions:</p>
          <p>{this.state.unconfirmedTxSize}</p>
          {/* 
            create ul of last 5 UTXs 
            <ul>{ this.state.unconfirmedTxs.slice(-5).map( (msg, idx) => <li key={'msg-' + idx }>{ msg }</li> )}</ul> 
          */}
        </div>
        <div className="current-block-index">
          <p>Current Block Index:</p>
          <p>{this.state.currentBlockIndex}</p>
        </div>
      </div>
    );
  }
}

export default App;
