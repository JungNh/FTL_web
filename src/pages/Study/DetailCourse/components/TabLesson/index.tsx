import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import { Accordion, Spinner } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { RootState } from '../../../../../store'
import {
  actionAllLessonsWithCourse,
  actionGetAllSection,
  actionPostLastestCourse,
  actionSaveCurrentSection,
  actionGetCourseScore,
  actionCheckLanguage
} from '../../../../../store/study/actions'

import { LessionType } from '../../../../../store/study/types'
import SectionRow from './SectionRow'

type Props = {
  courseScore: any
  sectionIdActive?: number
}
type SectionType = {
  courseId: number
  id: number
  name: string
  sequenceNo: number
  lessons?: any[]
}

const TabLesson: React.FC<Props> = ({ courseScore, sectionIdActive }) => {
  const [sections, setSections] = useState<SectionType[]>([])
  const [allLessons, setAllLessons] = useState<LessionType[]>([])
  const [loading, setLoading] = useState(false)
  const [expandedRow, setExpandedRow] = useState<string | null>('')
  const currentSection = useSelector((state: RootState) => state.study.currentSection)
  const currentCourse = useSelector((state: RootState) => state.study.currentCourse)
  const location = useLocation()
  const dispatch = useDispatch()

  useEffect(() => {
    // * get course id
    const indexLoca: number = location.pathname.lastIndexOf('/')
    const idCourse: string = location.pathname.substring(indexLoca + 1, location.pathname.length)

    const getSectionsAndCurrentPosition = async () => {
      /**
       * todo [x] get course id from pathname
       * todo [x] get all section
       * todo [x] check and set current open section
       */
      setLoading(true)

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
      dispatch(actionCheckLanguage({ courseId: Number(idCourse) }))
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
      } else if (sectionIdActive) {
        const sectionIndex = sectionsRes.findIndex(
          (item: SectionType) => item?.id === Number(sectionIdActive)
        )
        const currentLessons = allLessonCheckLocked.filter(
          (item: any) => item?.section?.id === sectionIdActive
        )

        if (sectionsRes[sectionIndex]) {
          sectionsRes[sectionIndex].lessons = currentLessons

          await dispatch(
            actionSaveCurrentSection({
              index: sectionIndex,
              data: sectionsRes[sectionIndex]
            })
          )
          setExpandedRow(sectionIdActive?.toString())
        }
      } else {
        const currentLessons = allLessonCheckLocked.filter(
          (item: any) => item?.section?.id === sectionsRes[0].id
        )
        // sectionsRes[0].lessons = currentLessons

        await dispatch(
          actionSaveCurrentSection({
            index: 0,
            data: sectionsRes[0]
          })
        )

        setExpandedRow(sectionsRes[0]?.id?.toString())
      }

      setSections(sectionsRes)
      setLoading(false)
    }
    getSectionsAndCurrentPosition()
  }, [dispatch, location.pathname, sectionIdActive])

  const getLessionInSection = async (sectionId: string | string[] | null | undefined) => {
    if (sectionId === null) {
      await dispatch(actionSaveCurrentSection(null))
      setExpandedRow(null)
    }

    if (sectionId !== null) {
      const sectionIndex = sections.findIndex((item: SectionType) => item?.id === Number(sectionId))
      const newSection = sections.slice()
      if (_.isEmpty(newSection?.[sectionIndex]?.lessons)) {
        const currentLessons = _.orderBy(
          allLessons.filter((item: any) => item?.section?.id?.toString() === sectionId),
          'sequenceNo',
          'asc'
        )
        newSection[sectionIndex].lessons = currentLessons
        await dispatch(
          actionSaveCurrentSection({
            index: sectionIndex,
            data: newSection[sectionIndex]
          })
        )
      }
      setSections(newSection)

      setExpandedRow(sectionId?.toString() || null)
    }
  }

  return (
    <div className="tab__lesson">
      {loading ? (
        <div className="d-flex align-items-center justify-content-center" style={{ height: 100 }}>
          <Spinner animation="grow" style={{ width: 15, height: 15, margin: 10 }} />
          <Spinner animation="grow" style={{ width: 15, height: 15, margin: 10 }} />
          <Spinner animation="grow" style={{ width: 15, height: 15, margin: 10 }} />
          <Spinner animation="grow" style={{ width: 15, height: 15, margin: 10 }} />
          <Spinner animation="grow" style={{ width: 15, height: 15, margin: 10 }} />
        </div>
      ) : (
        <Accordion
          activeKey={expandedRow?.toString()}
          onSelect={getLessionInSection}
          className="mb-3"
        >
          {sections.map((item: SectionType, index: number) => (
            <SectionRow
              data={item}
              courseScore={courseScore}
              prevSection={index > 0 ? sections[index - 1] : null}
              key={index}
              isExpanded={expandedRow?.toString() === item?.id?.toString()}
            />
          ))}
        </Accordion>
      )}
    </div>
  )
}

export default TabLesson
