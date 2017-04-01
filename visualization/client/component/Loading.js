import React, { Component } from 'react'
import { Spin } from 'antd'

class Loading extends Component {
  render () {
    return <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <Spin style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}
        tip='数据加载中' />
    </div>
  }
}

export default Loading
