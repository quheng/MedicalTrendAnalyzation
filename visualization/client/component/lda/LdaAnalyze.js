import React from 'react'
import echarts from 'echarts'

import styles from './Main.css'

import { autobind } from 'react-decoration'
import { Form, Input, Button } from 'antd'

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

export const WrappedInputForm = Form.create()(InputForm)

const getOption = () => ({
  title: {
    text: '自定义雷达图'
  },
  radar: [
    {
      indicator: [
        { text: '指标一' },
        { text: '指标二' },
        { text: '指标三' },
        { text: '指标四' }
      ],
      center: ['25%', '50%'],
      radius: 120,
      startAngle: 90,
      splitNumber: 4,
      shape: 'circle',
      name: {
        formatter: '【{value}】',
        textStyle: {
          color: '#72ACD1'
        }
      },
      splitArea: {
        areaStyle: {
          color: ['rgba(114, 172, 209, 0.2)',
            'rgba(114, 172, 209, 0.4)', 'rgba(114, 172, 209, 0.6)',
            'rgba(114, 172, 209, 0.8)', 'rgba(114, 172, 209, 1)'],
          shadowColor: 'rgba(0, 0, 0, 0.3)',
          shadowBlur: 10
        }
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.5)'
        }
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.5)'
        }
      }
    }
  ],
  series: [
    {
      name: '雷达图',
      type: 'radar',
      itemStyle: {
        emphasis: {
          // color: 各异,
          lineStyle: {
            width: 4
          }
        }
      },
      data: [
        {
          value: [100, 8, 0.40, -80],
          name: '图一',
          symbol: 'rect',
          symbolSize: 5,
          lineStyle: {
            normal: {
              type: 'dashed'
            }
          }
        }
      ]
    }
  ]
})

export default class LdaAnalyze extends React.Component {
  constructor () {
    super()
    this.state = {
      analyze: []
    }
  }

  componentDidMount () {
    console.log(this)
    console.log(this)
  }

  @autobind
  drawAnalyze () {
    console.log(this)
    this.myChart = echarts.init(this.refs.LdaAnalyze)
    const option = getOption()
    this.myChart.setOption(option)
  }

  render () {
    return <div
      ref='LdaAnalyze'
      style={{display: 'flex', 'flexDirection': 'row'}}
      className={styles.container}
    >
      {/* <WrappedInputForm */}
      {/* style={{flexGrow: 1, display:'flex', 'flexDirection':'row', justifyContent: 'center'}} */}
      {/* /> */}
      <div
        style={{flexGrow: 1}} />
      {this.drawAnalyze()}
    </div>
  }
}
