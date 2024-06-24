import * as React from 'react'
import { useState, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router'
import { Col, Row } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import _ from 'lodash'
import Swal from 'sweetalert2'
import { Button } from '../../../components'
import backArrow from '../../../assets/images/left.png'
import DefaultNav from '../../../components/Navbar'
import AssistiveTouch from '../../../components/AssistiveTouch'
import CourseGeneralInfo from './CourseGeneralInfo'
import TabGeneral from '../DetailCourse/components/TabGeneral'
import TabLesson from '../DetailCourse/components/TabLesson'
import TabDocument from '../DetailCourse/components/TabDocument'
import TabQA from '../DetailCourse/components/TabQA'
import TabNote from '../DetailCourse/components/TabNote'

import ParentLessonRow from '../DetailCourse/components/TabLesson/ParentLessonRow'
import {
  actionSaveParentLessons,
  actionSaveChildLesson,
  actionGetCourseScore,
  actionGetInfoUnitActive,
  actionGetAllSection,
  actionActiveModalWelcome,
  saveListPurchase
} from '../../../store/study/actions'
import { RootState } from '../../../store'
import fubo_blink from '../../../assets/images/ico_fubo.svg'
import { apiCore } from '../../../lib-core'
import PanelTab from '../../../components/PanelTab'
import HeaderHome from '../../Homepage/HeaderHome'

type Props = Record<string, unknown>

const Courses: React.FC<Props> = () => {
  const { currentCourse, parentLesson, modalWelcome } = useSelector((state: RootState) => ({
    currentCourse: state.study.currentCourse,
    parentLesson: state.study.parentLessons,
    modalWelcome: state.study.modalWelcome
  }))

  const [courseScore, setCourseScore] = useState<any>([])
  const [sectionIdActive, setSectionIdActive] = useState<number>(0)
  const [unitActive, setUnitActive] = useState<any>({})
  const [isLoaded, setIsLoaded] = useState<boolean>(false)
  const [courseDetails, setCourseDetails] = useState<any>([])
  const [active, setActive] = useState<'general' | 'lesson' | 'document' | 'qa' | 'note'>('lesson')
  const [isPurchased, setIsPurchased] = useState(true)
  const history = useHistory()
  const location: any = useLocation()
  const dispatch = useDispatch()

  useEffect(() => {
    if (location && location?.state && isLoaded && modalWelcome) {
      const isLearned = !_.isEmpty(unitActive) && currentCourse?.name && unitActive?.name
      Swal.fire({
        title: `${
          isLearned
            ? `Bạn <b>chưa hoàn thành</b> ${unitActive.name} khóa <br> <b style="text-transform: uppercase">${currentCourse.name}</b>`
            : 'CHÀO MỪNG BẠN ĐẾN VỚI KHÓA HỌC'
        }`,
        html: `${
          isLearned
            ? 'Hãy <strong>tiếp tục học</strong> để hoàn thành nhé!'
            : `<b style="text-transform: uppercase">${currentCourse.name}</b>`
        }`,
        confirmButtonText: `${isLearned ? 'TIẾP TỤC' : 'BẮT ĐẦU'}`,
        iconHtml: `<img src="${fubo_blink}">`,
        customClass: {
          icon: 'icon-style',
          title: 'title-popup',
          container: 'container-popup'
        }
      })
        .then((results: { isConfirmed: boolean }) => {
          if (results.isConfirmed) {
            history.replace({ ...location, state: false })
          }
          return ''
        })
        .catch((error: any) => console.error(error))
    }
  }, [location, history, unitActive, currentCourse.name, isLoaded, modalWelcome])

  useEffect(() => {
    const getCourseScore = async () => {
      const dataRes = await dispatch(
        actionGetCourseScore({
          course_id: Number(currentCourse.id)
        })
      )
      if (!_.isEmpty(dataRes)) {
        setCourseDetails(dataRes)
        const { sections } = dataRes as any
        setCourseScore(sections)
      }
    }

    const getInfoUnitActive = async () => {
      const dataRes: any = await dispatch(actionGetInfoUnitActive(currentCourse.id))
      // * get all section
      const sectionsRes: any = await dispatch(
        actionGetAllSection({ courseId: Number(currentCourse.id) })
      )

      setIsLoaded(true)
      if (!_.isEmpty(dataRes) && !_.isEmpty(dataRes.data) && !_.isEmpty(sectionsRes)) {
        const {
          data: { sectionId }
        } = dataRes as any

        const sectionById = sectionsRes.find((section: any) => section.id === sectionId)

        sectionById && setUnitActive(sectionById)
        sectionId && setSectionIdActive(sectionId)
      }
    }

    getCourseScore()
    getInfoUnitActive()
  }, [])

  useEffect(() => {
    if (location.state?.isPurchased === false && currentCourse.type === 'VIP') {
      setIsPurchased(false)
    }
    if (location.state?.isPurchased === undefined && currentCourse.type === 'VIP') {
      const handleCheckPurchased = async () => {
        const response = await apiCore.post('/course/purchased')
        dispatch(saveListPurchase(response.data))
        if (response.data?.data) {
          const listPurchased = response.data.data
          if (listPurchased.includes(currentCourse.id)) {
            setIsPurchased(true)
            dispatch(actionActiveModalWelcome(true))
          } else {
            setIsPurchased(false)
          }
        }
      }
      handleCheckPurchased()
    }
    if (currentCourse.type !== 'VIP') {
      dispatch(actionActiveModalWelcome(true))
    }

    return () => {
      dispatch(actionActiveModalWelcome(false))
    }
  }, [location, currentCourse, dispatch])

  console.log('active', active)

  return (
    <div className="homePage">
      <HeaderHome
        title={
          <div className='say_hi' style={{ display: 'flex', alignItems: 'center' }} onClick={() => history.goBack()}>
            <img src={backArrow} alt="bageSection" style={{ marginRight: 10, height: 16 }} />
            <div className="h4" style={{ margin: 0 }}>
              Khoá học
            </div>
          </div>
        }
      />
      <div style={{ position: 'relative' }}>
        <PanelTab />
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <div className="courses__page--detail">
            <Row>
              <Col
                xs={4}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}
              >
                <CourseGeneralInfo courseScore={courseDetails} isPurchased={isPurchased} />
              </Col>
              <Col xs={8} style={{ paddingRight: '40px' }}>
                {parentLesson?.childLessons ? (
                  <ParentLessonRow
                    data={parentLesson?.childLessons}
                    goBack={() => {
                      dispatch(
                        actionSaveParentLessons({ ...parentLesson, childLessons: undefined })
                      )
                      dispatch(actionSaveChildLesson(null))
                    }}
                  />
                ) : (
                  <>
                    {active === 'general' && <TabGeneral listLession={[]} />}
                    {active === 'lesson' && (
                      <TabLesson courseScore={courseScore} sectionIdActive={sectionIdActive} />
                    )}
                    {active === 'document' && <TabDocument />}
                    {active === 'qa' && <TabQA />}
                    {active === 'note' && <TabNote />}
                  </>
                )}
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Courses
