import { Reducer } from 'redux'
import { Types } from './types'
import States from './states'

export const initialState: States = {
  allSections: null,
  currentCourse: null,
  currentSection: null,
  parentLessons: null,
  childLesson: null,
  gameResouces: [],
  modalWelcome: false,
  checkLang: null,
  listPurcharse: [-1],
  showActiveCode: true,
  sectionInCourse: [],
  perSectionsCourse: []
}
const reducer: Reducer<States> = (state = initialState, action) => {
  switch (action.type) {
    case Types.RESET:
      return initialState
    // luu tat ca chuong cua khoa hoc
    case Types.SAVE_ALL_SECTIONS:
      return {
        ...state,
        allSections: action.payload
      }
    // luu type khoa hoc
    case Types.SAVE_CURRENT_COURSE:
      return {
        ...state,
        currentCourse: action.payload
      }
    case Types.SAVE_CURRENT_SECTION:
      return {
        ...state,
        currentSection: action.payload
      }
    case Types.SAVE_PARENT_LESSON:
      return {
        ...state,
        parentLessons: action.payload
      }
    case Types.SAVE_CHILD_LESSON:
      return {
        ...state,
        childLesson: action.payload
      }
    case Types.SAVE_GAME_RESOURCES:
      return {
        ...state,
        gameResouces: action.payload
      }
    case Types.SAVE_MODAL_WELCOME:
      return {
        ...state,
        modalWelcome: action.payload
      }
    case Types.SAVE_CHECK_LANGUAGE:
      return {
        ...state,
        checkLang: action.payload
      }

    case Types.SAVE_LIST_PURCHARSE:
      return { ...state, listPurcharse: action.payload }

    case Types.SHOW_ACTIVE:
      return { ...state, showActiveCode: action.payload }

    case Types.SAVE_ALL_LESSONS:
      return { ...state, sectionInCourse: action.payload }

    case Types.SAVE_PER_SECTION_COURSE:
      let arrLesson = state.sectionInCourse
      let arrPerLesson = action.payload
      if (arrLesson.length !== 0) {
        for (let i = 0; i < arrLesson.length; i++) {
          let child = arrLesson[i]
          child.perLock = arrPerLesson[child.id] ? arrPerLesson[child.id]?.unit_percentage : 0
        }
      }
      return { ...state, sectionInCourse: arrLesson }
    default:
      return state
  }
}
export { reducer as studyReducer }
