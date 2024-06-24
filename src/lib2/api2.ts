import axios from 'axios'
import Swal from 'sweetalert2'
import config2 from './config2'
import { store } from '../index'

/**
 * Axios defaults
 */
const instance = axios.create({
  baseURL : config2.apiBaseUrl2
})

// Headers
instance.defaults.headers.common['Content-Type'] = 'application/json'
instance.defaults.headers.common.Accept = 'application/json'
// axios.defaults.baseURL = config2.apiBaseUrl2


/**
 * Request Interceptor
 */
 instance.interceptors.request.use(
  async (inputConfig) => {
    const config = inputConfig

    // Check for and add the stored Auth Token to the header request
    let token: string = ''
    try {
      token = (await localStorage.getItem('token')) || ''
    } catch (error) {
      /* Nothing */
    }
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
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
        data?.error === 'Unauthorized'
        && data?.statusCode === 401
        && error.response?.config?.url !== '/login'
        && error.response?.config?.url !== '/me'
      ) {
        store.dispatch({
          type: 'RESET',
        })
        localStorage.removeItem('token')
        Swal.fire({
          title: 'Phiên đăng nhập hết hạn. Quý khách vui lòng đăng nhập lại',
          icon: 'error',
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
          cancelButtonText: 'Đóng',
        })
          .then(() => {
            window.location.replace('/fix-network')
            return ''
          })
          .catch(() => { })
      } else {
        Swal.fire({
          title: 'Không có kết nối Internet',
          html: 'Hãy kiểm tra lại kết nối của bạn và thử lại',
          icon: 'error',
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
        cancelButtonText: 'Đóng',
      })
        .then(() => {
          window.location.replace('/fix-network')
          return ''
        })
        .catch(() => { })
    }
    throw error
  }
)

export default instance;
