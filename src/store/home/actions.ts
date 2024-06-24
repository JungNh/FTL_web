import _ from 'lodash'
import { Types } from './types'
import { api } from '../../lib'
import { openError } from '../../utils/common'
import { apiCore } from '../../lib-core'
import { api2 } from '../../lib2'
import { STATUS } from '../../pages/Homepage/ModalNotify/constants'
import { ItemSlidShow } from '../../pages/ArenaPage/components/Carousel'
import moment from 'moment'

const API_MATH = process.env.REACT_APP_API_V2

// luu danh sach category
export const actionSaveDataCategory = (payload: any) => ({
  type: Types.SAVE_DATA_CATEGORY,
  payload
})

// luu chi tiet khoa hoc
export const actionSaveItemCourse = (payload: any) => ({
  type: Types.SAVE_ITEM_COURSE,
  payload
})

export const actionSaveSlideShow = (payload: any) => ({
  type: Types.SAVE_SLIDE_SHOW,
  payload
})

// lay danh sach category
export const actionGetCategory = () => async (dispatch: any) => {
  try {
    const response = await api.get('/categories')
    if (!_.isEmpty(response?.data) && !_.isEmpty(response.data.data)) {
      dispatch(actionSaveDataCategory(response.data.data))
      return response.data.data
    }
    return []
  } catch (error) {
    if (error instanceof Error) openError(error.message)
    return []
  }
}
// lay danh sach khoa hoc chung
export const actionGetAllCourse = (data: { categoryId: number }) => async () => {
  try {
    const response = await apiCore.get(`/course/categories/${data.categoryId}`)
    if (!_.isEmpty(response?.data) && !_.isEmpty(response.data)) {
      return response.data
    }
    return []
  } catch (error) {
    if (error instanceof Error) openError(error.message)
    return []
  }
}
// lay danh sach slider
export const actionGetAllSlider = (payload: string) => async () => {
  try {
    const response = await api.get(`/pagebuilders/homeslides?type=${payload}`)
    if (!_.isEmpty(response?.data) && !_.isEmpty(response.data.data)) {
      return response.data.data
    }
    return []
  } catch (error) {
    if (error instanceof Error) openError(error.message)
    return []
  }
}

export const actionGetAllHomeSlide = (payload: object) => async (dispatch: any) => {
  try {
    const response = await apiCore.post(`/admin/slideshow/getList`, payload)
    if (!_.isEmpty(response?.data) && !_.isEmpty(response.data.data)) {
      // const filterList = response.data.data?.filter((item: ItemSlidShow) => {
      //   const timeStart = moment.utc(item.timeStart).format('YYYY-MM-DD HH:mm:ss')

      //   const newDate = moment().format('YYYY-MM-DD HH:mm:ss')

      //   return (item.device === 1 || item.device === 3) && timeStart <= newDate
      // })

      const filterList = response.data.data?.filter((item: any) => {
        const timeStart = moment.utc(item.timeStart).format('YYYY-MM-DD HH:mm:ss')

        const newDate = moment().format('YYYY-MM-DD HH:mm:ss')
        const timeEnd = moment.utc(item.timeEnd).format('YYYY-MM-DD HH:mm:ss')

        return (
          (item.device === 1 || item.device === 3) && timeStart <= newDate && timeEnd >= newDate
        )
      })

      return dispatch(actionSaveSlideShow(filterList))
    }
    return []
  } catch (error) {
    if (error instanceof Error) openError(error.message)
    return []
  }
}

// lay danh sach homelock
export const actionGetHomeBlocks = () => async () => {
  try {
    const response = await api2.get('/courses/homeblocks')
    // const response = await apiCore.get('/api/pagebuilders/homeblocks')
    if (!_.isEmpty(response?.data) && !_.isEmpty(response.data.data)) {
      return response.data.data
    }
    return []
  } catch (error) {
    if (error instanceof Error) openError(error.message)
    return []
  }
}
// lay chi tiet khoa hoc theo id
export const actionCourseWithId = (payload: number) => async (dispatch: any) => {
  try {
    const response = await api.get(`/courses/${payload}`)
    if (!_.isEmpty(response?.data) && !_.isEmpty(response.data.data)) {
      dispatch(actionSaveItemCourse(response.data.data))
      return response.data.data
    }
    return []
  } catch (error) {
    if (error instanceof Error) openError(error.message)
    return []
  }
}

// get detail course by id api core
export const getCourseById = (payload: number) => async (dispatch: any) => {
  try {
    const response = await apiCore.post(`/course/${payload}`)
    if (!_.isEmpty(response?.data) && !_.isEmpty(response.data.data)) {
      dispatch(actionSaveItemCourse(response.data.data))
      return response.data.data
    }
    return []
  } catch (error) {
    if (error instanceof Error) openError(error.message)
    return []
  }
}

// Lấy các sách user đã học
export const actionCategoryCourseWithId = (payload: number) => async (dispatch: any) => {
  try {
    const response = await api.post(`${API_MATH}/courses/category/${payload}`)
    if (!_.isEmpty(response?.data) && !_.isEmpty(response.data.data)) {
      return response.data.data
    }
    return []
  } catch (error) {
    if (error instanceof Error) openError(error.message)
    return []
  }
}
// lay tin tuc theo id
export const actionPostWithId = (payload: number) => async () => {
  try {
    const response = await api.get(`/posts/${payload}`)
    if (!_.isEmpty(response?.data) && !_.isEmpty(response.data.data)) {
      return response.data.data
    }
    return []
  } catch (error) {
    if (error instanceof Error) openError(error.message)
    return []
  }
}
// lay khoa hoc bat dau hoc
export const actionCourseQuickStart = () => async () => {
  try {
    const response = await api.get('/courses/quickstart')
    if (!_.isEmpty(response?.data) && !_.isEmpty(response.data.data)) {
      return response.data.data
    }
    return []
  } catch (error) {
    if (error instanceof Error) openError(error.message)
    return []
  }
}

// save status update profile
export const actionSaveUpdateProfile = (payload: any) => ({
  type: Types.SAVE_UPDATE_PROFILE,
  payload
})

// check user has school
export const actionCheckUserHasSchool = () => async (dispatch: any) => {
  try {
    const response = await apiCore.post('/user/check-school')
    if (!_.isEmpty(response?.data)) {
      dispatch(
        actionSaveUpdateProfile({
          must_update: response.data.data.must_update,
          show_popup_vitan: response.data.data?.pupup
        })
      )
      return response.data
    }
  } catch (error) {
    if (error instanceof Error) openError(error.message)
  }
}

// save data provinces
export const actionSaveDataProvinces = (payload: any) => ({
  type: Types.SAVE_DATA_PROVINCES,
  payload
})

// get data provinces
export const actionGetDataProvinces = () => async (dispatch: any) => {
  try {
    const response = await apiCore.post('/school/provinces')
    if (!_.isEmpty(response?.data)) {
      let newData = response.data.data.map((item: any) => {
        return { value: item.id, label: item.name }
      })
      dispatch(actionSaveDataProvinces(newData))
    }
  } catch (error) {
    if (error instanceof Error) openError(error.message)
  }
}

// save data levels
export const actionSaveDataLevels = (payload: any) => ({
  type: Types.SAVE_DATA_LEVELS,
  payload
})

// get data levels
export const actionGetDataLevels = () => async (dispatch: any) => {
  try {
    const response = await apiCore.post('/school/school-level')
    if (!_.isEmpty(response?.data)) {
      let newData = response.data.data.map((item: any) => {
        return { value: item.id, label: item.name }
      })
      dispatch(actionSaveDataLevels(newData))
    }
  } catch (error) {
    if (error instanceof Error) openError(error.message)
  }
}

// save data districts
export const actionSaveDataDistricts = (payload: any) => ({
  type: Types.SAVE_DATA_DISTRICTS,
  payload
})

interface DistrictsParams {
  province_id: number
}

// get data districts
export const actionGetDataDistricts =
  ({ province_id }: DistrictsParams) =>
  async (dispatch: any) => {
    try {
      const response = await apiCore.post(`/school/${province_id}/districts`)
      if (!_.isEmpty(response?.data)) {
        let newData = response.data.data.map((item: any) => {
          return { value: item.id, label: item.name }
        })
        dispatch(actionSaveDataDistricts(newData))
      }
    } catch (error) {
      if (error instanceof Error) openError(error.message)
    }
  }
// save data schools
export const actionSaveDataSchools = (payload: any) => ({
  type: Types.SAVE_DATA_SCHOOLS,
  payload
})

interface SchoolsParams {
  province_id: number
  district_id: number
  school_level: number
}

// get data schools
export const actionGetDataSchools =
  ({ province_id, district_id, school_level }: SchoolsParams) =>
  async (dispatch: any) => {
    try {
      const response = await apiCore.post(
        `/school/${province_id}/${district_id}/${school_level}/suggest`
      )
      if (!_.isEmpty(response?.data)) {
        let newData = response.data.data.map((item: any) => {
          return { value: item.id, label: item.name }
        })

        dispatch(actionSaveDataSchools(newData))
      }
    } catch (error) {
      if (error instanceof Error) openError(error.message)
    }
  }

export const actionLoadingListNoti = (payload: any) => ({
  type: Types.LOADING_NOTI_DATA,
  payload
})

export const actionGetListNotify = (payload: any) => async (dispatch: any) => {
  dispatch(actionLoadingListNoti(true))
  try {
    const response = await api2.post('/notification/list', payload)
    dispatch(actionSaveListNoti(response?.data?.data))
    if (payload.status == STATUS.NOT_READ) {
      dispatch(actionSaveNumNotiNotRead(response?.data?.data?.length || 0))
    }
  } catch (error) {
    if (error instanceof Error) openError(error.message)
    dispatch(actionLoadingListNoti(false))
  }
}

export const actionSaveListNoti = (payload: any) => ({
  type: Types.SAVE_LIST_NOTIFY_ALl,
  payload
})

export const markReaded = (payload: any) => async (dispatch: any) => {
  try {
    const response = await api2.post('/notification/mark-read', payload)
    return response
  } catch (error) {
    if (error instanceof Error) openError(error.message)
  }
}

export const actionSaveNumNotiNotRead = (payload: any) => ({
  type: Types.SAVE_NUM_NOTI_NOT_READ,
  payload
})

export const markReadedAll = (payload: any) => async (dispatch: any) => {
  console.log('trang thái', payload)
  try {
    const response = await api2.post('/notification/mark-read-all')
    if (response) {
      dispatch(actionGetListNotify(payload))
      dispatch(actionSaveNumNotiNotRead(0))
    }
  } catch (error) {
    if (error instanceof Error) openError(error.message)
  }
}

export const actionSaveNewsNoti = (payload: any) => ({
  type: Types.SAVE_NEWS_NOTI_DATA,
  payload
})

export const actionShowNews = (payload: any) => ({
  type: Types.IS_SHOW_NEWS,
  payload
})

export const getNewFromNoti = (payload: any) => async (dispatch: any) => {
  try {
    const response = await apiCore.get(`/api/posts/${payload}`)
    dispatch(actionSaveNewsNoti(response.data.data))
    return response
  } catch (error) {
    if (error instanceof Error) openError(error.message)
  }
}

export const actionShowPosts = (payload: any) => ({
  type: Types.IS_SHOW_POSTS,
  payload
})

export const actionSavePostsNoti = (payload: any) => ({
  type: Types.SAVE_POSTS_NOTI_DATA,
  payload
})

export const actionSaveLastLesson = (payload: any) => ({
  type: Types.SAVE_LAST_LESSON,
  payload
})

export const actionWatchLastLesson = () => async (dispatch: any) => {
  try {
    const response = await apiCore.post(`/user/lastLesson`)
    if (!_.isEmpty(response?.data)) {
      dispatch(actionSaveLastLesson(response?.data?.data))
      return response?.data
    }
  } catch (error) {
    if (error instanceof Error) openError(error.message)
  }
}

export const actionSetAffiliate = (payload: boolean) => ({
  type: Types.IS_SHOW_AFFILIATE,
  payload
})

//Get courses by language
export const actionGetHomeBlocksLanguage = (language: string) => async () => {
  try {
    // const response = await api.get('/pagebuilders/homeblocks')
    const response = await api2.get(`/courses/homeblocks?language=${language}`)
    if (!_.isEmpty(response?.data) && !_.isEmpty(response.data.data)) {
      return response.data.data
    }
    return []
  } catch (error) {
    if (error instanceof Error) openError(error.message)
    return []
  }
}
