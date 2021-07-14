import { showToast, showLoading, hideLoading, redirectTo, getCurrentPages } from '@tarojs/taro'
import { axios, PostData, FileData, Canceler, AxiosRequestConfig, AxiosResponse } from 'taro-axios'
import { merge, last, prop, is, contains } from 'ramda'
import storage from 'taro-storage'
import qs from 'qs'
import md5 from 'md5'

import { api } from './config'

const CancelToken = axios.CancelToken
const pending: Map<string, Canceler> = new Map()

const instance = axios.create({
  baseURL: api,
  timeout: 1000 * 30
})

interface RequestConfig extends AxiosRequestConfig {
  isLoading?: boolean;
}

instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'

instance.interceptors.request.use((config: RequestConfig) => {
  // console.log('请求前pending', pending)
  console.log('axios-url: ', ` ${config.baseURL}${config.url}`)
  // console.log('请求参数：', `headers: ${is(Object, config.headers) ? JSON.stringify(config.headers) : ''},
  // params: ${is(Object, config.params) ? JSON.stringify(config.params) : ''},
  // data: ${is(Object, config.data) ? JSON.stringify(config.data) : ''}`)

  // 添加loading
  if (config.isLoading !== false) {
    showLoading({
      title: '加载中',
      mask: true
    })
  }

  // get请求时将data转为params兼容data
  if (config.method === 'get') {
    config.params = merge(config.data, config.params)
  }

  // 获取token
  const token = storage.getLocalStorage('token')
  if (token) config.headers.Authorization = `Bearer ${token}`

  removeRepeatPending(config)
  // 添加取消请求
  config.cancelToken = new CancelToken(function executor (c) {
    // An executor function receives a pending function as a parameter
    const key = getKey(config)
    pending.set(key, c)
  })

  return config
}, (error) => {
  return Promise.reject(error)
})

instance.interceptors.response.use((response: AxiosResponse) => {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  removePending(response.config)
  hideLoading()

  const contentType = response.headers['Content-Type']

  if (response.data.code !== 0) {
    showToast({
      title: response.data.message || '该接口没有以code=0作为成功的标识，请注意调整axios封装',
      icon: 'none'
    })
  }

  const refreshToken = response.headers['refresh-token']
  if (refreshToken) {
    const { token, expiresIn } = JSON.parse(refreshToken)
    storage.setLocalStorage('token', token, expiresIn * 1000)
  }

  // 二进制流时不进行response.data转换
  if (contains(contentType, ['image/png'])) {
    return {
      code: 0,
      data: response.data
    }
  } else if (contains(contentType, ['application/json; charset=utf-8'])) {
    return response.data
  }
  // else if (!contains(contentType, ['application/octet-stream'])) {
  //   return response
  // }

  return {
    data: response,
    code: 0
  }
}, (error) => {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  hideLoading()
  // 处理网络、超时错误
  responseOtherError(error)

  removePending(error.config)

  return Promise.reject(error)
})

const retry = (error) => {
  // 全局的请求次数,请求的间隙
  const [RETRY_COUNT, RETRY_DELAY] = [3, 1000]

  if (error.config && RETRY_COUNT) {
    // 设置用于跟踪重试计数的变量
    error.config.__retryCount = error.config.__retryCount || 0
    // 检查是否已经把重试的总数用完
    if (error.config.__retryCount >= RETRY_COUNT) {
      return Promise.reject(error.response || { message: error.message })
    }
    // 增加重试计数
    error.config.__retryCount++
    // 创造新的Promise来处理指数后退
    const backoff = new Promise((resolve) => {
      setTimeout(() => {
        resolve('重新请求')
      }, RETRY_DELAY || 1)
    })
    // instance重试请求的Promise
    return backoff.then(() => {
      return instance(error.config)
    })
  }
}

const removeRepeatPending = (config: RequestConfig) => {
  // 从cancel map中移除
  const key = getKey(config)
  const value = pending.get(key)
  if (value) {
    value('请求过于频繁，请稍后再试')
    pending.delete(key)
  }
}

const removePending = (config: RequestConfig) => {
  // 从cancel map中移除
  if (config) {
    const key = getKey(config)
    if (pending.has(key)) {
      pending.delete(key)
    }
  }
}

const getKey = (config: RequestConfig) => {
  const key = `${config.method}__${config.baseURL}${config.url}__${is(Object, config.data) ? JSON.stringify(config.data) : config.data}__${JSON.stringify(config.params)}`
  return md5(decodeURIComponent(key))
}

const responseOtherError = (error) => {
  const errorDetail = error?.toJSON ? error.toJSON() : error
  const response = prop('response', error)
  const errmes = prop('message', error)
  const status = prop('status', response)
  const resmes = prop('message', response)
  const data = prop('data', response)

  if (prop('message', errorDetail) === 'Network Error') {
    console.log('无网络')
    showToast({
      title: '无网络',
      icon: 'none'
    })
  } else if (prop('code', error) === 'ECONNABORTED') {
    console.log('请求超时')
    showToast({
      title: '请求超时',
      icon: 'none'
    })
    // 只有超时才需要重试
    retry(error)
  } else {
    // 请求失败后的错误统一处理
    switch (status) {
      // 401: 未登录状态，跳转登录页
      case 401:
        removeAllPending()
        storage.removeLocalStorage('token')
        // eslint-disable-next-line no-case-declarations
        const currentPage = last(getCurrentPages())
        if (currentPage?.route !== 'pages/login/index') {
          redirectTo({
            url: '/pages/login/index'
          })
          global.store.dispatch({
            type: 'app/updateLoginState',
            payload: {
              isLogin: false
            }
          })
          global.store.dispatch({
            type: 'app/updateRedirect',
            payload: {
              redirect: `/${currentPage?.route}?${qs.stringify(currentPage?.options)}`
            }
          })
        }
        showToast({
          icon: 'none',
          title: '未登录或登录过期'
        })
        break
      case 404:
        showToast({
          title: response.data || '服务不存在',
          icon: 'none'
        })
        break
      default:
        if (error.constructor.name !== 'Cancel') {
          showToast({
            title: errmes || resmes || (is(String, data) ? data : is(Object, data) ? JSON.stringify(data) : '服务器错误'),
            icon: 'none'
          })
        }
    }
  }
}

export const removeAllPending = (): void => {
  for (const [key, value] of pending) {
    value()
    pending.delete(key)
  }
}

export const request = (params:RequestConfig) => {
  return instance(params)
}

export const uploadImage = async (params) => {
  const { url, type = 'Common', filename, token, filePath } = params

  const res = await axios.post(
    url,
    new PostData({
      smfile: new FileData(filePath),
      ssl: true,
      format: 'json',
      token,
      name: 'file',
      key: filename
      // headers: {
      //   'Content-Type': 'multipart/form-data',
      //   'Access-Control-Allow-Origin': '*'
      // }
    })
  )

  return res
}
