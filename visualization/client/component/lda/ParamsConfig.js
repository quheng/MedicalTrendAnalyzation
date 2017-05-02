import React from 'react'
import echarts from 'echarts'
import _ from 'lodash'
import fetch from 'isomorphic-fetch'
import styles from './Main.css'

import { autobind } from 'react-decoration'
import { Tooltip, Modal, Form, Button, Slider, Spin, message, Progress, Select } from 'antd'
import { checkStatus, apiAddress } from '../../util'

const refName = 'ParamsConfig'
const FormItem = Form.Item
const Option = Select.Option
const autoTopicAmount = 'auto'

const maxTopicNumber = 21
const minTopicNumber = 2

const getOption = ({ config }) => ({
  title: {
    text: '困惑度分析',
    left: 80
  },
  tooltip: {
    formatter: (item) => {
      const data = item.data
      return data[2].map(keywords => keywords.join(' ')).join('<br>')
    }
  },
  xAxis: {
    min: minTopicNumber,
    max: maxTopicNumber,
    splitLine: {
      lineStyle: {
        type: 'dashed'
      }
    }
  },
  yAxis: {
    splitLine: {
      lineStyle: {
        type: 'dashed'
      }
    },
    scale: true
  },
  series: [{
    data: config.model_info,
    type: 'scatter',
    symbolSize: function (data) {
      return data[3]
    },
    itemStyle: {
      normal: {
        shadowBlur: 10,
        shadowColor: 'rgba(25, 100, 150, 0.5)',
        shadowOffsetY: 5,
        color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [{
          offset: 0,
          color: 'rgb(129, 227, 238)'
        }, {
          offset: 1,
          color: 'rgb(25, 183, 207)'
        }])
      }
    }
  }, {
    type: 'line',
    smooth: true,
    showSymbol: false,
    hoverAnimation: false,
    data: config.model_info
  }]
})

class ConfigForm extends React.Component {
  @autobind
  handleSubmit (e) {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (values.min_df > values.max_df) {
          message.error('最小词频大于最大词频')
        } else {
          this.props.submitParams(values)
        }
      }
    })
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const { max_df, min_df, topic_keywords, max_iter, topic_amount } = this.props.preConfig
    const value = _.isEmpty(this.props.form.getFieldsValue()) ? this.props.preConfig : this.props.form.getFieldsValue()
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem
          label={`主题数量 ${typeof value['topic_amount'] === 'number' ? value['topic_amount'] : '由困惑度自动选取'}`}
        >
          {getFieldDecorator('topic_amount', {
            initialValue: topic_amount
          })(
            <Select>
              <Option value={autoTopicAmount}>由困惑度自动选取</Option>
              {
                [...new Array(maxTopicNumber - minTopicNumber).keys()].map((value) => (
                  <Option value={value + minTopicNumber}>{value + minTopicNumber}</Option>
                ))
              }
            </Select>
          )}
        </FormItem>
        <FormItem
          label={`最大词频 ${value['max_df']}`}
        >
          {getFieldDecorator('max_df', {
            initialValue: max_df
          })(
            <Slider max='1' step='0.01' />
            )}
        </FormItem>
        <FormItem
          label={`最小词频 ${value['min_df']}`}
        >
          {getFieldDecorator('min_df', {
            initialValue: min_df
          })(
            <Slider max='1' step='0.01' />
          )}
        </FormItem>
        <FormItem
          label={`关键词数量 ${value['topic_keywords']}`}
        >
          {getFieldDecorator('topic_keywords', {
            initialValue: topic_keywords
          })(
            <Slider max='10' />
          )}
        </FormItem>

        <FormItem
          label={`最大迭代次数 ${value['max_iter']}`}
        >
          {getFieldDecorator('max_iter', {
            initialValue: max_iter
          })(
            <Slider max='10' />
          )}
        </FormItem>

        <FormItem>
          <Tooltip placement='topLeft' title='生成模型需花费约 5 min 左右，请使用脚本生成'>
            <Button type='primary' htmlType='submit' disabled>
              生成
            </Button>
          </Tooltip>
        </FormItem>
      </Form>
    )
  }
}

const WrappedConfigForm = Form.create()(ConfigForm)

const transformData = (rawData) => {
  const modelInfo = []
  const topicAmount = rawData.topic_amount === autoTopicAmount
    ? rawData.min_perplexity_index
    : rawData.topic_amount

  rawData.model_info.forEach(model => {
    const topicList = model.topic_list
    const weight = topicList.length === topicAmount ? 35 : 15
    modelInfo.push([topicList.length, model.perplexity, topicList, weight])
  })
  return {
    ...rawData,
    model_info: modelInfo
  }
}

export default class AbsoluteTrend extends React.Component {
  constructor () {
    super()
    this.state = {
      config: {},
      showModal: false,
      percent: 0
    }
    fetch(`${apiAddress}/lda-config`, { method: 'GET' })
      .then(checkStatus)
      .then((res) => (res.json()))
      .then((rawData) => this.setState({...this.state, config: transformData(rawData)}))
  }

  @autobind
  isDataLoaded () {
    return !_.isEmpty(this.state.config)
  }

  componentDidMount () {
    this.myChart = echarts.init(this.refs[refName])
  }

  componentDidUpdate () {
    const option = getOption(this.state)
    this.myChart.setOption(option)
  }

  @autobind
  addPercent () {
    if (this.state.percent < 99 || !_.isEmpty(this.state.config)) {
      this.setState({...this.state, percent: this.state.percent + 1})
    }
    setTimeout(this.addPercent, 300)
  }

  @autobind
  submitParams (value) {
    value['is_saving'] = true
    fetch(`${apiAddress}/lda-config`, {
      method: 'POST',
      body: JSON.stringify(value),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(checkStatus)
      .then((res) => (res.json()))
      .then((results) => {
        this.myChart.hideLoading()
        this.setState({...this.state, config: transformData(results)})
      })

    this.setState({...this.state, config: {}, showModal: true, percent: 0})
    setTimeout(this.addPercent, 300)
  }

  render () {
    return <div
      className={styles.container}>
      <Modal
        visible={this.state.showModal}
        title={this.state.percent > 99 ? '保存成功' : '模型生成中'}
        footer={this.state.percent > 99
          ? <Button
            key='submit'
            onClick={() => { this.setState({ ...this.state, percent: 0, showModal: false }) }}
            >
              确认
            </Button>
          : <div />}
        closable={false}
        width='450'
      >
        <div
          style={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}
        >
          <Progress type='circle' percent={this.state.percent} />
        </div>
      </Modal>
      <div
        style={{
          width: '20%',
          display: 'flex',
          height: '100%',
          flexDirection: 'column',
          justifyContent: 'flex-start'
        }}
      >
        <h1 style={{marginBottom: 23}}> 参数配置 </h1>
        {
          this.isDataLoaded()
            ? <WrappedConfigForm preConfig={this.state.config} submitParams={this.submitParams} />
            : <div style={{textAlign: 'center'}}> <Spin /> </div>
        }
      </div>
      <div
        style={{width: '80%', height: '100%'}}
        ref={refName}
      />
    </div>
  }
}
