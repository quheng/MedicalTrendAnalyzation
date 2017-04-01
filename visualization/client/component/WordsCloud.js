import React, {Component} from 'react'
import fetch from 'isomorphic-fetch'
import { checkStatus, serverAddress } from '../util'

class WordsCloud extends Component {
  constructor () {
    super()
    this.state = {
      words: []
    }
    fetch(`${serverAddress}/words-relationship`, { method: 'GET' })
      .then(checkStatus)
      .then((res) => (res.json()))
      .then((resJson) => console.log(resJson))
  }

  render () {
    return <div> words cloud </div>
  }
}

export default WordsCloud
