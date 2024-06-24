import { Reducer } from 'redux'
import States from './states'
import { Types } from './types'

export const initialState: States = {
  contest: null,
}
const reducer: Reducer<States> = (state = initialState, action) => {
  switch (action.type) {
    case Types.RESET:
      return initialState
    case Types.SAVE_CONTEST:
      return { ...state, contest: action.payload }
    default:
      return state
  }
}
export { reducer as roomOfflineReducer }
