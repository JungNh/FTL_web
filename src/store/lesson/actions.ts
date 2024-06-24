// import axios from 'axios'
import _ from 'lodash'
// import { Types } from './types'
import { api } from '../../lib'
import { openError } from '../../utils/common'
import { apiCore } from '../../lib-core'
import { async } from '@firebase/util'
import { Types } from './types'

type showState = {
  isShow: boolean
  questionID?: number
}

//Lưu dữ liệu script trên store
export const saveSriptData = (payload: any) => ({
  type: Types.SAVE_DATA_SCRIPT,
  payload
})

// lay thong tin bai hoc
export const actionGetOneLesson = (payload: number) => async (dispatch: any) => {
  try {
    const response = await api.get(`/lessons/${payload}`)
    //Lấy phần dữ liệu script bài nghe
    const response_v1 = await apiCore.get(`/api/lessons/${payload}`)
    dispatch(saveSriptData(response_v1.data || null))
    if (!_.isEmpty(response?.data) && !_.isEmpty(response.data.data)) {
      return response.data.data
    }
    return []
  } catch (error) {
    if (error instanceof Error) openError(error.message)
    return []
  }
}

// lay dap an bai tap
export const actionGetResultQuestion = (payload: any) => async () => {
  try {
    const response = await api.get(`/questions/result?ids=${payload}`)
    if (!_.isEmpty(response?.data) && !_.isEmpty(response.data.data)) {
      return response.data.data
    }
    return []
  } catch (error) {
    if (error instanceof Error) openError(error.message)
    return []
  }
}

// gui dap an len server
export const actionSendAnswer = (payload: any) => async () => {
  try {
    const response = await api.post('/questions/result', payload)
    if (!_.isEmpty(response?.data)) {
      return response.data
    }
    return []
  } catch (error) {
    if (error instanceof Error) openError(error.message)
    return []
  }
}

// gui nhieu dap an len server
export const actionSendBulkAnswer = (payload: any) => async () => {
  try {
    const response = await api.post('/questions/result/bulk', payload)
    if (!_.isEmpty(response?.data)) {
      return response.data
    }
    return []
  } catch (error) {
    if (error instanceof Error) openError(error.message)
    return []
  }
}
// lay ket qua bai hoc
export const actionResultReadingOrListening = (payload: any) => async () => {
  try {
    const response = await api.get(`/questions/${payload}/result`)
    if (!_.isEmpty(response?.data)) {
      return response.data.data
    }
    return []
  } catch (error) {
    if (error instanceof Error) openError(error.message)
    return []
  }
}
export const actionResultQuiz = (payload: any) => async () => {
  try {
    const response = await api.get(`/quizs/${payload}/result-v2`)
    if (!_.isEmpty(response?.data)) {
      return response.data.data
    }
    return []
  } catch (error) {
    if (error instanceof Error) openError(error.message)
    return []
  }
}
// gui phan tram bai hoc ly thuyet
export const actionSendPercentVideo = (payload: any) => async () => {
  try {
    const response = await api.post('/unitpercentages', payload)
    if (!_.isEmpty(response?.data)) {
      return response.data
    }
    return []
  } catch (error) {
    if (error instanceof Error) openError(error.message)
    return []
  }
}
// gui phan tram bai hoc bai tap
export const actionSendPercentQuestion = (payload: any) => async () => {
  try {
    const response = await api.post('/questionpercentages', payload)
    if (!_.isEmpty(response?.data)) {
      return response.data
    }
    return []
  } catch (error) {
    if (error instanceof Error) openError(error.message)
    return []
  }
}

/**
 * Speech to text
 */
export const speechToText = (payload: any) => async () => {
  try {
    return new Promise((resolve, reject) => {
      const witAiToken = [
        'Bearer R7TANAUBBZY6JBK4SRKSL6UREDV7MX3O',
        'Bearer BS4OHZWUPG7VY5LLT2ZIE7LKM3DREJ2U',
        'Bearer BS4OHZWUPG7VY5LLT2ZIE7LKM3DREJ2U'
      ]
      let witAiIndex = 0
      try {
        witAiIndex = Number(localStorage.getItem('witAiIndex')) || 0
      } catch (err) {
        witAiIndex = 0
      }

      const data = new FormData()
      data.append('file', payload)

      const xhr = new XMLHttpRequest()
      xhr.withCredentials = true

      let lastIndex = 0
      let lastChunked: any
      xhr.onprogress = () => {
        const currIndex = xhr.responseText.length
        if (lastIndex === currIndex) return
        const s = xhr.responseText.substring(lastIndex, currIndex)
        lastIndex = currIndex
        try {
          lastChunked = JSON.parse(s)
        } catch (error) {
          //
        }
      }

      xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (lastChunked?.code === 'rate-limit') {
            const nextWitIndex = witAiIndex < witAiToken.length - 1 ? witAiIndex + 1 : 0
            localStorage.setItem('witAiIndex', nextWitIndex.toString())
          }
          resolve(lastChunked)
        }
      }

      xhr.onerror = (err) => {}

      xhr.open('POST', 'https://api.wit.ai/speech', true)
      xhr.setRequestHeader('Content-Type', 'audio/mpeg3')
      xhr.setRequestHeader('Authorization', witAiToken[witAiIndex])

      xhr.send(data)
      return xhr
    })
  } catch (error) {
    if (error instanceof Error) openError(error.message)
    return []
  }
}

export const saveHightScoreGame = (payload: any) => ({
  type: Types.SAVE_HIGHT_SCORE,
  payload
})

//check report question
export const checkReport = async (questionId: number, userId: number) => {
  try {
    const response = await apiCore.post('/question-reports', { questionId, userId })
    if (!_.isEmpty(response?.data)) {
      return response.data
    }
    return []
  } catch (error) {
    if (error instanceof Error) openError(error.message)
    return error
  }
}

export const actionShowReport = (payload: showState) => ({
  type: Types.SHOW_REPORT,
  payload
})

export const actionShowReported = (payload: any) => ({
  type: Types.SHOW_REPORTED,
  payload
})

export const actionShowSumary = (payload: any) => ({
  type: Types.SHOW_SUMARY,
  payload
})

export const actionAddCorrect = () => ({
  type: Types.ADD_CORRECT
})

export const actionAddWrong = () => ({
  type: Types.ADD_WRONG
})

export const actionResetCorrect = () => ({
  type: Types.RESET_CORRECT
})

export const actionShowCheer = (payload: boolean) => ({
  type: Types.SHOW_CHEER,
  payload
})

export const actionFirstCheerCorrect = () => ({
  type: Types.SHOW_FIRST_CHEER_CORRECT
})

export const actionSecondCheerCorrect = () => ({
  type: Types.SHOW_SECOND_CHEER_CORRECT
})

export const actionCheerWrong = () => ({
  type: Types.SHOW_CHEER_WRONG,
})
