import React from 'react'
import echarts from 'echarts'
import _ from 'lodash'
import fetch from 'isomorphic-fetch'

import styles from './AbsoluteTrend.css'
import Loading from './Loading'

import { autobind } from 'react-decoration'
import { checkStatus, serverAddress } from '../util'

const getOption = (topic, data) => ({
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
    data: [1, 2, 3, 4]  // todo
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
      data
    }
  ]
})

const transformData = (rawData) => {
  const topicAmountList = []
  rawData.forEach(data => {
    const lda = data.lda
    const topic = lda.indexOf(Math.max(...lda))
    if (_.isEmpty(topicAmountList[topic])) {
      topicAmountList[topic] = {}
      topicAmountList[topic][data.date] = [data.date, 1, topic]
    } else {
      topicAmountList[topic][data.date] = _.get(topicAmountList[topic], data.date, 0) + 1
    }
  })
  console.log(...topicAmountList)
  return _.concat(...topicAmountList)
}

export default class AbsoluteTrend extends React.Component {
  constructor () {
    super()
    this.state = {
      trend: []
    }
    fetch(`${serverAddress}/lda-doc`, { method: 'GET' })
      .then(checkStatus)
      .then((res) => (res.json()))
      .then((doc) => this.setState({trend: transformData(doc)}))
  }

  componentDidMount () {
    this.myChart = echarts.init(this.refs.AbsoluteTrend)
  }

  @autobind
  drawRelativeTrend () {
    const option = getOption()
    this.myChart.setOption(option)
  }

  render () {
    return <div
      className={styles.container}
      ref='RelativeTrend'>
      {_.isEmpty(this.state.trend)
        ? <Loading />
        : this.drawRelativeTrend()}
    </div>
  }
}
