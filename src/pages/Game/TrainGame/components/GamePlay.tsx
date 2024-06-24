import React, {
  FC, useCallback, useEffect, useState,
} from 'react'
import Sound from 'react-sound'
import TweenOne from 'rc-tween-one'
import Incorrect from './Incorrect'
import Correct from './Correct'
import { AudioResourcesType, ImageResourcesType } from '../types'

type UserAnsType = {
  src: string
  sound: string
  box: string
  status: 'correct' | 'wrong' | 'not-answer'
  correctText: string
}

type DataQues = {
  answers: string[]
  correct: string
  sound: string
  correctText: string
}

type Props = {
  detailQues: DataQues
  userAns: UserAnsType
  setUserAns: (newUserAns: UserAnsType, index: number) => void
  quesIndex: number
  nextQues: (value: number) => void
  life: number
  setLife: (remainLife: number) => void
  onEndGame: () => void
  quesLength: number
  quesId: number
  setIsScreenCorrect: (isShow: boolean) => void
  updateUnitPercent: (isDone: boolean) => void
  imageResources: ImageResourcesType
  audioResources: AudioResourcesType
}

const SectionGame: FC<Props> = ({
  detailQues,
  setUserAns,
  userAns,
  quesIndex,
  life,
  setLife,
  onEndGame,
  nextQues,
  setIsScreenCorrect,
  imageResources,
  audioResources,
  quesLength,
  updateUnitPercent,
}) => {
  const [screen, setScreen] = useState<'correct' | 'wrong' | 'question'>('question')
  const [soundEffect, setSoundEffect] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  useEffect(() => {
    setTimeout(() => {
      setSoundEffect(true)
      setIsChecking(false)
    }, 1000)
  }, [])

  useEffect(() => {
    if (screen === 'correct') {
      setIsScreenCorrect(true)
    } else {
      setIsScreenCorrect(false)
    }
  }, [screen, setIsScreenCorrect])

  const onNextQuestion = (prevCorr: boolean) => {
    if (life <= 1 && !prevCorr) {
      onEndGame()
      if (quesIndex + 1 < quesLength) {
        updateUnitPercent(true)
      }
    }
    if (!prevCorr) setLife(life - 1)
    nextQues(quesIndex + 1)
    setScreen('question')
    setSoundEffect(false)
    setTimeout(() => {
      setSoundEffect(true)
      setIsChecking(false)
    }, 1000)
  }

  const checkResult = async (src: string, boxType: string) => {
    setIsChecking(true)
    setSoundEffect(false)

    if (src === detailQues?.correct) {
      const newAns: UserAnsType = {
        src,
        sound: detailQues?.sound,
        box: boxType,
        status: 'correct',
        correctText: detailQues?.correctText,
      }
      setUserAns(newAns, quesIndex)
      setTimeout(() => {
        setScreen('correct')
      }, 500)
    } else {
      setScreen('wrong')
      const newAns: UserAnsType = {
        src,
        sound: detailQues?.sound,
        box: boxType,
        status: 'wrong',
        correctText: detailQues?.correctText,
      }
      setUserAns(newAns, quesIndex)
    }
  }

  const findBox = useCallback(
    (boxType: 'green' | 'blue' | 'red' | number, returnType: 'src' | 'type') => {
      if (returnType === 'src') {
        switch (boxType) {
          case 0:
          case 'green':
            return imageResources?.ico_box_green
          case 1:
          case 'blue':
            return imageResources?.ico_box_blue
          case 2:
          case 'red':
            return imageResources?.ico_box_red
          default:
            return imageResources?.ico_box_red
        }
      }
      if (returnType === 'type') {
        switch (boxType) {
          case 0:
            return 'green'
          case 1:
            return 'blue'
          case 2:
            return 'red'
          default:
            return 'red'
        }
      }
    },
    [imageResources]
  )

  const animationBox = (index: number) => [
    {
      opacity: 0,
      duration: 0,
      y: -80,
      scale: 1.1,
    },
    {
      opacity: 1,
      delay: 100 * index,
      y: 0,
      scale: 1,
      duration: 500,
    },
  ]

  const onWrongDone = () => {
    onNextQuestion(false)
  }

  return (
    <>
      <div className={`w-100 container-game ${screen === 'correct' ? 'blur' : ''}`}>
        {userAns?.status === 'not-answer' && (
          <>
            <div className="game-answer-train">
              {detailQues?.answers?.map((item: any, index: number) => (
                <div className="game-answer-train-inside" key={item}>
                  <TweenOne animation={animationBox(index)} repeat={0} style={{ opacity: 0 }}>
                    <div
                      className="game-answer-container game-button answer-animation"
                      onClick={() => {
                        if (!isChecking) checkResult(item, findBox(index, 'type') || '')
                      }}
                    >
                      <img
                        width={300}
                        src={findBox(index, 'src')}
                        alt="answer1"
                        className="user-drag--none"
                      />
                      <img
                        width={150}
                        src={item}
                        alt="answer1"
                        className="number-in-answer user-drag--none"
                      />
                    </div>
                  </TweenOne>
                </div>
              ))}
            </div>
            <div className="sound-game-train">
              <img
                width={100}
                src={imageResources?.ico_sound}
                onClick={() => setSoundEffect(true)}
                alt="sound"
                className="game-button user-drag--none"
              />
            </div>
            <Sound
              url={detailQues?.sound || ''}
              playStatus={soundEffect ? 'PLAYING' : 'STOPPED'}
              onFinishedPlaying={() => setSoundEffect(false)}
            />
          </>
        )}
      </div>
      {screen === 'correct' && (
        <Correct
          imageResources={imageResources}
          audioResources={audioResources}
          detailQues={detailQues}
          onNextQuestion={onNextQuestion}
          quesLength={quesLength}
        />
      )}
      {screen === 'wrong' && (
        <Incorrect
          imageResources={imageResources}
          audioResources={audioResources}
          onEnded={() => onWrongDone()}
        />
      )}
    </>
  )
}

export default SectionGame
