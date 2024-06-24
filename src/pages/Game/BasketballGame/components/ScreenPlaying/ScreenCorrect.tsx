import React, { FC, useState } from 'react'
import { Image } from 'react-bootstrap'
import Sound from 'react-sound'
import { AudioResourcesType, ImageResourcesType } from '../../types'

type Props = {
  imageResources: ImageResourcesType
  audioResources: AudioResourcesType
  currentQues: {
    quesImg: string
    quesAudio: string
    answers: { id: string | number; value: string; isCorrect: boolean }[]
    description: string
  }
  onContinue: () => void
  pointQuestion: any
}

const ScreenCorrect: FC<Props> = ({
  imageResources,
  audioResources,
  currentQues,
  onContinue,
  pointQuestion
}) => {
  const correctAns = currentQues?.answers?.find((i) => i?.isCorrect)
  const [soundIsPlay, setSoundIsPlay] = useState<'ques' | 'correct' | null>('correct')

  return (
    <div className="correct__screen">
      <div className="board__question--wrapper">
        <Image className="board__question--board" src={imageResources.ico_board_correct} />
        <div className="board__question--asnwers">{correctAns?.value}</div>
        <div className="board__question--text">{currentQues?.description}</div>
        {currentQues?.quesImg && (
          <img className="board__question--image" src={currentQues.quesImg} alt="point" />
        )}
      </div>

      <div className="continue__section">
        <div className="continue__section--score">
          <Image className="continue__section--board" src={imageResources.ico_board_text} />
          <div className="continue__section--text">
            <p className="excellent">Excellent!</p>
            <p className="text-exp">{`+${pointQuestion} xp`}</p>
          </div>
        </div>
        <div className="robo__wrapper">
          <Image className="robo__happy" src={imageResources.ico_robo_happy} />
          <div className="btn__continue" onClick={() => onContinue()}>
            <Image className="btn__continue--image" src={imageResources.btn} />
            <p className="btn__continue--text">Continue</p>
          </div>
        </div>
      </div>

      <Image
        width={100}
        src={imageResources.ico_sound}
        alt="sound"
        className="correct__screen--sound"
        onClick={() => setSoundIsPlay('ques')}
      />
      <Sound
        url={audioResources.sound_correct || ''}
        playStatus={soundIsPlay === 'correct' ? 'PLAYING' : 'STOPPED'}
        playFromPosition={0}
        onLoading={() => {}}
        onPlaying={() => {}}
        onFinishedPlaying={() => setSoundIsPlay('ques')}
      />
      <Sound
        url={currentQues?.quesAudio || ''}
        playStatus={soundIsPlay === 'ques' ? 'PLAYING' : 'STOPPED'}
        playFromPosition={0}
        onLoading={() => {}}
        onPlaying={() => {}}
        onFinishedPlaying={() => setSoundIsPlay(null)}
      />
    </div>
  )
}

export default ScreenCorrect
