import _ from 'lodash'
import { openError } from '../../utils/common'
import { arenaApi as api } from '../../lib'
import { Types } from './types'
import axios from 'axios'

const instanceApi = axios.create({
  baseURL: process.env.REACT_APP_END_POINT_ARENA,
  timeout: 60000,
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
})

export const getQuestions = (id: number) => async (dispatch: any) => {
  try {
    await dispatch({
      type: Types.SET_QUESTION_STATE,
      payload: {
        quiz: undefined,
        submit_state: false,
        auto_submit_state: false,
        error_message: undefined
      }
    })
    const response = await api.post('/contests/take_exam_questions/', { round_id: id })
    if (response.data.c === 1) {
      dispatch({
        type: Types.SET_QUESTION_STATE,
        payload: { quiz: response.data.d?.[0], error_message: undefined }
      })
    } else {
      dispatch({
        type: Types.SET_QUESTION_STATE,
        payload: { quiz: undefined, error_message: response.data.m }
      })
    }
  } catch (error) {
    await dispatch({
      type: Types.SET_QUESTION_STATE,
      payload: {
        quiz: undefined,
        submit_state: false,
        auto_submit_state: false,
        error_message: undefined
      }
    })
    if (error instanceof Error) openError(error.message)
    return []
  }
}

export const submit = (result: any, type: 'submit' | 'auto_submit') => async (dispatch: any) => {
  console.log('result', result)
  try {
    const response = await api.post('/contests/submit_the_exam/', result, {
      timeout: 60000
    })
    if (response?.data?.c === 1) {
      dispatch({
        type: Types.SET_SUBMIT_STATE,
        payload: {
          submit_state: type == 'submit' ? true : false,
          auto_submit_state: type == 'auto_submit' ? true : false
        }
      })
      return response.data
    } else {
      return response.data
    }
  } catch (error) {
    if (error instanceof Error) openError(error.message)
    return []
  }
}

export const resetSubmit = () => async (dispatch: any) => {
  dispatch({
    type: Types.SET_SUBMIT_STATE,
    payload: {
      submit_state: false,
      auto_submit_state: false
    }
  })
}
