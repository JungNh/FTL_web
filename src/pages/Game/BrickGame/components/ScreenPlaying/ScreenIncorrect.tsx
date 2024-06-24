import React from 'react'
import { Image } from 'react-bootstrap'
import Sound from 'react-sound'

import { AudioResourcesType, ImageResourcesType } from '../../types'

type Props = {
  imageResources: ImageResourcesType
  audioResources: AudioResourcesType
  onEnded: () => void
}

const ScreenIncorrect = ({ imageResources, audioResources, onEnded }: Props) => (
  <div className="incorrect__screen">
    <div className="incorrect__screen--imageWrapper">
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
      onFinishedPlaying={() => onEnded()}
    />
  </div>
)

export default ScreenIncorrect
