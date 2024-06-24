import React, { useMemo } from 'react'
import { Form } from 'react-bootstrap'
import ReactHtmlParser from 'react-html-parser'
import _ from 'lodash'
import { convertIndexToLetter, htmlSpecialLetter } from '../../../../../utils/common'
import { AnswerType, UserAnswerType } from './types'

type Props = {
  question?: {
    id?: number
    questionTitle?: string
    questionText?: string
    questionExplain?: string
    answers?: any[]
    audioUrl?: string
  }
  quesIndex: number
  userAns: UserAnswerType
  isAnswerShow: boolean
  setAnswer: (answers: any) => void
}

const QuizListening: React.FC<Props> = ({
  question,
  setAnswer,
  userAns,
  isAnswerShow,
  quesIndex,
}) => {
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
        label,
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
      numOfCorrAns: listAnsCorrect?.length || 0,
    }
  }, [question?.answers])

  const convertAnsStatus = (isTrue: boolean, isShowResult: boolean) => {
    if (isShowResult && isTrue) return 'correct'
    if (isShowResult && !isTrue) return 'wrong'
    return ''
  }

  const onChosseAns = (ops: AnswerType) => {
    let isCorrect = false
    let score = 0

    // concate Value
    const value: (number | string)[] = []
    const isIncludes = userAns?.value?.includes(ops.id)

    if (answerAllInfo.numOfCorrAns >= 2) {
      if (isIncludes) {
        const newValue = userAns?.value?.filter((item) => item !== ops.id) || []
        value.push(...newValue)
      } else if (
        (!userAns?.value || Number(userAns?.value?.length) < answerAllInfo.numOfCorrAns)
        && !isIncludes
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

    // userAns label
    const desUserAns: string[] = []
    question?.answers?.forEach((item: AnswerType, index: number) => {
      if (value?.includes(item?.id)) {
        desUserAns.push(`${convertIndexToLetter(index)}. ${item?.value || ''}`)
      }
    })
    const dataSend = {
      questionId: question?.id,
      isCorrect,
      value,
      valueString: valueString.join(' - '),
      score,
      desCorrectAns: answerAllInfo.correctDes,
      desUserAns,
    }
    setAnswer(dataSend)
  }
  return (
    <div className="lession__reading pb-3" style={{ paddingTop: 0 }}>
      <div>
        <div className="p-3 question__section">
          <div>
            <p className="question__title">
              Câu hỏi 
              {quesIndex + 1}
            </p>
            <p>{ReactHtmlParser(htmlSpecialLetter(question?.questionText || ''))}</p>
            {answerAllInfo?.listAns?.map((item: AnswerType, index: number) => {
              const isTrue = answerAllInfo.listIdCorrect.includes(item.id)
              const ansStatus = convertAnsStatus(isTrue, isAnswerShow)

              return (
                <Form.Check
                  type={answerAllInfo.numOfCorrAns === 1 ? 'radio' : 'checkbox'}
                  label={`${convertIndexToLetter(index)}. ${ReactHtmlParser(
                    htmlSpecialLetter(item?.value || '')
                  )}`}
                  id={`answers - ${question?.id} - ${index}`}
                  name={`answers - ${question?.id}`}
                  key={index}
                  checked={userAns?.value?.includes(item?.id) || false}
                  onChange={() => onChosseAns(item)}
                  className={`custome__radio mb-3 ${ansStatus}`}
                  disabled={isAnswerShow}
                />
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuizListening
