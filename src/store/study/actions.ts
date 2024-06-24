import _ from 'lodash'
import Swal from 'sweetalert2'
import { LessionType, Types } from './types'
import { api } from '../../lib'
import { apiCore } from '../../lib-core'
import { openError } from '../../utils/common'

const API_MATH = process.env.REACT_APP_API_V2

// luu danh sach cac chuong
export const actionSaveSections = (payload: any) => ({
  type: Types.SAVE_ALL_SECTIONS,
  payload
})
export const actionSaveAllLessons = (payload: any) => ({
  type: Types.SAVE_ALL_LESSONS,
  payload
})

// lay danh sach tat ca bai hoc theo khoa hoc
export const actionAllLessonsWithCourse =
  (payload: { courseId: number }) => async (dispatch: any) => {
    try {
      const response = await api.get(`/lessons?courseId=${payload.courseId}`)
      if (!_.isEmpty(response?.data) && !_.isEmpty(response.data.data)) {
        await dispatch(actionSaveAllLessons(response.data.data))
        await dispatch(actionAllPerLessonInCourse(payload.courseId))
        return response.data.data
      }
      return []
    } catch (error) {
      if (error instanceof Error) openError(error.message)
      return []
    }
  }
// lay thong tin chuong dang hoc
export const actionGetInfoUnitActive = (payload: number) => async () => {
  try {
    const response = await api.get(`/lessons/lastest?courseId=${payload}`)
    if (!_.isEmpty(response?.data)) {
      return response?.data
    }
    return []
  } catch (error) {
    if (error instanceof Error) openError(error.message)
    return []
  }
}
// goi api join vao bai hoc
export const actionJoinLesson = (payload: any) => async () => {
  try {
    const response = await api.post('/studentunits/join', payload)
    if (!_.isEmpty(response?.data)) {
      return response.data
    }
    return []
  } catch (error) {
    if (error instanceof Error) openError(error.message)
    return []
  }
}
// goi api ket thuc bai hoc
export const actionFinishedLesson = (payload: any) => async () => {
  try {
    const response = await api.post('/studentunits/finish', payload)
    if (!_.isEmpty(response?.data)) {
      return response.data
    }
    return []
  } catch (error) {
    if (error instanceof Error) openError(error.message)
    return []
  }
}
// lay danh sach bai hoc con
export const actionGetChildsLesson = (payload: number) => async () => {
  try {
    const response = await api.get(`/lessons/${payload}/childs`)
    if (!_.isEmpty(response?.data)) {
      return response?.data?.data
    }
    return {}
  } catch (error) {
    if (error instanceof Error) openError(error.message)
    return {}
  }
}

export const actionGetSectionScore = (payload: any) => async () => {
  try {
    const response = await api.post(`${API_MATH}/progresses/section-score-user`, payload)
    if (!_.isEmpty(response?.data)) {
      return response?.data?.data
    }
    return {}
  } catch (error) {
    if (error instanceof Error) openError(error.message)
    return {}
  }
}

export const actionGetCourseScore = (payload: any) => async () => {
  try {
    const response = await api.post(`${API_MATH}/progresses/course-score-user`, payload)
    if (!_.isEmpty(response?.data)) {
      return response?.data?.data
    }
    return {}
  } catch (error) {
    if (error instanceof Error) openError(error.message)
    return {}
  }
}

export const actionSaveScoreLession = (payload: any) => async () => {
  try {
    const response = await api.post(`${API_MATH}/progresses/save`, payload)
    if (!_.isEmpty(response?.data)) {
      return response?.data?.code
    }
    return {}
  } catch (error) {
    if (error instanceof Error) openError(error.message)
    return {}
  }
}

/**
 * API GET ALL SECTION IN COURSE
 */
export const actionGetAllSection = (payload: { courseId: number }) => async (dispatch: any) => {
  try {
    const response = await api.get(`/sections/${payload?.courseId}`)
    if (!_.isEmpty(response?.data) && !_.isEmpty(response.data.data)) {
      const sortedSections = _.sortBy(response.data.data, 'sequenceNo')
      await dispatch(actionSaveSections(JSON.stringify(sortedSections || '')))
      return sortedSections
    }
    return []
  } catch (error) {
    if (error instanceof Error) openError(error.message)
    return []
  }
}

/**
 * API GET LESSON IN SECTION
 */
export const actionGetLessionWithSectionId = (payload: { sectionId: string }) => async () => {
  try {
    const response = await api.get(`/lessons?sectionId=${payload?.sectionId}`)
    if (!_.isEmpty(response?.data) && !_.isEmpty(response.data.data)) {
      const sortedData: LessionType[] = _.sortBy(response.data.data, 'sequenceNo')
      const filtedData: LessionType[] = _.filter(sortedData, (item: any) => item.status !== 'draft')
      return filtedData
    }
    return []
  } catch (error) {
    if (error instanceof Error) openError(error.message)
    return []
  }
}

export const actionSaveCurrentCourse = (payload: any) => ({
  type: Types.SAVE_CURRENT_COURSE,
  payload
})

export const actionSaveCurrentSection = (payload: any) => ({
  type: Types.SAVE_CURRENT_SECTION,
  payload
})

export const actionSaveParentLessons = (payload: any) => ({
  type: Types.SAVE_PARENT_LESSON,
  payload
})

export const actionSaveChildLesson = (payload: any) => ({
  type: Types.SAVE_CHILD_LESSON,
  payload
})

export const actionTextToSpeech = (payload: { text: string }) => async () => {
  try {
    const response = await api.post('/texttospeech', payload)
    if (!_.isEmpty(response?.data) && !_.isEmpty(response.data.data)) {
      return response.data.data
    }
    return []
  } catch (error) {
    if (error instanceof Error) openError(error.message)
    return []
  }
}

export const actionGetHomophones =
  ({ word }: { word: string }) =>
  async () => {
    try {
      const response = await api.get(`/homophones?word=${word}`)
      if (!_.isEmpty(response?.data) && !_.isEmpty(response.data.data)) {
        return response.data.data
      }
    } catch (error) {
      if (error instanceof Error) openError(error.message)
    }
  }

export const actionReportQuestion =
  (payload: { content: string; questionId: number }) => async () => {
    try {
      const response = await api.post('/questionreports', payload)
      if (!_.isEmpty(response?.data) && !_.isEmpty(response.data.data)) {
        return response.data.data
      }
      return []
    } catch (error) {
      if (error instanceof Error) openError(error.message)
      return []
    }
  }

export const actionGetLastestCourse = () => async (dispatch: any) => {
  try {
    const response = await api.get('/courses/lastest')
    if (response?.data?.data) {
      dispatch(actionSaveCurrentCourse(response.data.data))
      return response?.data?.data
    }
    Swal.fire('Bạn đang không học khóa nào', 'Vui lòng chọn một khóa để bắt đầu.', 'info')

    return undefined
  } catch (error) {
    if (error instanceof Error) openError(error.message)
  }
}
/**
 * @param  {courseId:number|string} payload Id của Khóa đang học
 */
export const actionPostLastestCourse =
  (payload: { courseId: number | string }) => async (dispatch: any) => {
    try {
      const response = await api.post('/courses/lastest', { courseId: payload?.courseId })
      if (response?.data?.data) {
        return response.data.data
      }
    } catch (error) {
      if (error instanceof Error) openError(error.message)
      return []
    }
  }

export const actionSaveDurationStudy =
  (payload: { unitId: number; duration: number }) => async () => {
    try {
      const response = await api.post('/studentunits/learned', {
        unitId: payload.unitId,
        duration: payload.duration
      })
      if (response?.data?.data) {
        return response.data.data
      }
    } catch (error) {
      if (error instanceof Error) openError(error.message)
      return []
    }
  }

// lay 1 bài học
export const actionGetOneLesson = (payload: number) => async () => {
  try {
    const response = await api.get(`/lessons/${payload}`)
    if (!_.isEmpty(response?.data)) {
      return response?.data?.data
    }
    return {}
  } catch (error) {
    if (error instanceof Error) openError(error.message)
    return {}
  }
}
// game resources
export const saveGameResource = (payload: any) => ({
  type: Types.SAVE_GAME_RESOURCES,
  payload
})

export const getGameResource = (payload: any) => async (dispatch: any) => {
  try {
    const response = await api.get(`/new-game?filter=name||$eq||${payload.name}`, {
      // baseURL: 'https://future-api.2soft.top/api',
    })
    if (!_.isEmpty(response?.data)) {
      dispatch(saveGameResource(response.data))
      return response.data
    }
    return []
  } catch (error) {
    if (error instanceof Error) openError(error.message)
    return []
  }
}

export const actionGetLeaderBoard =
  (payload: { courseId: number | string; time: string; data: object }) => async () => {
    try {
      const response = await api.post(
        `${API_MATH}/progresses/${payload?.courseId}/course-rank-${payload?.time}`,
        {
          ...payload?.data
        }
      )
      if (!_.isEmpty(response?.data)) {
        return response?.data?.data
      }
      return {}
    } catch (error) {
      if (error instanceof Error) openError(error.message)
      return {}
    }
  }

export const actionGetCurrentRankUser = (payload: { courseId: number | string }) => async () => {
  try {
    const response = await api.post(`${API_MATH}/progresses/${payload?.courseId}/rank-user`)
    if (!_.isEmpty(response?.data)) {
      return response?.data?.data
    }
    return {}
  } catch (error) {
    if (error instanceof Error) openError(error.message)
    return {}
  }
}

// lay chi tiet khoa hoc theo id
export const actionCourseWithId = (payload: number) => async () => {
  try {
    const response = await api.get(`/courses/${payload}`)
    if (!_.isEmpty(response?.data) && !_.isEmpty(response.data.data)) {
      return response.data.data
    }
    return []
  } catch (error) {
    if (error instanceof Error) openError(error.message)
    return []
  }
}

export const actionActiveModalWelcome = (payload: boolean) => (dispatch: any) => {
  dispatch({
    type: Types.SAVE_MODAL_WELCOME,
    payload
  })
}

export const actionCheckLanguage = (payload: any) => async (dispatch: any) => {
  try {
    const response = await apiCore.post(`/course/${payload.courseId}`)
    if (!_.isEmpty(response) && response?.data) {
      dispatch({
        type: Types.SAVE_CHECK_LANGUAGE,
        payload: response?.data?.data
      })
    }
  } catch (error) {
    if (error instanceof Error) openError(error.message)
    return []
  }
}

export const saveListPurchase = (payload: any) => ({
  type: Types.SAVE_LIST_PURCHARSE,
  payload
})

export const savePerSectionsCourse = (payload: any) => ({
  type: Types.SAVE_PER_SECTION_COURSE,
  payload
})

export const actionAllPerLessonInCourse = (payload: any) => async (dispatch: any) => {
  try {
    const response = await api.post(`${API_MATH}/progresses/${payload}/lessons`)
    if (!_.isEmpty(response?.data)) {
      dispatch(savePerSectionsCourse(response?.data?.data))
      return response?.data?.data
    }
    return {}
  } catch (error) {
    if (error instanceof Error) openError(error.message)
    return {}
  }
}
