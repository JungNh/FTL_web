import React, {
  FC, useEffect, useMemo, useState,
} from 'react'
import { Image } from 'react-bootstrap'
import TweenOne from 'rc-tween-one'
import Sound from 'react-sound'
import logo from '../../../../../assets/icon.png'
import { ImageResourcesType, AudioResourcesType } from '../../types'
import { randomPosition } from '../../../../../utils/common'

type Props = {
  imageResources: ImageResourcesType
  audioResources: AudioResourcesType
  setBreakTimes: () => void
  setIsBigHammerShow: (visible: boolean) => void
  canBreak: boolean
  quesImg: string
  quesIndex: number
}

const SectionBrick: FC<Props> = ({
  imageResources,
  audioResources,
  setBreakTimes,
  canBreak,
  setIsBigHammerShow,
  quesImg,
  quesIndex,
}) => {
  const [brickBreakIndex, setBrickBreakIndex] = useState<number | null>(null)
  const [isBrickAnimation, setIsBrickAnimation] = useState<boolean>(false)
  const [brickBrokeList, setBrickBrokeList] = useState<number[]>([])
  const [listHiddenBrick, setListHiddenBrick] = useState<number[]>([])
  const [isPlaySoundBreak, setIsPlaySoundBreak] = useState(false)

  const aniHammer = (groupIndex: number) => [
    {
      rotate: -80,
      duration: 0,
      delay: 0,
    },
    {
      rotate: 20,
      duration: 300,
    },
    {
      rotate: 16,
      duration: 100,
      delay: 100,
      onComplete: () => {
        setIsBrickAnimation(true)
      },
    },
    {
      delay: 400,
      opacity: 0,
      onComplete: () => {
        setIsBrickAnimation(false)
        setListHiddenBrick((data: number[]) => [...data, groupIndex || 0])
        setBrickBreakIndex(null)
        setBreakTimes()
        setIsBigHammerShow(true)
      },
    },
  ]

  const aniBrickBroken = () => [
    {
      duration: 0,
      delay: 0,
    },
    {
      rotate: Math.random() * 180 - 90,
      x: Math.random() * 300 - 150,
      y: Math.random() * 300 - 150,
      duration: Math.random() * 200 + 100,
      opacity: 0,
      zIndex: -1,
    },
  ]

  const brickImages = useMemo(() => {
    const list = [
      imageResources.ico_brick_green,
      imageResources.ico_brick_blue,
      imageResources.ico_brick_cyan,
      imageResources.ico_brick_purple,
    ]
    return randomPosition(list)
  }, [
    imageResources.ico_brick_blue,
    imageResources.ico_brick_cyan,
    imageResources.ico_brick_green,
    imageResources.ico_brick_purple,
  ])

  const onBreakBrick = (indexGroup: number) => {
    if (canBreak && brickBreakIndex === null && !brickBrokeList?.includes(indexGroup)) {
      setIsPlaySoundBreak(true)
      setIsBigHammerShow(false)
      setBrickBreakIndex(indexGroup)
      setBrickBrokeList((list) => list.concat(indexGroup))
    }
  }

  useEffect(() => {
    if (quesIndex >= 0) {
      setBrickBrokeList([])
      setListHiddenBrick([])
    }
  }, [quesIndex])

  return (
    <section className="image__container">
      <div className="question__image--container">
        <Image className="question__image" src={quesImg || logo} />
      </div>
      {[...Array(4).keys()].map((_group, indexGroup: number) => {
        const isHidden = listHiddenBrick.includes(indexGroup)
        const isNotBreakable = brickBrokeList?.includes(indexGroup) || brickBrokeList.length === 4
        return (
          <div
            key={`group-${indexGroup}`}
            onClick={() => onBreakBrick(indexGroup)}
            className={`
              group__brick
              group__brick--${indexGroup}
              ${isNotBreakable && 'no-hover'}
              ${isHidden && 'brick__hidden'}
            `}
          >
            {[...Array(20).keys()].map((_i, index: number) =>
              (isBrickAnimation && brickBreakIndex === indexGroup ? (
                <TweenOne
                  key={`group_brick_${indexGroup}_${index}`}
                  className={`brick__item brick__item--${index}`}
                  animation={aniBrickBroken()}
                >
                  <Image className="brick__item--image" src={brickImages[indexGroup]} />
                </TweenOne>
              ) : (
                <div
                  key={`group_brick_no_animation_${indexGroup}_${index}`}
                  className={`brick__item brick__item--${index}`}
                >
                  <Image className="brick__item--image" src={brickImages[indexGroup]} />
                </div>
              )))}
            {brickBreakIndex === indexGroup && (
              <TweenOne
                resetStyle
                className="ico__hammer--inBrick"
                animation={aniHammer(indexGroup)}
              >
                <Image className="ico__hammer--inBrick--image" src={imageResources.ico_hammer} />
              </TweenOne>
            )}
          </div>
        )
      })}
      <Sound
        url={audioResources.sound_break || ''}
        playStatus={isPlaySoundBreak ? 'PLAYING' : 'STOPPED'}
        onFinishedPlaying={() => setIsPlaySoundBreak(false)}
      />
    </section>
  )
}

export default SectionBrick
