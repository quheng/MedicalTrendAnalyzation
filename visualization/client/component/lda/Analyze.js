import React from 'react'
import echarts from 'echarts'
import _ from 'lodash'
import fetch from 'isomorphic-fetch'
import styles from './Main.css'
import DynamicFieldSet from './DynamicFieldSet'

import { autobind } from 'react-decoration'
import { checkStatus, serverAddress } from '../../util'

const refName = 'Analyze'

const getOption = ({ topicList, results }) => ({
  title: {
    text: '分析结果',
    left: 88
  },
  tooltip: {},
  legend: {
    data: results.map((result, index) => `文章 ${index + 1}`)
  },
  radar: {
    indicator: topicList
  },
  series: [{
    type: 'radar',
    data: results.map((result, index) => ({name: `文章 ${index + 1}`, value: result}))
  }]
})

const transformData = (rawData) => {
  return _.map(rawData, (value, index) => ({name: `主题${index + 1}`, max: 1}))
}

export default class Analyze extends React.Component {
  constructor () {
    super()
    this.state = {
      topicList: [],
      results: []
    }
    fetch(`${serverAddress}/lda-topic`, { method: 'GET' })
      .then(checkStatus)
      .then((res) => (res.json()))
      .then((topicList) => this.setState({...this.state, topicList: transformData(topicList)}))
  }

  componentDidMount () {
    this.myChart = echarts.init(this.refs[refName])
  }

  componentDidUpdate () {
    if (this.isDataLoaded()) {
      const option = getOption(this.state)
      this.myChart.setOption(option)
    }
  }

  @autobind
  isDataLoaded () {
    return !_.isEmpty(this.state.topicList)
  }

  @autobind
  analyze (articleList) {
    this.myChart.showLoading({
      text: '分析中',
      color: '#5CACEE',
      textColor: '#000',
      maskColor: 'rgba(255, 255, 255, 0.8)',
      zlevel: 0
    })
    fetch(`${serverAddress}/lda-predict`, {
      method: 'POST',
      body: JSON.stringify(articleList),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(checkStatus)
      .then((res) => (res.json()))
      .then((results) => {
        this.myChart.hideLoading()
        this.setState({...this.state, results})
      })
  }

  render () {
    return <div className={styles.container}>
      <div className={styles.dynamicFieldSet}>
        <DynamicFieldSet analyze={this.analyze} />
      </div>
      <div ref={refName} style={{width: '60%', height: '100%'}} />
    </div>
  }
}
