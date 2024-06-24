import React, { FC, useEffect, useRef, useState } from 'react'
import '../styles.scss'
import Spinner from 'react-bootstrap/Spinner'
import _ from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router'
import AliceCarousel from 'react-alice-carousel'
import { FaChevronCircleLeft, FaChevronCircleRight } from 'react-icons/fa'
import { actionCourseWithId, getCourseById } from '../../../store/home/actions'
import { convertUrl, openError } from '../../../utils/common'
import {
  actionActiveModalWelcome,
  actionSaveChildLesson,
  actionSaveCurrentCourse,
  actionSaveCurrentSection,
  actionSaveParentLessons,
  saveListPurchase
} from '../../../store/study/actions'
import { hideLoading, showLoading } from '../../../store/login/actions'
import { RootState } from '../../../store'
import { apiCore } from '../../../lib-core'
import Swal from 'sweetalert2'
import fubo_blink from '../../../assets/images/ico_fubo.svg'
import { Button, Modal } from 'react-bootstrap'

type Props = {
  name?: string
  data: any[]
  setCurrentKey: (data: string) => void
  changeData: (data: any) => void
  setCategoryCourse: (data: any) => void
}

const ItemFirstCourse: FC<Props> = ({
  data,
  name,
  changeData,
  setCurrentKey,
  setCategoryCourse
}) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const carousel = useRef<AliceCarousel>(null)
  const [rightBtnDisabled, setRightBtnDisabled] = useState(true)
  const currentCourse = useSelector((state: RootState) => state.study.currentCourse)
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

  useEffect(() => {
    if (data.length > 4) {
      setRightBtnDisabled(false)
    }
  }, [data.length])

  const showMore = () => {
    setCategoryCourse({ name, data })
    setCurrentKey('showAll')
  }

  return (
    <div className="english__child" style={{ marginTop: '-0.5rem' }}>
      {/* <div className="d-flex justify-content-between">
        <div className="title__child">{name}</div>
        {!_.every(data, { model: 'contest' }) && (
          <p className="link__child" onClick={showMore}>
            Tất cả
          </p>
        )}
      </div> */}
      {!_.isEmpty(data) ? (
        <div className="carousel__wrapper">
          <AliceCarousel
            mouseTracking
            autoWidth
            onSlideChanged={(e: any) => {
              if (e?.item >= data?.length - 4) {
                setRightBtnDisabled(true)
              } else {
                setRightBtnDisabled(false)
              }
            }}
            ref={carousel}
            disableDotsControls
            renderPrevButton={({ isDisabled }: any) => (
              <FaChevronCircleLeft className={`btn__left ${isDisabled ? 'disabled' : ''}`} />
            )}
            renderNextButton={() => (
              <FaChevronCircleRight
                className={`btn__right ${rightBtnDisabled ? 'disabled' : ''}`}
              />
            )}
          >
            {data.map((item: any) => (
              <div
                className={`item__course--wrapper ${
                  item?.model === 'contest' ? 'content__item' : ''
                }`}
                key={item.id}
              >
                <div
                  className="item__course"
                  onClick={async () => {
                    handleGetCourse(item.id)
                  }}
                >
                  <img
                    className="image__course"
                    src={convertUrl(item.imageUrl, 'image') || ''}
                    alt=""
                  />
                  {/* <div className={`flag__vip ${item.type}`}>{item.type}</div> */}
                  {item?.model !== 'contest' && <div className="text__course">{item.name}</div>}
                </div>
              </div>
            ))}
          </AliceCarousel>
        </div>
      ) : (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: '10rem' }}
        >
          <Spinner animation="border" variant="danger" />
        </div>
      )}
    </div>
  )
}

export default ItemFirstCourse
