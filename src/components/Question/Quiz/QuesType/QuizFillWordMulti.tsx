import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react'
import _ from 'lodash'
import { cleanSentence } from '../../../../utils/common'
import { QuestionType } from './types'
import SubTitleQues from '../SubTitleQues'

type Props = {
  question: QuestionType
  quesIndex: number
  setAnswer: (answers: any) => void
  answers: { isCorrect: boolean; value: string }
  isAnswerShow: boolean
}

const QuizFillWordMulti: React.FC<Props> = ({
  question,
  quesIndex,
  setAnswer,
  answers,
  isAnswerShow,
}) => {
  const [userAns, setUserAns] = useState<any[]>([])
  const [listCorrectAns, setListCorrectAns] = useState<any[]>([])

  useEffect(() => {
    if (!_.isEmpty(question?.answers)) {
      const convertUserAns = answers?.value ? JSON.parse(answers.value) : []
      setUserAns(convertUserAns)
      const newArr: any = question?.answers?.map((item: any) => JSON.parse(item.value))
      if (!_.isEmpty(newArr)) {
        setListCorrectAns(newArr)
      } else {
        setListCorrectAns([])
      }
    }
  }, [answers, question])
  useEffect(() => {
    if (!answers?.value) {
      const changeQues: string = (question?.questionText || '').replaceAll(
        '_____',
        '/---/_____/---/'
      )
      const questionConvert = changeQues.split('/---/')
      const preAnswers: any = []
      questionConvert.forEach((item: string, index: number) => {
        if (item === '_____') preAnswers[index] = ''
        setUserAns(preAnswers)
      })
    }
  }, [answers?.value, question?.questionText])

  const submitAnswer = useCallback(() => {
    let isCorrect = true
    let score = 0
    userAns
      ?.filter((item) => item !== null)
      .forEach((ans: string, index: number) => {
        if (_.isEmpty(listCorrectAns) || !listCorrectAns[index]?.includes(cleanSentence(ans))) {
          isCorrect = false
        } else {
          score += 1
        }
      })

    setAnswer({
      isCorrect,
      value: JSON.stringify(userAns),
      valueString: _.compact(userAns).join('; '),
      questionId: question.id,
      score: Math.floor((score * 100) / (listCorrectAns.length || 1)) / 100,
      desCorrectAns: _.compact(listCorrectAns.map((item: string[]) => item.join('/ '))),
      desUserAns: _.compact(userAns),
    })
  }, [listCorrectAns, question.id, setAnswer, userAns])

  const convertQuestion = useMemo(() => {
    const changeQues: string = (question?.questionText || '').replaceAll('_____', '/---/_____/---/')
    const questionConvert = changeQues.split('/---/')
    return questionConvert.map((item: string, index: number) => {
      if (item === '_____') {
        return (
          <input
            key={index}
            maxLength={20}
            value={userAns[index]}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const newData: any[] = userAns.slice()
              newData[index] = e.target.value
              setUserAns(newData)
            }}
            onBlur={() => submitAnswer()}
            disabled={isAnswerShow}
          />
        )
      }
      return <span key={index}>{item}</span>
    })
  }, [isAnswerShow, question?.questionText, submitAnswer, userAns])

  return (
    <div className="lession__fillWordMulti pb-5" style={{ paddingTop: 0 }}>
      <p className="question__title">
        Câu hỏi 
        {' '}
        {quesIndex + 1}
      </p>
      <SubTitleQues question={question} />
      <p className="subTitle__lession">{question?.questionTitle}</p>
      <div className="question__holder">{convertQuestion}</div>
    </div>
  )
}

export default QuizFillWordMulti
