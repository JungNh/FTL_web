import { Reducer } from 'redux'
import { Types } from './types'
import States from './states'

export const initialState: States = {
  allSections: [],
  arrScript: [],
  hightScoreGame: 0,
  showReport: false,
  showReported: false,
  questionRpId: 0,
  showSumary: false,
  numberCorrect: 0,
  numberWrong: 0,
  showCheer: false,
  correctFirstShowed: false,
  correctSecondShowed: false,
  wrongShowed: false
}
const reducer: Reducer<States> = (state = initialState, action) => {
  switch (action.type) {
    case Types.RESET:
      return initialState
    // luu tat ca chuong cua khoa hoc
    case Types.SAVE_SECTION_OF_COURSE:
      return {
        ...state,
        allSections: action.payload
      }
    case Types.SAVE_DATA_SCRIPT:
      return {
        ...state,
        arrScript: action.payload?.data
      }
    case Types.SAVE_HIGHT_SCORE:
      return {
        ...state,
        hightScoreGame: action.payload
      }
    case Types.SHOW_REPORT:
      return {
        ...state,
        showReport: action.payload?.isShow,
        questionRpId: action.payload?.questionID
      }
    case Types.SHOW_REPORTED:
      return {
        ...state,
        showReported: action.payload
      }
    case Types.SHOW_SUMARY:
      return {
        ...state,
        showSumary: action.payload
      }
    case Types.ADD_CORRECT:
      return {
        ...state,
        numberCorrect: state.numberCorrect + 1,
        numberWrong: 0
      }
    case Types.ADD_WRONG:
      return {
        ...state,
        numberCorrect: 0,
        numberWrong: state.numberWrong + 1
      }
    case Types.SHOW_FIRST_CHEER_CORRECT:
      return {
        ...state,
        correctFirstShowed: true
      }
    case Types.SHOW_SECOND_CHEER_CORRECT:
      return {
        ...state,
        correctSecondShowed: true
      }
    case Types.SHOW_CHEER_WRONG:
      return {
        ...state,
        wrongShowed: true
      }
    case Types.RESET_CORRECT:
      return {
        ...state,
        numberCorrect: 0,
        numberWrong: 0,
        correctFirstShowed: false,
        correctSecondShowed: false,
        wrongShowed: false,
        showCheer: false
      }
    case Types.SHOW_CHEER:
      return {
        ...state,
        showCheer: action.payload
      }
    default:
      return state
  }
}
export { reducer as lessonReducer }
