import React, {
  FC, useCallback, useEffect, useMemo, useState,
} from 'react'
import { Row } from 'react-bootstrap'
import Sound from 'react-sound'
import { ImageResourcesType } from '../types'

type Props = {
  quesLength: number
  score: any
  onFinishGame: () => void
  onNextScreen: () => void
  imageResources: ImageResourcesType
}

const SoundSummary: FC<Props> = ({
  quesLength, score, onFinishGame, onNextScreen, imageResources,
}) => {
  const [indexSound, setIndexSound] = useState<number | null>(null)
  const [isPlaySound, setIsPlaySound] = useState<boolean>(false)

  useEffect(() => {
    let timeObj: any
    if (indexSound !== null) timeObj = setTimeout(() => setIsPlaySound(true), 1000)
    return () => clearTimeout(timeObj)
  }, [indexSound])

  const nextSound = useCallback(
    (index: number) => {
      setIsPlaySound(false)
      if (index === quesLength) {
        setIndexSound(null)
        onNextScreen()
      } else if (score?.[index]?.point) {
        setIndexSound(index)
      } else {
        nextSound(index + 1)
      }
    },
    [score]
  )

  useEffect(() => {
    nextSound(0)
    return () => {
      setIndexSound(null)
    }
  }, [nextSound])

  const boxNull: { unSelected: boolean }[] = useMemo(() => {
    const dataBox = []
    const number = quesLength - score?.length
    for (let i = 0; i < number; i++) {
      dataBox.push({ unSelected: true })
    }
    return dataBox
  }, [quesLength, score?.length])
  const newResult: any = [...score, ...boxNull]

  return (
    <div className="w-100 container-game">
      <Sound
        url={score?.[indexSound || 0]?.sound || ''}
        playStatus={isPlaySound ? 'PLAYING' : 'STOPPED'}
        onFinishedPlaying={() => nextSound((indexSound || 0) + 1)}
      />

      <div>
        <div className="header-game">
          <img
            width={80}
            src={imageResources?.btn_back}
            className="game-button user-drag--none"
            alt="button-back"
            onClick={onFinishGame}
          />
        </div>
        <img className="summary-text user-drag--none" src={imageResources?.btn_summary} width={400} alt="summary" />

        <img width={200} src={imageResources?.logo} className="game-logo user-drag--none" alt="button-back" />
      </div>

      {/*
        SUMMARY SCREEN
      */}
      <Row className="table-summary-spin">
        <div className="results__container">
          {newResult?.map((item: any, key: number) => (
            <div key={key} className={`box-summary-spin ${indexSound === key ? 'popup' : ''}`}>
              <div className="text-box-summary">
                {item?.point && (
                  <>
                    <p>{item?.correct}</p>
                    <img
                      width={120}
                      src={item?.imageUrl}
                      className="image-box-summary"
                      alt="result"
                    />
                  </>
                )}
              </div>
              <img
                width={200}
                src={imageResources?.ico_board_summary}
                className="box__border"
                alt="summary-box"
                draggable={false}
              />
            </div>
          ))}
        </div>
      </Row>
    </div>
  )
}

export default SoundSummary
