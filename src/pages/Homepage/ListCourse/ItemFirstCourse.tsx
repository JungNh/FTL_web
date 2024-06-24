import React, { FC, useEffect, useRef, useState } from 'react'
import '../styles.scss'
import Spinner from 'react-bootstrap/Spinner'
import _ from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useLocation } from 'react-router'
import AliceCarousel from 'react-alice-carousel'
import { FaChevronCircleLeft, FaChevronCircleRight } from 'react-icons/fa'
import { actionCourseWithId } from '../../../store/home/actions'
import { convertUrl, openError } from '../../../utils/common'
import {
  actionSaveChildLesson,
  actionSaveCurrentCourse,
  actionSaveCurrentSection,
  actionSaveParentLessons
} from '../../../store/study/actions'
import { hideLoading, showLoading } from '../../../store/login/actions'
import { RootState } from '../../../store'
import { apiCore } from '../../../lib-core'
import Swal from 'sweetalert2'
import fubo_blink from '../../../assets/images/ico_fubo.svg'
import vipcourse from '../../../assets/images/vip_course.png'
import { Button, Modal } from 'react-bootstrap'

type Props = {
  name?: string
  data: any[]
  setCurrentKey: (data: string) => void
  changeData: (data: any) => void
  setCategoryCourse: (data: any) => void
  setVisibleCategory: (data: boolean) => void
}

const ItemFirstCourse: FC<Props> = ({
  data,
  name,
  changeData,
  setCurrentKey,
  setCategoryCourse,
  setVisibleCategory
}) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const pathCurrent = useLocation()
  console.log(pathCurrent.pathname)
  const carousel = useRef<AliceCarousel>(null)
  const [rightBtnDisabled, setRightBtnDisabled] = useState(true)
  const currentCourse = useSelector((state: RootState) => state.study.currentCourse)
  const callItemCourse = async (id: number) => {
    dispatch(showLoading())
    const courseResult: any = await dispatch(actionCourseWithId(id))
    if (!_.isEmpty(courseResult)) {
      if (currentCourse?.id !== courseResult?.id) {
        dispatch(actionSaveCurrentCourse(courseResult))
        dispatch(actionSaveCurrentSection(null))
        dispatch(actionSaveParentLessons(null))
        dispatch(actionSaveChildLesson(null))
      }
      dispatch(hideLoading())
      history.push({
        pathname: `/study/${courseResult?.id}`,
        state: { showPopup: true, path: pathCurrent.pathname }
      })
    } else {
      dispatch(hideLoading())
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
    <div>
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
                key={item.sourceId}
              >
                <div
                  className="item__course"
                  onClick={async () => {
                    if (item?.model === 'courses') {
                      const response = await apiCore.post(`/course/${item.sourceId}`)
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
                      callItemCourse(item?.sourceId)
                    }
                    if (item?.model === 'categories') {
                      changeData(item)
                      // setCurrentKey('detail')
                      setVisibleCategory(true)
                    }
                    if (item?.model === 'contest' && item.sourceId === 'online') {
                      history.push('/exam-online')
                    }
                    if (item?.model === 'contest' && item.sourceId === 'offline') {
                      history.push('/exam-offline')
                    }
                  }}
                >
                  <div style={{ position: 'relative' }}>
                    <img
                      className="image__course"
                      src={convertUrl(item.imageUrl, 'image') || ''}
                      alt=""
                    />
                    {item?.vip ? (
                      <img src={vipcourse} style={{ position: 'absolute', bottom: 3, right: -1 }} />
                    ) : (
                      <></>
                    )}
                  </div>
                  <div className={`flag__vip ${item.type}`}>{item.type}</div>
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
