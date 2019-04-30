import { isDate, isPlainObject } from './util'

// 对于字符 @、:、$、,、、[、]，我们是允许出现在 url 中的，不希望被 encode。
function encode(val: string): string {
  return encodeURIComponent(val)
    .replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/$24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, '[')
}

export function buildURL(url: string, params?: any): string {
  if (!params) {
    return url
  }
  const parts: string[] = []

  Object.keys(params).map(key => {
    const val = params[key]
    // 对于值为 null 或者 undefined 的属性，我们是不会添加到 url 参数中的。
    if (val === null || typeof val === 'undefined') {
      // 跳出本次循环进入下一次循环
      return
    }
    let values = []
    if (Array.isArray(val)) {
      values = val
      key += '[]'
    } else {
      values = [val]
    }
    values.map(val => {
      if (isDate(val)) {
        val = val.toISOString
      } else if (isPlainObject(val)) {
        val = JSON.stringify(val)
      }
      parts.push(`${encode(key)}=${encode(val)}`)
    })
  })

  let serializedParams = parts.join('&')
  if (serializedParams) {
    // 丢弃 url 中的哈希标记
    const markIndex = url.indexOf('#')
    if (markIndex !== -1) {
      url = url.slice(0, markIndex)
    }
    // 保留 url 中已存在的参数
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams
  }
  return url
}
