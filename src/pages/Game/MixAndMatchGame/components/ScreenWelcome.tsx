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
  const aniGameLogo = [
    {
      type: 'from' as 'from' | 'to',
      rotate: -5
    },
    {
      rotate: 5,
      duration: 1000,
      repeat: -1,
      yoyo: true
    }
  ]

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
      <TweenOne className="welcome__game--logo" animation={aniGameLogo}>
        <Image className="welcome__game--image" src={imageResources.game_logo} />
      </TweenOne>
    </div>
  )
}

export default WelcomeScreen
