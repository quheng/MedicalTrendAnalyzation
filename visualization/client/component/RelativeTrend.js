import React from 'react'
import echarts from 'echarts'
import _ from 'lodash'
import fetch from 'isomorphic-fetch'
import styles from './AbsoluteTrend.css'
import Loading from './Loading'

import { autobind } from 'react-decoration'
import { checkStatus, serverAddress } from '../util'

const getOption = (trend) => {

}

const transformData = (rawData) => {

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
    const option = getOption(this.state.trend)
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
