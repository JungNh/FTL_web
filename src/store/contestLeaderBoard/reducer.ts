import { Reducer } from 'redux'
import { Types } from './types'
import States from './states'

const initialState: States = {
  leaderboard: null,
}

const ContestLeaderBoardReducer: Reducer<States> = (state = initialState, action) => {
  switch (action.type) {
    case Types.GET_LEADER_BOARD_SUCCEED:
      return {
        ...state,
        leaderboard: action.payload,
      }
    default:
      return state
  }
}
export default ContestLeaderBoardReducer
