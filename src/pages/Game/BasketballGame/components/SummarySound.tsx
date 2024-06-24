import React, {
  FC, useCallback, useEffect, useState,
} from 'react'
import { Image } from 'react-bootstrap'
import Sound from 'react-sound'
import { ImageResourcesType, UserAnswerType } from '../types'

type Props = {
  quesLength: number
  imageResources: ImageResourcesType
  onNextScreen: () => void
  userAnswers: UserAnswerType[]
}

const SummarySound: FC<Props> = ({
  quesLength, onNextScreen, userAnswers, imageResources,
}) => {
  const [indexSound, setIndexSound] = useState<number | null>(null)
  const nextSound = useCallback(
    (index: number) => {
      if (index === quesLength) {
        onNextScreen()
        return
      }

      if (userAnswers?.[index]?.isCorrect) {
        setTimeout(() => setIndexSound(index), 1000)
      } else {
        nextSound(index + 1)
      }
    },
    [quesLength, onNextScreen, userAnswers]
  )

  useEffect(() => {
    nextSound(0)
    return () => {
      setIndexSound(null)
    }
  }, [nextSound])

  return (
    <div className="summary__sound">
      <Sound
        url={indexSound !== null ? userAnswers?.[indexSound]?.quesAudio : ''}
        playStatus="PLAYING"
        playFromPosition={0}
        onLoading={() => {}}
        onPlaying={() => {}}
        onFinishedPlaying={() => nextSound((indexSound || 0) + 1)}
      />
      <Image className="summary__sound--title" src={imageResources.btn_summary} />

      {/*
        SUMMARY SCREEN
      */}
      <div className="summary__sound--table">
        {userAnswers?.map((item: UserAnswerType | null, key: number) => (
          <div key={key} className={`summary__sound--item ${indexSound === key ? 'popup' : ''}`}>
            <div className="item__content--wrap">
              {item?.isCorrect && (
                <>
                  <Image src={item?.quesImage} className="item__content--image" />
                  <p className="item__content--text">{item?.text}</p>
                </>
              )}
            </div>
            <Image className="item__box" src={imageResources.ico_board_summary} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default SummarySound
