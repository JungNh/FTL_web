import { Reducer } from 'redux'
import { Types } from './types'
import States from './states'

const initialState: States = {
  is_registed: false,
  mode: null,
  candidate_info: null,
  error_message: null,
  contests_registration_succeed_id: null,
  data_round_info: null,
  tab_option: '',
  is_open_popup_edit_user: false,
  is_form_code: false,
  answers: []
}

const ArenaReducer: Reducer<States> = (state = initialState, action) => {
  switch (action.type) {
    case Types.CONTEST_REGISTRATION_SUCCEED:
      return {
        ...state,
        contests_registration_succeed_id: action.payload.id,
        mode: action.payload.mode,
        is_registed: action.payload.is_registed
      }
    case Types.CONTEST_REGISTRATION_FAILED:
      return {
        ...state,
        contests_registration_succeed_id: action.payload.id,
        error_message: action.payload.error
      }
    case Types.RESET_CONTEST_REGISTRATION:
      return {
        ...state,
        is_registed: false,
        mode: null,
        error_message: null,
        contests_registration_succeed_id: null
      }
    case Types.GET_CANDIDATE_SUCCEED:
      return {
        ...state,
        candidate_info: action.payload
      }
    case Types.SAVE_DATA_ROUND_INFO:
      return {
        ...state,
        data_round_info: action.payload
      }
    case Types.TAB_OPTION:
      return {
        ...state,
        tab_option: action.payload
      }
    case Types.IS_OPEN_EDIT_USER:
      return {
        ...state,
        is_open_popup_edit_user: action.payload
      }
    case Types.IS_FORM_CODE:
      return {
        ...state,
        is_form_code: action.payload
      }
    case Types.GET_ANSWER:
      let ans = action.payload.map((item: any) => {
        return {
          quest_id: item.id,
          answer_ids: []
        }
      })
      localStorage.setItem('answer_arena', JSON.stringify(ans))
      return {
        ...state,
        answers: ans
      }
    case Types.SET_ANSWER:
      const payload = action.payload
      let ansSet = state.answers.map((item: any, i: number) => {
        if (i == payload.index) {
          return { ...item, answer_ids: payload.answer_ids }
        } else {
          return item
        }
      })
      localStorage.setItem('answer_arena', JSON.stringify(ansSet))
      return {
        ...state,
        answers: ansSet
      }

    case Types.SET_MUTI_ANSWER:
      const input = action.payload
      let ansMuti = state.answers.map((item: any, i: number) => {
        if (i == input.index) {
          if (item.answer_ids.includes(input.answer_ids)) {
            return {
              ...item,
              answer_ids: item.answer_ids.filter((i: number) => i !== input.answer_ids)
            }
          } else {
            return {
              ...item,
              answer_ids: item.answer_ids.concat(input.answer_ids)
            }
          }
        } else {
          return item
        }
      })
      localStorage.setItem('answer_arena', JSON.stringify(ansMuti))
      return {
        ...state,
        answers: ansMuti
      }
    default:
      return state
  }
}
export default ArenaReducer
