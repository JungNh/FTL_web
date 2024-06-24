import { Reducer } from 'redux'
import { Types } from './types'
import States from './states'

export const initialState: States = {
  historyMe: null,
}
const reducer: Reducer<States> = (state = initialState, action) => {
  switch (action.type) {
    case Types.RESET:
      return initialState
    case Types.SAVE_HISTORY_ME:
      return {
        ...state,
        historyMe: action.payload,
      }
    default:
      return state
  }
}
export { reducer as progressReducer }
