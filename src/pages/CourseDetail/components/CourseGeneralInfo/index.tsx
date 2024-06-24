import React, { useMemo } from 'react'
import { useHistory, useLocation } from 'react-router'
import { Col, ProgressBar, Row } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import ReactHtmlParser from 'react-html-parser'
import heartIco from '../../../../assets/images/ico_heart-yellow.svg'
import ico_check_green from '../../../../assets/images/ico_check-green.svg'
import leaderboard from '../../../../assets/images/leaderboard.png'
import { convertUrl } from '../../../../utils/common'
import { RootState } from '../../../../store'
import imgAchivement from './../../achivement.png'

type Props = {
    course: any,
    courseTitle: string
}

const CourseGeneralInfo: React.FC<Props> = ({ course, courseTitle }) => {
  const history = useHistory()

  const convertM = (value: any) => {
    const sec = parseInt(value, 10);
    let hours = Math.floor(sec / 60);
    let minutes = Math.floor((sec - (hours * 60)));
    return hours + 'giờ' + minutes + 'phút';
  }

  const { currentCourse, allSections } = useSelector((state: RootState) => ({
    currentCourse: state.study.currentCourse,
    allSections: JSON.parse(state.study.allSections)
  }))
 
  const convertStatus = (status: string) => {
    switch (status) {
      case 'finished':
        return (
          <span className="good">
            <img src={ico_check_green} alt="good" />
            &nbsp; Hoàn thành
          </span>
        )
      case 'enrolled':
        return (
          <span className="not__done">
            <img className="me-2" src={heartIco} alt="heart_ico" />
            &nbsp; Đang học
          </span>
        )
      default:
        return <span className="not__done">Chưa học</span>
    }
  }
 
  return (
    <div className="course__general--info">
        <div
            className="leaderboard mb-4"
            style={{
            background: `url(${leaderboard})`
            }}
            onClick={() => history.push(`/leader-board/${course.course_id}`)}
        />
        <div
            className="leaderboard mb-4"
            style={{
            background: `url(${imgAchivement})`
            }}
            onClick={() => history.push(`/user-setting`)}
        />
        <div
            className="logo__container mb-4"
            style={{
              background: `url(${convertUrl(currentCourse?.imageUrl, 'image')})`,
            backgroundSize: 'cover'
            }}
        >
            <div className="logo__title">
                <p className="logo__title--time">{`${convertM(course?.course_duration) || 0}`}</p>
                <p className="logo__title--text">FutureLang</p>
            </div>
            <div className="logo__subtitle">
                <p>{courseTitle}</p>
            </div>
            <div className="overlay" />
        </div>

        <div className="course__status mb-3">{convertStatus(currentCourse?.studentCourseStatus)}</div>
      
        <div className="course__name mb-3">{courseTitle}</div>

        <div className="tag__container mb-3">
            <div className="course__tag me-1 mb-1">
                Khoá học của bạn
            </div>
        </div>

      <div className="course__note mb-3">
        <Row>
            <Col xs="6" className="mb-1">
                <span>Số lượng bài giảng</span>
            </Col>
            <Col xs="6" className="mb-1">
                    <span>{course.course_count_exercise}</span>
              </Col>
        </Row>
        <Row>
            <Col xs="6" className="mb-1">
                <span>Số lượng bài tập</span>
            </Col>
            <Col xs="6" className="mb-1">
                <span>{course.course_count_lesson}</span>
            </Col>
        </Row>
      </div>

      <div className="course__progress mb-3">
        <div className="d-flex justify-content-between align-items-center">
          <p className="mb-1">TIẾN TRÌNH CỦA BẠN</p>
          <p className="mb-0">
            <span className="yellow__color">
              {`${
                Math.floor(
                  Number(course?.course_percentage * 100) 
                )
              }%`}
            </span>
          </p>
        </div>
        <ProgressBar
          className="progess__line"
          variant="success"
          now={
            Math.floor(
                Number(course?.course_percentage * 100) 
            )
          }
        />
      </div>
    </div>
  )
}

export default CourseGeneralInfo
