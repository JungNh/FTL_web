import React, {
  FC, useCallback, useEffect, useState,
} from 'react'
import Sound from 'react-sound'
import { ImageResourcesType } from '../types'

type Props = {
  dataGame: {
    answers: string[]
    correct: number
    sound: string
    correctSrc: string
    correctText: string
    status: 'correct' | 'wrong' | 'not-ans'
  }[]
  imageResources:ImageResourcesType
  nextScreen: () => void
}

const ScreenSummary: FC<Props> = ({ imageResources, dataGame, nextScreen }) => {
  const [indexSound, setIndexSound] = useState<number | null>(null)
  const [isPlaySound, setIsPlaySound] = useState(false)

  useEffect(() => {
    let timeObj: any
    if (indexSound !== null) {
      timeObj = setTimeout(() => setIsPlaySound(true), 200)
    }
    return () => clearTimeout(timeObj)
  }, [indexSound])

  const nextSound = useCallback(
    (index: number) => {
      setIsPlaySound(false)
      if (index === dataGame?.length) {
        setIndexSound(null)
        nextScreen()
      } else if (dataGame?.[index]?.status === 'correct') {
        setTimeout(() => setIndexSound(index), 1000)
      } else {
        nextSound(index + 1)
      }
    },
    [dataGame, nextScreen]
  )

  useEffect(() => {
    nextSound(0)
    return () => {
      setIndexSound(null)
    }
  }, [nextSound])

  return (
    <div className="screen__summary">
      <Sound
        url={indexSound !== null ? dataGame?.[indexSound]?.sound : ''}
        playStatus={isPlaySound ? 'PLAYING' : 'STOPPED'}
        onFinishedPlaying={() => nextSound((indexSound || 0) + 1)}
      />

      <img className="screen__summary--title" src={imageResources?.btn_summary} width={400} alt="summary" />

      <div className="screen__summary--container">
        {dataGame?.map((item: any, index: number) => (
          <div
            key={index}
            className={`screen__summary--box ${indexSound === index ? 'popup' : ''}`}
          >
            {item?.status === 'correct' && (
              <>
                <p className="correct__text">{item?.correctText}</p>
                <img src={item?.correctSrc} className="correct__image" alt="result" />
              </>
            )}
            <img src={imageResources?.ico_board_summary} alt="summary-box" className="correct__box" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default ScreenSummary
