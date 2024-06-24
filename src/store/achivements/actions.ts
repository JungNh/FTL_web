import _ from 'lodash'
// import { Types } from './types'
import { api } from '../../lib'
import { api2 } from '../../lib2'
import { openError } from '../../utils/common'

// lay danh sach cac khoa hoc cua toi
export const actionGetAllCource = () => async () => {
  try {
    const response = await api2.post(`/courses/my-course`)
    if (!_.isEmpty(response?.data)) {
        return response.data
      }
      return []
  } catch (error) {
    if (error instanceof Error) openError(error.message)
    return []
  }
}
// lay thành tích của course theo courseId
export const actionGetAchivementByCouseId = (data: {categoryId: any}) => async () => {
  try {
    const response = await api2.post(`/courses/${data}/personal-achievement`)
    if (!_.isEmpty(response?.data)) {
      return response.data
    }
    return []
    return []
  } catch (error) {
    if (error instanceof Error) openError(error.message)
    return []
  }
}
