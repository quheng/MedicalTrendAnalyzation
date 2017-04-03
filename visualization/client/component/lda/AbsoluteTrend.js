import React from 'react'
import echarts from 'echarts'
import _ from 'lodash'
import fetch from 'isomorphic-fetch'

import styles from './AbsoluteTrend.css'
import Loading from '../Loading'

import { autobind } from 'react-decoration'
import { checkStatus, serverAddress } from '../../util'

const getMaCalculator = (values) => (dayCount) => {
  const result = []
  for (let i = 0, len = values.length; i < len; i++) {
    if (i < dayCount) {
      result.push('-')
      continue
    }
    let sum = 0
    for (let j = 0; j < dayCount; j++) {
      sum += values[i - j]
    }
    result.push(sum / dayCount)
  }
  return result
}

const getOption = (trend) => {
  const calculateMA = getMaCalculator(trend.values)
  return {
    title: {
      text: '绝对趋势',
      left: 100
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    legend: {
      data: ['MA5', 'MA10', 'MA20', 'MA30']
    },
    grid: {
      left: '10%',
      right: '10%',
      bottom: '15%'
    },
    xAxis: {
      type: 'category',
      data: trend.categoryData,
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
    ],
    series: [
      {
        name: 'MA5',
        type: 'line',
        data: calculateMA(5),
        smooth: true,
        lineStyle: {
          normal: {opacity: 0.5}
        }
      },
      {
        name: 'MA10',
        type: 'line',
        data: calculateMA(10),
        smooth: true,
        lineStyle: {
          normal: {opacity: 0.5}
        }
      },
      {
        name: 'MA20',
        type: 'line',
        data: calculateMA(20),
        smooth: true,
        lineStyle: {
          normal: {opacity: 0.5}
        }
      },
      {
        name: 'MA30',
        type: 'line',
        data: calculateMA(30),
        smooth: true,
        lineStyle: {
          normal: {opacity: 0.5}
        }
      }

    ]
  }
}

const transformData = (rawData) => {
  const trend = {}
  rawData.forEach(data => {
    trend[data.date] = _.get(trend, data.date, 0) + 1
  })
  const categoryData = []
  const values = []
  _.forIn(trend, (value, key) => {
    categoryData.push(key)
    values.push(value)
  })
  return {categoryData, values}
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
  drawAbsoluteTrend () {
    const option = getOption(this.state.trend)
    this.myChart.setOption(option)
  }

  render () {
    return <div
      className={styles.container}
      ref='AbsoluteTrend'>
      {_.isEmpty(this.state.trend)
        ? <Loading />
        : this.drawAbsoluteTrend()}
    </div>
  }
}