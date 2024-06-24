import _ from 'lodash'
import { RoomType, Types } from './types'
import { api } from '../../lib'
import { objToQueryString, openError } from '../../utils/common'

// luu danh sach category
export const actionSaveListRoom = (payload: any) => ({
  type: Types.SAVE_LIST_ROOM,
  payload,
})
export const actionSaveCurrentRoom = (payload: any) => ({
  type: Types.SAVE_CURRENT_ROOM,
  payload,
})
export const actionSaveMember = (payload: any) => ({
  type: Types.SAVE_MEMBER,
  payload,
})
export const actionSaveContest = (payload: any) => ({
  type: Types.SAVE_CONTEST,
  payload,
})

// lay danh sach category
export const actionGetListRoom = (payload: {
  offset: number
  limit: number
  order: 'ASC' | 'DESC',
  gradeId?: any,
}) => async (dispatch: any) => {
  try {
    const searchParam = objToQueryString(payload)
    const response = await api.get(
      `/examinations?${searchParam}`
    )
    if (!_.isEmpty(response?.data) && !_.isEmpty(response.data.data)) {
      dispatch(actionSaveListRoom(response.data.data))
      return response.data.data
    }
    return []
  } catch (error) {
    if (error instanceof Error) openError(error.message)
    return []
  }
}

export const actionCreateRoom = (payload: RoomType) => async (dispatch: any) => {
  try {
    const response = await api.post('/examinations', payload)
    if (!_.isEmpty(response?.data) && !_.isEmpty(response.data.data)) {
      await dispatch(actionSaveCurrentRoom({ info: response.data.data, member: null }))
      return response.data.data
    }
    return []
  } catch (error) {
    if (error instanceof Error) openError(error.message)
    return []
  }
}

export const actionGetDetailRoom = (payload: { examId: number }) => async () => {
  try {
    const response = await api.get(`/examinations/${payload.examId}`)
    if (!_.isEmpty(response?.data) && !_.isEmpty(response.data.data)) {
      return response.data.data
    }
  } catch (error) {
    if (error instanceof Error) openError(error.message)
  }
}
export const actionGetMemberOfRoom = (payload: { examId: number }) => async () => {
  try {
    const response = await api.get(`/examinations/${payload.examId}/members`)
    if (!_.isEmpty(response?.data) && !_.isEmpty(response.data.data)) {
      return response.data.data
    }
  } catch (error) {
    if (error instanceof Error) openError(error.message)
  }
}

export const actionGetContest = (payload: {
  offset: number
  limit: number
  order: string
  gradeId: number
}) => async () => {
  try {
    const response = await api.get(
      `/contests?offset=${payload.offset}&limit=${payload.limit}&order=${payload.order}&gradeId=${payload.gradeId}`
    )
    if (!_.isEmpty(response?.data) && !_.isEmpty(response.data.data)) {
      return response.data.data
    }
  } catch (error) {
    if (error instanceof Error) openError(error.message)
  }
}
export const actionGetContestById = (payload: { contestId: number }) => async (dispatch: any) => {
  try {
    const response = await api.get(`/contests/${payload.contestId}`)
    if (!_.isEmpty(response?.data) && !_.isEmpty(response.data.data)) {
      dispatch(actionSaveContest(response.data.data))
      return response.data.data
    }
  } catch (error) {
    if (error instanceof Error) openError(error.message)
  }
}

export const actionGetGradeOnline = (payload: {
  offset: number
  limit: number
  order: string
}) => async () => {
  try {
    const response = await api.get(
      `/grades/online?offset=${payload.offset}&limit=${payload.limit}&order=${payload.order}`
    )
    if (!_.isEmpty(response?.data) && !_.isEmpty(response.data.data)) {
      return response.data.data
    }
  } catch (error) {
    if (error instanceof Error) openError(error.message)
  }
}

export const actionGetExamination = (payload: {
  gradeId: any
  limit: any
}) => async () => {
  try {
    const response = await api.get('/api/examinations')
    if (!_.isEmpty(response?.data) && !_.isEmpty(response.data.data)) {
      return response.data.data
    }
  } catch (error) {
    if (error instanceof Error) openError(error.message)
  }
}

export const actionGetGradeOffline = (payload: {
  offset: number
  limit: number
  order: string
}) => async () => {
  try {
    const response = await api.get(
      `/grades/offline?offset=${payload.offset}&limit=${payload.limit}&order=${payload.order}`
    )
    if (!_.isEmpty(response?.data) && !_.isEmpty(response.data.data)) {
      return response.data.data
    }
  } catch (error) {
    if (error instanceof Error) openError(error.message)
  }
}

export const actionGetUserExams = (payload: { text: string }) => async () => {
  try {
    const response = await api.get(`/examinations/search/members?text=${payload.text}`)
    if (!_.isEmpty(response?.data) && !_.isEmpty(response.data.data)) {
      return response.data.data
    }
  } catch (error) {
    if (error instanceof Error) openError(error.message)
  }
}

/**
 * Send result online exam
 */
export const actionSubmitResults = (payload: { score: number; examId: number }) => async () => {
  try {
    const response = await api.post('/examinations/submit-results', payload)
    if (!_.isEmpty(response) && !_.isEmpty(response?.data)) {
      return response.data
    }
  } catch (error) {
    if (error instanceof Error) openError(error.message)
  }
}

export const actionResultsOnline = (payload: { examId: number }) => async () => {
  try {
    const response = await api.get(`/examinations/${payload.examId}/results`)
    if (!_.isEmpty(response?.data) && !_.isEmpty(response.data.data)) {
      return response.data.data
    }
  } catch (error) {
    if (error instanceof Error) openError(error.message)
  }
}

export const actionResultsOnlineMe = (payload: { examId: string }) => async () => {
  try {
    const response = await api.get(`/examinations/${payload.examId}/me/results`)
    if (!_.isEmpty(response?.data) && !_.isEmpty(response.data.data)) {
      return response.data.data
    }
  } catch (error) {
    if (error instanceof Error) openError(error.message)
  }
}
