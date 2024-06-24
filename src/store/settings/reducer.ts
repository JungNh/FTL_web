import { Reducer } from 'redux'
import { Types } from './types'
import States from './states'

export const initialState: States = {
  allNews: [],
}
const reducer: Reducer<States> = (state = initialState, action) => {
  switch (action.type) {
    case Types.RESET:
      return initialState
    default:
      return state
  }
}
export { reducer as settingsReducer }
