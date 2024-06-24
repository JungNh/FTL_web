import { Reducer } from 'redux'
import { Types } from './types'
import States from './states'

export const initialState: States = {
  categories: [],
  itemCourse: {},
  must_update: 0,
  show_popup_vitan: 0,

  provinces: [],
  levels: [],
  districts: [],
  schools: [],
  listNotiAll: [],
  numberNotiNotRead: 0,
  newsData: {},
  isShowNews: false,
  loadingNoti: false,
  isShowPosts: false,
  postsData: {},
  lastLesson: {},
  slideShow: [],
  isShowAffi: false
}
const reducer: Reducer<States> = (state = initialState, action) => {
  switch (action.type) {
    case Types.RESET:
      return initialState
    // luu thong tin dang nhap
    case Types.SAVE_DATA_CATEGORY:
      return {
        ...state,
        categories: action.payload
      }
    // luu chi tiet khoa hoc
    case Types.SAVE_ITEM_COURSE:
      return {
        ...state,
        itemCourse: action.payload
      }
    case Types.SAVE_UPDATE_PROFILE:
      const { must_update, show_popup_vitan } = action.payload
      return {
        ...state,
        must_update: must_update,
        show_popup_vitan: show_popup_vitan
      }
    case Types.SAVE_DATA_PROVINCES:
      return {
        ...state,
        provinces: action.payload
      }
    case Types.SAVE_DATA_LEVELS:
      return {
        ...state,
        levels: action.payload
      }
    case Types.SAVE_DATA_DISTRICTS:
      return {
        ...state,
        districts: action.payload
      }
    case Types.SAVE_DATA_SCHOOLS:
      return {
        ...state,
        schools: action.payload
      }
    case Types.SAVE_LIST_NOTIFY_ALl:
      return {
        ...state,
        listNotiAll: action.payload,
        loadingNoti: false
      }
    case Types.SAVE_NUM_NOTI_NOT_READ:
      return {
        ...state,
        numberNotiNotRead: action.payload
      }

    case Types.LOADING_NOTI_DATA:
      return {
        ...state,
        loadingNoti: action.payload
      }

    case Types.SAVE_NEWS_NOTI_DATA:
      return {
        ...state,
        newsData: action.payload
      }

    case Types.IS_SHOW_NEWS:
      return {
        ...state,
        isShowNews: action.payload
      }

    case Types.IS_SHOW_POSTS:
      return {
        ...state,
        isShowPosts: action.payload
      }

    case Types.SAVE_POSTS_NOTI_DATA:
      return {
        ...state,
        postsData: action.payload
      }
    case Types.SAVE_SLIDE_SHOW:
      return {
        ...state,
        slideShow: action.payload
      }

    case Types.SAVE_LAST_LESSON:
      return {
        ...state,
        lastLesson: action.payload
      }

    case Types.IS_SHOW_AFFILIATE:
      return {
        ...state,
        isShowAffi: action.payload
      }

    default:
      return state
  }
}
export { reducer as homeReducer }
