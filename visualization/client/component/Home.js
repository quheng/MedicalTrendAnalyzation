import React, {Component} from 'react'
import styles from './Home.css'
import WordsCloud from './WordsCloud'
import AbsoluteTrend from './AbsoluteTrend'

import { Menu, Icon } from 'antd'
import { autobind } from 'react-decoration'
const SubMenu = Menu.SubMenu

const FUNC = {
  ldaWordCloud: 'ldaWordCloud',
  absoluteTrend: 'absoluteTrend',
  todo: 'todo'
}

class Sider extends React.Component {
  render () {
    return (
      <Menu
        onClick={(e) => { this.props.changeFunc(e.key) }}
        className={styles.sider}
        defaultSelectedKeys={[FUNC.ldaWordCloud]}
        defaultOpenKeys={['lda']}
        mode='inline'
      >
        <SubMenu key='lda' title={<span><Icon type='api' /><span>LDA</span></span>}>
          <Menu.Item key={FUNC.ldaWordCloud}>词云</Menu.Item>
          <Menu.Item key={FUNC.absoluteTrend}>绝对数量趋势</Menu.Item>
        </SubMenu>
        <SubMenu key='tot' title={<span><Icon type='rocket' /><span>TOT</span></span>}>
          <Menu.Item key='tot-todo'>敬请期待</Menu.Item>
        </SubMenu>
      </Menu>
    )
  }
}

class Home extends Component {
  constructor () {
    super()
    this.state = {
      func: FUNC.ldaWordCloud
    }
  }

  @autobind
  getPanel () {
    switch (this.state.func) {
      case FUNC.ldaWordCloud:
        return <WordsCloud />
      case FUNC.absoluteTrend:
        return <AbsoluteTrend />
      default:
        return <div>敬请期待</div>
    }
  }

  @autobind
  changeFunc (func) {
    this.setState({
      func
    })
  }

  render () {
    return (
      <div className={styles.container}>
        <Sider changeFunc={this.changeFunc} />
        {
          this.getPanel()
        }
      </div>
    )
  }
}

export default Home
