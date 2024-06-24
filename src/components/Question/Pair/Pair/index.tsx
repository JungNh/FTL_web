import React, { useEffect, useMemo, useState } from 'react'
import Swal from 'sweetalert2'
import { Col, Row } from 'react-bootstrap'
import _ from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import { Flipper, Flipped } from 'react-flip-toolkit'
import Button from '../../../Button'
import NavbarTest from '../../../NavbarTest'
import Part from './Part'
import { shuffleArray } from '../../../../utils/common'
import ResultAns from '../../ResultAns'
import backArrow from '../../../../assets/images/ico_arrowLeft-blue.svg'
import ico_part_wrong from '../../../../assets/images/ico_pair-wrong.svg'
import ico_part_correct from '../../../../assets/images/ico_pair-correct.svg'
import Cheering from '../../../Cheering'
import { RootState } from '../../../../store'
import {
  actionAddCorrect,
  actionAddWrong,
  actionCheerWrong,
  actionFirstCheerCorrect,
  actionSecondCheerCorrect,
  actionShowCheer
} from '../../../../store/lesson/actions'

type Props = {
  lession?: {
    id?: number
    answers?: Answer[]
    questionExplain?: string
    questionText?: string
    questionTitle?: string
  }
  onNextLession: (data: any) => void
  currentTestIndex?: number
  totalTest?: number
  backCourse: () => void
}
type Answer = {
  audioUrl?: string
  id?: number
  imageUrl?: string
  isCorrect?: boolean
  questionId?: number
  value?: string
}

const Pair: React.FC<Props> = ({
  lession,
  onNextLession,
  currentTestIndex,
  totalTest,
  backCourse
}) => {
  const dispatch = useDispatch()
  const [question, setQuestion] = useState<any[]>([])
  const [feedBackResult, setFeedBackResult] = useState<boolean | null>(null)
  const [countCorrectAns, setCountCorrectAns] = useState<number>(0)
  const [answers, setAnswers] = useState<any[]>([])
  const [correctAns, setCorrectAns] = useState<any[]>([])
  const [select, setSelect] = useState<{ left: number | null; right: number | null }>({
    left: null,
    right: null
  })
  const {
    numberCorrect,
    numberWrong,
    correctFirstShowed,
    correctSecondShowed,
    wrongShowed,
    showCheer
  } = useSelector((state: RootState) => state.lesson)

  useEffect(() => {
    const ans: any = !_.isEmpty(lession) ? lession?.answers : []
    const firstQues: any = !_.isEmpty(ans) ? ans[0] : {}
    const listQuestionAndAns: any = !_.isEmpty(firstQues) ? JSON.parse(firstQues?.value) : []
    if (!_.isEmpty(listQuestionAndAns)) {
      const listQ: any = [
        ...listQuestionAndAns.map((item: any, index: number) => ({
          text: item.key,
          pair: index
        }))
      ]
      const listAns: any = [
        ...listQuestionAndAns.map((item: any, index: number) => ({
          text: item.value,
          pair: index
        }))
      ]
      setQuestion(
        shuffleArray(listQ).map((item: any) => ({
          text: item.text,
          pair: item.pair,
          status: 'normal',
          rowStatus: 'normal'
        })) || []
      )
      setAnswers(
        shuffleArray(listAns).map((item: any, index: number) => ({
          text: item.text,
          order: index,
          isPair: false,
          pair: item.pair,
          status: 'normal'
        })) || []
      )
      setCorrectAns([
        ...listQuestionAndAns.map((item: any) => ({
          key: item.key,
          value: item.value
        }))
      ])
    }
  }, [lession])

  const onCheck = () => {
    const newQuestion = [...question]
    const newAnswers = _.orderBy(answers, 'order')
    let countCorrect = 0
    question.forEach((ques: any, index: any) => {
      const isCorrect = ques?.pair === newAnswers[index]?.pair

      if (isCorrect && newAnswers[index]?.isPair) {
        countCorrect += 1
        newQuestion[index].status = 'correct'
        newQuestion[index].rowStatus = 'correct'
        newAnswers[index].status = 'correct'
      }

      if (newAnswers[index]?.isPair === false) {
        newAnswers[index].status = 'wrong'
        newQuestion[index].rowStatus = 'wrong'
      }

      if (newAnswers[index]?.isPair && !isCorrect) {
        newQuestion[index].status = 'wrong'
        newQuestion[index].rowStatus = 'wrong'
        newAnswers[index].status = 'wrong'
      }
    })
    console.log('isCorrect', countCorrect === question.length)
    if (countCorrect === question.length) {
      dispatch(actionAddCorrect())
    } else {
      dispatch(actionAddWrong())
    }
    setCountCorrectAns(countCorrect)
    setQuestion(newQuestion)
    setAnswers(newAnswers)
    setFeedBackResult(true)
  }

  const sendAnswer = async () => {
    const listAns: any = lession?.answers
    const objAns: any = listAns[0]
    onNextLession({
      questionId: objAns?.questionId,
      result: countCorrectAns === question.length || false,
      answer: '',
      score: countCorrectAns === question.length ? 1 : 0,
      duration: 0
    })
  }

  const onHint = () => {
    Swal.fire({
      title: 'Gợi ý',
      text: 'Bạn có chắc chắn muốn xem gợi ý',
      confirmButtonText: 'Tôi muốn xem',
      showCancelButton: true,
      cancelButtonText: 'Không, tôi có thể làm được'
    })
      .then((results: { isConfirmed: boolean }) => {
        if (results.isConfirmed) {
          Swal.fire('Gợi ý !', lession?.questionExplain, 'info')
        }
        return ''
      })
      .catch((error) => console.error(error))
  }
  const onSkip = () => {
    Swal.fire({
      title: 'Bạn muốn bỏ qua bài tập này',
      text: 'Bài tập này sẽ không được tính điểm',
      confirmButtonText: 'Bỏ qua',
      showCancelButton: true,
      cancelButtonText: 'Ở lại',
      icon: 'warning'
    })
      .then((results: { isConfirmed: boolean }) => {
        if (results.isConfirmed) {
          if (numberWrong == 2 && !wrongShowed) {
            dispatch(actionShowCheer(true))
          } else {
            sendAnswer()
          }
          checkShowCheer()
          dispatch(actionAddWrong())
        }
        return ''
      })
      .catch((error) => console.error(error))
  }

  const onSelect = (currentIndex: number, side: 'left' | 'right') => {
    if (side === 'left') {
      const newAnswers = _.orderBy(answers, 'order')
      if (select.right === null) {
        setSelect({ left: currentIndex, right: null })
        if (newAnswers[currentIndex].isPair) {
          newAnswers[currentIndex].isPair = false
          setAnswers(newAnswers)
        }
      }
      if (select.right !== null) {
        newAnswers[select.right].order = currentIndex
        newAnswers[currentIndex].order = select.right
        newAnswers[select.right].isPair = true
        setAnswers(_.orderBy(newAnswers, 'order'))
        setSelect({ left: null, right: null })
      }
    }

    if (side === 'right') {
      if (select.left === null) {
        setSelect({ left: null, right: currentIndex })
      }
      if (select.left !== null) {
        const newAnswers = _.orderBy(answers, 'order')
        newAnswers[select.left].order = currentIndex
        newAnswers[currentIndex].isPair = true
        newAnswers[currentIndex].order = select.left
        setAnswers(_.orderBy(newAnswers, 'order'))
        setSelect({ left: null, right: null })
      }
    }
  }

  const isDisabledCheck = useMemo(() => {
    const isAnswer = answers.find((item: any) => item.isPair)
    return _.isEmpty(isAnswer)
  }, [answers])

  const checkShowCheer = () => {
    if (numberCorrect == 5) dispatch(actionFirstCheerCorrect())
    if (numberCorrect == 10) dispatch(actionSecondCheerCorrect())
    if (numberWrong == 3) dispatch(actionCheerWrong())
  }

  const renderBody = () => {
    return (
      <div className="bg_renderBody">
        <p className="subTitle__lession">{lession?.questionTitle || ''}</p>
        <p className="title__lession mb-5">{lession?.questionText || ''}</p>
        <div className="container">
          <Row>
            <Col xs={6}>
              {question?.map((item: any, index: number) => {
                let rowSrc = item?.rowStatus
                if (item?.status === 'correct') rowSrc = ico_part_correct
                if (answers[index].status === 'wrong') rowSrc = ico_part_wrong
                return (
                  <div className="d-flex justify-content-end align-item-center" key={index}>
                    {rowSrc !== 'normal' && <img src={rowSrc} alt="icon" className="mx-3 mb-3" />}
                    <Part
                      text={item?.text}
                      active={select.left === index}
                      status={item.status}
                      side="left"
                      isPair={false}
                      onClick={() => {
                        if (!feedBackResult) onSelect(index, 'left')
                      }}
                    />
                  </div>
                )
              })}
            </Col>
            <Col xs={6}>
              <Flipper flipKey={answers.map((item) => item?.text).join('')}>
                <ul style={{ position: 'relative', paddingLeft: 0 }}>
                  {answers?.map((item: any, index: number) => (
                    <Flipped key={item?.text} flipId={item?.text}>
                      <li
                        style={{
                          transition: '0.5s margin ease',
                          marginLeft: item?.isPair ? '-48px' : 0
                        }}
                        className="li__item mb-3"
                        key={item?.text}
                      >
                        <Part
                          text={item?.text}
                          active={select.right === index}
                          status={item.status}
                          side="right"
                          isPair={item?.isPair}
                          onClick={() => {
                            if (!feedBackResult) onSelect(index, 'right')
                          }}
                        />
                      </li>
                    </Flipped>
                  ))}
                </ul>
              </Flipper>
            </Col>
          </Row>
        </div>
      </div>
    )
  }

  return (
    <div className="lession__pair">
      <Button.Shadow
        className="button__back"
        color="gray"
        content={<img src={backArrow} alt="back" />}
        onClick={() => backCourse()}
      />
      {showCheer ? <Cheering /> : renderBody()}
      <NavbarTest
        currentTest={(currentTestIndex || 0) + 1}
        totalTest={totalTest}
        onCheck={() => {
          if (showCheer) {
            dispatch(actionShowCheer(false))
            sendAnswer()
            checkShowCheer()
          } else {
            onCheck()
          }
        }}
        // onCheck={onCheck}
        onHint={onHint}
        onSkip={onSkip}
        isDisabled={isDisabledCheck && !showCheer}
      />

      <ResultAns
        // onContinue={() => {
        //   if (
        //     (numberCorrect == 5 && !correctFirstShowed) ||
        //     (numberCorrect == 10 && !correctSecondShowed) ||
        //     (numberWrong == 3 && !wrongShowed)
        //   ) {
        //     dispatch(actionShowCheer(true))
        //   } else {
        //     sendAnswer()
        //   }
        //   setFeedBackResult(null)
        // }}
        showCheerScreen={() => {
          dispatch(actionShowCheer(true))
          setFeedBackResult(null)
        }}
        onContinue={() => {
          setFeedBackResult(null)
          sendAnswer()
        }}
        questionType="pair"
        show={feedBackResult !== null}
        correct={countCorrectAns === question.length}
        correctAns={correctAns}
        correctCount={countCorrectAns}
        numOfQuestion={question.length}
        type="array"
        questionId={lession?.id || 0}
        isLastQuestion={(currentTestIndex || 0) + 1 === (totalTest || 0)}
      />
    </div>
  )
}

export default Pair
