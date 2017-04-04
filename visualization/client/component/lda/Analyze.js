import React from 'react'
import echarts from 'echarts'
import _ from 'lodash'
import fetch from 'isomorphic-fetch'
import styles from './Main.css'
import Loading from '../Loading'
import DynamicFieldSet from './DynamicFieldSet'

import { autobind } from 'react-decoration'
import { checkStatus, serverAddress } from '../../util'

const getOption = ({ topic, result }) => ({
  title: {
    text: '分析结果',
    left: 100
  },
  tooltip: {},
  legend: {
    data: ['预算分配（Allocated Budget）']
  },
  radar: {
    indicator: topic
  },
  series: [{
    name: '预算 vs 开销（Budget vs spending）',
    type: 'radar',
    data: result
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
      result: []
    }
    fetch(`${serverAddress}/lda-topic`, { method: 'GET' })
      .then(checkStatus)
      .then((res) => (res.json()))
      .then((topic) => this.setState({topic: transformData(topic)}))
  }

  componentDidMount () {
    this.myChart = echarts.init(this.refs.Analyze)
  }

  @autobind
  drawAnalyze () {
    const option = getOption(this.state)
    this.myChart.setOption(option)
  }

  render () {
    return <div className={styles.container}>
      <div className={styles.dynamicFieldSet}>
        <DynamicFieldSet />
      </div>
      <div ref='Analyze' style={{width: '60%', height: '100%'}}>
        {_.isEmpty(this.state.topic)
          ? <Loading />
          : this.drawAnalyze()}
      </div>
    </div>
  }
}
