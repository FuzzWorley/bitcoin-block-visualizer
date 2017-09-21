import React, { Component } from 'react'
import Anime from 'react-anime';
import '../assets/styles/Transaction.css'

class Transaction extends Component {
  constructor() {
    super()
    this.state = {
      unconfirmedTxs: [],
      unconfirmedTxSizes: [],
      totalUnconfirmedTxSize: 0,
      avgUnconfTxSize: 0,
      largestUnconfTxSize: 0,
      smallestUnconfTxSize: 10000000
    }
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
    this.connection = new WebSocket('wss://ws.blockchain.info/inv')
    this.connection.onmessage = evt => { 
      var msgObj = JSON.parse(evt.data)

      if (msgObj.op === 'utx') {
        var txSize = msgObj.x.size
        console.log(msgObj.x.outputs)
        this.setMaxTxSize(txSize)
        this.setMinTxSize(txSize)
        this.setState({
          unconfirmedTxs: [msgObj].concat(this.state.unconfirmedTxs),
          totalUnconfirmedTxSize: this.state.totalUnconfirmedTxSize + txSize,
          unconfirmedTxSizes: ([txSize].concat(this.state.unconfirmedTxSizes)).reverse(),
          avgUnconfTxSize: this.getAvgTxSize(this.state.unconfirmedTxSizes)
        })
      }
    }
    
    this.connection.onopen = () => {
      // subscribe to unconfirmed transactions
      this.connection.send(JSON.stringify({"op":"unconfirmed_sub"}))
    }
  }

  render() {
    return (
      <div className="transaction">
        <div className="data-container">
          <div className="text title">
            <p>Total Size of Unconfirmed Transactions This Block</p>
          </div>
          <Anime scale={this.state.totalUnconfirmedTxSize / 2000}
                 easing="easeOutQuart"
          >
            <div className="txn-container">
            </div>
          </Anime>
          <div className="total-unconf-tx-size">
            <p className="number text">{this.state.totalUnconfirmedTxSize} kb</p>
          </div> 
        </div>
      </div>
    )
  }
}

export default Transaction
