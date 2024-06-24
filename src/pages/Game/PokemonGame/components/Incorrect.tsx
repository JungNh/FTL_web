import React, { FC } from 'react'
import '../styles.scss'
import Sound from 'react-sound'
import { KImage } from '../../../../components'
import { AudioResourcesType, ImageResourcesType } from '../types'

type Props = {
  onNextQuestion: () => void
  imageResources: ImageResourcesType
  audioResources: AudioResourcesType
}

const IncorrectScreen: FC<Props> = ({ onNextQuestion, imageResources, audioResources }) => (
  <div className="w-100 incorrect-game">
    <div className="icon-incorrect-game">
      <KImage src={imageResources?.ico_robo_sad} width={200} alt="incorrect" className="user-drag--none" />
      <p>Oops!</p>
      <Sound url={audioResources?.sound_wrong} playStatus="PLAYING" onFinishedPlaying={() => onNextQuestion()} />
    </div>
  </div>
)

export default IncorrectScreen
