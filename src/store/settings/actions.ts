// import _ from 'lodash'
// import { Types } from './types'
import _ from 'lodash'
import { api } from '../../lib'
import { openError, openSuccess } from '../../utils/common'
import axios, { Axios } from 'axios'
import { apiCore } from '../../lib-core'

// lay danh sach tat ca bai hoc theo khoa hoc
export const actionGetNews =
  (payload: { offset: number; limit: number; order?: 'ASC' | 'DESC' | '' }) => async () => {
    try {
      const response = await api.get(
        `/posts?offset=${payload.offset}&limit=${payload.limit}&order=${payload.order} `
      )
      if (response?.data) return response?.data
    } catch (error) {
      if (error instanceof Error) openError(error.message)
    }
  }

export const actionGetStaticData = (payload: any) => async () => {
  try {
    const response = await api.get(
      `/statistics/account/history?start=${payload.start}&end=${payload.end}&accountId=${
        payload?.accountId || ''
      } `
    )
    if (response?.data) return response?.data
  } catch (error) {
    if (error instanceof Error) openError(error.message)
  }
}

export const actionActiveCardCourse = (payload: any) => async (dispatch: any) => {
  try {
    if (payload?.cardCode.length > 14 || payload?.cardCode.length < 6) {
      openError('Bạn vui lòng nhập mã thẻ 6 - 14 ký tự!')
      return
    }
    const response = await apiCore.post('/studentcardcodes/old-active', payload)
    if (!_.isEmpty(response) && response?.data) return response?.data?.data
  } catch (error) {
    if (error !== null && typeof error === 'object') {
      const convertedError = error as { statusCode?: number; error?: string; message?: string }
      if (convertedError?.statusCode === 404) {
        switch (convertedError.message) {
          case 'The card code must be at least 14 characters.':
            openError('Mã thẻ phải có ít nhất 14 ký tự.')
            break

          case 'YOU_ACTIVATED_TEST_CARD':
            openError('Bạn đã kích hoạt thẻ thử! Vui lòng chọn mã thẻ khác!')
            break

          case 'CARD_CODE_ALREADY_USED':
            openError('Mã thẻ đã được sử dụng. Vui lòng nhập mã thẻ khác!')
            break

          case 'CARD_DOES_NOT_EXIST_OR_DELETED':
            openError('Thẻ học không tồn tại hoặc đã bị xóa!')
            break

          case 'CARD_CODE_DOES_NOT_EXIST':
            const resPlus = await dispatch(actionActiveCardCoursePlus(payload))
            if (!_.isEmpty(resPlus) && resPlus?.data) return resPlus?.data?.data
            break
          default:
        }
      } else if (convertedError?.message) {
        openError(convertedError?.message)
      }
    }
    if (error instanceof Error) openError(error.message)
  }
}
export const actionActiveCardCoursePlus = (payload: any) => async () => {
  try {
    const response = await apiCore.post('/studentcardcodes/active', payload)
    if (response.status === 200) {
      return response
    }
    if (!_.isEmpty(response) && response?.data) return response?.data?.data
  } catch (error) {
    if (error !== null && typeof error === 'object') {
      const convertedError = error as { status?: number; error?: string; message?: string }
      if (convertedError?.status === 404) {
        switch (convertedError.message) {
          case 'USER_NEED_TO_UPDATE_INFO':
            openError('Mã thẻ không hợp lệ')
            break

          case 'CARD_CODE_INVALID':
            openError('Mã thẻ không hợp lệ')
            break

          case 'CARD_CODE_IS_LOCKED':
            openError('Mã thẻ đã bị khoá')
            break

          case 'CARD_CODE_OUT_OF_DATE':
            openError('Mã thẻ hết hạn')
            break

          case 'CARD_CODE_OUT_OF_USE':
            openError('Mã thẻ hết số lần sử dụng')
            break

          case 'CARD_CODE_ALREADY_USED':
            openError('Mã thẻ đã được sử dụng')
            break

          case 'CARD_CODE_DOES_NOT_EXIST':
            openError('Mã thẻ không tồn tại')
            break
          default:
        }
      } else if (convertedError?.message) {
        openError(convertedError?.message)
      }
    }
    if (error instanceof Error) openError(error.message)
  }
}

export const actionChangePassword = (payload: any) => async () => {
  try {
    const response = await api.post('/auth/changepassword', payload)
    if (!_.isEmpty(response)) return response?.data
  } catch (error) {
    if (error instanceof Error) openError(error.message)
  }
}
// cap nhat thong tin user
export const actionUpdateAccount = (payload: any) => async () => {
  try {
    const response = await api.put('/student', payload)
    if (!_.isEmpty(response)) return response?.data
    return {}
  } catch (error) {
    if (error instanceof Error) openError(error.message)
    return {}
  }
}

// get sub account
export const actionGetAccounts = () => async () => {
  try {
    const response = await api.get('/accounts')
    if (!_.isEmpty(response)) return response?.data
  } catch (error) {
    if (error instanceof Error) openError(error.message)
  }
}

// get create account
export const actionCreateAccounts =
  (payload: { avatar: string; fullname: string; sex?: string; dob?: string }) => async () => {
    try {
      const response = await api.post('/accounts', payload)
      if (!_.isEmpty(response)) return response?.data
    } catch (error) {
      if (error instanceof Error) openError(error.message)
    }
  }

// upload image
export const actionUploadImage = (file: any) => async () => {
  try {
    const formData = new FormData()
    formData.append('file', file)
    const response = await api.post('/upload/image', formData)
    if (!_.isEmpty(response)) return response?.data
  } catch (error) {
    if (error instanceof Error) openError(error.message)
  }
}

// get switch account
export const actionSwitchAcc = (payload: { accountId: number }) => async () => {
  try {
    const response = await api.post('/switch-account', { accountId: payload.accountId })
    if (!_.isEmpty(response)) return response?.data
  } catch (error) {
    if (error instanceof Error) openError(error.message)
  }
}

// get get sub account info
export const actionUpdateSubAcc = (payload: { accountId: number; data: any }) => async () => {
  try {
    const response = await api.put(`/accounts/${payload.accountId}`, payload.data)
    if (!_.isEmpty(response)) return response?.data
  } catch (error) {
    if (error instanceof Error) openError(error.message)
  }
}

// get detail notification
export const actionGetOneNotification = (payload: { notiId: number }) => async () => {
  try {
    const response = await api.get(`/notifications/${payload.notiId}`)
    if (response?.status === 200 && response?.data) {
      return response?.data
    }
  } catch (error) {
    // openError()
    console.error(error)
  }
}

// register notification
export const actionRegisterNotification = (payload: { token: string }) => async () => {
  try {
    const response = await api.post('/register-notification', {
      token: payload.token
    })
    if (response?.status === 200 && response?.data) {
      return response?.data
    }
  } catch (error) {
    // openError()
    console.error(error)
  }
}

// un register notification
export const actionUnregisterNotification = () => async () => {
  try {
    const response = await api.post('/unregister-notification')
    if (response?.status === 200 && response?.data) {
      return response?.data
    }
  } catch (error) {
    // openError()
    console.error(error)
  }
}
export const actionUploadAudio = (file: any) => async () => {
  try {
    const formData = new FormData()
    formData.append('file', file)
    const response = await api.post('/upload/audio', formData)
    if (!_.isEmpty(response)) return response?.data
  } catch (error) {
    if (error instanceof Error) openError(error.message)
  }
}
