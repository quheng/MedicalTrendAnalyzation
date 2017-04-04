import React, {Component} from 'react'
import fetch from 'isomorphic-fetch'
import WordCloud from 'react-d3-cloud'
import _ from 'lodash'
import Loading from '../Loading'
import styles from './Main.css'

import { autobind } from 'react-decoration'
import { checkStatus, serverAddress } from '../../util'

const limit = 1000

class WordsCloud extends Component {
  constructor () {
    super()
    this.state = {
      words: [],
      limit
    }
    fetch(`${serverAddress}/words-relationship`, { method: 'GET' })
      .then(checkStatus)
      .then((res) => (res.json()))
      .then((data) => this.setState({words: data}))
  }

  @autobind
  drawWordCloud () {
    return <div className={styles.container}>
      <WordCloud
        data={_.slice(this.state.words, 0, this.state.limit).map((word) => ({text: word[0], value: word[1]}))}
        fontSizeMapper={word => Math.log2(word.value) * 5}
        rotate={word => word.value % 360}
     />
    </div>
  }

  render () {
    return _.isEmpty(this.state.words)
      ? <Loading />
      : this.drawWordCloud()
  }
}

export default WordsCloud
