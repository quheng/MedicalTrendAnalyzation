import React from 'react'
import echarts from 'echarts'
import _ from 'lodash'
import fetch from 'isomorphic-fetch'
import styles from './Main.css'
import Loading from '../Loading'

import { autobind } from 'react-decoration'
import { Form, Input, Button } from 'antd'
import { checkStatus, serverAddress } from '../../util'

const FormItem = Form.Item

function hasErrors (fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field])
}

class InputForm extends React.Component {
  componentDidMount () {
    this.props.form.validateFields()
  }

  @autobind
  handleSubmit (e) {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
      }
    })
  }

  render () {
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form

    const textError = isFieldTouched('text') && getFieldError('text')

    return (
      <Form layout='vertical' onSubmit={this.handleSubmit}>
        <FormItem
          validateStatus={textError ? 'error' : ''}
          help={textError || ''}
        >
          {getFieldDecorator(' text', {
            rules: [{ required: true, message: '请输入文章内容' }]
          })(
            <Input placeholder='请输入文章内容' />
          )}
        </FormItem>
        <FormItem>
          <Button
            type='primary'
            htmlType='submit'
            disabled={hasErrors(getFieldsError())}
          >
            分析
          </Button>
        </FormItem>
      </Form>
    )
  }
}

const WrappedInputForm = Form.create()(InputForm)

const getOption = ({ topic, result }) => ({
  title: {
    text: '分析结果'
  },
  tooltip: {},
  legend: {
    data: ['预算分配（Allocated Budget）']
  },
  radar: {
    indicator: topic
  },
  series: [{
    name: '预算 vs 开销（Budget vs spending）',
    type: 'radar',
    data: result
  }]
})

const transformData = (rawData) => {
  return _.map(rawData, (value, index) => ({name: `主题${index + 1}`}))
}

export default class Analyze extends React.Component {
  constructor () {
    super()
    this.state = {
      trend: [],
      result: []
    }
    fetch(`${serverAddress}/lda-topic`, { method: 'GET' })
      .then(checkStatus)
      .then((res) => (res.json()))
      .then((topic) => this.setState({topic: transformData(topic)}))
  }

  componentDidMount () {
    this.myChart = echarts.init(this.refs.Analyze)
  }

  drawAnalyze () {
    const option = getOption(this.state)
    this.myChart.setOption(option)
  }

  render () {
    return <div
      className={styles.container}>
      <WrappedInputForm />
      <div ref='Analyze' style={{padding: '-100px', width: '80%', height: '100%'}}>
        {_.isEmpty(this.state.topic)
          ? <Loading />
          : this.drawAnalyze()}
      </div>
    </div>
  }
}
