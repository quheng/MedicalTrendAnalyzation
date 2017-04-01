import React, {Component} from 'react'
import { Menu, Icon } from 'antd'

const SubMenu = Menu.SubMenu

const FUNC = {
  ldaWordCloud: 'ldaWordCloud',
  todo: 'todo'
}

class Sider extends React.Component {
  render () {
    return (
      <Menu
        onClick={(e) => { this.props.changeFunc(e.key) }}
        style={{ width: 120, height: 1000 }}
        defaultSelectedKeys={[FUNC.ldaWordCloud]}
        defaultOpenKeys={['lda']}
        mode='inline'
      >
        <SubMenu key='lda' title={<span><Icon type='api' /><span>LDA</span></span>}>
          <Menu.Item key={FUNC.ldaWordCloud}>词云</Menu.Item>
        </SubMenu>
        <SubMenu key='tot' title={<span><Icon type='rocket' /><span>TOT</span></span>}>
          <Menu.Item key='tot-todo'>敬请期待</Menu.Item>
        </SubMenu>
      </Menu>
    )
  }
}

class Home extends Component {
  state = {
    func: FUNC.ldaWordCloud
  }

  changeFunc (func) {
    console.log(this)
    this.setState({
      func
    })
  }

  render () {
    return (
      <div >
        <Sider changeFunc={this.changeFunc} />
        {this.state.func}
      </div>
    )
  }
}

export default Home
