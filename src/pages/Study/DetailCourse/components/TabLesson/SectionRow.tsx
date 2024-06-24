import React, { useEffect, useState, useMemo } from 'react'
import type { FC } from 'react'
import { Accordion, ProgressBar, ListGroup, Spinner } from 'react-bootstrap'
import { BsFillCaretRightFill, BsFillCaretDownFill } from 'react-icons/bs'
import _ from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar'
import icoAudio from '../../../../../assets/images/ico_audio-color.svg'
import icoLock from '../../../../../assets/images/ico_lock-gray.svg'
import icoBook from '../../../../../assets/images/ico_book-color.svg'
import icoQuiz from '../../../../../assets/images/ico_quiz-color.svg'
import icoSpeaking from '../../../../../assets/images/ico_speaking.svg'
import icoVocab from '../../../../../assets/images/ico_vocab.svg'
import icoReading from '../../../../../assets/images/ico_reading-color.svg'
import icoVideo from '../../../../../assets/images/ico_video-color.svg'
import icoGame from '../../../../../assets/images/ico_game-color.svg'
import ico_check_green from '../../../../../assets/images/ico_check-green.svg'
import ico_check_yellow from '../../../../../assets/images/ico_check-yellow.svg'
import { openActiveCode, openError } from '../../../../../utils/common'
import {
  actionJoinLesson,
  actionGetChildsLesson,
  actionSaveParentLessons,
  actionGetSectionScore
} from '../../../../../store/study/actions'
import { LessionType, SectionType } from '../../../../../store/study/types'
import { RootState } from '../../../../../store'

type Props = {
  data: SectionType
  courseScore: any
  isExpanded: boolean
  prevSection: SectionType | null
}

const SectionRow: FC<Props> = ({ data, courseScore, isExpanded, prevSection }) => {
  const history = useHistory()
  const dispatch = useDispatch()
  const currentCourse: any = useSelector((state: RootState) => state.study.currentCourse)
  const { sectionInCourse } = useSelector((state: RootState) => state.study)
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
  const checkChildLession = async (lesson: LessionType, lessIndex?: number) => {
    // console.log('==checkChildLession==',lesson,lessIndex)
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

  const onClickParentLess = async (lesson: LessionType, lessIndex: number, lock: boolean) => {
    // console.log('===onClickChildLesson===', lock, lesson)

    /**
     * TODO [X] Check canAccess
     * TODO [X] Check prev lesson percent > 80% (isPercentLock)
     * TODO [X] Check lesson has child or not
     */
    if (lesson?.canAccess) {
      // if (!lesson?.isPercentLock || currentCourse?.scope !== 'limit') {
      //   const isHaveChildLesson = await checkChildLession(lesson, lessIndex)
      //   if (!isHaveChildLesson) goToLesson(lesson?.id)
      // } else {
      //   openError('Bạn cần hoàn thành bài học trước đó.')
      // }
      if (currentCourse?.scope === 'limit' && lock) {
        openError('Bạn cần hoàn thành bài học trước đó.')
        return
      } else {
        const isHaveChildLesson = await checkChildLession(lesson, lessIndex)
        if (!isHaveChildLesson) goToLesson(lesson?.id)
      }
    } else {
      openActiveCode('Hãy nâng cấp tài khoản VIP để mở khóa tất cả bài học bạn nhé!', () => {
        // history.push({
        //   pathname: '/user-setting',
        //   state: { tabPanel: 'card-active' }
        // })
        history.push('/active-card')
      })
    }
  }

  const getCourseScoreById = useMemo(
    () => courseScore.find((cs: any) => cs.section_id === data?.id) ?? 0,
    [courseScore, data?.id]
  )

  return (
    <div className="mb-4">
      <Accordion.Item eventKey={data?.id?.toString() || ''} className="part__item">
        <Accordion.Header
          className={`part__title--wrapper d-flex align-items-center justify-content-between ${
            getCourseScoreById?.section_percentage * 100 === 0 ? 'disable-progress' : ''
          }`}
        >
          <ProgressBar
            now={Math.round(getCourseScoreById?.section_percentage * 100)}
            label={
              <div className="content-wrap">
                <div className="label">
                  {isExpanded ? <BsFillCaretDownFill /> : <BsFillCaretRightFill />}
                  <div>{`${data?.name}`}</div>
                </div>
              </div>
            }
          />
          {/* <div className="scale_rate">
            {`${getCourseScoreById?.section_score}/${getCourseScoreById?.section_total_score}`}
          </div> */}

          <div
            className="tooltip-percent"
            style={{
              left: `${Math.round(getCourseScoreById?.section_percentage * 100)}%`,
              display: `${
                Math.round(getCourseScoreById?.section_percentage * 100) === 0 ? 'none' : 'flex'
              }`
            }}
          >
            <span className="tooltiptext tooltip-right">
              {`${Math.round(getCourseScoreById?.section_percentage * 100)}%`}
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
              // sectionInCourse.map((_item: any, _index: any) => {
              //   if (_item.id === lesson.id) {
              //     prevIndex = _index
              //   }
              // })
              let lock = false
              sectionInCourse.map((_item: any, _index: any) => {
                if (_item.id === lesson.id) {
                  lock = _index > 0 && sectionInCourse[_index - 1]?.perLock < 0.8
                }
              })
              return (
                <ListGroup.Item key={lessIndex}>
                  <div
                    className="d-flex align-items-center item__lesson"
                    onClick={() => {
                      onClickParentLess(lesson, lessIndex, lock)
                    }}
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
                    {(lock && currentCourse?.scope === 'limit') || !lesson?.canAccess ? (
                      <img src={icoLock} alt="icon" />
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

export default SectionRow
