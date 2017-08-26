import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      unconfirmedTxs: [],
      blocks: [],
      unconfirmedTxSizes: [],
      totalUnconfirmedTxSize: 0,
      currentBlockHeight: 0,
      avgUnconfTxSize: 0,
      maxUnconfTxSize: 0,
      minUnconfTxSize: 10000000
    };
  }

  getAvgTxSize(txs) {
    return this.state.totalUnconfirmedTxSize / txs.length
  }

  getMaxTxSize(txSize) {
    if (this.state.maxUnconfTxSize < txSize) {
      this.setState({
        maxUnconfTxSize: txSize
      })
    }
  }

  getMinTxSize(txSize) {
    if (this.state.minUnconfTxSize > txSize) {
      this.setState({
        minUnconfTxSize: txSize
      })
    }
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
        var txSize = msgObj.x.size
        this.getMaxTxSize(txSize)
        this.getMinTxSize(txSize)
        this.setState({
          // unconfirmedTxs: this.state.unconfirmedTxs.concat([msgObj]),
          unconfirmedTxs: [msgObj].concat(this.state.unconfirmedTxs),
          totalUnconfirmedTxSize: this.state.totalUnconfirmedTxSize + txSize,
          unconfirmedTxSizes: ([txSize].concat(this.state.unconfirmedTxSizes)).reverse(),
          avgUnconfTxSize: this.getAvgTxSize(this.state.unconfirmedTxSizes)
        })
      }
      else if (msgObj.op === 'block'){
        this.setState({
          unconfirmedTxs: [],
          blocks: this.state.blocks.concat([msgObj]),
          totalUnconfirmedTxSize: 0,
          currentBlockHeight: msgObj.x.height
        })
      }
    };
    
    this.connection.onopen = () => {
      // subscribe to unconfirmed transactions
      this.connection.send(JSON.stringify({"op":"unconfirmed_sub"}));
      // get last block data
      this.connection.send(JSON.stringify({"op":"ping_block"}));
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
        <div className="container">
          <div className="current-block-height">
            <p>Current Block Height:</p>
            <p>{this.state.currentBlockHeight}</p>
          </div>
          <div className="total-unconf-tx-size">
            <p>Total Size of Unconfirmed Transactions:</p>
            <p>{this.state.totalUnconfirmedTxSize}</p>
          </div>
        {/*  <div className="unconf-tx-sizes">
            <p>Transaction Sizes:</p>
            <p>{this.state.unconfirmedTxSizes}</p>
          </div>
        */}
          <div className="avg-unconf-tx-size">
            <p>Average Unconfirmed Transaction Size:</p>
            <p>{this.state.avgUnconfTxSize}</p>
          </div>
          <div className="max-unconf-tx-size">
            <p>Maximum Unconfirmed Transaction Size:</p>
            <p>{this.state.maxUnconfTxSize}</p>
          </div>
          <div className="max-unconf-tx-size">
            <p>Minimum Unconfirmed Transaction Size:</p>
            <p>{this.state.minUnconfTxSize}</p>
          </div>


        </div>
        {/*
        <ul>{ this.state.unconfirmedTxs.slice().map( (msg, idx) => <li key={'msg-' + idx }>{ JSON.stringify(msg) }</li> )}</ul> 
        */}
      </div>
    );
  }
}

export default App;
