import _ from 'lodash'
import { api } from '../../lib'
import { apiCore } from '../../lib-core'
import { openError } from '../../utils/common'
import { Types } from './types'
import { getArenaAuththentication } from '../../lib/arenaApi'

// luu thong tin login
export const actionSaveAuthLogin = (payload: any) => ({
  type: Types.SAVE_AUTH_LOGIN,
  payload
})

export const actionSaveUserInfo = (payload: any) => ({
  type: Types.SAVE_USER_INFO,
  payload
})

export const saveFirebaseToken = (payload: any) => ({
  type: Types.SAVE_FIREBASE_TOKEN,
  payload
})

// dang ky tai khoan
export const actionRegisterAccount = (payload: any) => async () => {
  try {
    const response = await apiCore.post('user/register', payload)
    if (!_.isEmpty(response?.data)) {
      return response.data
    }
  } catch (error) {
    if (error !== null && typeof error === 'object') {
      const convertedError = error as { message?: any }
      if (typeof convertedError?.message === 'object') {
        const messageObj: any = convertedError.message?.[0]?.constraints
        const message: any = Object.values(messageObj)?.[0] || 'Lỗi không xác định'
        switch (message.toLowerCase()) {
          case 'email must be an email':
            openError('Email không đúng định dạng')
            break
          case 'duplicate email':
            openError('Email đã tồn tại')
            break
          case 'duplicate telephone':
            openError('Số điện thoại đã tồn tại')
            break
          default:
            openError(message)
            break
        }
      } else if (typeof convertedError.message === 'string') {
        openError(convertedError.message || 'Lỗi không xác định')
      }
    } else {
      openError('Lỗi không xác định')
    }
  }
}

// check email
export const actionCheckEmail = (payload: any) => async () => {
  try {
    const response = await api.post('/lookup', payload)
    if (!_.isEmpty(response?.data)) {
      return response.data
    }
  } catch (error) {
    if (error !== null && typeof error === 'object') {
      const convertedError = error as { statusCode?: number; error?: string }
      if (convertedError?.statusCode === 404 && convertedError?.error === 'Not Found') {
        openError('Tài khoản đăng ký không tồn tại trên hệ thống')
      }
    }
    if (error instanceof Error) openError(error.message)
  }
}
// login
export const actionLogin = (payload: any) => async (dispatch: any) => {
  try {
    const response = await api.post('/login', payload)
    if (!_.isEmpty(response?.data)) {
      if (!_.isEmpty(response.data.data)) {
        localStorage.setItem('token', response.data.data.token)
        localStorage.setItem('showFubo', 'FUBO')
        dispatch(actionSaveAuthLogin(response.data.data))
        loopGetToken()
      }
      return response.data
    }
  } catch (error) {
    openError('Mật khẩu không chính xác')
  }
}

let i = 0
let res: any = null
const loopGetToken = () => {
  // let arenaToken: any = getArenaAuththentication()
  // let i = 0;
  // let res
  res = setInterval(() => {
    if (i < 5) {
      getArenatoken()
      i++
    } else {
      return
    }
  }, 3000)
}

const getArenatoken = () => {
  getArenaAuththentication()
    .then((value) => {
      console.log(value)
      if (value == 'arenaToken') {
        clearInterval(res)
      }
    })
    .catch((err) => {
      console.log(err)
    })
}

// quen mat khau
export const actionForgotPassword = (payload: any) => async () => {
  try {
    const response = await apiCore.post('/user/forgotPassword', payload)
    if (!_.isEmpty(response?.data)) {
      return response.data
    }
  } catch (error) {
    if (error !== null && typeof error === 'object') {
      const convertedError = error as { message?: any }
      if (typeof convertedError.message === 'object') {
        const messageObj: any = convertedError.message?.[0]?.constraints
        const message: any = Object.values(messageObj)?.[0] || 'Lỗi không xác định'
        switch (message.toLowerCase()) {
          case 'email must be an email':
            openError('Email không đúng định dạng')
            break
          default:
            openError(message)
            break
        }
      } else if (typeof convertedError.message === 'string') {
        openError(convertedError.message || 'Lỗi không xác định')
      }
    } else {
      openError('Lỗi không xác định')
    }
  }
}
// doi mat khau
export const actionRenewPassword = (payload: any) => async () => {
  try {
    console.log('đi vào dây ')

    const response = await apiCore.post('/user/renewPassword', payload)
    console.log(response, 'response====>>>>>')

    if (!_.isEmpty(response?.data)) {
      return response.data
    }
  } catch (error) {
    if (error instanceof Error) openError(error.message)
  }
}
// doi mat khau
export const actionUserMe = () => async (dispatch: any) => {
  try {
    const response = await api.get('/me')
    if (!_.isEmpty(response) && !_.isEmpty(response?.data)) {
      dispatch({
        type: Types.SAVE_USER_INFO,
        payload: response?.data?.data
      })
      return response.data
    }
  } catch (error) {
    if (error instanceof Error && error.message) openError(error.message)
  }
}

export const actionUserMeCore = () => async (dispatch: any) => {
  try {
    const response = await apiCore.post('/user/me')

    if (!_.isEmpty(response) && !_.isEmpty(response?.data)) {
      dispatch({
        type: Types.SAVE_USER_INFO_CORE,
        payload: response?.data?.data
      })
      return response.data
    }
  } catch (error) {
    if (error instanceof Error && error.message) openError(error.message)
  }
}
// get profile
export const actionGetProfile = () => async () => {
  try {
    const response = await api.get('/profiles/mine')
    if (!_.isEmpty(response?.data)) {
      return response.data
    }
  } catch (error) {
    if (error instanceof Error) openError(error.message)
  }
}
// create profile
export const actionCreateProfile =
  (payload: {
    language: string
    dob: string
    reason: string
    target: string
    scope: string
    scheduleLearning: string
  }) =>
  async () => {
    try {
      const response = await api.post('/profiles', payload)
      if (!_.isEmpty(response?.data)) {
        return response.data
      }
    } catch (error) {
      if (error instanceof Error) openError(error.message)
    }
  }

// Loading
export const showLoading = () => (dispatch: any) => {
  dispatch({ type: Types.SHOW_LOADING })
}

export const hideLoading = () => (dispatch: any) => {
  setTimeout(() => dispatch({ type: Types.HIDE_LOADING }), 500)
}

export const userInteractWeb = (payload: boolean) => ({
  type: Types.USER_INTERACT_WEB,
  payload
})
