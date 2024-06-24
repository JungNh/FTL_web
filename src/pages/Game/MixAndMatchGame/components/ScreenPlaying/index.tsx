import React, { FC, useMemo, useState } from 'react'
import { Image } from 'react-bootstrap'
import { AnswerType, AudioResourcesType, ImageResourcesType, UserAnswerType } from '../../types'
import SectionAnswers from './SectionAnswers'
import ScreenCorrect from './ScreenCorrect'
import ScreenIncorrect from './ScreenIncorrect'

type Props = {
  imageResources: ImageResourcesType
  audioResources: AudioResourcesType
  dataGame: {
    quesImg: string
    quesAudio: string
    answers: { id: string | number; value: string; isCorrect: boolean }[]
    questionText: string
  }[]
  increaseScore: (plusPoint: number) => void
  loseOneLife: () => void
  endGame: () => void
  life: number
  saveUserAnswer: (answer: UserAnswerType, questionIndex: number) => void
}

const ScreenPlaying: FC<Props> = ({
  imageResources,
  dataGame,
  audioResources,
  loseOneLife,
  increaseScore,
  endGame,
  life,
  saveUserAnswer
}) => {
  const [isQuesCorrect, setIsQuesCorrect] = useState<boolean | null>(null)
  const [questionIndex, setQuestionIndex] = useState<number>(0)

  const onContinue = () => {
    if (questionIndex <= dataGame?.length - 2 && life > 0) {
      setQuestionIndex((data) => data + 1)
      setIsQuesCorrect(null)
    } else {
      endGame()
    }
  }

  const currentQues = useMemo(() => dataGame[questionIndex], [dataGame, questionIndex])

  const onSelectAnswer = (ans: AnswerType) => {
    setIsQuesCorrect(ans.isCorrect)
    saveUserAnswer(
      {
        isCorrect: ans.isCorrect,
        quesImage: currentQues.quesImg,
        text: ans.value,
        quesAudio: currentQues?.quesAudio
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
          <section className="question__container">
            <div className="question--wrapper">
              <Image className="question--board" src={imageResources.ico_board_question} />
              <Image className="question--image" src={currentQues?.quesImg} />
              <p className="question--text">{currentQues?.questionText}</p>
            </div>
          </section>

          <SectionAnswers
            imageResources={imageResources}
            onSelectAnswer={onSelectAnswer}
            listAnswers={currentQues?.answers}
          />
        </div>
      )}

      {isQuesCorrect === true && (
        <ScreenCorrect
          onContinue={onContinue}
          imageResources={imageResources}
          audioResources={audioResources}
          currentQues={currentQues}
          pointQuestion={Math.round(100 / dataGame?.length)}
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
