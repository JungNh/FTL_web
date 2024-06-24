import React, { useState, useEffect, FC, useCallback } from 'react'
import { useLocation } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { Col, Row } from 'react-bootstrap'
import _ from 'lodash'
import Button from '../../Button'
import backArrow from '../../../assets/images/ico_arrowLeft-blue.svg'
import SideBar from './SideBar'
import { convertIndexToLetter, openConfirm, openSuccess } from '../../../utils/common'
import SumaryResults from './SumaryResults'
import QuesType from './QuesType'
import ButtonAndDescription from './ButtonAndDescription'
import SubTitleQues from './SubTitleQues'
import { RootState } from '../../../store'
import { QuestionType, LessonType, UserAnswerType, MetaType, SectionScore } from './QuesType/types'
import { actionSaveScoreLession } from '../../../store/study/actions'
import ModalReport from '../ResultAns/ModalReport'
import { actionShowReport, actionShowReported, checkReport } from '../../../store/lesson/actions'

type Props = {
  lessionInfo?: LessonType
  course?: any
  sectionScore?: SectionScore
  backCourse: (isDone?: boolean) => void
}

const QuizLesson: FC<Props> = ({ lessionInfo, backCourse, sectionScore }) => {
  const [screenType, setScreenType] = useState<string>('doing')
  const [curQuesIndex, setCurQuesIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState<UserAnswerType[]>([])
  const [questions, setQuestions] = useState<QuestionType[]>([])
  const { userInfo } = useSelector((state: RootState) => state.login)
  const [currentResult, setCurrentResult] = useState<any[]>([])
  const [doingTime, setDoingTime] = useState<{ start: string | null; duration: number | null }>({
    start: null,
    duration: null
  })

  const dispatch = useDispatch()
  const location = useLocation()
  const course = useSelector((state: RootState) => state.study.currentCourse)
  const sectionId = useSelector((state: RootState) => state.study.parentLessons?.data?.sectionId)
  const indexLoca: number = location.pathname.lastIndexOf('/')
  const idLess: string = location.pathname.substring(indexLoca + 1, location.pathname.length)
  // console.log('questions', questions)

  const convertInitAnswers = useCallback((listQues: any) => {
    const initAns: UserAnswerType[] = []

    listQues.forEach((ques: any) => {
      const a: UserAnswerType = { isCorrect: false, questionId: ques.id }
      const desCorrectArray = []
      let desCorrectString = ''
      if (ques?.type === 'multiple_choice') {
        ques?.answers?.forEach((item: any, index: number) => {
          if (item?.isCorrect) {
            const label = convertIndexToLetter(index)
            const correctValue = item?.value || ''
            desCorrectArray.push(`${label}. ${correctValue}`)
          }
        })
      }
      if (ques?.type === 'fill_word_multiple') {
        ques?.answers?.forEach((item: any) => {
          if (item?.isCorrect) {
            const correctObj = JSON.parse(item?.value || '')
            const correctValue = correctObj?.map((i: any) => i?.value || '').join('/ ')
            desCorrectArray.push(correctValue)
          }
        })
      }
      if (ques?.type === 'fill_word_multiple_answer') {
        const listAns = ques?.answers || []
        const correctStr = listAns?.map((item: any) => {
          const s = JSON.parse(item?.value || '')
          if (typeof s === 'object' && s.length) return s?.join('/ ')
          return ''
        })
        desCorrectArray.push(...correctStr)
      }

      if (ques?.type === 'arrangement') {
        const correctAns = ques?.answers?.[0]?.value || ''
        const correctStr = JSON.parse(correctAns)?.[0]?.value
        desCorrectString = correctStr
      }
      if (ques?.type === 'new_arrange') {
        desCorrectString = ques?.questionText
      }
      if (ques?.type === 'reading' || ques?.type === 'listening') {
        ques?.answers?.forEach((item: any, index: number) => {
          if (item?.isCorrect) {
            const label = convertIndexToLetter(index)
            const correctValue = item?.value || ''
            desCorrectArray.push(`${label}. ${correctValue}`)
          }
        })
      }

      if (desCorrectArray.length > 0) {
        a.desCorrectAns = desCorrectArray
      } else {
        a.desCorrectAns = desCorrectString
      }
      initAns.push(a)
    })
    setUserAnswers(initAns)
  }, [])

  const initQuiz = useCallback(() => {
    const listQuestion: QuestionType[] = []
    _.orderBy(lessionInfo?.questions || [], 'sequenceNo', 'asc')?.forEach((item) => {
      if (item.type === 'reading') {
        const readingQues: any[] =
          _.orderBy(item?.childs || [], 'sequenceNo', 'asc')?.map((r) => ({
            ...r,
            questionTitle: item?.questionText,
            richText: item?.richText,
            readingId: item?.id,
            type: 'reading'
          })) || []
        listQuestion.push(...readingQues)
      } else if (item.type === 'listening') {
        const listMetas: MetaType[] = item?.metas || []
        const objImage = listMetas.find((meta) => meta?.key === 'image')
        const listenQues: any[] =
          _.orderBy(item?.childs || [], 'sequenceNo', 'asc')?.map((r: any) => ({
            ...r,
            questionTitle: item?.questionText,
            audioUrl: item?.audioUrl,
            listeningId: item?.id,
            type: 'listening',
            imageUrl: objImage?.value || undefined
          })) || []
        listQuestion.push(...listenQues)
      } else if (
        item.type === 'multiple_choice' ||
        item.type === 'fill_word_multiple' ||
        item.type === 'fill_word_multiple_answer'
      ) {
        const listMetas: MetaType[] = item?.metas || []
        const objImage = listMetas.find((meta) => meta?.key === 'image')
        const objAudio = listMetas.find((meta) => meta?.key === 'audio')
        listQuestion.push({
          ...item,
          audioUrl: objAudio?.value || undefined,
          imageUrl: objImage?.value || undefined
        })
      } else {
        listQuestion.push(item)
      }
    })

    setQuestions(listQuestion)
    convertInitAnswers(listQuestion)
    setDoingTime({ start: new Date().toString(), duration: null })
  }, [convertInitAnswers, lessionInfo])

  useEffect(() => {
    initQuiz()
  }, [initQuiz])

  const changeQuestions = (type: 'next' | 'prev') => {
    if (type === 'next' && curQuesIndex >= questions?.length - 1) {
      if (screenType === 'doing') {
        openSuccess('Bạn đã làm xong bài tập. Vui lòng nộp bài để kết thúc bài học.')
      }
      if (screenType === 'review') {
        openConfirm(
          {
            title: 'Bạn đã hoàn thành hết bài học.Bạn có muốn học bài tiếp theo?',
            cancelButtonText: 'Ở LẠI',
            confirmButtonText: 'BÀI TIẾP'
          },
          () => backCourse(true)
        )
      }
    }
    if (type === 'next' && curQuesIndex < questions?.length - 1) {
      setCurQuesIndex((index: number) => index + 1)
    }
    if (type === 'prev') setCurQuesIndex((index: number) => index - 1)
  }

  const setUserAns = (answerData: any) => {
    const newListAnswers = [...userAnswers]
    newListAnswers[curQuesIndex] = answerData
    setUserAnswers(newListAnswers)
  }

  const saveResult = async (data: any, doingTimeDuration: any) => {
    // const numberAnswer = data.filter((r: any) => r.answer !== '').length
    const correct = data?.filter((item: any) => item.result).length || 0
    const total = data?.length || 1

    await dispatch(
      actionSaveScoreLession({
        course_id: course?.id,
        section_id: sectionId,
        unit_id: idLess,
        unit_score: correct / total,
        // unit_percentage: Math.round((numberAnswer / total) * 100),
        unit_percentage: 100,
        unit_duration: doingTimeDuration || 0
      })
    )
  }

  return (
    <div className="lession_quiz">
      <>
        <p className="title__lession">{lessionInfo?.name || ''}</p>
        <Button.Shadow
          className="button__back"
          color="gray"
          content={<img src={backArrow} alt="back" />}
          onClick={() => backCourse(screenType === 'review')}
        />

        <div>
          <Row>
            <Col xs={4}>
              <SideBar
                questions={questions}
                active={curQuesIndex}
                onChangeQuestion={setCurQuesIndex}
                answers={userAnswers}
                disabled={false}
                duration={lessionInfo?.duration || null}
                isAnswerShow={screenType === 'review'}
                sendResult={(data: any, totalDuration: number) => {
                  setScreenType('summary')
                  setCurrentResult(data)
                  setDoingTime({
                    start: doingTime.start,
                    duration: totalDuration
                  })

                  saveResult(data, totalDuration)
                }}
                idQuestion={lessionInfo?.id}
                doingTime={doingTime}
                backCourse={backCourse}
              />
            </Col>
            <Col xs={8}>
              <div className="border p-3">
                {/* <SubTitleQues question={questions[curQuesIndex]} /> */}
                <QuesType
                  question={questions[curQuesIndex]}
                  quesIndex={curQuesIndex}
                  userAns={userAnswers[curQuesIndex]}
                  setUserAns={setUserAns}
                  isAnswerShow={screenType === 'review'}
                />
                <ButtonAndDescription
                  isAnswerShow={screenType === 'review'}
                  // =========Dap an=========
                  correctAns={userAnswers[curQuesIndex]?.desCorrectAns || ''}
                  // =========Dap an=========
                  userAns={userAnswers[curQuesIndex]?.desUserAns || ''}
                  isCorrect={userAnswers[curQuesIndex]?.isCorrect || false}
                  questionExplain={questions[curQuesIndex]?.questionExplain || ''}
                  changQuestion={(type: 'next' | 'prev') => changeQuestions(type)}
                  btnDisabled={{
                    left: curQuesIndex === 0,
                    right: false
                  }}
                  setShow={async () => {
                    try {
                      const res = await checkReport(Number(questions[curQuesIndex]?.id), userInfo?.id)
                      if (res?.status == 200)
                        dispatch(
                          actionShowReport({ isShow: true, questionID: Number(questions[curQuesIndex]?.id)})
                        )
                      else {
                        dispatch(actionShowReported(true))
                      }
                    } catch (error) {
                      console.log(error)
                    }
                  }}
                />
              </div>
            </Col>
          </Row>
        </div>
      </>
      {screenType === 'summary' && (
        <SumaryResults
          goBack={(type: string) => {
            setCurQuesIndex(0)
            if (type === 'back') {
              backCourse(true)
            }
            if (type === 'answer') {
              setScreenType('review')
            }
            if (type === 'repeat') {
              initQuiz()
              setScreenType('doing')
            }
          }}
          currentResult={currentResult}
          doingTime={doingTime}
          highestScore={Number(sectionScore?.unit_score)}
        />
      )}
    </div>
  )
}

export default QuizLesson
