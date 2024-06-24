import _ from 'lodash'

import { arenaApi as api } from '../../lib'
import { openError } from '../../utils/common'
import { ContestType } from '../../utils/enums'
import { Types } from './types'

export const contestRegistration =
  (id: number, mode?: ContestType, callback?: Function) => async (dispatch: any) => {
    try {
      const response = await api.post('/contests/candidate_register/', {
        round_id: id
      })
      const c = response.data.c
      if (c === 1 || c === -11) {
        dispatch({
          type: Types.CONTEST_REGISTRATION_SUCCEED,
          payload: {
            id,
            mode,
            is_registed: c === -11
          }
        })
        callback?.()
      } else if (c === -10) {
        dispatch({
          type: Types.CONTEST_REGISTRATION_FAILED,
          payload: {
            error: '-10',
            id: id
          }
        })
      } else {
        dispatch({
          type: Types.CONTEST_REGISTRATION_FAILED,
          payload: {
            error: response.data.m,
            id: id
          }
        })
      }
    } catch (error) {
      if (error instanceof Error) openError(error.message)
      return []
    }
  }

export const getCandidateInfo = () => async (dispatch: any) => {
  try {
    const response = await api.post('/candidates/get_info/', {})
    if (response.data.c === 1) {
      dispatch({ type: Types.GET_CANDIDATE_SUCCEED, payload: response.data.d?.[0] })
    }
  } catch (error) {
    if (error instanceof Error) openError(error.message)
    return []
  }
}

export const resetContestRegistration = () => ({
  type: Types.RESET_CONTEST_REGISTRATION
})

export const saveDataRoundInfo = (data: any) => async (dispatch: any) => {
  try {
    dispatch({ type: Types.SAVE_DATA_ROUND_INFO, payload: data })
  } catch (error) {
    if (error instanceof Error) openError(error.message)
    return []
  }
}

export const saveTabOptions = (tab: string) => async (dispatch: any) => {
  try {
    dispatch({ type: Types.TAB_OPTION, payload: tab })
  } catch (error) {
    if (error instanceof Error) openError(error.message)
    return []
  }
}

export const saveIsOpenEditUser = (isOpen: boolean) => async (dispatch: any) => {
  try {
    dispatch({ type: Types.IS_OPEN_EDIT_USER, payload: isOpen })
  } catch (error) {
    if (error instanceof Error) openError(error.message)
    return []
  }
}

export const saveIsOpenFormCode = (isOpen: boolean) => async (dispatch: any) => {
  try {
    dispatch({ type: Types.IS_FORM_CODE, payload: isOpen })
  } catch (error) {
    if (error instanceof Error) openError(error.message)
    return []
  }
}
