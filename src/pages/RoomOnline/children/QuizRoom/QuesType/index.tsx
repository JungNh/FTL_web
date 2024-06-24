import type { FC } from 'react'
import React from 'react'
import QuizArrangement from './QuizArrangement'
import QuizFillWord from './QuizFillWord'
import QuizFillWordMulti from './QuizFillWordMulti'
import QuizListening from './QuizListenning'
import QuizMultipleChoice from './QuizMultipleChoice'
import QuizReading from './QuizReading'
import { QuestionType } from './types'

type Props = {
  question: QuestionType
  quesIndex: number
  userAns: any
  setUserAns: (userAns: any) => void
  isAnswerShow: boolean
}

const QuesType: FC<Props> = ({
  question, quesIndex, setUserAns, userAns, isAnswerShow,
}) => (
  <div className="quiz__lession">
    {question?.type === 'multiple_choice' && (
    <QuizMultipleChoice
      question={question}
      quesIndex={quesIndex}
      setAnswer={setUserAns}
      userAns={userAns}
      isAnswerShow={isAnswerShow}
    />
      )}
    {question?.type === 'fill_word_multiple' && (
    <QuizFillWord
      question={question}
      quesIndex={quesIndex}
      isAnswerShow={isAnswerShow}
      setAnswer={setUserAns}
      answers={userAns}
    />
      )}
    {question?.type === 'fill_word_multiple_answer' && (
    <QuizFillWordMulti
      question={question}
      quesIndex={quesIndex}
      isAnswerShow={isAnswerShow}
      setAnswer={setUserAns}
      answers={userAns}
    />
      )}
    {question?.type === 'arrangement' && (
    <QuizArrangement
      question={question}
      quesIndex={quesIndex}
      isAnswerShow={isAnswerShow}
      setAnswer={setUserAns}
      answers={userAns}
    />
      )}
    {question?.type === 'reading' && (
    <QuizReading
      question={question}
      quesIndex={quesIndex}
      setAnswer={setUserAns}
      userAns={userAns}
      isAnswerShow={isAnswerShow}
    />
      )}
    {question?.type === 'listening' && (
    <QuizListening
      question={question}
      quesIndex={quesIndex}
      setAnswer={setUserAns}
      userAns={userAns}
      isAnswerShow={isAnswerShow}
    />
      )}
  </div>
)

export default QuesType
