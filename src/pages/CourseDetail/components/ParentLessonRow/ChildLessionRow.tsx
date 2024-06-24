import React, { useEffect, useState } from 'react'
import type { FC } from 'react'
import { Accordion, ProgressBar, ListGroup, Spinner } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import _ from 'lodash'
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar'
import { BsFillCaretRightFill, BsFillCaretDownFill } from 'react-icons/bs'
import Button from '../../../../components/Button'
// import icoAudio from '../../../../../../assets/images/ico_audio-color.svg'
// import icoBook from '../../../../../../assets/images/ico_book-color.svg'
// import icoQuiz from '../../../../../../assets/images/ico_quiz-color.svg'
// import icoSpeaking from '../../../../../../assets/images/ico_speaking.svg'
// import icoVocab from '../../../../../../assets/images/ico_vocab.svg'
// import icoReading from '../../../../../../assets/images/ico_reading-color.svg'
// import icoVideo from '../../../../../../assets/images/ico_video-color.svg'
// import icoGame from '../../../../../../assets/images/ico_game-color.svg'
// import ico_check_green from '../../../../../../assets/images/ico_check-green.svg'
// import ico_check_yellow from '../../../../../../assets/images/ico_check-yellow.svg'
import { openError } from '../../../../utils/common'
import { LessionType, SectionType } from '../../../../store/study/types'
import {
  actionJoinLesson,
  actionGetChildsLesson,
  actionSaveParentLessons,
  actionGetSectionScore
} from '../../../../store/study/actions'
import { RootState } from '../../../../store'

type Props = {
  data: SectionType
  courseScore: any
  isExpanded: boolean
  //   unitScore: any
  //   sectionScore: SectionScore[]
  currentIndex: number
}

const ChildLessionRow: FC<Props> = ({ data, currentIndex, courseScore, isExpanded }) => {
  const history = useHistory()
  const dispatch = useDispatch()
  const currentCourse: any = useSelector((state: RootState) => state.study.currentCourse)
  const [sectionScore, setSectionScore] = useState<any>([])

  useEffect(() => {
    const getSectionScore = async () => {
      const dataRes = await dispatch(
        actionGetSectionScore({
          course_id: data.courseId as any,
          section_id: data.id as any
        })
      )

      if (!_.isEmpty(dataRes)) {
        setSectionScore(dataRes)
      }
    }

    getSectionScore()
  }, [])

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

  const checkChildLession = async (lesson: LessionType, lessIndex?: number) => {
    const dataDetail: any = await dispatch(actionGetChildsLesson(lesson?.id))
    /**
     * ? Gọi children của lession (cha)
     * * Lưu dữ liệu parentLesson with childLessons
     * * Nếu có dữ liệu => return true / false
     */

    await dispatch(
      actionSaveParentLessons({
        index: lessIndex || 0,
        data: lesson,
        childLessons: _.isEmpty(dataDetail) ? null : dataDetail
      })
    )
    if (_.isEmpty(dataDetail)) return false
    return true
  }

  const goToLesson = async (id: number) => {
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

  const onClickParentLess = async (lesson: LessionType, lessIndex?: number) => {
    /**
     * TODO [X] Check canAccess
     * TODO [X] Check prev lesson percent > 80% (isPercentLock)
     * TODO [X] Check lesson has child or not
     */
    if (lesson?.canAccess) {
      if (!lesson?.isPercentLock || currentCourse?.scope !== 'limit') {
        const isHaveChildLesson = await checkChildLession(lesson, lessIndex)
        if (!isHaveChildLesson) goToLesson(lesson?.id)
      } else {
        openError('Bạn cần hoàn thành bài học trước đó.')
      }
    } else {
      openError('Hãy nâng cấp tài khoản VIP để mở khóa tất cả bài học bạn nhé!')
    }
  }

  const getCourseScoreById = (id: Number) =>
    courseScore.find((cs: any) => cs.section_id === id) ?? 0

  return (

    <div className="mb-4">

      <Accordion.Item eventKey={data?.id?.toString() || ''} className="part__item">
        <Accordion.Header
          className={`part__title--wrapper d-flex align-items-center justify-content-between ${
            getCourseScoreById(data?.id)?.section_percentage * 100 === 0 ? 'disable-progress' : ''
          }`}
        >
     
          <div className="scale_rate">
            {`${(data as any).section_score}/${(data as any).section_total_score}`}
          </div>

          <div
            className="tooltip-percent"
            style={{
              left: `${Math.round(getCourseScoreById(data?.id)?.section_percentage * 100)}%`,
              display: `${
                Math.round(getCourseScoreById(data?.id)?.section_percentage * 100) === 0
                  ? 'none'
                  : 'flex'
              }`
            }}
          >
            <span className="tooltiptext tooltip-right">
              {`${Math.round((data as any).section_percentage * 100)}%`}
            </span>
          </div>

          {isExpanded && data?.lessons === undefined && (
            <div className="d-flex align-items-center">
              <Spinner animation="grow" style={{ width: 15, height: 15, marginLeft: 2 }} />
              <Spinner animation="grow" style={{ width: 15, height: 15, marginLeft: 2 }} />
              <Spinner animation="grow" style={{ width: 15, height: 15, marginLeft: 2 }} />
            </div>
          )}
        </Accordion.Header>
        <Accordion.Collapse eventKey={`${data?.id}`}>
          <ListGroup variant="flush">
            {(data?.lessons || []).map((lesson: LessionType, lessIndex: number) => {
              const lessonItem = sectionScore[lesson.id] as any
              return (
                <ListGroup.Item key={lessIndex}>
                  <div
                    className="d-flex align-items-center item__lesson"
                    onClick={() => onClickParentLess(lesson, lessIndex)}
                  >
                    {lessonItem && (
                      <CircularProgressbar
                        className="circlePercent"
                        value={Math.round(lessonItem?.unit_percentage * 100)}
                        text={`${Math.round(lessonItem?.unit_percentage * 100)}%`}
                        strokeWidth={10}
                        styles={buildStyles({
                          textColor: '#000000',
                          pathColor: '#2E81FF',
                          textSize: 28
                        })}
                      />
                    )}
                    
                    <div className="ms-3 flex-1">
                      <p className="lesson__title mb-0">{lesson?.name}</p>
                    </div>
                    {(lesson?.isPercentLock && currentCourse?.scope === 'limit') ||
                    !lesson?.canAccess ? (
                      <img src="" alt="icon" />
                    ) : (
                      lessonItem && (
                        <div className="score__btn">
                          {`${lessonItem.unit_score}/${lessonItem.unit_total_score}`}
                        </div>
                      )
                    )}
                  </div>
                </ListGroup.Item>
              )
            })}
          </ListGroup>
        </Accordion.Collapse>
      </Accordion.Item>
    </div>
  )
}

export default ChildLessionRow
