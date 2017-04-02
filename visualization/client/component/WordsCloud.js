import React, {Component} from 'react'
import fetch from 'isomorphic-fetch'
import WordCloud from 'react-d3-cloud'
import _ from 'lodash'
import Loading from './Loading'
import styles from './WordsCloud.css'
import Slider from 'nw-react-slider'

import { autobind } from 'react-decoration'
import { checkStatus, serverAddress } from '../util'

const limit = 100

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
        className={styles.wordCloud}
        data={_.slice(this.state.words, 0, limit).map((word) => ({text: word[0], value: word[1]}))}
        fontSizeMapper={word => Math.log2(word.value) * 5}
        rotate={word => word.value % 360}
     />
      <Slider
        value={3}
        min={1}
        max={5}
        onChange={function () {}}
        ticks
        markerLabel={[]} />
    </div>
  }

  render () {
    return _.isEmpty(this.state.words)
      ? <Loading />
      : this.drawWordCloud()
  }
}

export default WordsCloud
