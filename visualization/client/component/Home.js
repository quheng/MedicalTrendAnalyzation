import React, {Component} from 'react'
import styles from './Home.css'
import LdaWordsCloud from './lda/WordsCloud'
import LdaAbsoluteTrend from './lda/RelativeTrend'
import LdaRelativeTrend from './lda/AbsoluteTrend'
import LdaTopic from './lda/Topic'
import LdaAnalyze from './lda/Analyze'

import { Menu, Icon } from 'antd'
import { autobind } from 'react-decoration'
const SubMenu = Menu.SubMenu

const FUNC = {
  ldaWordCloud: 'ldaWordCloud',
  ldaAbsoluteTrend: 'ldaAbsoluteTrend',
  ldaRelativeTrend: 'ldaRelativeTrend',
  ldaTopic: 'ldaTopic',
  ldaAnalyze: 'ldaAnalyze',
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
          <Menu.Item key={FUNC.ldaTopic}>主题关系</Menu.Item>
          <Menu.Item key={FUNC.ldaAbsoluteTrend}>绝对数量趋势</Menu.Item>
          <Menu.Item key={FUNC.ldaRelativeTrend}>相对数量趋势</Menu.Item>
          <Menu.Item key={FUNC.ldaAnalyze}>文章主题分析</Menu.Item>
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
      func: FUNC.ldaAbsoluteTrend
    }
  }

  @autobind
  getPanel () {
    switch (this.state.func) {
      case FUNC.ldaWordCloud:
        return <LdaWordsCloud />
      case FUNC.ldaAbsoluteTrend:
        return <LdaAbsoluteTrend />
      case FUNC.ldaRelativeTrend:
        return <LdaRelativeTrend />
      case FUNC.ldaTopic:
        return <LdaTopic />
      case FUNC.ldaAnalyze:
        return <LdaAnalyze />
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
