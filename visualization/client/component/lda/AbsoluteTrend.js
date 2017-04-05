import React from 'react'
import echarts from 'echarts'
import _ from 'lodash'
import fetch from 'isomorphic-fetch'
import moment from 'moment'

import styles from './Main.css'
import Loading from '../Loading'

import { autobind } from 'react-decoration'
import { Checkbox } from 'antd'
import { checkStatus, serverAddress } from '../../util'

const refName = 'AbsoluteTrend'

const rawDateFormat = 'YYYY-MM-DD'
const dateFormat = 'YYYY-MM'

const CheckboxGroup = Checkbox.Group
const lineType = {'月线': 1, 'MA3': 3, 'MA5': 5}

const getMaCalculator = (values, dayCount) => {
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

const getSeries = (topicValues, checkedTopics) => (
  _.flatMap(checkedTopics, topic => (
    _.map(lineType, (value, key) => ({
      name: `${topic}-${key}`,
      type: 'line',
      data: getMaCalculator(topicValues[topic], value),
      smooth: true,
      lineStyle: {
        normal: {opacity: 0.5}
      }
    }))
  ))
)

const getOption = ({ categoryData, topicValues, checkedTopics }) => {
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
    grid: {
      left: '10%',
      right: '10%',
      bottom: '15%'
    },
    xAxis: {
      type: 'category',
      data: categoryData,
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
    series: getSeries(topicValues, checkedTopics)
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
      topicValues[topicName(index)].push(_.get(topic, date, 0) / totalAmount)
    })
  })
  return {categoryData, topicValues, topicsName}
}

export default class AbsoluteTrend extends React.Component {
  constructor () {
    super()
    this.state = {
      categoryData: [],
      topicValues: [],
      checkedTopics: [],
      checkedLineTypes: [],
      topicsName: [],
      lineTypeIndeterminate: true,
      lineTypeCheckAll: false,
      topicIndeterminate: true,
      topicCheckAll: false
    }
    fetch(`${serverAddress}/lda-doc`, { method: 'GET' })
      .then(checkStatus)
      .then((res) => (res.json()))
      .then((doc) => {
        const data = transformData(doc)
        this.setState({
          ...this.state,
          checkedTopics: [data.topicsName[0]],
          categoryData: data.categoryData,
          topicValues: data.topicValues,
          topicsName: data.topicsName
        })
      })
  }

  isDataLoaded () {
    return !_.isEmpty(this.state.topicsName)
  }

  componentDidMount () {
    this.myChart = echarts.init(this.refs[refName])
  }

  componentDidUpdate () {
    if (this.isDataLoaded()) {
      let option = this.myChart.getOption()
      if (_.isEmpty(option)) {
        option = getOption(this.state)
      } else {
        option.series = getSeries(this.state.topicValues, this.state.checkedTopics)
      }

      // 这里不能直接 this.myChart.setOption(series), 那样会无法去掉数据
      this.myChart.setOption(option, true)
    }
  }

  @autobind
  onTopicChange (checkedTopics) {
    const plainOptions = this.state.topicsName
    this.setState({
      ...this.state,
      checkedTopics,
      topicIndeterminate: !!checkedTopics.length && (checkedTopics.length < plainOptions.length),
      topicCheckAll: checkedTopics.length === plainOptions.length
    })
  }

  @autobind
  onTopicCheckAllChange (e) {
    this.setState({
      ...this.state,
      checkedLineType: e.target.checked ? this.state.topicsName : [],
      lineTypeIndeterminate: false,
      lineTypeCheckAll: e.target.checked
    })
  }

  @autobind
  onLineTypeChange (checkedLineTypes) {
    const plainOptions = _.keys(lineType)
    this.setState({
      ...this.state,
      checkedLineTypes,
      lineTypeIndeterminate: !!lineType && (checkedLineTypes.length < plainOptions.length),
      lineTypeCheckAll: checkedLineTypes.length === plainOptions.length
    })
  }

  @autobind
  onLineTypeCheckAllChange (e) {
    this.setState({
      ...this.state,
      checkedLineTypes: e.target.checked ? _.keys(lineType) : [],
      lineTypeIndeterminate: false,
      lineTypeCheckAll: e.target.checked
    })
  }

  @autobind
  drawCheckbox () {
    return <div style={{position: 'fixed', top: 30, right: 120}}>
      <div style={{width: 222}}>
        <div style={{borderBottom: '1px solid #E9E9E9'}}>
          <Checkbox
            topicIndeterminate={this.state.topicIndeterminate}
            onChange={this.onTopicCheckAllChange}
            checked={this.state.topicCheckAll}
          >
            全选主题
          </Checkbox>
        </div>
        <br />
        <CheckboxGroup options={this.state.topicsName} value={this.state.checkedTopics} onChange={this.onTopicChange} />
      </div>

      <div style={{width: 222}}>
        <div style={{ borderBottom: '1px solid #E9E9E9' }}>
          <Checkbox
            topicIndeterminate={this.state.topicIndeterminate}
            onChange={this.onLineTypeCheckAllChange}
            checked={this.state.lineTypeCheckAll}
          >
            全选类型
          </Checkbox>
        </div>
        <br />
        <CheckboxGroup options={_.keys(lineType)} value={this.state.checkedLineTypes} onChange={this.onLineTypeChange} />
      </div>
    </div>
  }

  render () {
    return <div
      className={styles.container}>
      <div
        className={styles.palette}
        ref={refName}
      />
      {this.isDataLoaded()
        ? this.drawCheckbox()
        : <Loading />}
    </div>
  }
}
