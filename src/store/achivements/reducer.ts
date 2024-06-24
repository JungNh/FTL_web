import { Reducer } from 'redux'
import { Types } from './types'
import States from './states'

export const initialState: States = {
}
const reducer: Reducer<States> = (state = initialState, action) => {
  switch (action.type) {
    
    default:
      return state
  }
}
export { reducer as achivementReducer }
