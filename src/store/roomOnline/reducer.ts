import { Reducer } from 'redux'
import { Types } from './types'
import States from './states'

export const initialState: States = {
  listRoom: {},
  currentRoom: { info: null, member: null, contest: null },
}
const reducer: Reducer<States> = (state = initialState, action) => {
  switch (action.type) {
    case Types.RESET:
      return initialState
    case Types.SAVE_LIST_ROOM:
      return {
        ...state,
        listRoom: action.payload,
      }
    case Types.SAVE_CURRENT_ROOM:
      return {
        ...state,
        currentRoom: action.payload,
      }
    case Types.SAVE_MEMBER:
      return {
        ...state,
        currentRoom: {
          ...state.currentRoom,
          member: action.payload,
        },
      }
    case Types.SAVE_CONTEST:
      return {
        ...state,
        currentRoom: {
          ...state.currentRoom,
          contest: action.payload,
        },
      }
    default:
      return state
  }
}
export { reducer as roomOnlineReducer }
