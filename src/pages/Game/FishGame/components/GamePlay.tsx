import React, {
  FC, useEffect, useMemo, useState,
} from 'react'
import { Row, Col } from 'react-bootstrap'
import Sound from 'react-sound'
import TweenOne from 'rc-tween-one'
import Swal from 'sweetalert2'
import Incorrect from './IncorrectPopup'
import Correct from './CorrectScreen'
// import { getUrlFish } from '../../../../utils/common'
import Bubble from '../Bubble'
import { AudioResourcesType, ImageResourcesType } from '../types'

type ScoreType = {
  answers: { value: string; src: string }[]
  correct?: string
  sound?: string
  fish?: string
  point?: boolean
}[]

type Props = {
  dataGame: {
    answers: { value: string; src: string }[]
    correct: string
    sound: string
    correctSrc: string
    background: string
  }
  imageResources: ImageResourcesType
  audioResources: AudioResourcesType
  backToWelComeScreen: () => void
  life: number
  setLife: (value: number) => void
  score: ScoreType
  setScore: (value: ScoreType) => void
  question: number
  showTimer: any
  questionLength: number
  setQuestion: (value: number) => void
  getUrlFish: (index?: string) => string
}

const GamePlay: FC<Props> = ({
  backToWelComeScreen,
  life,
  setLife,
  score,
  setScore,
  dataGame,
  question,
  setQuestion,
  imageResources,
  audioResources,
  questionLength,
  getUrlFish,
  showTimer,
}) => {
  const [result, setResult] = useState<string>('')
  const [answer, setAnswer] = useState('')
  const [soundEffect, setSoundEffect] = useState(false)
  const [soundEffectCorrect, setSoundEffectCorrect] = useState(false)
  const [isChecking, setIsChecking] = useState(false)
  const [controlShark, setControlShark] = useState<any>({ isPlay: false, eat: {} })

  useEffect(() => {
    let timeObj: any
    if (dataGame?.sound) {
      timeObj = setTimeout(() => {
        setSoundEffect(true)
      }, 1000)
    }
    return () => clearTimeout(timeObj)
  }, [dataGame?.sound])

  const onNextQuestion = async () => {
    setQuestion(question + 1)
    setSoundEffectCorrect(false)
    setResult('')
    setTimeout(() => {
      setIsChecking(false)
    }, 1000)
  }

  const checkResult = (data: any) => {
    const value = data?.value
    const src = data?.src
    if (value === dataGame?.correct) {
      const newScore: ScoreType = [...score]
      newScore.push({ ...dataGame, fish: src, point: true })
      setScore(newScore)
      setControlShark({ isPlay: true, eat: data })
    } else {
      setResult('incorrect')
      const newScore: ScoreType = [...score]
      newScore.push({ ...dataGame, fish: src, point: false })
      setScore(newScore)
    }
  }

  const bubbleAnimation = useMemo(() => <Bubble />, [])

  const onSharkEat = () => {
    setResult(controlShark?.eat?.value)
    setSoundEffectCorrect(true)
    setAnswer(controlShark?.eat?.value)
  }

  const sharkAnimation = (index: number) => {
    switch (index) {
      case 1:
        return [
          {
            top: '27%',
            left: '130%',
            opacity: 0.5,
            duration: 0,
            zIndex: 10,
          },
          {
            scale: 1,
            left: '5%',
            opacity: 1,
            duration: 2000,
          },
          {
            opacity: 0,
            duration: 100,
            onComplete: () => onSharkEat(),
          },
        ]
      case 2:
        return [
          {
            top: '27%',
            left: '130%',
            opacity: 0.5,
            duration: 0,
            zIndex: 10,
          },
          {
            scale: 1,
            left: '37%',
            opacity: 1,
            duration: 2000,
          },
          {
            opacity: 0,
            duration: 100,
            onComplete: () => onSharkEat(),
          },
        ]
      case 3:
        return [
          {
            top: '27%',
            rotateY: '180deg',
            left: '-10%',
            opacity: 0.5,
            duration: 0,
            zIndex: 10,
          },
          {
            scale: 1,
            left: '92%',
            opacity: 1,
            duration: 2000,
          },
          {
            opacity: 0,
            duration: 100,
            onComplete: () => onSharkEat(),
          },
        ]
      default:
        return []
    }
  }

  return (
    <>
      <div className={`w-100 container-game ${dataGame?.background}`}>
        {bubbleAnimation}
        <div className="header__wrapper">
          <div className="header-game">
            <img
              width={80}
              src={imageResources?.btn_back}
              className="game-button user-drag--none"
              alt="button-back"
              onClick={() => {
                Swal.fire({
                  title: 'Bạn muốn dừng chơi',
                  text: 'Tiến trình chơi sẽ bị mất',
                  cancelButtonText: 'Không',
                  confirmButtonText: 'Đồng ý',
                  showCancelButton: true,
                })
                  .then(async ({ isConfirmed }: { isConfirmed: boolean }) => {
                    if (isConfirmed) {
                      backToWelComeScreen()
                    }
                    return ''
                  })
                  .catch(() => {
                    Swal.fire('Có lỗi xảy ra', '', 'error')
                  })
              }}
            />
            <div className={`heart_ico ${showTimer && 'showTimer'}`}>
              {[...Array(5).keys()].map((__item: unknown, index: number) => (
                <img
                  key={index}
                  className="user-drag--none heart-icon"
                  src={
                    index < life ? imageResources?.ico_heart_full : imageResources?.ico_heart_empty
                  }
                  alt="life"
                />
              ))}
            </div>
            {/* <div className="font-text">
              Score:
              {(score?.filter((item: any) => item?.point)?.length || 0)
                * Math.round(100 / questionLength)}
            </div> */}
          </div>
          <img
            width={200}
            src={imageResources?.logo}
            className="game-logo user-drag--none"
            alt="button-back"
          />
        </div>

        {/**
         * FISH IMAGE ANSWERS
         *  */}
        {controlShark?.isPlay && (
          <TweenOne
            animation={sharkAnimation(controlShark?.eat?.index || 0)}
            className="shark__animation"
            repeat={0}
            moment={controlShark?.moment || null}
            paused={controlShark?.pause}
          >
            <img
              className="shark__hungry1 user-drag--none"
              src={imageResources?.ico_shark_hungry_extra}
              alt="shark"
            />
          </TweenOne>
        )}
        {result !== 'correct' && (
          <>
            <Row className="w-100 game-answer">
              {dataGame?.answers?.map((item: any, index: number) => (
                <Col xs={4} key={item?.value}>
                  <p
                    className={
                      controlShark?.eat?.index && controlShark?.eat?.index !== index + 1
                        ? 'disapper'
                        : ''
                    }
                  >
                    {item?.value}
                  </p>
                  {result !== item?.value ? (
                    <TweenOne
                      animation={[{ rotate: '3deg' }, { rotate: '-3deg' }]}
                      repeat={-1}
                      yoyo
                    >
                      <img
                        width={200}
                        src={getUrlFish(item?.src)}
                        alt={`answer${index + 1}`}
                        className={`
                          game-button
                          answer-animation
                          user-drag--none
                          ${!isChecking && !soundEffect && 'can-hover'}
                          ${
                            controlShark?.eat?.index
                            && controlShark?.eat?.index !== index + 1
                            && 'disapper'
                          }
                        `}
                        onClick={() => {
                          if (!isChecking && !soundEffect) {
                            setIsChecking(true)
                            checkResult({
                              index: index + 1,
                              value: item?.value,
                              src: item?.src,
                            })
                          }
                        }}
                      />
                    </TweenOne>
                  ) : (
                    <img
                      width={400}
                      src={imageResources?.ico_shark_fat}
                      alt={`answer${index + 1}`}
                      className="game-button correct-answer user-drag--none"
                    />
                  )}
                </Col>
              ))}
            </Row>

            <div className="chat-game">
              <div className="left-chat-game">
                <img
                  className="container-chat-game user-drag--none"
                  src={imageResources?.ico_board_text}
                  alt="chat"
                />
                <div className="chat-text-game">Choose the correct sea animal</div>
              </div>
            </div>
            <div className="sound-game-fish">
              <img
                width={100}
                src={imageResources?.ico_sound}
                onClick={() => setSoundEffect(true)}
                alt="sound"
                className="game-button user-drag--none"
              />
            </div>
          </>
        )}
      </div>
      <Sound
        url={dataGame?.sound || ''}
        playStatus={soundEffect && dataGame?.sound ? 'PLAYING' : 'STOPPED'}
        onFinishedPlaying={() => setSoundEffect(false)}
      />

      <Sound
        url={audioResources.sound_correct || ''}
        playStatus={soundEffectCorrect ? 'PLAYING' : 'STOPPED'}
        onFinishedPlaying={() => {
          setSoundEffectCorrect(false)
          setControlShark({ isPlay: false, eat: {} })
          setResult('correct')
        }}
      />
      {result === 'correct' && (
        <Correct
          imageResources={imageResources}
          dataGame={dataGame}
          answer={answer}
          onNextQuestion={onNextQuestion}
          questionLength={questionLength}
        />
      )}
      {result === 'incorrect' && (
        <Incorrect
          imageResources={imageResources}
          audioResources={audioResources}
          onEnded={() => {
            setLife(life - 1)
            onNextQuestion()
          }}
        />
      )}
    </>
  )
}

export default GamePlay
