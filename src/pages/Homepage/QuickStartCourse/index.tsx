import React, { FC } from 'react'
import { useHistory } from 'react-router'
import { useDispatch } from 'react-redux'
import _ from 'lodash'
import { Col, Row } from 'react-bootstrap'
import { CourseItem, Button } from '../../../components'
import { actionCourseWithId } from '../../../store/home/actions'
import backArrow from '../../../assets/images/ico_arrowLeft-blue.svg'
import notFoundBG from '../../../assets/images/notFoundBG.svg'
import { convertUrl, openError } from '../../../utils/common'
import { hideLoading, showLoading } from '../../../store/login/actions'
import { actionSaveCurrentCourse } from '../../../store/study/actions'

type Props = {
  setCurrentKey: (data: string) => void
  listCourse: any
}

const QuickStart: FC<Props> = ({ setCurrentKey, listCourse }) => {
  const dispatch = useDispatch()
  const history = useHistory()

  const callItemCourse = async (id: number) => {
    dispatch(showLoading())
    const courseResult: any = await dispatch(actionCourseWithId(id))
    if (!_.isEmpty(courseResult)) {
      dispatch(actionSaveCurrentCourse(courseResult))
      dispatch(hideLoading())
      history.push({
        pathname: `/study/${courseResult?.id}`,
        state: { showPopup: true }
      })
    } else {
      dispatch(hideLoading())
    }
  }

  return (
    <div className="allCourses__page pb-5 container">
      <Row className="courses__container">
        <Col lg={12} xs={12} sm={12} md={12}>
          <Button.Shadow
            className="button__back"
            color="gray"
            onClick={() => setCurrentKey('home')}
            content={<img src={backArrow} alt="bageSection" />}
          />
          <p className="h1 fw-bold text-center">Khóa học dành cho bạn</p>
          <div className="divider__horizontal my-3" />
        </Col>
        {!_.isEmpty(listCourse) ? (
          listCourse.map((item: any) => (
            <Col
              key={item?.id}
              xs={12}
              sm={6}
              lg={4}
              onClick={() => {
                callItemCourse(item?.id)
              }}
            >
              <CourseItem.BigNotDone
                courseImage={convertUrl(item.imageUrl, 'image')}
                coursename={item?.name}
                courseTime={Math.floor((item?.duration || 0) / 60)}
                lessons={item?.unitCount}
                percent={
                  Math.floor(
                    (Number(item?.unitLearnedCount || 0) * 10000) / Number(item?.unitCount || 1)
                  ) / 100
                }
              />
            </Col>
          ))
        ) : (
          <div className="d-flex w-100 flex-column justify-content-center align-items-center">
            <img className="mb-3" width={800} src={notFoundBG} alt="notfoundImg" />
            <p className="fw-bold" style={{ fontSize: 20 }}>
              Không có dữ liệu
            </p>
          </div>
        )}
      </Row>
    </div>
  )
}

export default QuickStart
