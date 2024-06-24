import React, { FC } from 'react'
import Sound from 'react-sound'
import { KImage } from '../../../../components'
import { AudioResourcesType, ImageResourcesType } from '../types'

type Props = {
  onEnded: () => void
  imageResources: ImageResourcesType
  audioResources: AudioResourcesType
}

const IncorrectPopup: FC<Props> = ({ onEnded, imageResources, audioResources }) => (
  <div className="w-100 incorrect-game">
    <div className="icon-incorrect-game">
      <KImage src={imageResources?.ico_robo_sad || ''} width={200} alt="incorrect" />
      <p>Oops!</p>
      <Sound url={audioResources?.sound_wrong || ''} playStatus="PLAYING" onFinishedPlaying={onEnded} />
    </div>
  </div>
)

export default IncorrectPopup
