import React, { FC, useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import _ from 'lodash'
import { useTimer } from 'react-timer-hook'
import { useDispatch } from 'react-redux'
import { differenceInSeconds } from 'date-fns'
import Swal from 'sweetalert2'
import Button from '../../../../../components/Button'
import ico_list from '../../../../../assets/images/ico_list.svg'
import ico_clock from '../../../../../assets/images/ico_clock-blue.svg'
import { actionSubmitResults } from '../../../../../store/roomOnline/actions'
import { numberTwoDigits, openError, openWarning } from '../../../../../utils/common'
import { QuestionType, UserAnswerType } from './types'
import { hideLoading, showLoading } from '../../../../../store/login/actions'

type Props = {
  questions: QuestionType[]
  active: number
  onChangeQuestion: (index: number) => void
  answers: UserAnswerType[]
  disabled: boolean
  duration: number | null
  isAnswerShow: boolean
  examId: number
  changeScreen: (totalDuration?: number) => void
  doingTime: { start: string | null; duration: number | null }
}

const SideBar: FC<Props> = ({
  questions,
  active,
  onChangeQuestion,
  answers,
  disabled,
  duration,
  isAnswerShow,
  examId,
  changeScreen,
  doingTime,
}) => {
  const dispatch = useDispatch()
  const [isTimeOut, setIsTimeOut] = useState(false)

  const sendAnswer = async () => {
    dispatch(showLoading())
    let totalDuration = doingTime.start
      ? differenceInSeconds(new Date(), new Date(doingTime.start))
      : 0
    if (duration && totalDuration >= (duration || 0)) totalDuration = duration
    const score = _.sumBy(answers, 'score') || 0
    const response: any = await dispatch(
      actionSubmitResults({
        examId,
        score,
      })
    )
    dispatch(hideLoading())
    if (response?.status !== 200) {
      openError('Đã có lỗi xảy ra trong quá trình nộp bài')
    }
    changeScreen(totalDuration)
  }

  const {
    seconds, minutes, restart, pause,
  } = useTimer({
    expiryTimestamp: new Date(),
    onExpire: () => {
      if (!isAnswerShow) {
        setIsTimeOut(true)
        Swal.fire({
          icon: 'info',
          title: 'Đã hết thời gian làm bài.',
          html: 'Bạn vui lòng nộp bài để kết thúc bài học.',
          confirmButtonText: 'Nộp bài',
          allowOutsideClick: false,
        })
          .then(() => sendAnswer())
          .catch(() => {})
      }
    },
  })

  useEffect(() => {
    if (duration && !isAnswerShow) {
      const date = new Date()
      date.setSeconds(date.getSeconds() + duration)
      restart(date)
    } else {
      pause()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration, isAnswerShow])

  const handleClickSubmit = () => {
    const listUnFinished: any = []
    answers.forEach((item: any, index: number) => {
      if (!item?.value) listUnFinished.push(index + 1)
    })
    if (duration !== 0 && !isTimeOut) {
      if (!_.isEmpty(listUnFinished)) {
        openWarning(
          {
            header: `Bạn chưa hoàn thành các câu: ${listUnFinished.join(', ')}`,
            title: 'Bạn có muốn nộp bài không?',
            cancelButtonText: 'LÀM TIẾP',
            confirmButtonText: 'NỘP BÀI',
          },
          () => {
            pause()
            sendAnswer()
          },
          () => {}
        )
      } else {
        pause()
        sendAnswer()
      }
    } else {
      pause()
      sendAnswer()
    }
  }

  return (
    <div>
      {!isAnswerShow && duration ? (
        <div className="d-flex justify-content-center align-items-center mb-4">
          <img src={ico_clock} alt="ico" style={{ height: '2rem' }} />
          <h3 className="question__title text-center mb-0 mx-3">
            Thời gian còn lại:
            {' '}
            {numberTwoDigits(minutes)}
            :
            {numberTwoDigits(seconds)}
          </h3>
        </div>
      ) : (
        ''
      )}
      {isAnswerShow && (
        <Row>
          <Col xs={12}>
            <div className="result__show">
              <h3 className="title__show mb-3 mx-2">Kết quả bài làm</h3>
              <p className="fw-bold mx-2 mb-1">
                Số câu đúng:
                {' '}
                {_.filter(answers, 'isCorrect').length}
              </p>
              <p className="fw-bold mx-2 mb-1">
                Số câu sai:
                {' '}
                {_.filter(answers, (item: any) => !item?.isCorrect).length}
              </p>
              <p className="fw-bold mx-2 mb-1">
                Đáp án đúng:
                {' '}
                <span className="sub__green">màu xanh</span>
              </p>
              <p className="fw-bold mx-2 mb-1">
                Đáp án sai:
                {' '}
                <span className="sub__red">màu đỏ</span>
              </p>
              <p className="fw-bold mx-2 mb-1">Chưa trả lời: màu trắng</p>
            </div>
          </Col>
        </Row>
      )}
      <div className="side__bar">
        <Row>
          <Col xs={12}>
            <div className="d-flex justify-content-center align-items-center mb-5">
              <img src={ico_list} alt="ico" />
              <h3 className="side__bar--title mb-0 mx-3">Danh sách câu hỏi</h3>
            </div>
          </Col>

          {questions?.map((item: any, index: number) => (
            <Col xs={2} key={index}>
              <button
                disabled={disabled}
                onClick={() => onChangeQuestion(index)}
                className={`side__bar--item mb-3
                ${active === index ? 'active' : ''}
                ${!isAnswerShow && answers[index]?.value ? 'has-answer' : ''}
                ${isAnswerShow ? 'done' : ''}
                ${
                  isAnswerShow && answers[index]?.value
                    ? answers[index].isCorrect
                      ? 'correct'
                      : 'error'
                    : 'no-ans'
                }
              `}
                type="button"
              >
                {index + 1}
              </button>
            </Col>
          ))}
        </Row>
      </div>
      {!isAnswerShow && (
        <Button.Solid
          className="my-3"
          content="Nộp bài"
          onClick={handleClickSubmit}
          disabled={isAnswerShow}
        />
      )}
    </div>
  )
}

export default SideBar
