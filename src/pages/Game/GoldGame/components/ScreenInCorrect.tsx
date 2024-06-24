import React from 'react'
import { Image } from 'react-bootstrap'
import Sound from 'react-sound'
import { AudioResourcesType, ImageResourcesType } from '../types'

type Props = {
  imageResources: ImageResourcesType
  audioResources: AudioResourcesType
  onNextQuestion: () => void
}

const ScreenIncorrect = ({ imageResources, audioResources, onNextQuestion }: Props) => (
  <div className="w-100 incorrect__game">
    <div className="incorrect__game--icon">
      <Image
        src={imageResources.ico_robo_sad}
        alt="incorrect"
        className="incorrect__screen--image"
      />
      <p>Oops!</p>
    </div>
    <Sound
      url={audioResources?.sound_wrong || ''}
      playStatus="PLAYING"
      onFinishedPlaying={() => onNextQuestion()}
    />
  </div>
)

export default ScreenIncorrect
