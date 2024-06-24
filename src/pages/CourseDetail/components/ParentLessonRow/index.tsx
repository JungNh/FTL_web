import React, { FC, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import _ from 'lodash'
import { Accordion } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { BsFillCaretRightFill } from 'react-icons/bs'
// import Button from '../../../../../../components/Button'
import ChildLessionRow from './ChildLessionRow'
// import backArrow from '../../../../../../assets/images/ico_arrowLeft-blue.svg'
import { RootState } from '../../../../store'
import {
  actionAllLessonsWithCourse,
  actionGetAllSection,
  actionPostLastestCourse,
  actionSaveCurrentSection,
  actionGetCourseScore
} from '../../../../store/study/actions'
import { LessionType } from '../../../../store/study/types'

type Props = {
  data: any
  courseId: number
}
type SectionType = {
  courseId: number
  id: number
  name: string
  sequenceNo: number
  lessons?: any[]
}

const ParentLessonRow: FC<Props> = ({ data, courseId }) => {

  const [sections, setSections] = useState<SectionType[]>([])
  const [allLessons, setAllLessons] = useState<LessionType[]>([])
  const [courseScore, setCourseScore] = useState<any>([])
  const [expandedRow, setExpandedRow] = useState<string | null>('')
  const [loading, setLoading] = useState(false)
  const currentSection = useSelector((state: RootState) => state.study.currentSection)
  const currentCourse = useSelector((state: RootState) => state.study.currentCourse)
  const sectionId = useSelector((state: RootState) => state.study.parentLessons?.data?.sectionId)

  //   const location = useLocation()
  const dispatch = useDispatch()

  useEffect(() => {
    const getSectionsAndCurrentPosition = async () => {
      /**
       * todo [x] get course id from pathname
       * todo [x] get all section
       * todo [x] check and set current open section
       */
      setLoading(true)

      // * Lưu khóa đang học (lastest course) lên Server
      if (currentCourse?.id !== courseId) {
        await dispatch(actionPostLastestCourse({ courseId: courseId }))
      }

      // * get all section
      const sectionsRes: any = await dispatch(actionGetAllSection({ courseId: Number(courseId) }))

      // * get all lesson
      const allLessonAPI: any = await dispatch(
        actionAllLessonsWithCourse({ courseId: Number(courseId) })
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
      setAllLessons(allLessonCheckLocked)

      // * Get current position study
      if (currentSection) {
        const currentLessons = allLessonCheckLocked.filter(
          (item: any) => item?.section?.id === currentSection?.data?.id
        )
        const sectionIndex = currentSection?.index || 0
        if (sectionsRes[sectionIndex]) {
          sectionsRes[sectionIndex].lessons = currentLessons
          setExpandedRow(currentSection?.data?.id?.toString())
        }
      }
      setSections(sectionsRes)
      setLoading(false)
    }
    getSectionsAndCurrentPosition()

    const getCourseScore = async () => {
      const dataRes = await dispatch(
        actionGetCourseScore({
          course_id: Number(courseId)
        })
      )
      if (!_.isEmpty(dataRes)) {
        const { sections } = dataRes as any
        setCourseScore(sections)
      }
    }
    getCourseScore()
  }, [dispatch, courseId, sectionId])

  return (
    <div className="child_second_lession">
      <Accordion
      // activeKey={expandedRow?.toString()}
      // onSelect={(key: string | null) => {
      //   setExpandedRow(key)
      // }}
      >
        {data?.map((item: any, index: number) => {
          return (
            <ChildLessionRow
              data={item}
              key={item?.section_id}
              courseScore={courseScore}
              isExpanded={expandedRow?.toString() === item?.id?.toString()}
              // unitScore={sectionScore?.[item?.id]}
              //sectionScore={sectionScore}
              currentIndex={index}
            />
          )
        })}
      </Accordion>
    </div>
  )
}

export default ParentLessonRow
