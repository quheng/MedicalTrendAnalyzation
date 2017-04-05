import React from 'react'
import echarts from 'echarts'
import _ from 'lodash'
import fetch from 'isomorphic-fetch'
import styles from './Main.css'
import Loading from '../Loading'
import DynamicFieldSet from './DynamicFieldSet'

import { autobind } from 'react-decoration'
import { checkStatus, serverAddress } from '../../util'

const getOption = ({ topic, results }) => ({
  title: {
    text: '分析结果',
    left: 100
  },
  tooltip: {},
  legend: {
    data: results.map((result, index) => `文章 ${index + 1}`)
  },
  radar: {
    indicator: topic
  },
  series: [{
    name: '预算 vs 开销（Budget vs spending）',
    type: 'radar',
    data: results.map((result, index) => ({name: `文章 ${index + 1}`, value: result}))
  }]
})

const transformData = (rawData) => {
  return _.map(rawData, (value, index) => ({name: `主题${index + 1}`}))
}

export default class Analyze extends React.Component {
  constructor () {
    super()
    this.state = {
      trend: [],
      results: []
    }
    fetch(`${serverAddress}/lda-topic`, { method: 'GET' })
      .then(checkStatus)
      .then((res) => (res.json()))
      .then((topic) => this.setState({...this.state, topic: transformData(topic)}))
  }

  componentDidMount () {
    this.myChart = echarts.init(this.refs.Analyze)
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

  @autobind
  drawAnalyze () {
    const option = getOption(this.state)
    this.myChart.setOption(option)
  }

  render () {
    return <div className={styles.container}>
      <div className={styles.dynamicFieldSet}>
        <DynamicFieldSet analyze={this.analyze} />
      </div>
      <div ref='Analyze' style={{width: '60%', height: '100%'}}>
        <div>
          {_.isEmpty(this.state.topic)
          ? <Loading />
          : this.drawAnalyze()}
        </div>
      </div>
    </div>
  }
}
