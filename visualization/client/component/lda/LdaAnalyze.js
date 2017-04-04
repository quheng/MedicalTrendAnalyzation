import React from 'react'
import { Form, Input, Button } from 'antd'

const FormItem = Form.Item

function hasErrors (fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field])
}

export default class InputForm extends React.Component {
  componentDidMount () {
    this.props.form.validateFields()
  }

  handleSubmit = (e) => {
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
