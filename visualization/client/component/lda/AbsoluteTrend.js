import React from 'react'
import echarts from 'echarts'
import _ from 'lodash'
import fetch from 'isomorphic-fetch'
import moment from 'moment'

import styles from './Main.css'
import Loading from '../Loading'

import { autobind } from 'react-decoration'
import { checkStatus, serverAddress } from '../../util'

const rawDateFormat = 'YYYY-MM-DD'
const dateFormat = 'YYYY-MM'

const getOption = ({topic, trend}) => ({
  title: {
    text: '绝对趋势',
    left: 100
  },
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
    data: topic.map((words, index) => `主题${index + 1}`)
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
      data: trend
    }
  ]
})

const transformData = (rawData) => {
  const topicAmountList = [{}, {}, {}, {}, {}] // todo refactor
  rawData.forEach(data => {
    const lda = data.lda
    const topic = lda.indexOf(Math.max(...lda))
    const date = moment(data.date, rawDateFormat).format(dateFormat)

    topicAmountList.forEach((topicAmount, index) => {
      if (index === topic) {
        topicAmount[date] = [date, _.get(topicAmount, date, ['', 0, ''])[1] + 1, `主题${index + 1}`]
      } else {
        topicAmount[date] = [date, _.get(topicAmount, date, ['', 0, ''])[1], `主题${index + 1}`]
      }
    })
  })

  return _.concat(...topicAmountList.map(_.values))
}

export default class AbsoluteTrend extends React.Component {
  constructor () {
    super()
    this.state = {
      trend: [],
      topic: []
    }
    fetch(`${serverAddress}/lda-doc`, { method: 'GET' })
      .then(checkStatus)
      .then((res) => (res.json()))
      .then((doc) => this.setState({trend: transformData(doc)}))
    fetch(`${serverAddress}/lda-topic`, { method: 'GET' })
      .then(checkStatus)
      .then((res) => (res.json()))
      .then((topic) => this.setState({topic}))
  }

  componentDidMount () {
    this.myChart = echarts.init(this.refs.AbsoluteTrend)
  }

  @autobind
  drawAbsoluteTrend () {
    const option = getOption(this.state)
    this.myChart.setOption(option)
  }

  render () {
    return <div
      className={styles.container}
      ref='AbsoluteTrend'>
      <div>
        {_.isEmpty(this.state.trend) && _.isEmpty(this.state.topic)
        ? <Loading />
        : this.drawAbsoluteTrend()}
      </div>
    </div>
  }
}
