import React, { Component } from 'react'
import Anime from 'react-anime';
import request from 'superagent';
import cloud from '../assets/images/cloud.svg'
import '../assets/styles/Mempool.css'

class Mempool extends Component {
  constructor() {
    super()
    this.state = {
      mempoolSizeInMb: 0,
      mempoolTxCount: 0
    }
  }

  limitCalls(interval) {
    setInterval(() => {
      this.setMempoolSize()
    }, interval)
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

  translateMempoolSizeToScale() {
    return this.state.mempoolSizeInMb * 100
  }

  componentDidMount(){
    this.setMempoolSize()
    this.limitCalls(10000)
  }

  render() {
    return (
      <div className="Mempool">
        <div className="mempool-container">
          <Anime height={this.translateMempoolSizeToScale()}
          		 easing="easeOutQuart"
          >
            <div className="mempool-img-container">
	          <div className="text mem-text">
	            <p className="title">Mempool Size</p>
	            <p className="number">{this.state.mempoolSizeInMb} mb</p>
	          </div>
            </div>
          </Anime>
        </div>
      </div>
    )
  }
}

export default Mempool