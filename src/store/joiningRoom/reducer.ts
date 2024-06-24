import { Reducer } from 'redux'
import { Types } from './types'
import States from './states'

const initialState: States = {
  contest: null,
}
const JoiningRoomReducer: Reducer<States> = (state = initialState, action) => {
  switch (action.type) {
    case Types.GET_CONTEST:
      return state
    case Types.GET_CONTEST_SUCCEED:
      return {
        ...state,
        contest: action.payload,
      }
    default:
      return state
  }
}
export default JoiningRoomReducer
