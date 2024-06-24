import React, { useEffect } from 'react'
import { Image } from 'react-bootstrap'
import { ImageResourcesType } from '../../types'

type Props = {
  onFinishAnimation: () => void
  imageResources: ImageResourcesType
  isThrowGoal: boolean
}
const ScreenThrowCorrect = ({ onFinishAnimation, imageResources, isThrowGoal }: Props) => {
  useEffect(() => {
    const timeObj = setTimeout(() => {
      onFinishAnimation()
    }, 5000)
    return () => {
      clearTimeout(timeObj)
    }
  }, [onFinishAnimation])

  return (
    <div className="screen__throw__correct">
      <Image className="background__throw--ball" src={imageResources.bg_correct} />
      <Image className="ico_basket--stand" src={imageResources.ico_basket_stand} />
      <Image className="ico_basket" src={imageResources.ico_basket} />
      {isThrowGoal ? (
        <>
          <Image
            id="goal_ball"
            className="ico__ball--throw action__throw--goal"
            src={imageResources.ico_ball_small}
          />
          <Image
            id="goal_shadow"
            className="ico__ball--shadow"
            src={imageResources.ico_ball_shadow}
          />
          <Image
            id="goal_robo"
            className="ico__robot--throw  action__throw--goal"
            src={imageResources.ico_robo_throw}
          />
        </>
      ) : (
        <>
          <Image
            id="miss_ball"
            className="ico__ball--throw action__throw--miss"
            src={imageResources.ico_ball_small}
          />
          <Image
            id="miss_shadow"
            className="ico__ball--shadow"
            src={imageResources.ico_ball_shadow}
          />
          <Image
            id="miss_robo"
            className="ico__robot--throw action__throw--miss"
            src={imageResources.ico_robo_throw}
          />
        </>
      )}
    </div>
  )
}

export default ScreenThrowCorrect
