import React, { FC, useMemo } from 'react'
import { Image } from 'react-bootstrap'
import TweenOne from 'rc-tween-one'
import { ImageResourcesType } from '../types'

type Props = {
  imageResources: ImageResourcesType
  onStartGame: () => void
}

const WelcomeScreen: FC<Props> = ({ imageResources, onStartGame }) => {
  const aniBrick = useMemo(() => {
    const aniBrick1 = {
      scale: 1.5,
      rotate: 120,
      yoyo: true,
      repeat: -1,
      duration: 1000
    }
    const aniBrick2 = { ...aniBrick1, scale: 1.4, rotate: 100, duration: 2000 }
    const aniBrick3 = { ...aniBrick1, scale: 1.2, rotate: 90, duration: 1500 }
    const aniBrick4 = { ...aniBrick1, scale: 1.5, rotate: 70, duration: 1200 }
    return {
      aniBrick1,
      aniBrick2,
      aniBrick3,
      aniBrick4
    }
  }, [])

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

  return (
    <div className="welcome__screen">
      <TweenOne className="btn__play" animation={aniBtnPlay} onClick={onStartGame}>
        <p className="btn__play--text">PLAY NOW</p>
        <Image className="btn__play--image" src={imageResources.btn} />
      </TweenOne>
      <TweenOne className="welcome__game--name" animation={aniGameLogo}>
        <Image className="welcome__game--image" src={imageResources.game_name} />
      </TweenOne>
      <TweenOne className="brick_ico brick--1" animation={aniBrick.aniBrick1}>
        <Image className="brick__image" src={imageResources.ico_brick_cyan} />
      </TweenOne>
      <TweenOne className="brick_ico brick--2" animation={aniBrick.aniBrick2}>
        <Image className="brick__image" src={imageResources.ico_brick_purple} />
      </TweenOne>
      <TweenOne className="brick_ico brick--3" animation={aniBrick.aniBrick3}>
        <Image className="brick__image" src={imageResources.ico_brick_purple} />
      </TweenOne>
      <TweenOne className="brick_ico brick--4" animation={aniBrick.aniBrick4}>
        <Image className="brick__image" src={imageResources.ico_brick_cyan} />
      </TweenOne>
    </div>
  )
}

export default WelcomeScreen
