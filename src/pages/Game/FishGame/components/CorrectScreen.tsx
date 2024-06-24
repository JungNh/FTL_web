import React, { FC, useState } from 'react'
import Sound from 'react-sound'
import { KImage } from '../../../../components'
import { ImageResourcesType } from '../types'

type Props = {
  dataGame: {
    answers: { value: string; src: string }[]
    correct: string
    correctSrc: string
    sound: string
  }
  answer: string
  questionLength: number
  onNextQuestion: () => void
  imageResources: ImageResourcesType
}

const CorrectScreen: FC<Props> = ({
  onNextQuestion,
  answer,
  dataGame,
  imageResources,
  questionLength,
}) => {
  const [soundEffect, setSound] = useState(true)

  return (
    <>
      <Sound
        url={dataGame?.sound || ''}
        playStatus={soundEffect && dataGame?.sound ? 'PLAYING' : 'STOPPED'}
        onFinishedPlaying={() => setSound(false)}
      />
      <div className="container-correct-game-fish">
        <div className="result-game">
          <img
            className="container-result-game user-drag--none"
            src={imageResources?.ico_board_correct}
            alt="result"
          />
          <div className="result-text-game">{answer}</div>
          <KImage
            wrapperClassName="result-image-game user-drag--none"
            className="game__image--contain"
            src={dataGame?.correctSrc}
            alt="point"
          />
        </div>
      </div>
      <div className="sound-result-game">
        <img
          width={100}
          src={imageResources?.ico_sound}
          alt="sound"
          className="game-button user-drag--none"
          onClick={() => setSound(true)}
        />
      </div>
      <div className="container-point-game-fish">
        <div className="result-game">
          <img
            className="container-result-game user-drag--none"
            src={imageResources?.ico_board_text}
            alt="result"
          />
          <div className="result-text-game">
            <p>Excellent!</p>
            <p className="text-exp">{`+ ${Math.round(100 / questionLength)}xp`}</p>
          </div>
        </div>

        <div className="continue-game">
          <img
            className="result-game user-drag--none"
            src={imageResources?.ico_robo_happy}
            alt="continue"
          />
          <div className="cursor-pointer" onClick={() => onNextQuestion()}>
            <p className="btn__continue--text">Continue</p>
            <img
              className="continue-game game-button user-drag--none"
              src={imageResources.btn}
              alt="continue-button"
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default CorrectScreen
