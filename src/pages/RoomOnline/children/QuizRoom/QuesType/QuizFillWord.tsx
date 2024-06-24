import React, { useState, useEffect } from 'react'
import _ from 'lodash'
import Input from '../../../../../components/Input'
import { QuestionType } from './types'
import { cleanSentence } from '../../../../../utils/common'

type Props = {
  question: QuestionType
  quesIndex: number
  setAnswer: (answers: any) => void
  answers: { isCorrect: boolean; value: string }
  isAnswerShow: boolean
}

const QuizFillWord: React.FC<Props> = ({
  question,
  quesIndex,
  setAnswer,
  answers,
  isAnswerShow,
}) => {
  const [userAns, setUserAns] = useState('')
  const [correctAns, setCorrectAns] = useState<string[]>([])

  useEffect(() => {
    if (!_.isEmpty(question?.answers)) {
      document.getElementById('inputAns')?.focus()
      setUserAns(answers?.value?.[0] || '')
      const arrAnswer: any = question?.answers
      const objCorrect: any = !_.isEmpty(arrAnswer) ? arrAnswer[0] : {}
      const valueAns: any = !_.isEmpty(objCorrect) ? JSON.parse(objCorrect?.value) : []
      if (!_.isEmpty(valueAns)) {
        if (question?.type === 'fill_word_multiple_answer') {
          setCorrectAns(valueAns.map((i: string) => i.trim()))
        }
        if (question?.type === 'fill_word_multiple') {
          setCorrectAns(valueAns.map((i: any) => i?.value?.trim()))
        }
      } else {
        setCorrectAns([])
      }
    }
  }, [answers?.value, question])

  const submitAnswer = () => {
    const listCorrectAns = correctAns.map((i) => cleanSentence(i))
    const isCorrect = listCorrectAns.includes(cleanSentence(userAns))
    setAnswer({
      questionId: question.id,
      isCorrect,
      value: userAns ? [userAns] : [],
      valueString: userAns,
      score: isCorrect ? 1 : 0,
      desCorrectAns: correctAns.map((i) => cleanSentence(i || '')).join('/ '),
      desUserAns: cleanSentence(userAns || ''),
    })
  }

  return (
    <div className="lession__fillWord pb-5" style={{ paddingTop: 0 }}>
      <p className="question__title">
        Câu hỏi 
        {quesIndex + 1}
      </p>
      <p className="subTitle__lession">{question?.questionTitle}</p>
      <p className="title__lession mb-5">{question?.questionText}</p>
      <div className="answers__section d-flex align-items-center">
        <Input.TextArea
          id="inputAns"
          value={userAns}
          className="resize-none"
          onChange={(data: string) => setUserAns(data)}
          placeholder="Điền câu trả lời vào đây"
          rows={3}
          maxLength={1000}
          autoFocus
          onBlur={() => {
            if (userAns) {
              submitAnswer()
            }
          }}
          disabled={isAnswerShow}
        />
      </div>
    </div>
  )
}

export default QuizFillWord
