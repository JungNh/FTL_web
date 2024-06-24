import React, { useEffect, useState } from 'react'
import _ from 'lodash'
import { ProgressBar, Image, Accordion, Spinner } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import ReactHtmlParser from 'react-html-parser'
import icoMenu from '../../../assets/images/ico_menu-blue.svg'
import Button from '../../Button'
import ico_success from '../../../assets/images/ico_success-yellow.svg'
import ico_circleLeft from '../../../assets/images/ico_circleLeft-blue.svg'
import LessionRow from './LessionRow'
import backArrow from '../../../assets/images/ico_arrowLeft-blue.svg'
import {
  actionAllLessonsWithCourse,
  actionGetAllSection,
  actionSaveCurrentSection
} from '../../../store/study/actions'
import imagePlaceholder from '../../../assets/images/image_placeholder.png'
import LessionRowSecondChild from './LessionRowSecondChild'
import { RootState } from '../../../store'
import { LessionType, SectionType } from '../../../store/study/types'

type Props = {
  lesson: any
  course: any
  callChangeLesson: (id: number) => void
  backCourse: (isDone?: boolean) => void
  onNextLession: () => void
}

const Video: React.FC<Props> = ({
  lesson,
  course,
  callChangeLesson,
  onNextLession,
  backCourse,
}) => {
  const dispatch = useDispatch()

  const [isCollapsed, setIsCollapsed] = useState(true)
  const [detailChildren, setDetailChildren] = useState<LessionType[] | null>(null)
  const [expandedRow, setExpandedRow] = useState<string | null>('')
  const [sections, setSections] = useState<SectionType[]>([])
  const currentCourse = useSelector((state: RootState) => state.study.currentCourse)
  const currentSection = useSelector((state: RootState) => state.study.currentSection)

  const [allLessons, setAllLessons] = useState<LessionType[]>([])
  const [loading, setLoading] = useState(false)
  const [isShown, setIsShown] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setIsShown(true)
    }, 2400)
  }, [])

  useEffect(() => {
    const getSectionsAndCurrentPosition = async () => {
      /**
       * todo [x] get course id from pathname
       * todo [x] get all section
       * todo [x] check and set current open section
       */
      setLoading(true)

      // * get course id
      const idCourse: string = currentCourse?.id

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
  }, [currentCourse, currentSection, dispatch])

  const getLessionInSection = async (sectionId: string | null) => {
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
    <div className="lession__video pb-5">
      <h1 className="lession__title">{lesson.name}</h1>
      <div className="parent__player d-flex justify-content-center flex-column">
        {lesson.content ? (
          <div className="player__wrapper">{ReactHtmlParser(lesson.content)}</div>
        ) : (
          <div className="player__wrapper">
            <Image
              src={imagePlaceholder}
              alt="Not_found"
              style={{ backgroundColor: '#b2b2b2', opacity: 0.5 }}
            />
          </div>
        )}
      </div>
      {isShown && (
        <Button.Solid
          className="continue__btn"
          content={
            <div
              className="flex justify-content-center align-items-center fw-bold"
              onClick={() => onNextLession()}
            >
              <img src={ico_success} alt="success_ico" className="me-2 py-1" />
              HOÀN THÀNH
            </div>
          }
        />
      )}
      {/* Nav bar */}

      <img
        onClick={() => setIsCollapsed(false)}
        className={`ico__menu ${isCollapsed ? '' : 'collapsed'}`}
        src={icoMenu}
        alt="ico"
      />
      <div className={`sideBar ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="menu__close mb-2 me-3" onClick={() => setIsCollapsed(true)}>
          Ẩn menu &nbsp;
          <img src={ico_circleLeft} alt="" />
        </div>
        <div className="divider__horizontal" />
        <div className="px-3 py-3 d-flex align-items-center justify-content-between">
          <p className="text__process">Tiến trình của bạn</p>
          <p className="text__process--percent">
            {`${
              Math.floor(
                (Number(course?.timeFinishCourse || 0) / Number(course?.duration || 1)) * 10000
              ) / 100
            }%`}
          </p>
        </div>
        <ProgressBar
          className="progess__line ms-3"
          variant="success"
          now={Number(course?.timeFinishCourse || 0) / Number(course?.duration || 1)}
        />
        <div className="list__lesson">
          {detailChildren === null &&
            (loading ? (
              <div
                className="d-flex align-items-center justify-content-center"
                style={{ height: 100 }}
              >
                <Spinner animation="grow" style={{ width: 15, height: 15, margin: 10 }} />
                <Spinner animation="grow" style={{ width: 15, height: 15, margin: 10 }} />
                <Spinner animation="grow" style={{ width: 15, height: 15, margin: 10 }} />
                <Spinner animation="grow" style={{ width: 15, height: 15, margin: 10 }} />
                <Spinner animation="grow" style={{ width: 15, height: 15, margin: 10 }} />
              </div>
            ) : (
              <Accordion
                activeKey={expandedRow?.toString()}
                onSelect={(key: any) => {
                  getLessionInSection(key)
                }}
              >
                {sections?.map((item: any, index: number) => (
                  <LessionRow
                    data={item}
                    key={item?.id}
                    callChangeLesson={(id: number) => callChangeLesson(id)}
                    idLesson={lesson.id}
                    setDetailChildren={(data: any) => setDetailChildren(data)}
                    currentSection={index}
                    listLessons={sections}
                    isExpanded={expandedRow?.toString() === item?.id?.toString()}
                  />
                ))}
              </Accordion>
            ))}

          {detailChildren !== null && (
            <>
              <div>
                <div className="menu__back mb-2 ms-3" onClick={() => setDetailChildren(null)}>
                  Quay lại &nbsp;
                  <img src={ico_circleLeft} alt="" />
                </div>
              </div>
              {detailChildren?.map((iChildLess: any, index: number) => (
                <LessionRowSecondChild
                  data={iChildLess}
                  key={index}
                  callChangeLesson={(id: number) => callChangeLesson(id)}
                  idLesson={lesson.id}
                />
              ))}
            </>
          )}
        </div>
      </div>
      <Button.Shadow
        className="button__back"
        color="gray"
        content={<img src={backArrow} alt="back" />}
        onClick={() => backCourse()}
      />
    </div>
  )
}

export default Video
