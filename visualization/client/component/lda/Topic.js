import React from 'react'
import echarts from 'echarts'
import _ from 'lodash'
import fetch from 'isomorphic-fetch'

import styles from './AbsoluteTrend.css'
import Loading from '../Loading'

import { autobind } from 'react-decoration'
import { checkStatus, serverAddress } from '../../util'

const getOption = ({ topic }) => (
  {
    title: {
      text: '主题分析'
    },
    tooltip: {
      trigger: 'item',
      triggerOn: 'mousemove'
    },
    series: [
      {
        type: 'sankey',
        layout: 'none',
        data: topic.nodes,
        links: topic.links,
        itemStyle: {
          normal: {
            borderWidth: 1,
            borderColor: '#aaa'
          }
        },
        lineStyle: {
          normal: {
            color: 'source',
            curveness: 0.5
          }
        }
      }
    ]
  }
)

const transformData = (rawData) => {
  const links = []
  const nodes = _.map(rawData, (value, index) => (`主题${index + 1}`))

  rawData.forEach((index, topic) => {
    nodes.concat(...topic)
    const source = `主题${index + 1}`
    topic.forEach((word) => {
      links.push({
        source,
        target: word,
        value: 1
      })
    })
  })
  console.log(links)
  console.log(nodes)
  return {links, nodes}
}

export default class AbsoluteTrend extends React.Component {
  constructor () {
    super()
    this.state = {
      topic: []
    }
    fetch(`${serverAddress}/lda-topic`, { method: 'GET' })
      .then(checkStatus)
      .then((res) => (res.json()))
      .then((topic) => this.setState({topic: transformData(topic)}))
  }

  componentDidMount () {
    this.myChart = echarts.init(this.refs.Topic)
  }

  @autobind
  drawTopic () {
    const option = getOption(this.state)
    this.myChart.setOption(option)
  }

  render () {
    return <div
      className={styles.container}
      ref='Topic'>
      {_.isEmpty(this.state.trend) && _.isEmpty(this.state.topic)
        ? <Loading />
        : this.drawTopic()}
    </div>
  }
}
