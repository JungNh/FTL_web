import React, {
  useState, useEffect, FC, useCallback,
} from 'react'
import { Col, Row } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import Swal from 'sweetalert2'
import _ from 'lodash'
import Button from '../../../../components/Button'
import SideBar from './QuesType/SideBar'
import { convertIndexToLetter, openConfirm, openSuccess } from '../../../../utils/common'
import SumaryResults from './components/SumaryResults'
import QuesType from './QuesType'
import ButtonAndDescription from './components/ButtonAndDescription'
import SubTitleQues from './components/SubTitleQues'
import { MetaType, QuestionType, UserAnswerType } from './QuesType/types'
import { PageType } from '../../types'
import { RootState } from '../../../../store'
import backArrow from '../../../../assets/images/ico_arrowLeft-blue.svg'

type Props = {
  changePage: (room: PageType) => void
}

const QuizLesson: FC<Props> = ({ changePage }) => {
  const [screenType, setScreenType] = useState<string>('doing')
  const [curQuesIndex, setCurQuesIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState<UserAnswerType[]>([])
  const [questions, setQuestions] = useState<QuestionType[]>([])
  const [doingTime, setDoingTime] = useState<{ start: string | null; duration: number | null }>({
    start: null,
    duration: null,
  })

  const examInfo = useSelector((state: RootState) => state.roomOnline.currentRoom.info)
  const contestInfo: any = useSelector((state: RootState) => state.roomOnline.currentRoom.contest)

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
        ques?.answers?.forEach((item: any, index: number) => {
          if (item?.isCorrect) {
            const correctObj = JSON.parse(item?.value || '')
            const correctValue = correctObj?.[0]?.value || ''
            desCorrectArray.push(correctValue)
          }
        })
      }
      if (ques?.type === 'fill_word_multiple_answer') {
        const listAns = ques?.answers || []
        const correctStr = listAns.map((item: any) => {
          const s = JSON.parse(item?.value || '')
          if (typeof s === 'object' && s.length) {
            return s?.join('/ ')
          }
          return ''
        })
        desCorrectArray.push(...correctStr)
      }

      if (ques?.type === 'arrangement') {
        const correctAns = ques?.answers?.[0]?.value || ''
        const correctStr = JSON.parse(correctAns)?.[0]?.value
        desCorrectString = correctStr
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
    _.orderBy(contestInfo?.questions || [], 'sequenceNo', 'asc')?.forEach((item: any) => {
      if (item.type === 'reading') {
        const readingQues: any[] = _.orderBy(item?.childs || [], 'sequenceNo', 'asc')?.map((r: any) => ({
          ...r,
          questionTitle: item?.questionText,
          richText: item?.richText,
          readingId: item?.id,
          type: 'reading',
        })) || []
        listQuestion.push(...readingQues)
      } else if (item.type === 'listening') {
        const listenQues: any[] = _.orderBy(item?.childs || [], 'sequenceNo', 'asc')?.map((r: any) => ({
          ...r,
          questionTitle: item?.questionText,
          audioUrl: item?.audioUrl,
          listeningId: item?.id,
          type: 'listening',
        })) || []
        listQuestion.push(...listenQues)
      } else if (
        item.type === 'multiple_choice'
        || item.type === 'fill_word_multiple'
        || item.type === 'fill_word_multiple_answer'
      ) {
        const listMetas: MetaType[] = item?.metas || []
        const objImage = listMetas.find((meta) => meta?.key === 'image')
        const objAudio = listMetas.find((meta) => meta?.key === 'audio')
        listQuestion.push({
          ...item,
          audioUrl: objAudio?.value || undefined,
          imageUrl: objImage?.value || undefined,
        })
      } else {
        listQuestion.push(item)
      }
    })

    setQuestions(listQuestion)
    convertInitAnswers(listQuestion)
    setDoingTime({ start: new Date().toString(), duration: null })
  }, [convertInitAnswers, contestInfo])

  useEffect(() => {
    initQuiz()
  }, [initQuiz])

  const setUserAns = (userAns: any) => {
    const newAns = userAnswers.slice()
    newAns[curQuesIndex] = userAns
    setUserAnswers(newAns)
  }

  const leaveExam = () => {
    if (screenType === 'doing') {
      Swal.fire({
        icon: 'warning',
        title: 'Bạn có chắc chắn muốn rời phòng',
        confirmButtonText: 'Rời phòng',
        cancelButtonText: 'Không',
        showConfirmButton: true,
        showCancelButton: true,
      })
        .then((results: { isConfirmed: boolean }) => {
          if (results.isConfirmed) {
            changePage('list')
          }
          return ''
        })
        .catch((error) => console.error(error))
    } else {
      changePage('list')
    }
  }

  const changeQuestions = (type: 'next' | 'prev') => {
    if (type === 'next' && curQuesIndex >= questions?.length - 1) {
      if (screenType === 'doing') {
        openSuccess('Bạn đã làm xong bài tập. Vui lòng nộp bài để kết thúc bài học.')
      }
      if (screenType === 'review') {
        openConfirm(
          {
            title: 'Bạn đã hoàn thành hết bài thi.Bạn có muốn quay lại danh sách phòng thi?',
            cancelButtonText: 'Ở LẠI',
            confirmButtonText: 'VỀ DANH SÁCH PHÒNG THI',
          },
          () => leaveExam()
        )
      }
    }
    if (type === 'next' && curQuesIndex < questions?.length - 1) {
      setCurQuesIndex((index: number) => index + 1)
    }
    if (type === 'prev') setCurQuesIndex((index: number) => index - 1)
  }

  return (
    <div className="lession_quiz">
      {(screenType === 'doing' || screenType === 'review') && (
        <>
          <p className="title__lession">{contestInfo?.name || ''}</p>
          <Button.Shadow
            className="button__back"
            color="gray"
            content={<img src={backArrow} alt="back" />}
            onClick={() => leaveExam()}
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
                  duration={contestInfo?.duration || null}
                  isAnswerShow={screenType === 'review'}
                  changeScreen={(totalDuration?: number) => {
                    setScreenType('summary')
                    setDoingTime({
                      start: doingTime.start,
                      duration: totalDuration || 0,
                    })
                  }}
                  examId={examInfo?.id || 0}
                  doingTime={doingTime}
                />
              </Col>
              <Col xs={8}>
                <div className="border p-3">
                  <SubTitleQues question={questions[curQuesIndex]} />
                  <QuesType
                    question={questions[curQuesIndex]}
                    quesIndex={curQuesIndex}
                    userAns={userAnswers[curQuesIndex]}
                    setUserAns={setUserAns}
                    isAnswerShow={screenType === 'review'}
                  />
                  <ButtonAndDescription
                    isAnswerShow={screenType === 'review'}
                    correctAns={userAnswers[curQuesIndex]?.desCorrectAns || ''}
                    userAns={userAnswers[curQuesIndex]?.desUserAns || ''}
                    isCorrect={userAnswers[curQuesIndex]?.isCorrect || false}
                    questionExplain={questions[curQuesIndex]?.questionExplain || ''}
                    changQuestion={(type: 'next' | 'prev') => changeQuestions(type)}
                    btnDisabled={{
                      left: curQuesIndex === 0,
                      right: false,
                    }}
                  />
                </div>
              </Col>
            </Row>
          </div>
        </>
      )}
      {screenType === 'summary' && (
        <SumaryResults
          examId={examInfo?.id || 0}
          goBack={(type: string) => {
            if (type === 'answer') {
              setScreenType('review')
              setCurQuesIndex(0)
            }
            if (type === 'back') {
              changePage('list')
            }
          }}
          nameLesson={contestInfo?.name}
          currentResult={userAnswers}
          doingTime={doingTime}
        />
      )}
    </div>
  )
}

export default QuizLesson

//   <SumaryResults
// examId={examInfo?.id || 0}
// goBack={(type: string) => {
//   if (type === 'answer') {
//     setScreenType('review')
//   }
//   if (type === 'back') {
//     changePage('list')
//   }
// }}
// nameLesson={contestInfo?.name}
// currentResult={answers}
// doingTime={doingTime}
// />
