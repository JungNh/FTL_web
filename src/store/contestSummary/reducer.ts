import { Reducer } from 'redux'
import { Types } from './types'
import States from './states'

const initialState: States = {
  contest_summary: [],
  error_message: null,
}
const ContestSummaryReducer: Reducer<States> = (state = initialState, action) => {
  switch (action.type) {
    case Types.SET_CONTEST_SUMMARY_STATE:
      return {
        ...state,
        ...action.payload
      }
    default:
      return state
  }
}
export default ContestSummaryReducer
