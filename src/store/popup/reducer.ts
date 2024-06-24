import { Reducer } from 'redux'
import { Types } from './types'
import States from './states'

const initialState: States = {
  list_popup: [],
  list_item_popup_show: [],
  item_popup: {},
  list_item_slider: []
}

const ArenaReducer: Reducer<States> = (state = initialState, action) => {
  switch (action.type) {
    case Types.GET_LIST_POPUP:
      return {
        ...state,
        list_popup: action.payload
      }
    case Types.ITEM_SLIDER_POPUP:
      return {
        ...state,
        item_popup: action.payload
      }
    case Types.LIST_ITEM_SHOW_POPUP:
      return {
        ...state,
        list_item_popup_show: [...state.list_item_popup_show, action.payload]
      }
    case Types.CLEAR_ITEM_SHOW_POPUP:
      return {
        ...state,
        list_item_popup_show: []
      }
    case Types.LIST_ITEM_SLIDER:
      return {
        ...state,
        list_item_slider: action.payload
      }
    default:
      return state
  }
}
export default ArenaReducer
