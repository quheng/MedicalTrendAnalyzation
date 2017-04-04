import React from 'react'
import { Form, Input, Icon, Button } from 'antd'
import { autobind } from 'react-decoration'

const FormItem = Form.Item

let uuid = 0
class DynamicFieldSet extends React.Component {
  componentDidMount () {
    this.add()
  }

  @autobind
  remove (k) {
    const { form } = this.props
    const keys = form.getFieldValue('keys')
    if (keys.length === 1) {
      return
    }
    form.setFieldsValue({
      keys: keys.filter(key => key !== k)
    })
  }

  @autobind
  add () {
    uuid++
    const { form } = this.props
    const keys = form.getFieldValue('keys')
    const nextKeys = keys.concat(uuid)
    form.setFieldsValue({
      keys: nextKeys
    })
  }

  handleSubmit (e) {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
      }
    })
  }

  render () {
    const { getFieldDecorator, getFieldValue } = this.props.form
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 }
      }
    }
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 }
      }
    }
    getFieldDecorator('keys', { initialValue: [] })
    const keys = getFieldValue('keys')
    const formItems = keys.map((k, index) => {
      return (
        <FormItem
          {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
          label={index === 0 ? '文章列表' : ''}
          required={false}
          key={k}
        >
          {getFieldDecorator(`names-${k}`, {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [{
              required: true,
              whitespace: true,
              message: '请输入文章内容或删除该文章'
            }]
          })(
            <Input placeholder='文章内容' type='textarea' rows={4} style={{ width: '350px' }} />
          )}

          <Button
            icon='delete'
            disabled={keys.length === 1}
            onClick={() => this.remove(k)}>
            删除该文章
          </Button>
        </FormItem>
      )
    })
    return (
      <Form onSubmit={this.handleSubmit}>
        {formItems}
        <FormItem {...formItemLayoutWithOutLabel}>
          <Button type='dashed' onClick={this.add} style={{ width: '60%' }}>
            <Icon type='plus' /> 添加文章
          </Button>
        </FormItem>
        <FormItem {...formItemLayoutWithOutLabel}>
          <Button type='primary' htmlType='submit' size='large'>分析</Button>
        </FormItem>
      </Form>
    )
  }
}

export default Form.create()(DynamicFieldSet)
