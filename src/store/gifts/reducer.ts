import { Reducer } from 'redux'
import { Types } from './types'
import States from './states'

const initialState: States = {
  gifts: []
}
const GiftsReducer: Reducer<States> = (state = initialState, action) => {
  switch (action.type) {
    case Types.GET_EARNED_GIFTS_SUCCEED:
      return {
        ...state,
        gifts: action.payload,
      }
    default:
      return state
  }
}
export default GiftsReducer
