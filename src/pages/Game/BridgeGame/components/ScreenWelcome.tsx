import React, { FC } from 'react'
import { Image } from 'react-bootstrap'
import TweenOne from 'rc-tween-one'
import { ImageResourcesType } from '../types'

type Props = {
  imageResources: ImageResourcesType
  onStartGame: () => void
}

const WelcomeScreen: FC<Props> = ({ imageResources, onStartGame }) => {
  const aniBtnPlay = {
    scale: 1.05,
    duration: 300,
    repeat: -1,
    yoyo: true
  }

  const aniGameName = [
    {
      type: 'from' as 'from' | 'to',
      rotate: -5
    },
    {
      rotate: 5,
      duration: 500,
      delay: 100,
      repeat: -1,
      yoyo: true
    }
  ]

  return (
    <div className="welcome__screen">
      <TweenOne className="btn__play" animation={aniBtnPlay} onClick={onStartGame}>
        <p className="btn__play--text">PLAY NOW</p>
        <Image className="btn__play--image" src={imageResources.btn} />
      </TweenOne>
      <TweenOne className="welcome__game--name" animation={aniGameName}>
        <Image className="welcome__game--image" src={imageResources.game_name} />
      </TweenOne>

      <Image className="ico_decorate--robo" src={imageResources.ico_robo_happy} />
      <Image className="ico_decorate--stone stone-1" src={imageResources.ico_stone} />
      <Image className="ico_decorate--stone stone-2" src={imageResources.ico_stone} />
      <Image className="ico_decorate--stone stone-3" src={imageResources.ico_stone} />
      <Image className="ico_decorate--stone stone-4" src={imageResources.ico_stone} />
    </div>
  )
}

export default WelcomeScreen
