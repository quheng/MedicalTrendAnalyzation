import React from 'react'
import echarts from 'echarts'
import styles from './AbsoluteTrend.css'

export default class AbsoluteTrend extends React.Component {
  componentDidMount () {
    const myChart = echarts.init(this.refs.AbsoluteTrend)
    const option = {}
    myChart.setOption(option)
  }

  render () {
    return (
      <div
        className={styles.container}
        ref='AbsoluteTrend' />
    )
  }
}
