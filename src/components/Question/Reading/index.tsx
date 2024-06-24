import React, { useMemo, useState, useEffect, useCallback } from 'react'
import { Col, Row } from 'react-bootstrap'
import _ from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import Button from '../../Button'
import backArrow from '../../../assets/images/ico_arrowLeft-blue.svg'
import SideBar from './SideBar'
import { openSuccess, openConfirm } from '../../../utils/common'
import SumaryResults from '../Quiz/SumaryResults'
import { RootState } from '../../../store'
import QuestionSection from './QuestionSection'
import { QuestionType, SectionScore, UserAnswerType } from './types'
import { actionSaveScoreLession } from '../../../store/study/actions'

type Props = {
  lession?: QuestionType[]
  course?: any
  sectionScore?: SectionScore
  backCourse: (isDone?: boolean) => void
}

const ReadingLesson: React.FC<Props> = ({ lession, backCourse, sectionScore }) => {
  const [curQuesIndex, setCurQuesIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState<UserAnswerType[]>([])
  const [listQuestion, setListQuestion] = useState<QuestionType[]>([])

  const [lessionInfo, setLessionInfo] = useState<QuestionType>()
  const [isFinishAll, setIsFinishAll] = useState(false)
  const [isAnswerShow, setIsAnswerShow] = useState(false)
  const [currentResult, setCurrentResult] = useState<any[]>([])
  const [doingTime, setDoingTime] = useState<{ start: string | null; duration: number | null }>({
    start: null,
    duration: null
  })
  const dispatch = useDispatch()
  const lessonInfo = useSelector((state: RootState) => state.study.childLesson)
  const course = useSelector((state: RootState) => state.study.currentCourse)
  const sectionId = useSelector((state: RootState) => state.study.parentLessons?.data?.sectionId)

  const initLesson = useCallback(() => {
    if (!_.isEmpty(lession)) {
      /**
       * todo [x] find object reading
       * */
      const lessionObj: QuestionType | undefined = lession?.find((item) => item?.type === 'reading')

      if (!lessionObj) backCourse()
      setLessionInfo(lessionObj)

      const listChilds: QuestionType[] = _.orderBy(lessionObj?.childs || [], 'sequenceNo', 'asc')
      setListQuestion(listChilds)

      /**
       * todo [x] get list answers
       *  */
      const defaultAns: any =
        listChilds?.map((item: QuestionType) => ({ questionId: item.id })) || []
      setUserAnswers(defaultAns)

      /**
       * todo [x] initTime
       */
      setDoingTime({
        start: new Date().toISOString(),
        duration: null
      })
    }
  }, [backCourse, lession])

  useEffect(() => {
    initLesson()
  }, [initLesson])

  const submitAns = (answerData: UserAnswerType) => {
    const newListAnswers = [...userAnswers]
    newListAnswers[curQuesIndex] = answerData
    setUserAnswers(newListAnswers)
  }

  const currentData: QuestionType = useMemo(() => listQuestion[curQuesIndex], [
    curQuesIndex,
    listQuestion
  ])

  const changQuestion = (action: 'prev' | 'next') => {
    if (action === 'prev') {
      setCurQuesIndex(curQuesIndex - 1)
    }
    if (action === 'next') {
      if (isAnswerShow) {
        if (curQuesIndex >= (listQuestion?.length || 1) - 1) {
          openConfirm(
            {
              title: 'Bạn đã hoàn thành hết bài học.Bạn có muốn học bài tiếp theo?',
              cancelButtonText: 'Ở LẠI',
              confirmButtonText: 'BÀI TIẾP'
            },
            () => backCourse(true)
          )
        } else {
          setCurQuesIndex(curQuesIndex + 1)
        }
      } else if (curQuesIndex === (listQuestion?.length || 1) - 1) {
        openSuccess('Bạn đã làm xong bài tập. Vui lòng nộp bài để kết thúc bài học.')
      } else {
        setCurQuesIndex(curQuesIndex + 1)
      }
    }
  }

  const saveResult = async (data: any, doingTimeDuration: any) => {
    // const numberAnswer = data.filter((r: any) => r.answer !== '').length
    const correct = data?.filter((item: any) => item.result).length || 0
    const total = data?.length || 1
    await dispatch(
      actionSaveScoreLession({
        course_id: course?.id,
        section_id: sectionId,
        unit_id: lessionInfo?.unitId,
        unit_score: correct / total,
        unit_percentage: 100,
        unit_duration: doingTimeDuration || 0
      })
    )
  }

  return (
    <div className="lession__reading pb-5">
      <p className="title__lession">{lessonInfo?.data?.name || ''}</p>

      <Button.Shadow
        className="button__back"
        color="gray"
        content={<img src={backArrow} alt="back" />}
        onClick={() => backCourse(isAnswerShow)}
      />

      <div>
        <Row>
          <Col xs={4}>
            <SideBar
              questions={listQuestion || []}
              active={curQuesIndex}
              onChangeQuestion={setCurQuesIndex}
              answers={userAnswers}
              disabled={_.isEmpty(userAnswers[curQuesIndex])}
              duration={lessionInfo?.duration ? lessionInfo?.duration : null}
              isAnswerShow={isAnswerShow}
              sendResult={(data: any, totalDuration) => {
                setCurrentResult(data)
                setIsFinishAll(true)
                setDoingTime({
                  start: doingTime.start,
                  duration: totalDuration
                })

                saveResult(data, totalDuration)
              }}
              doingTime={doingTime}
              idQuestion={lessionInfo?.id}
              backCourse={backCourse}
            />
          </Col>
          <Col xs={8}>
            <QuestionSection
              question={currentData}
              quesIndex={curQuesIndex}
              readingTitle={lessionInfo?.questionText || ''}
              readingRickText={lessionInfo?.richText || ''}
              isAnswerShow={isAnswerShow}
              userAns={userAnswers[curQuesIndex]}
              changQuestion={changQuestion}
              submitAns={submitAns}
            />
          </Col>
        </Row>
      </div>

      {isFinishAll && (
        <SumaryResults
          goBack={(data: string) => {
            if (data === 'back') {
              backCourse(true)
            }
            if (data === 'answer') {
              setIsFinishAll(false)
              setIsAnswerShow(true)
              setCurQuesIndex(0)
            }
            if (data === 'repeat') {
              setCurQuesIndex(0)
              initLesson()
            }
            setIsFinishAll(false)
          }}
          currentResult={currentResult}
          doingTime={doingTime}
          highestScore={Number(sectionScore?.unit_score)}
        />
      )}
    </div>
  )
}

export default ReadingLesson
