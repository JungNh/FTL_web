import _ from 'lodash'

import { openError } from '../../utils/common'
import { Types } from './types'

export const saveListPopup = (data: any) => async (dispatch: any) => {
  try {
    dispatch({ type: Types.GET_LIST_POPUP, payload: data })
  } catch (error) {
    if (error instanceof Error) openError(error.message)
    return []
  }
}

export const saveListDataSlider = (data: any) => async (dispatch: any) => {
  try {
    dispatch({ type: Types.LIST_ITEM_SLIDER, payload: data })
  } catch (error) {
    if (error instanceof Error) openError(error.message)
    return []
  }
}

export const itemPopupSlider = (data: any) => async (dispatch: any) => {
  try {
    console.log(data, 'data ===>>>')

    dispatch({ type: Types.ITEM_SLIDER_POPUP, payload: data })
  } catch (error) {
    if (error instanceof Error) openError(error.message)
    return []
  }
}

export const clearDataListPopup = () => async (dispatch: any) => {
  try {
    dispatch({ type: Types.CLEAR_ITEM_SHOW_POPUP })
  } catch (error) {
    if (error instanceof Error) openError(error.message)
    return []
  }
}

export const setStatusItemPopup = (data: any) => async (dispatch: any) => {
  try {
    dispatch({
      type: Types.LIST_ITEM_SHOW_POPUP,
      payload: data
    })
  } catch (error) {
    if (error instanceof Error) openError(error.message)
    return []
  }
}
