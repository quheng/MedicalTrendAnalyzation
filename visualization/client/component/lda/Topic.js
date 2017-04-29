import React from 'react'
import echarts from 'echarts'
import _ from 'lodash'
import fetch from 'isomorphic-fetch'

import styles from './Main.css'

import { autobind } from 'react-decoration'
import { checkStatus, apiAddress } from '../../util'

const refName = 'AbsoluteTrend'

const getOption = ({ keywords, wordsTopics, nodes, links }) => (
  {
    title: {
      text: '主题分析',
      left: 100
    },
    tooltip: {
      trigger: 'item',
      triggerOn: 'mousemove',
      formatter: (item) => {
        const data = item.data
        if (!_.isEmpty(data.source)) {
          return `${data.source}-${data.target}`
        }
        if (!_.isEmpty(_.get(keywords, data.name))) {
          return keywords[data.name]
        } else {
          return Array.from(wordsTopics[data.name])
        }
      }
    },
    series: [
      {
        type: 'sankey',
        layout: 'none',
        data: nodes,
        links: links,
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
  const nodes = _.uniq(_.concat(_.map(rawData, (value, index) => (`主题${index + 1}`)), ...rawData))
  const keywords = {}
  const wordsTopics = {}
  rawData.forEach((topicKeywords, index) => {
    const source = `主题${index + 1}`
    keywords[source] = topicKeywords
    topicKeywords.forEach((word) => {
      wordsTopics[word] = _.get(wordsTopics, word, new Set()).add(source)
      links.push({
        source,
        target: word,
        value: 1
      })
    })
  })

  return {
    wordsTopics,
    keywords,
    links,
    nodes: nodes.map((node) => ({name: node}))
  }
}

export default class Topic extends React.Component {
  constructor () {
    super()
    this.state = {
      topic: []
    }
    fetch(`${apiAddress}/lda-topic`, { method: 'GET' })
      .then(checkStatus)
      .then((res) => (res.json()))
      .then((topic) => this.setState({...this.state, ...transformData(topic)}))
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
  isDataLoaded () {
    return !_.isEmpty(this.state.nodes)
  }

  render () {
    return <div
      className={styles.container}
      ref={refName}
    />
  }
}
