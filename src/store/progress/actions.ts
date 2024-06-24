import _ from 'lodash'
import { Types } from './types'
import { api } from '../../lib'
import { api2 } from '../../lib2'
import { openError } from '../../utils/common'

// luu danh sach category
export const actionSaveHistoryMe = (payload: any) => ({
  type: Types.SAVE_HISTORY_ME,
  payload,
})

// lay danh sach category
export const actionGetHistoryMe = () => async (dispatch: any) => {
  try {
    const response = await api.get('/statistics/me/history')
    if (!_.isEmpty(response?.data) && !_.isEmpty(response.data.data)) {
      dispatch(actionSaveHistoryMe(response.data.data))
      return response.data.data
    }
    return []
  } catch (error) {
    if (error instanceof Error) openError(error.message)
    return []
  }
}
export const actionGetHistoryMeLessons = () => async (dispatch: any) => {
  try {
    const response = await api.get('/statistics​/me​/history​/lessons')
    if (!_.isEmpty(response?.data) && !_.isEmpty(response.data.data)) {
      dispatch(actionSaveHistoryMe(response.data.data))
      return response.data.data
    }
    return []
  } catch (error) {
    if (error instanceof Error) openError(error.message)
    return []
  }
}

// lay danh sach category other account
export const actionGetHistoryAcount = (payload: { accountId: string | number }) => async (
  dispatch: any
) => {
  try {
    const response = await api.get(`/statistics/account/history?accountId=${payload.accountId}`)
    if (!_.isEmpty(response?.data) && !_.isEmpty(response.data.data)) {
      dispatch(actionSaveHistoryMe(response.data.data))
      return response.data.data
    }
    return []
  } catch (error) {
    if (error instanceof Error) openError(error.message)
    return []
  }
}

export const actionGetHistoryAccLessons = (payload: {
  accountId: string | number
  offset: number
  limit: number
  order: 'ASC' | 'DESC'
  mode: 'today' | 'week' | 'month'
}) => async () => {
  try {
    const response = await api.get(
      `/statistics/account/history/lessons?accountId=${payload.accountId}&offset=${payload.offset}&limit=${payload.limit}&order=${payload.order}&mode=${payload.mode}`
    )
    if (!_.isEmpty(response?.data) && !_.isEmpty(response.data.data)) {
      return response.data.data
    }
    return []
  } catch (error) {
    if (error instanceof Error) openError(error.message)
    return []
  }
}

export const actionsGetInfoCourseById = (payload: any) => async () => {
  try {
    const response = await api2.post('/progresses/course-score-user', { course_id: payload })
    if (!_.isEmpty(response?.data)) {
      return response.data
    }
    return []
  } catch (error) {
    if (error instanceof Error) openError(error.message)
    return []
  }
}

export const actionGetProgressByIdV2 = (payload: {id: any}) => async (dispatch: any) => {
  try {
    const response = await api2.post(`/progresses/my-progress/${payload}`)
    if (!_.isEmpty(response?.data) && !_.isEmpty(response.data.data)) {
      return response.data.data
    }
    return []
  } catch (error) {
    if (error instanceof Error) openError(error.message)
    return []
  }
}

export const actionGetStatisV2 = () => async (dispatch: any) => {
  try {
    const response = await api2.post('/progresses/statistics')
    if (!_.isEmpty(response?.data)) {
      return response.data
    }
    return []
  } catch (error) {
    if (error instanceof Error) openError(error.message)
    return []
  }
}

export const actionGetHistoryProgressV2 = (payload: {time: any}) => async (dispatch: any) => {
  try {
    const response = await api2.post(`/progresses/activity-history?time=${payload}`)
    if (!_.isEmpty(response?.data)) {
      return response.data
    }
    return []
  } catch (error) {
    if (error instanceof Error) openError(error.message)
    return []
  }
}

export const actionGetMyProgressV2 = () => async (dispatch: any) => {
  try {
    const response = await api2.post('/progresses/my-progress')
    if (!_.isEmpty(response?.data)) {
      return response.data
    }
    return []
  } catch (error) {
    if (error instanceof Error) openError(error.message)
    return []
  }
}
