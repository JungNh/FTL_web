import React, { FC, useMemo, useState } from 'react'
import ReactHtmlParser from 'react-html-parser'
import { Form } from 'react-bootstrap'
import _ from 'lodash'
import { convertIndexToLetter, convertUrl, htmlSpecialLetter } from '../../../utils/common'
import Button from '../../Button'
import { UserAnswerType, AnswerType, QuestionType } from './types'
import icoFlag from '../../../assets/images/icon_flag_white.png'
import ModalReport from '../ResultAns/ModalReport'
import { actionShowReport, actionShowReported, checkReport } from '../../../store/lesson/actions'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../store'
import { Image } from 'react-bootstrap'
import Sound from 'react-sound'
import ico_speaker from '../../../assets/images/ico_speaker.svg'

type Props = {
  audioUrl?: string
  readingRickText?: string
  readingTitle?: string
  question?: QuestionType
  quesIndex: number
  isAnswerShow: boolean
  userAns: UserAnswerType
  changQuestion: (data: 'prev' | 'next') => void
  submitAns: (data: UserAnswerType) => void
}

const QuestionSection: FC<Props> = ({
  readingTitle,
  readingRickText,
  question,
  isAnswerShow,
  quesIndex,
  userAns,
  changQuestion,
  submitAns
}) => {
  const convertAnsStatus = (isTrue: boolean, isShowResult: boolean) => {
    if (isShowResult && isTrue) return 'correct'
    if (isShowResult && !isTrue) return 'wrong'
    return ''
  }
  const { userInfo } = useSelector((state: RootState) => state.login)
  const [isPlayQuesAudio, setIsPlayQuesAudio] = useState(false)
  const [indexAnswerChoice, setIndexAnswerChoice] = useState(-1)
  const dispatch = useDispatch()

  const answerAllInfo = useMemo(() => {
    const listAns: AnswerType[] = []
    const listIdCorrect: number[] = []
    const listAnsCorrect: AnswerType[] = []
    const correctDes: string[] = []

    question?.answers?.forEach((item: AnswerType, index: number) => {
      const label = convertIndexToLetter(index)
      const correctValue = item?.value || ''
      listAns.push({
        ...item,
        label
      })
      if (item.isCorrect) {
        listAnsCorrect.push(item)
        listIdCorrect.push(item.id)
        correctDes.push(`${label}. ${correctValue}`)
      }
    })

    return {
      listAns,
      listIdCorrect,
      listAnsCorrect,
      correctDes,
      numOfCorrAns: listAnsCorrect?.length || 0
    }
  }, [question?.answers])

  const userLabel = useMemo(() => {
    const list: string[] = []
    question?.answers?.forEach((item: AnswerType, index: number) => {
      if (userAns?.value?.includes(item?.id)) {
        const label = convertIndexToLetter(index)
        const correctValue = item?.value || ''
        list.push(`${label}. ${correctValue}`)
      }
    })
    return list
  }, [question?.answers, userAns?.value])
  const metasQuestion = question?.metas[0] as any
  const onChosseAns = (ops: AnswerType) => {
    let isCorrect = false
    let score = 0

    // concate Value
    const value: number[] = []
    const isIncludes = userAns?.value?.includes(ops.id)

    if (answerAllInfo.numOfCorrAns >= 2) {
      if (isIncludes) {
        const newValue = userAns?.value?.filter((item) => item !== ops.id) || []
        value.push(...newValue)
      } else if (
        (!userAns?.value || Number(userAns?.value?.length) < answerAllInfo.numOfCorrAns) &&
        !isIncludes
      ) {
        value.push(...(userAns?.value || []), ops.id)
      } else {
        value.push(...(userAns?.value || []))
      }
    } else if (answerAllInfo.numOfCorrAns === 1) {
      value.push(ops.id)
    }

    const valueString: string[] = []
    answerAllInfo.listAns.forEach((item) => {
      if (value.includes(item.id)) {
        valueString.push(item.value)
      }
    })

    // Check is Correct
    const listUserCorrect = _.intersection(answerAllInfo.listIdCorrect, value)
    const correctLength = listUserCorrect.length
    if (_.isEqual(_.orderBy(value), _.orderBy(answerAllInfo.listIdCorrect))) {
      isCorrect = true
      score = 1
    } else if (correctLength > 0 && correctLength === value.length) {
      score = Math.floor((correctLength * 100) / (answerAllInfo.listIdCorrect.length || 1)) / 100
    }

    const dataSend = {
      questionId: userAns.questionId,
      isCorrect,
      value,
      valueString: valueString.join(' - '),
      score
    }
    submitAns(dataSend)
  }

  return (
    <div className="border p-3 question__section">
      <div className="px-5">
        <div>
          <p className="question__title">Chủ đề bài học</p>
          <p>{readingTitle}</p>
        </div>

        <div className="divider__horizontal my-3 richtext__container">
          {metasQuestion !== undefined ? (
            <img src={metasQuestion.value} alt="" />
          ) : (
            ReactHtmlParser(htmlSpecialLetter(readingRickText || ''))
          )}
        </div>
      </div>
      <div className="divider__horizontal my-3" />

      <div>
        <p className="question__title">Câu hỏi  {quesIndex + 1}</p>
        <p>{ReactHtmlParser(htmlSpecialLetter(question?.questionText || ''))}</p>
        {answerAllInfo?.listAns?.map((item: AnswerType, index: number) => {
          const isTrue = answerAllInfo.listIdCorrect.includes(item.id)
          const ansStatus = convertAnsStatus(isTrue, isAnswerShow)
          console.log(readingRickText)
          return (
            <>
              <Form.Check
                type={answerAllInfo.numOfCorrAns === 1 ? 'radio' : 'checkbox'}
                label={
                  <>
                    <p>
                      {convertIndexToLetter(index)}.{' '}
                      {ReactHtmlParser(htmlSpecialLetter(item?.value || ''))}
                    </p>
                    {item?.audioUrl && (
                      <>
                        <img
                          src={ico_speaker}
                          alt="sound"
                          className={`cursor-pointer small_speaker ${
                            indexAnswerChoice == index && isPlayQuesAudio ? 'playing' : ''
                          }`}
                        />
                        <Sound
                          url={String(item?.audioUrl)}
                          playStatus={
                            indexAnswerChoice == index && isPlayQuesAudio ? 'PLAYING' : 'STOPPED'
                          }
                          // playFromPosition={0}
                          onLoad={() => {
                            setIsPlayQuesAudio(true)
                          }}
                          onFinishedPlaying={() => setIsPlayQuesAudio(false)}
                          onError={() => {
                            setIsPlayQuesAudio(false)
                          }}
                        />
                      </>
                    )}
                    {item?.imageUrl && (
                      <Image
                        src={item?.imageUrl || ''}
                        className="question__images"
                        style={{
                          width: 300,
                          marginLeft: '30%',
                          objectFit: 'contain',
                          marginBottom: 30
                        }}
                      />
                    )}
                  </>
                }
                id={`answers - ${question?.id} - ${index}`}
                name={`answers - ${question?.id}`}
                key={index}
                checked={userAns?.value?.includes(item?.id) || false}
                onChange={() => {
                  onChosseAns(item)
                  setIsPlayQuesAudio(true)
                  setIndexAnswerChoice(index)
                }}
                className={`custome__radio mb-3 ${ansStatus}`}
                disabled={isAnswerShow}
              />
            </>
          )
        })}
      </div>
      {isAnswerShow && (
        <div className="explain__result">
          <div className="header__result">
            <div className="title__exp">Đáp án:</div>
            <div
              className="result__report"
              onClick={async () => {
                try {
                  const res = await checkReport(Number(question?.id), userInfo?.id)
                  if (res?.status == 200)
                    dispatch(actionShowReport({ isShow: true, questionID: Number(question?.id) }))
                  else {
                    dispatch(actionShowReported(true))
                  }
                } catch (error) {
                  console.log(error)
                }
              }}
            >
              <img src={icoFlag} className="ico__flag" alt="flag" />
              <p
                className="text_respone"
                style={{ alignSelf: 'center', display: 'contents', color: 'white', fontSize: 12 }}
              >
                BÁO CÁO
              </p>
            </div>
          </div>
          <div className="correct_exp mt-1 d-flex">
            <p className="me-2 mb-0">Đáp án chính xác là: </p>
            <span>
              {answerAllInfo.correctDes.map((item: any, index: number) => (
                <p key={index} className="mb-0">
                  {ReactHtmlParser(
                    htmlSpecialLetter(`${answerAllInfo.correctDes.length > 1 ? '- ' : ''}${item}`)
                  )}
                </p>
              ))}
            </span>
          </div>

          {userAns?.isCorrect === false && (
            <div className="wrong_exp mt-1 d-flex">
              <p className="me-2 mb-0">Câu trả lời của bạn là: </p>
              <span>
                {userLabel?.map((item: any, index: number) => (
                  <p key={index} className="mb-0">
                    {ReactHtmlParser(
                      htmlSpecialLetter(`${userLabel?.length > 1 ? '- ' : ''}${item}`)
                    )}
                  </p>
                ))}
              </span>
            </div>
          )}
          {question?.questionExplain && (
            <>
              <div className="title__exp mt-3">Giải thích đáp án</div>
              <div>{ReactHtmlParser(question?.questionExplain)}</div>
            </>
          )}
        </div>
      )}
      <div className="d-flex justify-content-center px-5 button__direct">
        <Button.Solid
          // color="gray"
          className="my-3 mx-3 prev__button text-uppercase fw-bold"
          content="Trước"
          onClick={() => changQuestion('prev')}
          disabled={quesIndex === 0}
        />
        <Button.Solid
          className="my-3 mx-3 text-uppercase fw-bold"
          content="Tiếp theo"
          onClick={() => changQuestion('next')}
        />
      </div>
    </div>
  )
}

export default QuestionSection
