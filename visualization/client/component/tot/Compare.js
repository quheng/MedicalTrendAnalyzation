import React from 'react'
import echarts from 'echarts'
import _ from 'lodash'
import fetch from 'isomorphic-fetch'
import styles from './Main.css'
import Loading from '../Loading'

import { autobind } from 'react-decoration'
import { checkStatus, apiAddress } from '../../util'

const refName = 'Compare'

const getOption = ({ topic, topicAmountList }) => ({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'line',
      lineStyle: {
        color: 'rgba(0,0,0,0.2)',
        width: 1,
        type: 'solid'
      }
    }
  },
  legend: {
    data: topic
  },
  singleAxis: {
    top: 50,
    bottom: 50,
    axisTick: {},
    axisLabel: {},
    type: 'time',
    axisPointer: {
      animation: true,
      label: {
        show: true
      }
    },
    splitLine: {
      show: true,
      lineStyle: {
        type: 'dashed',
        opacity: 0.2
      }
    }
  },
  series: [
    {
      type: 'themeRiver',
      itemStyle: {
        emphasis: {
          shadowBlur: 20,
          shadowColor: 'rgba(0, 0, 0, 0.8)'
        }
      },
      data: _.flatMap(topicAmountList.data, (topicAmountWithDate, index) =>
        (topicAmountWithDate.map((topicAmount, dateIndex) => ([
          topicAmountList.date[dateIndex],
          topicAmount,
          topic[index]
        ])))
      )
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
      topic: []
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
        topicAmountList: transformData(topicAbsAmountList)
      }))
  }

  @autobind
  isDataLoaded () {
    return !_.isEmpty(this.state.topic) && !_.isEmpty(this.state.topicAmountList)
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

  render () {
    return <div
      className={styles.container}>
      <div
        className={styles.palette}
        ref={refName}
      />
      {this.isDataLoaded()
        ? <div />
        : <Loading />}
    </div>
  }
}
