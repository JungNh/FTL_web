import React, { FC, useEffect, useState } from 'react'
import TweenOne from 'rc-tween-one'
import Sound from 'react-sound'
import { animationBtnStart } from '../animation'
import { AudioResourcesType, ImageResourcesType } from '../types'

type Props = {
  dataCorrect: {
    answers: string[]
    correct: number
    sound: string
    correctSrc: string
    correctText: string
    status: 'correct' | 'wrong' | 'not-ans'
  }
  onNextQuestion: () => void
  imageResources: ImageResourcesType
  audioResources: AudioResourcesType
  pointQuestion: any
}

const ScreenCorrect: FC<Props> = ({
  onNextQuestion,
  dataCorrect,
  imageResources,
  audioResources,
  pointQuestion
}) => {
  const [quesSound, setQuesSound] = useState(false)
  const [correctSound, setCorrectSound] = useState(false)

  useEffect(() => {
    setQuesSound(true)
    setCorrectSound(true)
  }, [])

  return (
    <>
      {audioResources?.sound_correct && (
        <Sound
          url={audioResources?.sound_correct}
          playStatus={correctSound ? 'PLAYING' : 'PAUSED'}
          onFinishedPlaying={() => setCorrectSound(false)}
        />
      )}
      <Sound
        url={dataCorrect?.sound}
        playStatus={quesSound ? 'PLAYING' : 'STOPPED'}
        onFinishedPlaying={() => setQuesSound(false)}
      />
      <div className="screen__correct">
        <div className="screen__correct--bg">
          <img src={imageResources?.bg} className="background1" alt="bgxuoi" />
          <img src={imageResources?.bg} className="background2" alt="bgnguoc" />
        </div>
        <div className="result__game">
          <div className="position-relative">
            <img className="result__bg" src={imageResources?.ico_board_correct} alt="result" />
            <img className="result__game--image" src={dataCorrect?.correctSrc} alt="ans__image" />
            <div className="result__game--text">{dataCorrect?.correctText}</div>
            <img
              src={imageResources?.ico_sound}
              className="sound__item--correct"
              alt="sound__item"
              onClick={() => setQuesSound(true)}
            />
          </div>
        </div>
        <div className="point__contanier">
          <img className="point__bg" src={imageResources?.ico_board_text} alt="result" />
          <div className="point__text">
            <p className="point__text--title">Excellent!</p>
            <p className="point__text--sub">{`+${pointQuestion} exp`}</p>
          </div>
        </div>

        <div className="continue__container">
          <img
            className="continue__container--robot"
            src={imageResources?.ico_robo_happy}
            alt="robot"
          />
          <TweenOne
            className="cursor-pointer"
            repeat={-1}
            yoyo
            animation={animationBtnStart}
            onClick={() => onNextQuestion()}
          >
            <p className="btn__continue--text">Continue</p>
            <img
              className="continue__container--button"
              src={imageResources?.btn}
              alt="continue-button"
            />
          </TweenOne>
        </div>
      </div>
    </>
  )
}

export default ScreenCorrect
