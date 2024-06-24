import React, { FC, useEffect, useMemo, useState } from 'react'
import { useHistory } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import _ from 'lodash'
import { Col, Row } from 'react-bootstrap'
import { CourseItem, Button } from '../../../components'
import {
  actionGetAllCourse,
  actionCourseWithId,
  actionCategoryCourseWithId
} from '../../../store/home/actions'
import backArrow from '../../../assets/images/ico_arrowLeft-blue.svg'
import { convertUrl, openError } from '../../../utils/common'
import { hideLoading, showLoading } from '../../../store/login/actions'
import {
  actionSaveChildLesson,
  actionSaveCurrentCourse,
  actionSaveCurrentSection,
  actionSaveParentLessons
} from '../../../store/study/actions'
import { RootState } from '../../../store'

type Props = {
  setCurrentKey: (data: string) => void
  detailCourse: any
}

const AllCourse: FC<Props> = ({ setCurrentKey, detailCourse }) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const [listCourse, setListCourse] = useState([])
  const [courseByCategory, setCourseByCategory] = useState<any>([])
  const currentCourse = useSelector((state: RootState) => state.study.currentCourse)

  useEffect(() => {
    const getCourse = async () => {
      dispatch(showLoading())
      const dataCourse: any = await dispatch(
        actionGetAllCourse({
          categoryId: _.get(detailCourse, 'sourceId')
        })
      )
      dispatch(hideLoading())
      if (!_.isEmpty(dataCourse)) {
        setListCourse(dataCourse.data)

        const categoryResult: any = await dispatch(
          actionCategoryCourseWithId(_.get(detailCourse, 'sourceId'))
        )

        if (!_.isEmpty(categoryResult)) {
          setCourseByCategory(categoryResult)
        } else {
          setCourseByCategory([])
        }
      } else {
        setListCourse([])
      }
    }
    getCourse()
  }, [detailCourse, dispatch])

  const callItemCourse = async (id: number) => {
    dispatch(showLoading())
    const courseResult: any = await dispatch(actionCourseWithId(id))
    if (!_.isEmpty(courseResult)) {
      dispatch(actionSaveCurrentCourse(courseResult))
      if (currentCourse?.id !== courseResult?.id) {
        dispatch(actionSaveCurrentSection(null))
        dispatch(actionSaveParentLessons(null))
        dispatch(actionSaveChildLesson(null))
      }

      dispatch(hideLoading())
      history.push({
        pathname: `/study/${courseResult?.id}`,
        state: { showPopup: true }
      })
    } else {
      dispatch(hideLoading())
    }
  }

  const getPercentByCourseId = useMemo(() => {
    const listPercentage: any = {}
    courseByCategory.map((corse: any) => {
      listPercentage[`${corse.course_id}`] = corse.course_percentage
    })

    return listPercentage
  }, [courseByCategory])

  return (
    <div style={{ width: '100%' }}>
      <p className="h1 fw-bold text-center" style={{ fontSize: 28 }}>
        {_.get(detailCourse, 'name')}
      </p>
      <p className="course__item--name" style={{ textAlign: 'center' }}>
        Hãy chọn giáo trình để vào học nhé!
      </p>
      <Row style={{ width: '100%' }}>
        {listCourse.map((item: any) => (
          <Col
            key={item?.id}
            lg={12}
            xl={6}
            onClick={() => {
              callItemCourse(item?.id)
            }}
          >
            <CourseItem.CourseItemModal
              courseImage={convertUrl(item.imageUrl, 'image')}
              coursename={item?.name}
              courseTime={Math.floor((item?.duration || 0) / 60)}
              lessons={item?.unitCount}
              percent={Math.floor((getPercentByCourseId?.[item?.id] || 0) * 100)}
              vip={item.vip}
            />
          </Col>
        ))}
      </Row>
    </div>
  )
}

export default AllCourse
