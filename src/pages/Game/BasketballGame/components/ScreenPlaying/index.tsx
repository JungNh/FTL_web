import React, { FC, useMemo, useState } from 'react'
import { Image } from 'react-bootstrap'
import { AnswerType, AudioResourcesType, ImageResourcesType, UserAnswerType } from '../../types'
import SectionAnswers from './SectionAnswers'
import ScreenCorrect from './ScreenCorrect'
import ScreenIncorrect from './ScreenIncorrect'
import ScreenThrowCorrect from './ScreenThrow'

type Props = {
  imageResources: ImageResourcesType
  audioResources: AudioResourcesType
  dataGame: {
    quesImg: string
    quesAudio: string
    answers: { id: string | number; value: string; isCorrect: boolean }[]
    questionText: string
    description: string
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
  const [isThrowGoal, setIsThrowGoal] = useState<boolean | null>(null)

  const onContinue = () => {
    if (questionIndex <= dataGame?.length - 2 && life > 0) {
      setQuestionIndex((data) => data + 1)
      setIsQuesCorrect(null)
      setIsThrowGoal(null)
    } else {
      endGame()
    }
  }

  const currentQues = useMemo(() => dataGame[questionIndex], [dataGame, questionIndex])

  const onSelectAnswer = (ans: AnswerType) => {
    setIsThrowGoal(ans.isCorrect)
    saveUserAnswer(
      {
        isCorrect: ans.isCorrect,
        quesImage: currentQues.quesImg,
        text: ans.value,
        quesAudio: currentQues?.quesAudio
      },
      questionIndex
    )
    // setIsQuesCorrect(ans.isCorrect)
    // if (ans.isCorrect) {
    //   increaseScore(5)
    // } else {
    //   loseOneLife()
    // }
  }

  const onFinishThrow = () => {
    setIsQuesCorrect(isThrowGoal)
    if (isThrowGoal) {
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
              <Image className="question--board" src={imageResources.ico_board_text} />
              <p className="question--text px-3">Choose the correct answer</p>
            </div>
            <div className="robo__wrapper">
              <Image className="ico__robo" src={imageResources.ico_robo_pre_throw} />
              <Image className="ico__ball" src={imageResources.ico_ball_big} />
            </div>
          </section>

          <SectionAnswers
            imageResources={imageResources}
            onSelectAnswer={onSelectAnswer}
            listAnswers={currentQues?.answers}
            questionText={currentQues?.questionText}
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
      {isThrowGoal !== null && isQuesCorrect !== true && (
        <ScreenThrowCorrect
          onFinishAnimation={onFinishThrow}
          imageResources={imageResources}
          isThrowGoal={isThrowGoal}
        />
      )}
    </>
  )
}

export default ScreenPlaying
