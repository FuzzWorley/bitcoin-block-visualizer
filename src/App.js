import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'
import request from 'superagent';
// import request from 'superagent-bluebird-promise'

class App extends Component {
  constructor() {
    super()
    this.state = {
      unconfirmedTxs: [],
      blocks: [],
      unconfirmedTxSizes: [],
      totalUnconfirmedTxSize: 0,
      currentBlockHeight: 0,
      avgUnconfTxSize: 0,
      largestUnconfTxSize: 0,
      smallestUnconfTxSize: 10000000,
      mempoolSizeInMb: 0,
      mempoolTxCount: 0
    }
  }

  limitCalls(interval, unconfTxs) {
    if (unconfTxs.length % interval === 0) {
      this.setMempoolSize()
    }
  }

  setMempoolSize() {
    request.get('https://blockchain.info/charts/mempool-size?format=json&cors=true')
    .end(function(err, response){
      var array = response.body.values
      var size = array[array.length - 1].y
      var sizeInMb = size / 1000000
      this.setState({mempoolSizeInMb: sizeInMb})
    }.bind(this))
  }

  fetchMempoolTxCount() {
    request.get('https://blockchain.info/charts/mempool-count?format=json&cors=true')
    .end(function(err, response){
      var array = response.body.values
      var txCount = array[array.length - 1].y
      return txCount
    })
  }

  getAvgTxSize(txs) {
    var avg = this.state.totalUnconfirmedTxSize / txs.length
    return Math.round(avg)
  }

  setMaxTxSize(txSize) {
    if (this.state.largestUnconfTxSize < txSize) {
      this.setState({
        largestUnconfTxSize: txSize
      })
    }
  }

  setMinTxSize(txSize) {
    if (this.state.smallestUnconfTxSize > txSize) {
      this.setState({
        smallestUnconfTxSize: txSize
      })
    }
  }

  componentDidMount(){
    var i = 0
    this.connection = new WebSocket('wss://ws.blockchain.info/inv')
    this.connection.onmessage = evt => { 
      var msgObj = JSON.parse(evt.data)
      this.limitCalls(50, this.state.unconfirmedTxs)

      if (msgObj.op === 'utx') {
        var txSize = msgObj.x.size
        this.setMaxTxSize(txSize)
        this.setMinTxSize(txSize)
        this.setState({
          unconfirmedTxs: [msgObj].concat(this.state.unconfirmedTxs),
          totalUnconfirmedTxSize: this.state.totalUnconfirmedTxSize + txSize,
          unconfirmedTxSizes: ([txSize].concat(this.state.unconfirmedTxSizes)).reverse(),
          avgUnconfTxSize: this.getAvgTxSize(this.state.unconfirmedTxSizes)
        })
      }
      else if (msgObj.op === 'block'){
        console.log('pool:' + msgObj.x.foundBy.description)
        console.log('totalBTCSent:' + msgObj.x.totalBTCSent / 100000000)
        console.log('#tx:' + msgObj.x.nTx)
        console.log('blockSize:' + msgObj.x.size)
        this.setState({
          unconfirmedTxs: [],
          totalUnconfirmedTxSize: 0,
          unconfirmedTxSizes: [],
          avgUnconfTxSize: 0,
          blocks: this.state.blocks.concat([msgObj]),
          totalUnconfirmedTxSize: 0,
          currentBlockHeight: msgObj.x.height
        })
      }
    }
    
    this.connection.onopen = () => {
      // TODO set state with these functions
      this.setMempoolSize()
      this.fetchMempoolTxCount()
      // subscribe to unconfirmed transactions
      this.connection.send(JSON.stringify({"op":"unconfirmed_sub"}))
      // get last block data
      this.connection.send(JSON.stringify({"op":"ping_block"}))
      // subscribe to blocks
      this.connection.send(JSON.stringify({"op":"blocks_sub"}))
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
            <p>Total Size of Unconfirmed Transactions This Block:</p>
            <p>{this.state.totalUnconfirmedTxSize}</p>
          </div>
        {/*  <div className="unconf-tx-sizes">
            <p>Transaction Sizes:</p>
            <p>{this.state.unconfirmedTxSizes}</p>
          </div>
        */}
          <div className="avg-unconf-tx-size">
            <p>Average Unconfirmed Transaction Size This Block:</p>
            <p>{this.state.avgUnconfTxSize}</p>
          </div>
          <div className="largest-unconf-tx-size">
            <p>Largest Unconfirmed Transaction Size This Block:</p>
            <p>{this.state.largestUnconfTxSize}</p>
          </div>
          <div className="smallest-unconf-tx-size">
            <p>Smallest Unconfirmed Transaction Size This Block:</p>
            <p>{this.state.smallestUnconfTxSize}</p>
          </div>
          <div className="mempool-size">
            <p>Mempool Size:</p>
            <p>{this.state.mempoolSizeInMb}</p>
          </div>


        </div>
        {/*
        <ul>{ this.state.unconfirmedTxs.slice().map( (msg, idx) => <li key={'msg-' + idx }>{ JSON.stringify(msg) }</li> )}</ul> 
        */}
      </div>
    )
  }
}

export default App
