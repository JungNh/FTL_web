import { format } from 'date-fns'
import Swal from 'sweetalert2'
import axios from 'axios'
import md5 from 'md5'
import { store } from '../index'
import { openError } from '../utils/common'
import { Redirect, Route } from 'react-router-dom'
import React from 'react'
import moment from 'moment'
import { apiCore } from '../lib-core'

/**
 * Axios defaults
 */
const instance = axios.create({
  baseURL: process.env.REACT_APP_END_POINT_ARENA,
  timeout: 15000,
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
})

instance.defaults.headers.common.Accept = 'application/x-www-form-urlencoded'

/**
 * Request Interceptor
 */
instance.interceptors.request.use(
  async (inputConfig) => {
    const config = inputConfig

    // Check for and add the stored Auth Token to the header request
    let token: string = ''
    try {
      token = (await localStorage.getItem('arena-token')) || ''
    } catch (error) {
      /* Nothing */
    }
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `${token}`
      }
    }
    return config
  },
  (error) => {
    throw error
  }
)

/**
 * Response Interceptor
 */
instance.interceptors.response.use(
  (res) => {
    // Status code isn't a success code - throw error
    if (!`${res?.status}`.startsWith('2')) {
      throw res.data
    }

    // Otherwise just return the data
    return res
  },
  (error) => {
    const isInLoginPage = window.location?.pathname?.includes('/login')
    // Pass the response from the API, rather than a status code
    if (error?.response?.status === 401) {
      const { data } = error.response
      if (
        data?.error === 'Unauthorized' &&
        data?.statusCode === 401 &&
        error.response?.config?.url !== '/login' &&
        error.response?.config?.url !== '/me'
      ) {
        store.dispatch({
          type: 'RESET'
        })
        localStorage.removeItem('arena-token')
        Swal.fire({
          title: 'Phiên đăng nhập hết hạn. Quý khách vui lòng đăng nhập lại',
          icon: 'error'
        })
      }
      throw new Error()
    } else if (error?.message === 'Network Error') {
      if (isInLoginPage) {
        Swal.fire({
          title: 'Không có kết nối Internet',
          html: 'Hãy kiểm tra lại kết nối của bạn và thử lại',
          icon: 'error',
          showConfirmButton: true,
          showCancelButton: true,
          confirmButtonText: 'Xem hướng dẫn sửa.',
          cancelButtonText: 'Đóng'
        })
          .then(() => {
            window.location.replace('/fix-network')
            return ''
          })
          .catch(() => {})
      } else {
        Swal.fire({
          title: 'Không có kết nối Internet',
          html: 'Hãy kiểm tra lại kết nối của bạn và thử lại',
          icon: 'error'
        })
      }
      throw new Error()
    } else if (error && error.response && error.response.data) {
      throw error.response.data
    } else if (isInLoginPage) {
      Swal.fire({
        title: 'Không có kết nối Internet',
        html: 'Hãy kiểm tra lại kết nối của bạn và thử lại',
        icon: 'error',
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: 'Xem hướng dẫn sửa.',
        cancelButtonText: 'Đóng'
      })
        .then(() => {
          window.location.replace('/fix-network')
          return ''
        })
        .catch(() => {})
    }
    throw error
  }
)

export const getArenaAuththentication = async (callback?: any, callbackFailed?: any) => {
  const arena_token = localStorage.getItem('arena-token')

  function formatTime(day: string, hour: number, minute: number) {
    const hourStr = hour < 10 ? '0' + hour : hour.toString()
    const minuteStr = minute < 10 ? '0' + minute : minute.toString()
    return `${day} ${hourStr}:${minuteStr}`
  }

  let datetime: any = ''
  try {
    const res = await apiCore
      .post('/datetimes/')
      .then((res) => res.data)
      .then((data) => {
        datetime = data.data
      })
  } catch (error) {
    console.error(error)
  }

  try {
    const client_id = 'ftl-web01'
    const api_key = 'A2w1ssfhASdfgafghdkcvnbdlkjui523mdg6fdghd'
    const user_client_token = localStorage.getItem('token')
    if (user_client_token) {
      const sign = md5(api_key + 'get_user_token' + datetime)

      const response = await instance.post('/candidates/get_token/', {
        client_id,
        datetime,
        sign,
        user_client_token
      })
      if (response.data.c === 1 && response.data.d?.[0]?.token) {
        localStorage.setItem('arena-token', response.data.d[0].token)
        callback?.()
        return 'arenaToken'
      } else {
        callbackFailed?.()
        openError('Có lỗi khi đăng nhập vào đấu trường!')
        localStorage.removeItem('arena-token')
        return ''
      }
    }
  } catch (error) {
    localStorage.removeItem('arena-token')
    if (error instanceof Error) openError(error.message)
    return ''
  }
  return ''
}

export const ArenaRoute = ({ path, component }: any) => {
  // React.useEffect(() => {
  //   if(!localStorage.getItem('arena-token') || localStorage.getItem('arena-token') === '') {
  //     openError("Có lỗi khi đăng nhập vào đấu trường!")
  //   }
  // }, [])

  return localStorage.getItem('arena-token') && localStorage.getItem('arena-token') !== '' ? (
    <Route exact path={path} component={component} />
  ) : (
    <Redirect to="/arena-login" />
  )
}

export default instance
