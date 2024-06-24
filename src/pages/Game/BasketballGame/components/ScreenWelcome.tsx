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
  const aniGameBall = [
    {
      rotate: 360,
      x: '-50%',
      y: '-50%',
      duration: 1000,
      repeat: -1,
      ease: 'linear' as 'linear' | undefined
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
      <TweenOne className="welcome__game--logo" animation={aniGameBall}>
        <Image className="welcome__game--image" src={imageResources.ico_ball_big} />
      </TweenOne>
      <Image className="welcome__game--robo--like" src={imageResources.ico_robo_like} />
      <Image className="welcome__game--robo--shy" src={imageResources.ico_robo_shy} />
    </div>
  )
}

export default WelcomeScreen
