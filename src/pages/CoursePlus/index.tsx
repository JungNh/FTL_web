import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useLocation } from 'react-router'
import { apiCore } from '../../lib-core'
import { RootState } from '../../store'
import { getCourseById } from '../../store/home/actions'
import { hideLoading, showLoading } from '../../store/login/actions'
import {
  actionActiveModalWelcome,
  actionSaveChildLesson,
  actionSaveCurrentCourse,
  actionSaveCurrentSection,
  actionSaveParentLessons,
  saveListPurchase
} from '../../store/study/actions'
import { openError } from '../../utils/common'
import CoursePlusHome from './components/CoursePlusHome'
import CoursePlusRouter from './components/CoursePlusRouter'
import './style.scss'
import Swal from 'sweetalert2'
import fubo_blink from '../../assets/images/ico_fubo.svg'

const CoursePlus = ({ location = 'router' }) => {
  const [dataPlus, setDataPlus] = useState({
    active: 0,
    data: []
  })

  const pathCurrent = useLocation()

  const currentCourse = useSelector((state: RootState) => state.study.currentCourse)

  const dispatch = useDispatch()
  const history = useHistory()

  const handleGetCourse = async (id: number) => {
    dispatch(showLoading())
    const response = await apiCore.post(`/course/${id}`)
    if (_.get(response, 'data.data.isComingSoon') == 1) {
      Swal.fire({
        title: `<div style="color: #000; font-weight:bold;font-size:30px">THÔNG BÁO</div>`,
        html: ' Khóa học sắp được ra mắt. Xin vui lòng quay lại sau!',
        confirmButtonText: `<div style="
          padding-left:20px;padding-right: 20px; padding-top:5px,padding-bottom:5px
        ">ĐỒNG Ý</div>`,
        iconHtml: `<img src="${fubo_blink}">`,
        customClass: {
          icon: 'icon-style',
          title: 'title-popup',
          container: 'container-popup'
        }
      })
      return
    }
    try {
      const courseResult: any = await dispatch(getCourseById(id))
      const coursePurchased = await apiCore.post('/course/purchased')
      dispatch(saveListPurchase(coursePurchased?.data))
      const listCoursePurchased = coursePurchased?.data?.data || []
      if (!_.isEmpty(courseResult)) {
        if (currentCourse?.id !== courseResult?.id) {
          dispatch(actionSaveCurrentCourse(courseResult))
          dispatch(actionSaveCurrentSection(null))
          dispatch(actionSaveParentLessons(null))
          dispatch(actionSaveChildLesson(null))
        }
        if (listCoursePurchased.length > 0 && listCoursePurchased.includes(courseResult.id)) {
          dispatch(actionActiveModalWelcome(true))
          console.log('TH1____')
          history.push({
            pathname: `/study/${courseResult?.id}`,
            state: { showPopup: true, isPurchased: true }
          })
        } else {
          dispatch(actionActiveModalWelcome(false))
          console.log('TH2____')
          history.push({
            // pathname: `/study/${courseResult?.id}`,
            pathname: `/study/plus/${courseResult?.id}`,
            state: { showPopup: true, isPurchased: false }
          })
        }
      }
      dispatch(hideLoading())
    } catch (error) {
      if (error instanceof Error) openError(error.message)
    }
  }

  const handleGetDataPlus = async (language: string, index: number) => {
    console.log('language',language);
    
    try {
      const response = await apiCore.post('/course/courses-plus', {
        language
      })
      const coursesPurchased = await apiCore.post('/course/purchased')
      dispatch(saveListPurchase(coursesPurchased?.data))
      if (!_.isEmpty(response?.data)) {
        let newData = response?.data?.data
        if (coursesPurchased?.data?.data?.length > 0) {
          const listCoursePurchased = coursesPurchased?.data?.data
          newData = newData.map((item: any) => {
            if (listCoursePurchased.includes(item.id))
              return {
                ...item,
                isPurchased: true
              }
            return {
              ...item,
              isPurchased: false
            }
          })
        }
        setDataPlus({
          ...dataPlus,
          data: newData,
          active: index
        })
      }
    } catch (error) {
      if (error instanceof Error) openError(error.message)
    }
  }

  useEffect(() => {
    let handlePath = pathCurrent.pathname.replace(/\//g, '')
    handleGetDataPlus(handlePath, 0)
  }, [pathCurrent])

  return (
    <CoursePlusRouter
      dataPlus={dataPlus}
      handleGetDataPlus={handleGetDataPlus}
      handleGetCourse={handleGetCourse}
    />
  )
}

export default React.memo(CoursePlus)
