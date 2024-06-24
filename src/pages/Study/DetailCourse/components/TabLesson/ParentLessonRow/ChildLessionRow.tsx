import React, { useEffect, useState } from 'react'
import type { FC } from 'react'
import { Accordion, Card, ListGroup } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import _ from 'lodash'
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar'
import Button from '../../../../../../components/Button'
import icoAudio from '../../../../../../assets/images/ico_audio-color.svg'
import icoBook from '../../../../../../assets/images/ico_book-color.svg'
import icoQuiz from '../../../../../../assets/images/ico_quiz-color.svg'
import icoSpeaking from '../../../../../../assets/images/ico_speaking.svg'
import icoVocab from '../../../../../../assets/images/ico_vocab.svg'
import icoReading from '../../../../../../assets/images/ico_reading-color.svg'
import icoVideo from '../../../../../../assets/images/ico_video-color.svg'
import icoGame from '../../../../../../assets/images/ico_game-color.svg'
// import ico_check_green from '../../../../../../assets/images/ico_check-green.svg'
// import ico_check_yellow from '../../../../../../assets/images/ico_check-yellow.svg'
import { openError } from '../../../../../../utils/common'
import { actionJoinLesson, actionSaveChildLesson } from '../../../../../../store/study/actions'

type Props = {
  data: LessonType
  unitScore: any
  sectionScore: SectionScore[]
  currentIndex: number
}

type LessonType = {
  courseId?: number
  id?: number
  name?: string
  sequenceNo?: number
  showAll?: boolean
  children?: any[]
  childs?: any[]
  type?: string
  canAccess?: boolean
  studentUnitStatus?: string
  percentage?: number
}

type SectionScore = {
  unit_duration: number
  unit_id: number
  unit_parent_id: number | null
  unit_percentage: any
  unit_score: number
  unit_total_score: number
}

const ChildLessionRow: FC<Props> = ({ data, unitScore, sectionScore, currentIndex }) => {

  const history = useHistory()
  const dispatch = useDispatch()

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
      case 'game':
        return icoGame
      default:
        return icoReading
    }
  }
  const callLesson = async (id: number) => {
    const dataJoin: any = await dispatch(
      actionJoinLesson({
        unitId: id
      })
    )
    if (!_.isEmpty(dataJoin) && dataJoin?.status === 200) {
      history.push(`/lession/${id}`)
    } else {
      openError('Tham gia bài học không thành công')
    }
  }
  return (
    <div className="mb-3">
      {data?.childs && (
        <Accordion.Item eventKey={data?.id?.toString() || ''}>
          <Accordion.Header
            className="part__title--wrapper d-flex align-items-center justify-content-between w-100"
            onClick={() => {
              dispatch(
                actionSaveChildLesson({
                  index: currentIndex,
                  data
                })
              )
              if (_.isEmpty(data?.childs)) {
                callLesson(data?.id || 0)
              }
            }}
          >
            <div className="d-flex">
              <CircularProgressbar
                className="circlePercent"
                value={Math.round(unitScore?.unit_percentage * 100)}
                text={`${Math.round(unitScore?.unit_percentage * 100) || 0}%`}
                strokeWidth={10}
                styles={buildStyles({
                  textColor: '#000000',
                  pathColor: '#2E81FF',
                  textSize: 28
                })}
              />
              <p className="part__title mb-0 ms-3 align-self-center">{data?.name}</p>
            </div>
            <Button.Solid
              className="percent__btn"
              content={
                <div className="flex justify-content-center align-items-center fw-bold">
                  {`${unitScore?.unit_score || 0}/ ${unitScore?.unit_total_score || 0}`}
                </div>
              }
            />
          </Accordion.Header>
          <Accordion.Collapse eventKey={data?.id?.toString() || ''}>
            <ListGroup variant="flush" className="item__list">
              {_.orderBy(data?.childs || [], 'sequenceNo', 'asc').map(
                (lesson: any, secondIndex: number) => {
                  const lessonItem = sectionScore?.[lesson?.id] as any
                  return (
                    <ListGroup.Item key={secondIndex} className="item__wrap">
                      <div className="d-flex align-items-center item__lesson">
                        <span
                          className={`dot ${lessonItem?.unit_percentage === 1 ? 'active' : ''}`}
                        />
                        <div className="ms-3 flex-1">
                          <p
                            className=""
                            onClick={() => {
                              callLesson(lesson?.id)
                            }}
                          >
                            {lesson?.name}
                          </p>
                          <p className="lesson__des mb-0">{lesson?.description}</p>
                        </div>
                        <div>{`${lessonItem?.unit_score || 0}/100`}</div>
                      </div>
                    </ListGroup.Item>
                  )
                }
              )}
            </ListGroup>
          </Accordion.Collapse>
        </Accordion.Item>
      )}
    </div>
  )
}

export default ChildLessionRow
