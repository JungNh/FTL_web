import React, { FC, useState, useEffect } from 'react'
import '../styles.scss'
import Sound from 'react-sound'
import { AudioResourcesType, ImageResourcesType } from '../types'

type DataQues = {
  answers: string[]
  correct: string
  sound: string
  correctText: string
}

type Props = {
  detailQues: DataQues
  onNextQuestion: (isCorrect: boolean) => void
  imageResources: ImageResourcesType
  audioResources: AudioResourcesType
  quesLength: any
}

const CorrectScreen: FC<Props> = ({
  onNextQuestion,
  detailQues,
  imageResources,
  audioResources,
  quesLength
}) => {
  const [questionSound, setQuestionSound] = useState(false)
  const [correctSound, setCorrectSound] = useState(true)

  return (
    <>
      <Sound
        key="corectQues"
        url={detailQues?.sound || ''}
        playStatus={questionSound ? 'PLAYING' : 'STOPPED'}
        onLoad={() => setQuestionSound(true)}
        onFinishedPlaying={() => setQuestionSound(false)}
      />
      <Sound
        key="correctSoundQues"
        url={audioResources?.sound_correct || ''}
        playStatus={correctSound ? 'PLAYING' : 'STOPPED'}
        onLoad={() => setCorrectSound(true)}
        onFinishedPlaying={() => {
          setCorrectSound(false)
          setQuestionSound(true)
        }}
      />
      <div className="container-correct-game-train">
        <div className="result-game">
          <img
            className="container-result-game user-drag--none"
            src={imageResources?.ico_board_correct}
            alt="result"
          />
          <div className="result-text-game">{detailQues?.correctText}</div>
          <img
            className="result-image-game user-drag--none"
            src={detailQues?.correct}
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
          onClick={() => setQuestionSound(true)}
        />
      </div>
      <div className="container-point-game-train">
        <div className="result-game">
          <img
            className="container-result-game user-drag--none"
            src={imageResources?.ico_board_text}
            alt="result"
          />
          <div className="result-text-game">
            <p>Excellent!</p>
            <p className="text-exp">{`+${Math.round(100 / quesLength)} xp`}</p>
          </div>
        </div>

        <div className="continue-game">
          <img
            className="result-game user-drag--none"
            src={imageResources?.ico_robo_happy}
            alt="continue"
          />
          <div className="cursor-pointer" onClick={() => onNextQuestion(true)}>
            <p className="btn__continue--text">Continue</p>
            <img
              className="continue-game game-button user-drag--none"
              src={imageResources?.btn}
              onClick={() => onNextQuestion(true)}
              alt="continue-button"
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default CorrectScreen
