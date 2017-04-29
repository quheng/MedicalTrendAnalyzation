import React from 'react'
import echarts from 'echarts'
import _ from 'lodash'
import fetch from 'isomorphic-fetch'
import moment from 'moment'

import styles from './Main.css'

import { autobind } from 'react-decoration'
import { checkStatus, apiAddress } from '../../util'

const refName = 'AbsoluteTrend'

const rawDateFormat = 'YYYY-MM-DD'
const dateFormat = 'YYYY-MM'

const getSeries = (topicsName, topicValues) => (
  topicsName.map(topicName => ({
    name: topicName,
    type: 'bar',
    stack: '主题',
    data: topicValues[topicName]
  })))

const getOption = ({ topicsName, categoryData, topicValues, topicKeywords }) => {
  return {
    title: {
      text: '绝对趋势',
      left: 100
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: (topicList) => {
        const res = topicList.map((topic, index) => (
          `主题${index + 1} ${topicKeywords[index]}: ${topic.data}`
        ))
        return res.join('<br>')
      }
    },
    legend: {
      data: topicsName
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        data: categoryData
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: getSeries(topicsName, topicValues)
  }
}

const topicName = (index) => (`主题${index + 1}`)

const transformData = (rawData) => {
  const totalTrend = {}
  const topicTrend = []

  rawData.forEach(data => {
    const date = moment(data.date, rawDateFormat).format(dateFormat)
    totalTrend[date] = _.get(totalTrend, date, 0) + 1
    const lda = data.lda
    const topic = lda.indexOf(Math.max(...lda))
    if (_.isEmpty(topicTrend[topic])) {
      topicTrend[topic] = {}
      topicTrend[topic][date] = 1
    } else {
      topicTrend[topic][date] = _.get(topicTrend[topic], date, 0) + 1
    }
  })

  const categoryData = []
  const topicsName = topicTrend.map((topic, index) => (topicName(index)))
  const topicValues = {}
  topicsName.forEach(topicName => { topicValues[topicName] = [] })

  _.forIn(totalTrend, (totalAmount, date) => {
    categoryData.push(date)
    topicTrend.forEach((topic, index) => {
      topicValues[topicName(index)].push(_.get(topic, date, 0))
    })
  })
  return {categoryData, topicValues, topicsName}
}

export default class AbsoluteTrend extends React.Component {
  constructor () {
    super()
    this.state = {
      topicKeywords: [],
      topicValues: [],
      categoryData: [],
      topicsName: []
    }
    fetch(`${apiAddress}/lda-topic`, { method: 'GET' })
      .then(checkStatus)
      .then((res) => (res.json()))
      .then((topicKeywords) => this.setState({...this.state, topicKeywords}))

    fetch(`${apiAddress}/lda-doc`, { method: 'GET' })
      .then(checkStatus)
      .then((res) => (res.json()))
      .then((doc) => {
        const data = transformData(doc)
        this.setState({
          ...this.state,
          ...data
        })
      })
  }

  @autobind
  isDataLoaded () {
    return !_.isEmpty(this.state.topicsName)
  }

  componentDidMount () {
    this.myChart = echarts.init(this.refs[refName])
  }

  componentDidUpdate () {
    const option = getOption(this.state)
    console.log(JSON.stringify(this.state.categoryData))
    this.myChart.setOption(option)
  }

  render () {
    return <div
      className={styles.container}>
      <div
        className={styles.palette}
        ref={refName}
      />
    </div>
  }
}
