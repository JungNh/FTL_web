import React, { FC, useMemo, useState } from 'react'
import {
  AnswerType, AudioResourcesType, ImageResourcesType, UserAnswerType,
} from '../../types'
import SectionAnswers from './SectionAnswers'
import ScreenCorrect from './ScreenCorrect'
import ScreenIncorrect from './ScreenIncorrect'

type Props = {
  imageResources: ImageResourcesType
  audioResources: AudioResourcesType
  dataGame: {
    quesImg: string
    quesAudio: string
    answers: string[]
    correct: string
  }[]
  increaseScore: (plusPoint: number) => void
  loseOneLife: () => void
  endGame: () => void
  life: number
  saveUserAnswer: (answer: UserAnswerType, questionIndex: number) => void
  showDecor: (isShow: boolean) => void
}

const ScreenPlaying: FC<Props> = ({
  imageResources,
  dataGame,
  audioResources,
  loseOneLife,
  increaseScore,
  endGame,
  life,
  saveUserAnswer,
  showDecor,
}) => {
  const [isQuesCorrect, setIsQuesCorrect] = useState<boolean | null>(null)
  const [questionIndex, setQuestionIndex] = useState<number>(0)

  const onContinue = () => {
    if (questionIndex <= dataGame?.length - 2 && life > 0) {
      setQuestionIndex((data) => data + 1)
      setIsQuesCorrect(null)
      showDecor(true)
    } else {
      endGame()
    }
  }

  const currentQues = useMemo(() => dataGame[questionIndex], [dataGame, questionIndex])

  const onSubmitAnswer = (ans: AnswerType) => {
    setIsQuesCorrect(ans.isCorrect)
    if (ans.isCorrect) showDecor(false) // hide 2 mountain 2 side
    saveUserAnswer(
      {
        isCorrect: ans.isCorrect,
        quesImage: currentQues.quesImg,
        text: ans.value,
        quesAudio: currentQues?.quesAudio,
      },
      questionIndex
    )
    if (ans.isCorrect) {
      increaseScore(Math.round(100 / dataGame?.length))
    } else {
      loseOneLife()
    }
  }

  return (
    <>
      {isQuesCorrect !== true && (
        <div className="screen__playing">
          <SectionAnswers
            imageResources={imageResources}
            onSubmitAnswer={onSubmitAnswer}
            listAnswers={currentQues?.answers}
            correctAns={currentQues?.correct}
          />
        </div>
      )}

      {isQuesCorrect === true && (
        <ScreenCorrect
          onContinue={onContinue}
          imageResources={imageResources}
          audioResources={audioResources}
          currentQues={currentQues}
          porintQuestion={Math.round(100 / dataGame?.length)}
        />
      )}
      {isQuesCorrect === false && (
        <ScreenIncorrect
          imageResources={imageResources}
          audioResources={audioResources}
          onEnded={onContinue}
        />
      )}
    </>
  )
}

export default ScreenPlaying
