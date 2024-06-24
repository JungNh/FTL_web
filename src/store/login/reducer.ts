import { Reducer } from 'redux'
import { Types } from './types'
import States from './states'

export const initialState: States = {
  authUser: {},
  userInfo: {},
  userInfoCore: {},
  loading: false,
  userInteract: false,
  firebaseToken: null,
}
const reducer: Reducer<States> = (state = initialState, action) => {
  switch (action.type) {
    case Types.RESET:
      return initialState
    case Types.SAVE_AUTH_LOGIN:
      return {
        ...state,
        authUser: action.payload,
      }
    case Types.SAVE_FIREBASE_TOKEN:
      return {
        ...state,
        firebaseToken: action.payload,
      }
    case Types.SAVE_USER_INFO:
      return {
        ...state,
        userInfo: action.payload,
      }
    case Types.SAVE_USER_INFO_CORE:
      return {
        ...state,
        userInfoCore: action.payload,
      }
    case Types.SHOW_LOADING:
      return {
        ...state,
        loading: true,
      }
    case Types.HIDE_LOADING:
      return {
        ...state,
        loading: false,
      }
    case Types.USER_INTERACT_WEB:
      return {
        ...state,
        userInteract: action.payload,
      }
    default:
      return state
  }
}
export { reducer as loginReducer }
