import React, { FC, useEffect, useState } from 'react'
import '../styles.scss'
import Sound from 'react-sound'
import { KImage } from '../../../../components'
import { AudioResourcesType, ImageResourcesType } from '../types'

type Props = {
  dataGame: any
  quesLength: any
  onNextQuestion: () => void
  imageResources: ImageResourcesType
  audioResources: AudioResourcesType
}

const Correct: FC<Props> = ({
  onNextQuestion,
  dataGame,
  imageResources,
  audioResources,
  quesLength
}) => {
  const [correctEffect, setCorrectEffect] = useState(true)
  const [soundEffect, setSound] = useState(false)

  useEffect(() => {
    let timeObj: any
    if (dataGame.sound) timeObj = setTimeout(() => setSound(true), 1000)
    return () => clearTimeout(timeObj)
  }, [dataGame.sound])

  return (
    <>
      <Sound
        url={dataGame?.sound || ['']}
        playStatus={soundEffect && dataGame?.sound ? 'PLAYING' : 'STOPPED'}
        onFinishedPlaying={() => setSound(false)}
      />
      {correctEffect && audioResources?.sound_correct && (
        <Sound
          url={audioResources?.sound_correct}
          playStatus={correctEffect ? 'PLAYING' : 'STOPPED'}
          onFinishedPlaying={() => setCorrectEffect(false)}
        />
      )}
      <div className="container-correct-game-spin">
        <div className="result-game">
          <img
            className="container-result-game user-drag--none"
            src={imageResources?.ico_board_correct}
            alt="result"
          />
          <div className="result-text-game">{dataGame?.correct}</div>
          <KImage
            wrapperClassName="result-image-game user-drag--none"
            className="game__image--contain"
            src={dataGame?.imageUrl}
            alt="point"
          />
        </div>
      </div>
      <div className="container-point-game">
        <div className="result-game">
          <img
            className="container-result-game user-drag--none"
            src={imageResources?.ico_board_text}
            alt="result"
          />
          <div className="result-text-game">
            <p>Excellent!</p>
            <p className="text-exp">{`+ ${Math.round(100 / quesLength)}xp`}</p>
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
              src={imageResources?.btn}
              alt="continue-button"
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default Correct
