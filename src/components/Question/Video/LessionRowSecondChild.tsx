import React, { useState } from 'react'
import type { FC } from 'react'
import { Accordion, Card, ListGroup } from 'react-bootstrap'
import { BsFillCaretRightFill, BsFillCaretDownFill } from 'react-icons/bs'
import _ from 'lodash'
import icoAudio from '../../../assets/images/ico_audio-color.svg'
import icoBook from '../../../assets/images/ico_book-color.svg'
import icoQuiz from '../../../assets/images/ico_quiz-color.svg'
import icoSpeaking from '../../../assets/images/ico_speaking.svg'
import icoVocab from '../../../assets/images/ico_vocab.svg'
import icoReading from '../../../assets/images/ico_reading-color.svg'
import icoVideo from '../../../assets/images/ico_video-color.svg'
import ico_check_green from '../../../assets/images/ico_check-green.svg'
import ico_check_yellow from '../../../assets/images/ico_check-yellow.svg'

type Props = {
  data: CourseData
  callChangeLesson: (id: number) => void
  idLesson: number
}

type CourseData = {
  courseId?: number
  id?: number
  name?: string
  sequenceNo?: number
  showAll?: boolean
  children?: any[]
  childs?: any[]
  canAccess?: any
  status?: any
  description?: string
  type?: string
  percentage?: number
  studentUnitStatus?: string
}

const LessionRow: FC<Props> = ({ data, callChangeLesson, idLesson }) => {
  const [isCollapsed, setIsCollapsed] = useState(true)
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
  if (!_.isEmpty(data?.childs)) {
    return (
      <Accordion onSelect={() => setIsCollapsed(!isCollapsed)} className="mb-3">
        <Accordion.Item
          eventKey="0"
        >
          <Accordion.Header
            className="part__title--wrapper d-flex align-items-center custor"
          >
            {isCollapsed ? <BsFillCaretRightFill /> : <BsFillCaretDownFill />}
            <p className="part__title mb-0 ms-3">{data?.name}</p>
          </Accordion.Header>
          <Accordion.Collapse eventKey="0">
            <ListGroup variant="flush">
              {!_.isEmpty(data?.childs)
              && data?.childs?.map((lesson: any, lessIndex: number) => (
                <ListGroup.Item key={lessIndex} active={lesson.id === idLesson}>
                  <div
                    className="d-flex align-items-center custor"
                    onClick={() => {
                      callChangeLesson(lesson?.id)
                    }}
                  >
                    {lesson?.studentUnitStatus === 'finished' && (
                      <img src={ico_check_green} alt="good" />
                    )}
                    {lesson?.studentUnitStatus === 'enrolled' && (
                      <img src={ico_check_yellow} alt="greate" />
                    )}
                    {lesson?.studentUnitStatus === 'finished' && (
                      <img src={selectIcon(lesson?.type)} alt="icon" />
                    )}
                    {!lesson?.studentUnitStatus && (
                      <img src={selectIcon(lesson?.type)} alt="icon" />
                    )}

                    <div className="ms-3 flex-1">
                      <p className="lesson__title mb-0">{lesson.name}</p>
                      <p className="lesson__des mb-0">{lesson.description}</p>
                    </div>
                    <div>{`${lesson?.percentage || 0} %`}</div>
                  </div>
                  {/* )} */}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Accordion.Collapse>
        </Accordion.Item>
      </Accordion>
    )
  }

  if (_.isEmpty(data?.childs)) {
    return (
      <div
        className="d-flex align-items-center custor single__item"
        onClick={() => callChangeLesson(data?.id || 0)}
      >
        {data?.studentUnitStatus === 'finished' && <img src={ico_check_green} alt="good" />}
        {data?.studentUnitStatus === 'enrolled' && <img src={ico_check_yellow} alt="greate" />}
        {data?.studentUnitStatus === 'publish' && (
          <img src={selectIcon(data?.type || '')} alt="icon" />
        )}
        {!data?.studentUnitStatus && <img src={selectIcon(data?.type || '')} alt="icon" />}
        <div className="ms-3 flex-1">
          <p className="lesson__title mb-0">{data?.name}</p>
          <p className="lesson__des mb-0">{data?.description}</p>
        </div>
        <div>{`${data?.percentage || 0} %`}</div>
      </div>
    )
  }
  return <div />
}

export default LessionRow
