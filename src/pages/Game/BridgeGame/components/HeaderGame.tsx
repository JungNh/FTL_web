/* eslint-disable radix */
import React, { FC, useState, useEffect } from 'react'
import { Image } from 'react-bootstrap'
import Swal from 'sweetalert2'
import { ImageResourcesType } from '../types'
import IconTime from '../../../../assets/images/Icon_time.svg'

type Props = {
  imageResources: ImageResourcesType
  setIsPlayTheme: (data: boolean) => void
  setStartTime: (data: string) => void
  isPlayTheme: boolean
  score: number
  life: number
  screen: 'welcome' | 'playing' | 'soundSummary' | 'finalSummary'
  backCourse: () => void
  resetGame: (time: string) => void
}
const HeaderGame: FC<Props> = ({
  screen,
  imageResources,
  score,
  isPlayTheme,
  setIsPlayTheme,
  life,
  backCourse,
  setStartTime,
  resetGame
}) => {
  const isShowHeart = screen === 'playing'
  const isShowScore = screen === 'playing' || screen === 'finalSummary'
  const [counter, setCounter] = useState<string>('00:00')
  const [showTimer, setShowTimer] = useState<Boolean>(false)

  useEffect(() => {
    const timer = setInterval(() => {
      if (screen === 'playing') {
        const currentTime = formatTime(readTime(counter))
        setCounter(currentTime) // <-- Change this line!
      } else if (screen === 'welcome') {
        setCounter('00:00')
      }
    }, 1000)
    return () => {
      clearInterval(timer)
    }
  }, [counter, isPlayTheme, screen])

  const onBack = () => {
    if (screen === 'playing') {
      Swal.fire({
        title: 'Bạn muốn dừng chơi',
        text: 'Tiến trình chơi sẽ bị mất',
        cancelButtonText: 'Không',
        confirmButtonText: 'Đồng ý',
        showCancelButton: true
      })
        .then(async ({ isConfirmed }: { isConfirmed: boolean }) => {
          if (isConfirmed) resetGame(counter)
          return ''
        })
        .catch(() => {
          Swal.fire('Có lỗi xảy ra', '', 'error')
        })
    } else {
      backCourse()
    }
  }

  const formatTime = (t: any) => {
    const h = `0${Math.floor(parseInt(t) / 3600)}`.slice(-2)
    const m = `0${(parseInt(t) / 60) % 60}`.slice(-2)

    return `${h}:${m}`
  }

  const readTime = (s: any) => {
    const r = s.split(':')

    // eslint-disable-next-line radix
    return parseInt(r[0]) * 3600 + parseInt(r[1]) * 60 + 60
  }

  const handleShowTimer = () => {
    setShowTimer(!showTimer)
  }

  useEffect(() => {
    if (screen === 'welcome') {
      setStartTime('00:00')
    } else if (screen === 'finalSummary') {
      setStartTime(counter)
    }
  }, [counter, screen, setStartTime])

  return (
    <div className="game__header">
      <Image className="btn__back" src={imageResources?.btn_back} onClick={onBack} />
      <Image
        className="btn__sound"
        src={isPlayTheme ? imageResources?.btn_sound_on : imageResources?.btn_sound_off}
        onClick={() => setIsPlayTheme(!isPlayTheme)}
      />

      <Image className="btn__time" src={IconTime} onClick={handleShowTimer} />

      {screen === 'welcome' && <span className="label_time">00:00</span>}
      {screen !== 'welcome' && showTimer && <span className="label_time">{counter}</span>}
      {isShowHeart && (
        <>
          <div className={`heart__wrapper ${showTimer && 'showTimer'}`}>
            <Image className="heart" src={imageResources?.ico_heart_empty} />
            <Image className="heart" src={imageResources?.ico_heart_empty} />
            <Image className="heart" src={imageResources?.ico_heart_empty} />
            <Image className="heart" src={imageResources?.ico_heart_empty} />
            <Image className="heart" src={imageResources?.ico_heart_empty} />
          </div>
          <div className={`heart__wrapper live-${life} ${showTimer && 'showTimer'}`}>
            <Image className="heart" src={imageResources?.ico_heart_full} />
            <Image className="heart" src={imageResources?.ico_heart_full} />
            <Image className="heart" src={imageResources?.ico_heart_full} />
            <Image className="heart" src={imageResources?.ico_heart_full} />
            <Image className="heart" src={imageResources?.ico_heart_full} />
          </div>
        </>
      )}
      {/* {isShowScore && (
        <h2 className="score__container">
          SCORE:
          {score}
        </h2>
      )} */}
      <Image className="logo" src={imageResources?.logo} />
    </div>
  )
}

export default HeaderGame
