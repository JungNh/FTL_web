import React, { FC, useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import _ from 'lodash'
import { Card, Col, ProgressBar, Row } from 'react-bootstrap'
import { CourseItem, Button } from '../../../components'
import { actionCourseWithId } from '../../../store/home/actions'
import { convertUrl, openError } from '../../../utils/common'
import { hideLoading, showLoading } from '../../../store/login/actions'
import {
  actionSaveChildLesson,
  actionSaveCurrentCourse,
  actionSaveCurrentSection,
  actionSaveParentLessons
} from '../../../store/study/actions'
import { RootState } from '../../../store'
import { EMTYP_IMG } from '../../MyCourseLeaning/components/images'
import ModalCourse from '../../../components/ModalCourse'
import vipcourse from '../../../assets/images/vip_course.png'

type Props = {
  setCurrentKey: (data: string) => void
  categoryCourse: any
  changeData: (data: any) => void
  setVisibleCategory: (data: boolean) => void
}

const AllCourse: FC<Props> = ({
  setCurrentKey,
  categoryCourse,
  changeData,
  setVisibleCategory
}) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const location = useLocation()
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
        state: { showPopup: true, path: location.pathname }
      })
    } else {
      dispatch(hideLoading())
    }
  }

  console.log('categoryCourse?.data', categoryCourse?.data)

  return (
    <div style={{ marginTop: '3rem' }}>
      {/* <ModalCourse
        isShow={currentKey === 'detail'}
        handleClose={() => setCurrentKey('home')}
        data={detailCourse}
      /> */}
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {categoryCourse?.data?.map((item: any) => {
          const percentage = item?.percentage ?? 0 // Giá trị phần trăm, nếu không có giá trị thì sẽ là 0
          const displayedPercentage = percentage !== 0 ? Math.round(percentage) + '%' : '0%' // Làm tròn giá trị phần trăm đến 1 chữ số thập phân, nếu là 0 thì chỉ là 0%

          return (
            <div
              onClick={() => {
                if (item.model === 'courses') {
                  callItemCourse(item?.sourceId)
                }
                if (item?.model === 'categories') {
                  changeData(item)
                  console.log(item)
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
              <Card
                className="tag__item"
                style={{
                  width: '15rem',
                  height: '20rem',
                  border: 0,
                  marginBottom: 20,
                  marginRight: 20
                }}
              >
                <div
                  style={{
                    height: '14rem',
                    position: 'relative'
                  }}
                >
                  <Card.Img
                    className="tag__image"
                    variant="top"
                    src={convertUrl(item?.imageUrl, 'image') || ''}
                    // onClick={() => onClickHandleCourse(item)}
                    style={{
                      height: '14rem'
                    }}
                  />
                  {item.vip ? (
                    <img src={vipcourse} style={{ position: 'absolute', bottom: -2, right: -2 }} />
                  ) : (
                    <></>
                  )}
                </div>
                {item?.model !== 'contest' && (
                  <div style={{ marginTop: 10 }}>
                    <ProgressBar now={item?.percentage} style={{ backgroundColor: '#214B6F' }} />
                    <div
                      style={{
                        position: 'relative',
                        bottom: 16,
                        left: 0,
                        textAlign: 'center',
                        color: 'white',
                        fontSize: 12
                      }}
                    >
                      {displayedPercentage}
                    </div>
                  </div>
                )}

                <Card.Body style={{ marginTop: item?.model !== 'contest' ? -30 : 0 }}>
                  <Card.Text>{item?.name == 'offline' ? 'Luyện thi' : item?.name}</Card.Text>
                </Card.Body>
              </Card>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default AllCourse
