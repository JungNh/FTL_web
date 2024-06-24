import React from 'react'
import { Image } from 'react-bootstrap'
import TweenOne from 'rc-tween-one'
import fubo_blink from '../../assets/images/ico_fubo.svg'

const p0 = 'M0,100 L25,100 C34,20 40,0 100,0'
const p1 = 'M0,100 C5,120 25,130 25,100 C30,60 40,75 58,90 C69,98.5 83,99.5 100,100'
const ease0 = TweenOne.easing.path(p0)
const ease1 = TweenOne.easing.path(p1)

const LoadingGame = () => {
  const animation = [
    {
      repeatDelay: 250,
      y: -70,
      repeat: -1,
      yoyo: true,
      ease: ease0,
      duration: 500,
    },
    {
      repeatDelay: 250,
      appearTo: 0,
      scaleX: 0,
      scaleY: 2,
      repeat: -1,
      yoyo: true,
      ease: ease1,
      duration: 500,
    },
  ]
  return (
    <div className="game__loader">
      <div className="game__loadder--imageWrap">
        <TweenOne
          animation={animation}
          style={{
            position: 'absolute',
            transformOrigin: 'center bottom',
          }}
        >
          <Image src={fubo_blink} width={200} height={200} className="game__loadder--image" />
        </TweenOne>
      </div>

      <p className="game__loader--title">Đang tải game</p>
    </div>
  )
}

export default LoadingGame
