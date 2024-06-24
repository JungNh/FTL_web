import _ from 'lodash'
import React, { FC, useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { Button } from '../../components'
import { useDispatch } from 'react-redux'
import { useHistory, useLocation } from 'react-router'
import DefaultNav from '../../components/Navbar'
import AssistiveTouch from '../../components/AssistiveTouch'
import backArrow from '../../assets/images/ico_arrowLeft-blue.svg'
import CourseGeneralInfo from './components/CourseGeneralInfo'
import { actionsGetInfoCourseById } from '../../store/progress/actions'
import ParentLessonRow from './components/ParentLessonRow'

type Props = Record<string, unknown>

const CourseDetail: FC<Props> = () => {
  const history = useHistory()
  const location = useLocation()
  const dispatch = useDispatch()
  const [courseInfo, setCourseInfo] = useState([])

  useEffect(() => {
    const { courseId, unitId, courseName } = (location as any).state;
    console.log("PARAMS", courseId, courseName, unitId)
    const getCourseInfo = async () => {
      const dataList: any = await dispatch(actionsGetInfoCourseById(courseId))
      console.log('DATA_LIST', dataList)
      if (!_.isEmpty(dataList.data)) {
        setCourseInfo(dataList.data)
      } else {
        setCourseInfo([])
      }
    }
    getCourseInfo()
  }, [dispatch])

  return (
    <div>
      <AssistiveTouch />
      <div className="courses__page--detail">
        <Button.Shadow
          className="button__back"
          color="gray"
          onClick={() => history.push('/home')}
          content={<img src={backArrow} alt="bageSection" />}
        />
        <div className="">
          <Row>
            <Col xs={4}>
              <CourseGeneralInfo
                course={courseInfo}
                courseTitle={(location as any).state.courseName}
              />
            </Col>
            <Col xs={8} style={{ paddingRight: '40px' }}>
              {(courseInfo as any).sections && (
                <ParentLessonRow
                  data={(courseInfo as any).sections}
                  courseId={(location as any).state.courseId}
                  // goBack={() => {
                  //     dispatch(actionSaveParentLessons({ ...parentLesson, childLessons: undefined }))
                  //     dispatch(actionSaveChildLesson(null))
                  // }}
                />
              )}
            </Col>
          </Row>
        </div>
        <DefaultNav
          activePanel="home"
          changePanel={(panel: string) => console.log('change panel to ', panel)}
        />
      </div>
    </div>
  )
}

export default CourseDetail
