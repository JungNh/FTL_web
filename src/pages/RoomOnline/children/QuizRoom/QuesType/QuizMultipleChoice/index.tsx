import React, { FC } from 'react'
import { QuestionType } from '../types'
import MultiChoiceText from './MultiChoice'

type Props = {
  question: QuestionType
  quesIndex: number
  setAnswer: (answers: any) => void
  userAns: any
  isAnswerShow: boolean
}
const MultipleChoice: FC<Props> = ({
  question, setAnswer, userAns, isAnswerShow, quesIndex,
}) => {
  const checkAns = (answer: any) => {
    setAnswer({
      ...answer,
      questionId: question?.id,
    })
  }

  return (
    <div>
      <MultiChoiceText
        question={question}
        quesIndex={quesIndex}
        userAns={userAns}
        onChooseAns={(answer: any) => checkAns(answer)}
        isAnswerShow={isAnswerShow}
      />
    </div>
  )
}

export default MultipleChoice
