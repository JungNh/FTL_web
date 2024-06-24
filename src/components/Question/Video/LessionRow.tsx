import React, { useState } from 'react'
import type { FC } from 'react'
import { Accordion, Card, ListGroup } from 'react-bootstrap'
import { BsFillCaretRightFill, BsFillCaretDownFill } from 'react-icons/bs'
import _ from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import icoAudio from '../../../assets/images/ico_audio-color.svg'
import icoLock from '../../../assets/images/ico_lock-gray.svg'
import icoBook from '../../../assets/images/ico_book-color.svg'
import icoQuiz from '../../../assets/images/ico_quiz-color.svg'
import icoSpeaking from '../../../assets/images/ico_speaking.svg'
import icoVocab from '../../../assets/images/ico_vocab.svg'
import icoReading from '../../../assets/images/ico_reading-color.svg'
import icoVideo from '../../../assets/images/ico_video-color.svg'
import ico_check_green from '../../../assets/images/ico_check-green.svg'
import ico_check_yellow from '../../../assets/images/ico_check-yellow.svg'
import { openError } from '../../../utils/common'
import { actionGetChildsLesson } from '../../../store/study/actions'
import { RootState } from '../../../store'

type Props = {
  data: SectionType
  callChangeLesson: (id: number) => void
  idLesson: number
  setDetailChildren: (data: any) => void
  currentSection: number
  listLessons: any
  isExpanded: boolean
}
type SectionType = {
  courseId: number
  id: number
  name: string
  sequenceNo: number
  lessons?: LessonType[]
  childSecond: any[]
}
type LessonType = {
  canAccess: boolean
  canAccessCourse: boolean
  canComment: boolean
  commentCount: number
  content: null
  duration: number
  finishQuestion: boolean
  hasQuestion: boolean
  id: number
  isPrivate: boolean
  isQuiz: boolean
  name: string
  parentId: null
  percentage: number
  quizType: string
  quizzCount: number
  sectionId: number
  sequenceNo: number
  slug: string
  status: string
  studentUnitStatus: string
  studentunits: any[]
  type: string
  updatedBy: number
  visibleOn: number
}
const LessionRow: FC<Props> = ({
  data,
  callChangeLesson,
  idLesson,
  setDetailChildren,
  currentSection,
  listLessons,
  isExpanded
}) => {
  const dispatch = useDispatch()
  const currentCourse: any = useSelector((state: RootState) => state.study.currentCourse)
  const selectIcon = (type: string) => {
    switch (type) {
      case 'learning':
        return icoAudio
      case 'theory':
        return icoBook
      case 'quiz':
        return icoQuiz
      case 'speaking':
        return icoSpeaking
      case 'video':
        return icoVideo
      case 'vocab':
        return icoVocab
      case 'reading':
        return icoReading
      default:
        return icoReading
    }
  }
  const callDetailLesson = async (idLess: number) => {
    const dataDetail: any = await dispatch(actionGetChildsLesson(idLess))
    if (!_.isEmpty(dataDetail)) {
      setDetailChildren(dataDetail)
    } else {
      callChangeLesson(idLess)
    }
  }
  const conditionCall = async (lesson: any, lessIndex: number) => {
    if (!lesson?.isPercentLock || currentCourse?.scope !== 'limit') {
      // const isHaveChildLesson = await checkChildLession(lesson, lessIndex)
      // if (!isHaveChildLesson) goToLesson(lesson?.id)
      callDetailLesson(lesson?.id)
    } else {
      openError('Bạn cần hoàn thành bài học trước đó.')
    }
  }
  return (
    <div className="mb-3">
      <Accordion.Item eventKey={data?.id?.toString() || ''}>
        <Accordion.Header
          className="part__title--wrapper d-flex align-items-center custor"
          as={Card.Header}
        >
          {isExpanded ? <BsFillCaretDownFill /> : <BsFillCaretRightFill />}
          <p className="part__title mb-0 ms-3">{data?.name}</p>
        </Accordion.Header>
        <Accordion.Collapse eventKey={data?.id?.toString() || ''}>
          <ListGroup variant="flush">
            {!_.isEmpty(data.lessons || data?.childSecond) &&
              (data?.lessons || data?.childSecond)?.map((lesson: any, lessIndex: number) => (
                <ListGroup.Item key={lessIndex} active={lesson.id === idLesson}>
                  <div
                    className="d-flex align-items-center custor"
                    onClick={() => {
                      conditionCall(lesson, lessIndex)
                    }}
                  >
                    {lesson?.studentUnitStatus === 'finished' && (
                      <img src={ico_check_green} alt="good" />
                    )}
                    {lesson?.studentUnitStatus === 'enrolled' && (
                      <img src={ico_check_yellow} alt="greate" />
                    )}
                    {lesson?.studentUnitStatus === 'publish' && (
                      <img src={selectIcon(lesson?.type)} alt="icon" />
                    )}
                    {!lesson?.studentUnitStatus && (
                      <img src={selectIcon(lesson?.type)} alt="icon" />
                    )}

                    <div className="ms-3 flex-1">
                      <p className="lesson__title mb-0">{lesson.name}</p>
                      <p className="lesson__des mb-0">{lesson.description}</p>
                    </div>
                    {(lesson?.isPercentLock || !lesson?.canAccess) &&
                    currentCourse?.scope === 'limit' ? (
                      <img src={icoLock} alt="icon" />
                    ) : (
                      <>{`${lesson?.percentage || 0} %`}</>
                    )}
                  </div>
                </ListGroup.Item>
              ))}
          </ListGroup>
        </Accordion.Collapse>
      </Accordion.Item>
    </div>
  )
}

export default LessionRow
