import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useHistory, useLocation } from 'react-router'
import { Col, ProgressBar, Row } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import ReactHtmlParser from 'react-html-parser'
import heartIco from '../../../../../assets/images/ico_heart-yellow.svg'
import ico_check_green from '../../../../../assets/images/ico_check-green.svg'
import leaderboard from '../../../../../assets/images/leaderboard.png'
import { convertUrl, openError } from '../../../../../utils/common'
import { RootState } from '../../../../../store'
import CardCode from '../../../../Homepage/CardCode'
import { apiCore } from '../../../../../lib-core'
import {
  actionSaveChildLesson,
  actionSaveCurrentCourse,
  actionSaveCurrentSection,
  actionSaveParentLessons,
  saveListPurchase
} from '../../../../../store/study/actions'
import { hideLoading, showLoading } from '../../../../../store/login/actions'
import { getCourseById } from '../../../../../store/home/actions'
import _ from 'lodash'
import { log } from 'console'

type Props = {
  courseScore: any
  isPurchased: boolean
}

const CourseGeneralInfo: React.FC<Props> = ({ courseScore, isPurchased }) => {
  const [dataCardCode, setDataCardCode] = useState({
    isOpen: false,
    status: 'active'
  })
  const listPurchased = useSelector((state: RootState) => state.study.listPurcharse)
  const dispatch = useDispatch()
  const history = useHistory()
  const location = useLocation()

  // console.log('courseScore', courseScore.course_id)
  // console.log('listPurchased', listPurchased.data[0])

  const getPurchase = async () => {
    const coursePurchased = await apiCore.post('/course/purchased')
    dispatch(saveListPurchase(coursePurchased.data))
  }

  const pathname = window.location.pathname

  const [pathNameScreen, setPathNameScreen] = useState(pathname)

  useEffect(() => {
    getPurchase()
  }, [])

  const reLoadingScreen = useCallback((id: number) => {
    getCourseAgain(id)
  }, [])

  const getCourseAgain = async (id: number) => {
    dispatch(showLoading())
    try {
      const courseResult: any = await dispatch(getCourseById(id))
      const coursePurchased = await apiCore.post('/course/purchased')
      dispatch(saveListPurchase(coursePurchased?.data))
      if (!_.isEmpty(courseResult)) {
        dispatch(actionSaveCurrentCourse(courseResult))
        // console.log('courseResult', courseResult.id)
      }
      window.location.reload()
      dispatch(hideLoading())
    } catch (error) {
      if (error instanceof Error) openError(error.message)
    }
  }

  const { currentCourse, allSections } = useSelector((state: RootState) => ({
    currentCourse: state.study.currentCourse,
    allSections: JSON.parse(state.study.allSections)
  }))

  // * get course id
  const indexLoca: number = location.pathname.lastIndexOf('/')
  const idCourse: string = location.pathname.substring(indexLoca + 1, location.pathname.length)

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

  const detailInfo = useMemo(
    () => [
      { title: 'Thời lượng', value: `${Math.floor(currentCourse?.duration / 60)} phút` },
      {
        title: 'Số bài học',
        value: `${allSections?.length || 0} phần ${currentCourse?.unitCount || 0} bài`
      },
      { title: 'Bài tập', value: `${currentCourse?.quizzCount || 0} bài` },
      { title: 'Yêu cầu kỹ năng', value: currentCourse?.level || 'Không có' }
    ],
    [
      allSections?.length,
      currentCourse?.duration,
      currentCourse?.level,
      currentCourse?.quizzCount,
      currentCourse?.unitCount
    ]
  )

  const handleOpen = () => {
    setDataCardCode({ isOpen: true, status: 'active' })
  }

  const handleClose = useCallback(() => {
    setDataCardCode({ isOpen: false, status: 'active' })
  }, [])

  return (
    <div className="course__general--info">
      {/* {!listPurchased?.data.includes(courseScore?.course_id) && isPurchased && ( */}
      {/* {!isPurchased && (
        <div className="card-code mb-2" onClick={handleOpen}>
          Nhập mã kích hoạt
        </div>
      )} */}
      <div
        className="leaderboard mb-2"
        style={{
          background: `url(${leaderboard})`
        }}
        onClick={() => history.push(`/leader-board/${idCourse}`)}
      />

      {/* <div
        className="leaderboard mb-4"
        style={{
          background: `url(${achievements})`
        }}
        onClick={() => history.push(`/leader-board/${idCourse}`)}
      /> */}
      <div
        className="logo__container mb-4"
        style={{
          background: `url(${convertUrl(currentCourse?.imageUrl, 'image')})`,
          backgroundSize: 'cover'
        }}
      >
        <div className="logo__title">
          <p className="logo__title--time">{`${currentCourse?.duration || 0} phút`}</p>
          <p className="logo__title--text">FutureLang</p>
        </div>
        <div className="logo__subtitle">
          <p>{currentCourse?.name}</p>
        </div>
        <div className="overlay" />
      </div>

      <div className="course__status mb-3">{convertStatus(currentCourse?.studentCourseStatus)}</div>
      <div className="course__name mb-3">{currentCourse?.name}</div>

      <div className="tag__container mb-3">
        {currentCourse?.categories?.map((item: any) => (
          <div className="course__tag me-1 mb-1" key={item.id}>
            {item?.name}
          </div>
        ))}
      </div>

      <div className="course__note mb-3">
        <div className="mb-2">{ReactHtmlParser(currentCourse?.description)}</div>
        <Row>
          {detailInfo.map((item: { title: string; value: string }) => (
            <React.Fragment key={item.title}>
              <Col xs="4" className="mb-1">
                {item?.title}
              </Col>
              <Col xs="8" className="mb-1">
                {item.value}
              </Col>
            </React.Fragment>
          ))}
        </Row>
      </div>

      <div className="course__progress mb-3">
        <div className="d-flex justify-content-between align-items-center">
          <p className="mb-0">TIẾN TRÌNH CỦA BẠN</p>
          <p className="mb-0">
            <span className="yellow__color">
              {`${Math.floor(Number(courseScore?.course_percentage) * 100)}%`}
            </span>
          </p>
        </div>
        <ProgressBar
          className="progess__line"
          variant="success"
          now={Math.floor(Number(courseScore?.course_percentage) * 100)}
        />
      </div>
      <CardCode
        dataCardCode={dataCardCode}
        handleClose={handleClose}
        reLoadData={reLoadingScreen}
        courseId={courseScore.course_id}
      />
    </div>
  )
}

export default CourseGeneralInfo
