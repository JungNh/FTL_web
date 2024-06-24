import React, { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { Row, Button } from 'react-bootstrap'
import Sound from 'react-sound'
import { ImageResourcesType } from '../types'

type ScoreType = {
  answers: { value: string; src: string }[]
  correct?: string
  sound?: string
  fish?: string
  point?: boolean
}[]

type Props = {
  score: ScoreType
  backToWelComeScreen: () => void
  onNextLession: () => void
  questionLength: number
  results: any
  imageResources: ImageResourcesType
  getUrlFish: (index?: string) => string
}

const GameSummary: FC<Props> = ({
  score,
  backToWelComeScreen,
  onNextLession,
  questionLength,
  imageResources,
  getUrlFish,
  results
}) => {
  const [finish, setFinish] = useState(false)
  const [indexSound, setIndexSound] = useState<number | null>(null)
  const [isPlaySound, setIsPlaySound] = useState<boolean>(false)

  const newResult: any[] = useMemo(() => {
    const dataBox = []
    const number = questionLength - score?.length
    for (let i = 0; i < number; i++) {
      dataBox.push({ unSelected: true })
    }
    return [...score, ...dataBox]
  }, [questionLength, score])

  const getHighestScore = useMemo(() => {
    const { highestScore, unitScore } = results
    if (highestScore) {
      return unitScore > highestScore ? unitScore : highestScore
    }

    return unitScore || 0
  }, [results])

  useEffect(() => {
    let timeObj: any
    if (indexSound !== null) timeObj = setTimeout(() => setIsPlaySound(true), 1000)
    return () => clearTimeout(timeObj)
  }, [indexSound])

  const nextSound = useCallback(
    (index: number) => {
      setIsPlaySound(false)
      if (index === questionLength) {
        setFinish(true)
      } else if (score?.[index]?.point) {
        setIndexSound(index)
      } else {
        nextSound(index + 1)
      }
    },
    [questionLength, score]
  )

  useEffect(() => {
    nextSound(0)
    return () => {
      setIndexSound(null)
    }
  }, [nextSound])

  const renderSummary = useMemo(
    () =>
      newResult?.map(
        (
          item: {
            fish?: string
            point?: boolean
            unSelected?: boolean
          },
          key: number
        ) => {
          if (item?.unSelected) {
            return (
              <div key={key} className="box-finish-summary">
                <img
                  width={100}
                  src={imageResources.ico_scallop}
                  alt="summary-box"
                  draggable={false}
                />
              </div>
            )
          }
          if (item?.point) {
            return (
              <div key={key} className="box-finish-summary">
                <img width={100} src={getUrlFish(item?.fish)} alt="fish" draggable={false} />
              </div>
            )
          }
          return (
            <div key={key} className="box-finish-summary">
              <img
                className="icon_wrong"
                width={100}
                src={imageResources?.ico_result_wrong}
                alt="summary-box"
                draggable={false}
              />
              <img width={100} src={imageResources?.btn_null} alt="summary-box" draggable={false} />
            </div>
          )
        }
      ),
    [getUrlFish, imageResources, newResult]
  )

  return (
    <div className="w-100 container-game bg2">
      <div className="header__wrapper">
        <div className="header-game">
          <img
            width={80}
            src={imageResources?.btn_back}
            draggable={false}
            className="game-button "
            alt="button-back"
            onClick={() => {
              onNextLession()
            }}
          />
        </div>
        {!finish && (
          <img
            className="summary-text "
            src={imageResources?.btn_summary}
            width={400}
            alt="summary"
            draggable={false}
          />
        )}
        {/* {finish && (
          <div className="font-text summary__score">
            Score:
            {(newResult?.filter((item: any) => item?.point)?.length || 0)
              * Math.round(100 / questionLength)}
          </div>
        )} */}
        <img
          width={200}
          src={imageResources?.logo}
          className="game-logo "
          alt="button-back"
          draggable={false}
        />
      </div>
      {!finish && (
        <Row className="table-summary-fish">
          <Sound
            url={score?.[indexSound || 0]?.sound || ''}
            playStatus={isPlaySound ? 'PLAYING' : 'STOPPED'}
            onFinishedPlaying={() => nextSound((indexSound || 0) + 1)}
          />
          <div className="results__container">
            {newResult?.map((item: any, key: number) => {
              if (item?.unSelected) {
                return (
                  <div key={key} className="box-summary-fish">
                    <img
                      className="box__border"
                      width={200}
                      src={imageResources?.ico_board_summary}
                      alt="summary-box"
                      draggable={false}
                    />
                  </div>
                )
              }
              if (item?.point) {
                return (
                  <div
                    key={key}
                    className={`box-summary-fish ${indexSound === key ? 'popup' : ''}`}
                  >
                    <div className="text-box-summary">
                      <p>{item?.correct}</p>
                      <img
                        width={120}
                        src={getUrlFish(item?.fish)}
                        className="image-box-summary "
                        alt="fish"
                        draggable={false}
                      />
                    </div>
                    <img
                      className="box__border"
                      width={200}
                      src={imageResources?.ico_board_summary}
                      alt="summary-box"
                      draggable={false}
                    />
                  </div>
                )
              }

              return (
                <div key={key} className="box-summary-fish">
                  <img
                    className="box__border"
                    width={200}
                    src={imageResources?.ico_board_summary}
                    alt="summary-box"
                    draggable={false}
                  />
                </div>
              )
            })}
          </div>
        </Row>
      )}
      {finish && (
        <>
          {/* <div className="table-summary-fish" style={{ display: 'flex' }}>
            {renderSummary}
          </div> */}
          <div className="game__name">
            <div className="game__title">RESULT BOARD</div>
            <div className="result__wraper">
              <div className="title">
                <Button variant="danger">SCORE</Button>
                <Button variant="danger">TRUE</Button>
                <Button variant="danger">TIME</Button>
                <Button variant="danger">HIGHEST SCORE</Button>
              </div>
              <div className="content">
                <Button variant="warning">{results?.unitScore}</Button>
                <Button variant="warning">{results?.score}</Button>
                <Button variant="warning">{results?.durationTime}</Button>
                <Button variant="warning">{getHighestScore}</Button>
              </div>
            </div>
          </div>
          <div className="container-again">
            <div className="again-container-text">
              <div className="again-text">Congratulations! These are what you got!</div>
              <img
                className="w-100"
                src={imageResources?.ico_board_text}
                alt="chat"
                draggable={false}
              />
            </div>
          </div>
          <div className="again-game-fish">
            <img
              className="result-game "
              src={imageResources?.ico_robo_happy}
              alt="continue"
              draggable={false}
            />
            <div className="cursor-pointer" onClick={backToWelComeScreen}>
              <p className="btn__continue--text">TRY AGAIN</p>
              <img
                className="continue-game game-button "
                src={imageResources?.btn}
                alt="continue-button"
                draggable={false}
              />
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default GameSummary
