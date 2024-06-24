import _ from 'lodash'
import { api } from '../../lib'
import { objToQueryString, openError } from '../../utils/common'
import { Types } from './types'

export const actionGetGradeOffline = (payload: {
  offset: number
  limit: number
  order: string
}) => async () => {
  try {
    const response = await api.get(
      `/grades/offline?offset=${payload.offset}&limit=${payload.limit}&order=${payload.order}`
    )
    if (response?.status === 200 && !_.isEmpty(response?.data) && !_.isEmpty(response.data.data)) {
      return response.data.data
    }
  } catch (error) {
    if (error instanceof Error) openError(error.message)
  }
}
export const actionGetContestOffline = (payload: {
  offset: number
  limit: number
  order: 'ASC' | 'DESC'
  periodId?: number | null
  gradeId?: number
  status?: 'done' | 'not_doing' | 'doing' | ''
}) => async () => {
  try {
    const query = objToQueryString(payload)

    const response = await api.get(`/contests/offline?${query}`)
    if (response?.status === 200 && !_.isEmpty(response?.data) && !_.isEmpty(response.data.data)) {
      return response.data.data
    }
  } catch (error) {
    if (error instanceof Error) openError(error.message)
  }
}

export const actionGetContestById = (payload: { id: number }) => async () => {
  try {
    const response = await api.get(`/contests/${payload.id}`)
    if (response?.status === 200 && !_.isEmpty(response?.data)) {
      return response.data
    }
  } catch (error) {
    if (error instanceof Error) openError(error.message)
  }
}

export const saveDetailContest = (payload: any) => ({
  type: Types.SAVE_CONTEST,
  payload,
})

export const actionResultContest = (payload: any) => async () => {
  try {
    const response = await api.get(`/contests/${payload}/result-v2`)
    if (!_.isEmpty(response?.data)) {
      return response.data.data
    }
    return []
  } catch (error) {
    if (error instanceof Error) openError(error.message)
    return []
  }
}

export const actionGetPeriods = (payload: { gradeId: number }) => async () => {
  try {
    const response = await api.get(`/periods?gradeId=${payload.gradeId}`)
    if (response?.status === 200 && !_.isEmpty(response?.data)) {
      return response.data
    }
  } catch (error) {
    if (error instanceof Error) openError(error.message)
  }
}

export const actionGetStatistic = (payload: { gradeId?: number }) => async () => {
  const query = objToQueryString(payload)
  try {
    const response = await api.get(`/contests/me/statistic?${query}`)
    if (response?.status === 200 && !_.isEmpty(response?.data)) {
      return response.data
    }
  } catch (error) {
    if (error instanceof Error) openError(error.message)
  }
}

export const actionGetHistory = (payload: {
  offset?: number
  limit?: number
  order?: 'ASC' | 'DESC'
  gradeId?: number
}) => async () => {
  const query = objToQueryString(payload)
  try {
    const response = await api.get(`/contests/me/history?${query}`)
    if (response?.status === 200 && !_.isEmpty(response?.data)) {
      return response.data
    }
  } catch (error) {
    if (error instanceof Error) openError(error.message)
  }
}

export const actionUserContestJoin = (payload: { contestId: number }) => async () => {
  try {
    const response = await api.post('/usercontests/join', { contestId: payload.contestId })
    if (response?.status === 200 && !_.isEmpty(response?.data)) {
      return response.data
    }
  } catch (error) {
    if (error instanceof Error) openError(error.message)
  }
}

export const actionUserContestFinish = (payload: {
  contestId: number
  duration: number
}) => async () => {
  try {
    const response = await api.post('/usercontests/finish', {
      contestId: payload.contestId,
      duration: payload.duration,
    })
    if (!_.isEmpty(response?.data)) {
      return response.data
    }
  } catch (error) {
    if (error instanceof Error) openError(error.message)
  }
}

export const saveDraftOffline = (payload: {
  bulk: { questionId: number; answer: string; duration: number }[]
}) => async () => {
  try {
    const response = await api.post('/questions/draft-result/bulk', payload)
    if (!_.isEmpty(response?.data)) {
      return response.data
    }
  } catch (error) {
    if (error instanceof Error) openError(error.message)
  }
}

export const actionGetDraft = (payload: { contestId: number }) => async () => {
  try {
    const response = await api.get(`/questions/draft?contestId=${payload.contestId}`)
    if (!_.isEmpty(response?.data)) {
      return response.data
    }
  } catch (error) {
    if (error instanceof Error) openError(error.message)
  }
}
