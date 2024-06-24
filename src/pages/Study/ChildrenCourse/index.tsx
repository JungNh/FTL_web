import * as React from 'react'
import { Row, Col } from 'react-bootstrap'
import { useHistory } from 'react-router'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import _ from 'lodash'
import backArrow from '../../../assets/images/ico_arrowLeft-blue.svg'
import { Button } from '../../../components'
import ChildrenLessionBox from './components/ChildrenLessionBox'
import DetailChildrenLession from './components/Detail'
import { RootState } from '../../../store'
import {
  actionAllLessonsWithCourse,
  actionGetAllSection,
  actionPostLastestCourse
} from '../../../store/study/actions'
import { LessionType, SectionType } from '../../../store/study/types'

type Props = Record<string, unknown>

const Courses: React.FC<Props> = () => {
  const [sections, setSections] = useState<SectionType[]>([])
  const location = useLocation()
  const history = useHistory()
  const dispatch = useDispatch()
  const { currentCourse, parentLesson } = useSelector((state: RootState) => ({
    currentCourse: state.study.currentCourse,
    parentLesson: state.study.parentLessons
  }))
  
  useEffect(() => {
    const getSectionsAndCurrentPosition = async () => {
      /**
       * todo [x] get course id from pathname
       * todo [x] get all section
       * todo [x] check and set current open section
       */

      // * get course id
      const indexLoca: number = location.pathname.lastIndexOf('/')
      const idCourse: string = location.pathname.substring(indexLoca + 1, location.pathname.length)

      // * Lưu khóa đang học (lastest course) lên Server
      if (currentCourse?.id !== idCourse) {
        await dispatch(actionPostLastestCourse({ courseId: idCourse }))
      }

      // * get all section
      const sectionsRes: any = await dispatch(actionGetAllSection({ courseId: Number(idCourse) }))

      // * get all lesson
      const allLessonAPI: any = await dispatch(
        actionAllLessonsWithCourse({ courseId: Number(idCourse) })
      )

      const sortedAllLesson = _.orderBy(
        allLessonAPI,
        [(item: LessionType) => item?.section?.sequenceNo, 'sequenceNo'],
        ['asc', 'asc']
      )
      const allLessonCheckLocked = sortedAllLesson?.map((item: LessionType, index: number) => {
        let isPercentLock = false
        if (index > 0 && item?.isPrivate && sortedAllLesson[index - 1].percentage < 80) {
          isPercentLock = true
        }
        return { ...item, isPercentLock }
      })

      const finalListSection = sectionsRes.map((sec: any) => {
        const lessions = allLessonCheckLocked.filter((item: any) => item?.section?.id === sec.id)
        return { ...sec, lessions }
      })

      setSections(finalListSection)
    }
    getSectionsAndCurrentPosition()
  }, [dispatch, location.pathname])

  if (parentLesson?.childLessons) return <DetailChildrenLession data={parentLesson} />

  return (
    <div className="children__page--list">
      <div className="container">
        <Button.Shadow
          className="button__back"
          color="gray"
          onClick={() => history.push('/home')}
          content={<img src={backArrow} alt="bageSection" />}
        />

        <div className="container">
          <h3 className="fw-bold text-center py-5" style={{ color: '#0066FF' }}>
            {currentCourse?.name}
          </h3>
          {sections?.map((sec: any) => (
            <div className="section__wrap mb-4" key={sec?.id}>
              <div className="section__title">
                <div className="section__title-image">
                  <p className="section__title-text">{sec?.name}</p>
                </div>
              </div>
              <Row>
                {sec?.lessions?.map((less: any, index: number) => (
                  <Col xs={3} key={less?.id}>
                    <ChildrenLessionBox lessionInfo={less} lessIndex={index} />
                  </Col>
                ))}
              </Row>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Courses
