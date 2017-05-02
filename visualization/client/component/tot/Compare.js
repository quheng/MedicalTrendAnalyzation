import React from 'react'
import echarts from 'echarts'
import _ from 'lodash'
import fetch from 'isomorphic-fetch'
import styles from './Main.css'
import Loading from '../Loading'

import { autobind } from 'react-decoration'
import { Select } from 'antd'
import { checkStatus, apiAddress } from '../../util'

const refName = 'Compare'
const Option = Select.Option

const getOption = ({ topic, totTopicAmountList, ldaTopicAmountList, selectedTopic }) => ({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross'
    }
  },
  grid: {
    left: '10%',
    right: '10%',
    bottom: '15%'
  },
  xAxis: {
    type: 'category',
    data: totTopicAmountList.date,
    scale: true,
    boundaryGap: false,
    axisLine: {onZero: false},
    splitLine: {show: false},
    splitNumber: 20,
    min: 'dataMin',
    max: 'dataMax'
  },
  yAxis: {
    scale: true,
    splitArea: {
      show: true
    }
  },
  dataZoom: [
    {
      type: 'inside',
      start: 50,
      end: 100
    },
    {
      show: true,
      type: 'slider',
      y: '90%',
      start: 50,
      end: 100
    }
  ]
})

const transformData = (topicAbsAmountList) => {
  const totalAmount = _.zip(...topicAbsAmountList.data).map(_.sum)
  return {
    data: topicAbsAmountList.data.map(topicAbsAmount => (
      topicAbsAmount.map((amount, index) => amount / totalAmount[index])
    )),
    date: topicAbsAmountList.date
  }
}

export default class RelativeTrend extends React.Component {
  constructor () {
    super()
    this.state = {
      topic: [],
      selectedTopic: 0,
      totTopicAmountList: [],
      ldaTopicAmountList: []
    }
    fetch(`${apiAddress}/tot-topic`, { method: 'GET' })
      .then(checkStatus)
      .then((res) => (res.json()))
      .then((topic) => this.setState({...this.state, topic}))
    fetch(`${apiAddress}/tot-topic-amount`, { method: 'GET' })
      .then(checkStatus)
      .then((res) => (res.json()))
      .then((topicAbsAmountList) => this.setState({
        ...this.state,
        totTopicAmountList: transformData(topicAbsAmountList)
      }))
    fetch(`${apiAddress}/lda-topic-amount`, { method: 'GET' })
      .then(checkStatus)
      .then((res) => (res.json()))
      .then((topicAbsAmountList) => this.setState({
        ...this.state,
        ldaTopicAmountList: transformData(topicAbsAmountList)
      }))
  }

  @autobind
  isDataLoaded () {
    return !_.isEmpty(this.state.topic) &&
      !_.isEmpty(this.state.ldaTopicAmountList) &&
      !_.isEmpty(this.state.totTopicAmountList)
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
  handleChange (value) {
    this.setState({
      ...this.state,
      selectedTopic: value
    })
  }

  render () {
    return <div
      className={styles.container}>
      <div
        className={styles.palette}
        ref={refName}
      />
      {this.isDataLoaded()
        ? <div className={styles.topicSelector}>
          <p>请选择主题进行对比，主题名称是对关键词的人工解释</p>
          <Select defaultValue={this.state.topic[0]} style={{ width: 120 }} onChange={this.handleChange}>
            {
                this.state.topic.map((topic, index) => (
                  <Option value={index}>{topic}</Option>
                ))
              }
          </Select>
        </div>
        : <Loading />}
    </div>
  }
}
