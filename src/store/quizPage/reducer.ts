import { Reducer } from 'redux'
import { Types } from './types'
import States from './states'

const initialState: States = {
  quiz: undefined,
  submit_state: false,
  auto_submit_state: false,
  error_message: undefined,
}
const QuizPageReducer: Reducer<States> = (state = initialState, action) => {
  switch (action.type) {
    case Types.SET_QUESTION_STATE:
      return {
        ...state,
        ...action.payload,
      }
    case Types.SET_SUBMIT_STATE:
      return {
        ...state,
        ...action.payload
      }
    default:
      return state
  }
}
export default QuizPageReducer
