import React, { Component } from 'react'
import Anime from 'react-anime';
import '../assets/styles/Block.css'

class Block extends Component {
  constructor() {
    super()
    this.state = {
      blocks: [],
      currentBlockHeight: 0
    }
  }

  componentDidMount(){
    this.connection = new WebSocket('wss://ws.blockchain.info/inv')
    this.connection.onmessage = evt => { 
      var msgObj = JSON.parse(evt.data)

      if (msgObj.op === 'block'){
        console.log('pool:' + msgObj.x.foundBy.description)
        console.log('totalBTCSent:' + msgObj.x.totalBTCSent / 100000000)
        console.log('#tx:' + msgObj.x.nTx)
        console.log('blockSize:' + msgObj.x.size)
        this.setState({
          blocks: this.state.blocks.concat([msgObj]),
          currentBlockHeight: msgObj.x.height
        })
      }
    }
    
    this.connection.onopen = () => {
      // get last block data
      this.connection.send(JSON.stringify({"op":"ping_block"}))
      // subscribe to blocks
      this.connection.send(JSON.stringify({"op":"blocks_sub"}))
    }
  }

  render() {
    return (
      <div className="block">
        <div className="data-container">
          <div className="block-height">

          </div>
        </div>
      </div>
    )
  }
}

export default Block
