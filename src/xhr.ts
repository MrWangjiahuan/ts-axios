import { AxiosRequestConfig } from './types'
export default function xhr(config: AxiosRequestConfig): void {
  const { data = null, url, method = 'get' } = config

  const request = new XMLHttpRequest()
  // method默认要求大写
  // async 默认异步
  request.open(method.toUpperCase(), url, true)
  request.send(data)
}
