import React, {Component} from 'react'
import fetch from 'isomorphic-fetch'
import WordCloud from 'react-d3-cloud'
import _ from 'lodash'
import Loading from '../Loading'
import Dimensions from 'react-dimensions'

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
    fetch(`${serverAddress}/words-relationship/${limit}`, { method: 'GET' })
      .then(checkStatus)
      .then((res) => (res.json()))
      .then((data) => this.setState({words: data}))
  }

  @autobind
  drawWordCloud () {
    console.log(this.props)
    return <WordCloud
      width={this.props.containerWidth}
      height={this.props.containerHeight}
      data={this.state.words.map((word) => ({text: word[0], value: word[1]}))}
      fontSizeMapper={word => word.value / 100}
      rotate={word => word.value % 360}
     />
  }

  render () {
    return _.isEmpty(this.state.words)
      ? <Loading />
      : this.drawWordCloud()
  }
}

export default Dimensions()(WordsCloud)
