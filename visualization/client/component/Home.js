import React, {Component} from 'react'
import styles from './Home.css'
import WordsCloud from './WordsCloud'
import LdaAbsoluteTrend from './lda/AbsoluteTrend'
import LdaRelativeTrend from './lda/RelativeTrend'
import LdaTopic from './lda/Topic'
import LdaAnalyze from './lda/Analyze'
import LdaParamsConfig from './lda/ParamsConfig'

import { Menu, Icon } from 'antd'
import { autobind } from 'react-decoration'
const SubMenu = Menu.SubMenu

const FUNC = {
  wordCloud: 'wordCloud',
  ldaAbsoluteTrend: 'ldaAbsoluteTrend',
  ldaRelativeTrend: 'ldaRelativeTrend',
  ldaTopic: 'ldaTopic',
  ldaAnalyze: 'ldaAnalyze',
  ldaParamsConfig: 'LdaParamsConfig',
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
        <SubMenu key='wordCloud' title={<span><Icon type='cloud-o' />词云</span>}>
          <Menu.Item key={FUNC.wordCloud}>词云</Menu.Item>
        </SubMenu>
        <SubMenu key='lda' title={<span><Icon type='api' />LDA</span>}>
          <Menu.Item key={FUNC.ldaParamsConfig}>参数配置</Menu.Item>
          <Menu.Item key={FUNC.ldaTopic}>主题关系</Menu.Item>
          <Menu.Item key={FUNC.ldaAbsoluteTrend}>绝对趋势</Menu.Item>
          <Menu.Item key={FUNC.ldaRelativeTrend}>相对趋势</Menu.Item>
          <Menu.Item key={FUNC.ldaAnalyze}>主题分析</Menu.Item>
        </SubMenu>
        <SubMenu key='tot' title={<span><Icon type='rocket' />TOT</span>}>
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
      func: FUNC.ldaParamsConfig
    }
  }

  @autobind
  getPanel () {
    switch (this.state.func) {
      case FUNC.wordCloud:
        return <WordsCloud />
      case FUNC.ldaAbsoluteTrend:
        return <LdaAbsoluteTrend />
      case FUNC.ldaRelativeTrend:
        return <LdaRelativeTrend />
      case FUNC.ldaTopic:
        return <LdaTopic />
      case FUNC.ldaAnalyze:
        return <LdaAnalyze />
      case FUNC.ldaParamsConfig:
        return <LdaParamsConfig />
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
