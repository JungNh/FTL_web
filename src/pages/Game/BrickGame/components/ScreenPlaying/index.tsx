import React, { FC, useMemo, useState } from 'react'
import { Image } from 'react-bootstrap'
import TweenOne from 'rc-tween-one'
import { AnswerType, AudioResourcesType, ImageResourcesType, UserAnswerType } from '../../types'
import SectionBrick from './SectionBrick'
import SectionScoreLadder from './SectionScoreLadder'
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
  const [breakTimes, setBreakTimes] = useState<number>(0)
  const [isBigHammerShow, setIsBigHammerShow] = useState(true)
  const [isQuesCorrect, setIsQuesCorrect] = useState<boolean | null>(null)
  const [questionIndex, setQuestionIndex] = useState<number>(0)

  const maxQuestionScore = useMemo(() => {
    switch (breakTimes) {
      case 0:
      case 1:
        return Math.round(100 / dataGame?.length)
      case 2:
        return Math.round(((100 / dataGame?.length) * 70) / 100)
      case 3:
        return Math.round(((100 / dataGame?.length) * 40) / 100)
      case 4:
        return Math.round(((100 / dataGame?.length) * 40) / 100)
      default:
        return Math.round(100 / dataGame?.length)
    }
  }, [breakTimes, dataGame?.length])

  const aniHammerOut = [
    {
      duration: 0,
      delay: 0,
      opacity: 1
    },
    {
      duration: 200,
      y: -200,
      opacity: 0
    }
  ]

  const aniHammerIn = [
    {
      duration: 0,
      delay: 0,
      opacity: 0,
      y: -200
    },
    {
      duration: 200,
      rotate: 0,
      y: 0,
      opacity: 1
    }
  ]

  const onContinue = () => {
    if (questionIndex <= dataGame?.length - 2 && life > 0) {
      setQuestionIndex((data) => data + 1)
      setIsQuesCorrect(null)
      setBreakTimes(0)
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
      increaseScore(maxQuestionScore)
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
              <p className="question--text">What’s behind the wall?</p>
            </div>
            <div className="hammer__wrapper">
              <TweenOne animation={isBigHammerShow ? aniHammerIn : aniHammerOut}>
                <Image className="ico__hammer" src={imageResources.ico_hammer} />
              </TweenOne>
            </div>
          </section>

          <SectionBrick
            imageResources={imageResources}
            audioResources={audioResources}
            canBreak={breakTimes < 4}
            setBreakTimes={() => setBreakTimes((times: number) => times + 1)}
            setIsBigHammerShow={setIsBigHammerShow}
            quesImg={currentQues?.quesImg || ''}
            quesIndex={questionIndex}
          />

          <SectionScoreLadder
            imageResources={imageResources}
            maxQuestionScore={maxQuestionScore}
            questionLength={dataGame?.length}
          />

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
          maxQuestionScore={maxQuestionScore}
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
