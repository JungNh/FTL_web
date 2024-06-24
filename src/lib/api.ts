import axios from 'axios'
import Swal from 'sweetalert2'
import config from './config'
import { store } from '../index'

/**
 * Axios defaults
 */
axios.defaults.baseURL = config.apiBaseUrl

// Headers
axios.defaults.headers.common['Content-Type'] = 'application/json'
axios.defaults.headers.common.Accept = 'application/json'

/**
 * Request Interceptor
 */
axios.interceptors.request.use(
  async (inputConfig) => {
    const config = inputConfig

    // Check for and add the stored Auth Token to the header request
    let token = ''
    try {
      token = (await localStorage.getItem('token')) || ''
    } catch (error) {
      console.error('Error retrieving token from localStorage:', error)
    }

    if (!config.headers) {
      config.headers = {}
    }

    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`
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
axios.interceptors.response.use(
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
        localStorage.removeItem('token')
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

export default axios
