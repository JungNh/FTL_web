import { Reducer } from 'redux'
import { Types } from './types'
import States from './states'

const initialState: States = {
  gifts: []
}
const LuckyDrawReducer: Reducer<States> = (state = initialState, action) => {
  switch (action.type) {
    case Types.SET_DRAW_LIST_STATE:
      return {
        ...state,
        ...action.payload
      }
    default:
      return state
  }
}
export default LuckyDrawReducer
