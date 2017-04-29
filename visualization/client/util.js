import { message } from 'antd'

export const apiAddress = '/api'

export function checkStatus (response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    message.error('加载数据失败')
    const error = new Error(response.statusText)
    error.response = response
    throw error
  }
}
