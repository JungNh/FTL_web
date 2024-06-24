import { Row, Col, Modal, Image } from 'react-bootstrap'
import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import _ from 'lodash'
import Button from '../../../Button'
import NavbarTest from '../../../NavbarTest'
import ResultAns from '../../ResultAns'
import backArrow from '../../../../assets/images/ico_arrowLeft-blue.svg'
import { convertUrl, randomPosition } from '../../../../utils/common'
import {
  actionAddCorrect,
  actionAddWrong,
  actionCheerWrong,
  actionFirstCheerCorrect,
  actionSecondCheerCorrect,
  actionShowCheer
} from '../../../../store/lesson/actions'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../../store'
import Cheering from '../../../Cheering'

type Props = {
  lession?: any
  onNextLession: (data: any) => void
  currentTestIndex?: number
  totalTest?: number
  backCourse: () => void
}

const FillWord: React.FC<Props> = ({
  lession,
  onNextLession,
  currentTestIndex,
  totalTest,
  backCourse
}) => {
  const [feedBackResult, setFeedBackResult] = useState<boolean | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [currentEdit, setCurrentEdit] = useState<number | null>(null)
  const dispatch = useDispatch()
  const [questionList, setQuestionList] = useState([])
  const [answerList, setAnswerList] = useState([])
  const [userAns, setUserAns] = useState<string[]>([])
  const [score, setScore] = useState(0)
  const {
    numberCorrect,
    numberWrong,
    correctFirstShowed,
    correctSecondShowed,
    wrongShowed,
    showCheer
  } = useSelector((state: RootState) => state.lesson)

  useEffect(() => {
    const listQuestion = JSON.parse(lession?.answers?.[0]?.value || '')
    setQuestionList(listQuestion)
    const newList = randomPosition(listQuestion.slice() || [])
    setAnswerList(newList)
  }, [lession?.answers])

  const onCheck = () => {
    let isCorrect = true
    let scoreTemp = 0
    questionList?.forEach((item: any, index: number) => {
      if (item.value !== userAns[index]) {
        isCorrect = false
      } else {
        scoreTemp++
      }
    })
    setScore(scoreTemp)
    if (isCorrect) {
      setFeedBackResult(true)
      dispatch(actionAddCorrect())
    } else {
      setFeedBackResult(false)
      dispatch(actionAddWrong())
    }
  }
  const sendAnswer = async () => {
    const listAns: any = lession?.answers
    const objAns: any = listAns[0]
    onNextLession({
      questionId: objAns?.questionId,
      result: feedBackResult || false,
      answer: '',
      score: feedBackResult ? 1 : 0,
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
          Swal.fire('Gợi ý !', lession?.hint, 'info')
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
            const listAns: any = lession?.answers
            const objAns: any = listAns[0]
            onNextLession({
              questionId: objAns?.questionId,
              result: false,
              answer: '',
              score: 0,
              duration: 0
            })
          }
          checkShowCheer()
          dispatch(actionAddWrong())
        }
        return ''
      })
      .catch((error) => console.error(error))
  }

  const onClickSpan = (index: number) => {
    if (feedBackResult === null) {
      setShowModal(true)
      setCurrentEdit(index)
    }
  }

  const onChangeAns = (ans: string) => {
    const newAns = [...userAns]
    if (currentEdit !== null) {
      newAns[currentEdit] = ans
      setUserAns(newAns)
      setCurrentEdit(null)
      setShowModal(false)
    }
  }

  const checkShowCheer = () => {
    if (numberCorrect == 5) dispatch(actionFirstCheerCorrect())
    if (numberCorrect == 10) dispatch(actionSecondCheerCorrect())
    if (numberWrong == 3) dispatch(actionCheerWrong())
  }

  const renderBody = () => {
    return (
      <div className="bg_renderBody">
        <p className="title__lession">{lession?.questionText}</p>
        <div className="question__holder">
          {questionList?.map((item: any, index: number) => (
            <Row className="question__row mb-3" key={item?.key}>
              <Col xs={6} className="text-center">
                {item?.key || ''}
              </Col>
              <Col xs={6}>
                <div
                  className="div__with__text cursor-pointer"
                  onClick={() => {
                    onClickSpan(index)
                  }}
                >
                  {userAns[index]}
                </div>
              </Col>
            </Row>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="lession__fillPic">
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
        // onCheck={onCheck}
        onCheck={() => {
          if (showCheer) {
            dispatch(actionShowCheer(false))
            sendAnswer()
            checkShowCheer()
          } else {
            onCheck()
          }
        }}
        onHint={onHint}
        onSkip={onSkip}
        isDisabled={_.isEmpty(userAns) && !showCheer}
      />

      <ResultAns
        showCheerScreen={() => {
          dispatch(actionShowCheer(true))
          setFeedBackResult(null)
        }}
        onContinue={() => {
          setFeedBackResult(null)
          sendAnswer()
        }}
        show={feedBackResult !== null}
        correct={!!feedBackResult}
        questionId={lession?.id || 0}
        correctCount={score}
        numOfQuestion={questionList.length}
        correctAns={questionList}
        questionType="pair"
        type="array"
        isLastQuestion={(currentTestIndex || 0) + 1 === (totalTest || 0)}
      />

      <Modal size="lg" show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Body>
          <Row>
            {answerList?.map((item: any) => (
              <Col
                key={item?.key}
                xs={3}
                className="mb-3 cursor-pointer"
                onClick={() => onChangeAns(item?.value)}
              >
                <div className="card__question">
                  <Image src={convertUrl(item?.imageUrl, 'image')} />
                  <p className="fw-bold image__text">{item?.value}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default FillWord
