import React, {
  FC, useCallback, useEffect, useState, useMemo,
} from 'react'
import { Button } from 'react-bootstrap'
import '../styles.scss'
import Sound from 'react-sound'
import { ImageResourcesType } from '../types'

type UserAnsType = {
  src: string
  sound: string
  box: string
  status: 'correct' | 'wrong' | 'not-answer'
  correctText: string
}

type Props = {
  userAnswers: UserAnsType[]
  retryGame: () => void
  imageResources: ImageResourcesType
  results: any
}

const GameSummary: FC<Props> = ({
  userAnswers, retryGame, imageResources, results,
}) => {
  const [screen, setScreen] = useState<'summary' | 'train'>('summary')
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
      if (index === userAnswers?.length) {
        setIndexSound(null)
        setScreen('train')
      } else if (userAnswers?.[index]?.status === 'correct') {
        setIndexSound(index)
      } else {
        nextSound(index + 1)
      }
    },
    [userAnswers]
  )

  useEffect(() => {
    nextSound(0)
    return () => {
      setIndexSound(null)
    }
  }, [nextSound])

  const findBox = useCallback(
    (boxType: string) => {
      switch (boxType) {
        case 'green':
          return imageResources?.ico_box_green
        case 'blue':
          return imageResources?.ico_box_blue
        case 'red':
          return imageResources?.ico_box_red
        default:
          return imageResources?.ico_box_red
      }
    },
    [imageResources]
  )

  const getHighestScore = useMemo(() => {
    const { highestScore, unitScore } = results
    if (highestScore) {
      return unitScore > highestScore ? unitScore : highestScore
    }

    return unitScore || 0
  }, [results])

  return (
    <>
      {/* SOUND */}
      <Sound
        url={userAnswers?.[indexSound || 0]?.sound}
        playStatus={isPlaySound ? 'PLAYING' : 'STOPPED'}
        onFinishedPlaying={() => nextSound((indexSound || 0) + 1)}
      />
      <div>
        {screen === 'summary' && (
          <img
            className="summary-text user-drag--none"
            src={imageResources?.btn_summary}
            width={400}
            alt="summary"
          />
        )}
        {/* {screen === 'train' && (
          <div className="font-text">
            Score:{' '}
            {(userAnswers?.filter((item: UserAnsType) => item?.status === 'correct')?.length || 0) *
              5}
          </div>
        )} */}
        <img
          width={200}
          src={imageResources?.logo}
          className="game-logo user-drag--none"
          alt="button-back"
        />
      </div>

      {/*
        SCREEN SUMMARY
      */}
      {screen === 'summary' && (
        <div className="table-summary-train">
          <div className="results__container">
            {userAnswers?.map((item: UserAnsType, index: number) => (
              <div
                key={index}
                className={`box-summary-train ${indexSound === index ? 'popup' : ''}`}
              >
                <div className="text-box-summary">
                  {item?.status === 'correct' && (
                    <>
                      <p>{item?.correctText}</p>
                      <img width={120} src={item?.src} className="image-box-summary" alt="result" />
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
        </div>
      )}

      {/*
        SCREEN TRAIN END GAME
      */}
      {screen === 'train' && (
        <>
          {/* <div className="table-summary-train" style={{ display: 'flex' }}>
            {userAnswers?.map((item: UserAnsType, index: number) => {
              if (item?.status === 'not-answer') {
                return (
                  <div key={index} className="box-finish-summary-train">
                    <img
                      className="box__end"
                      width={100}
                      src={findBox(item?.box)}
                      alt="summary-box"
                    />
                  </div>
                )
              }
              return (
                <div key={index} className="box-finish-summary-train">
                  <img
                    className="box__end user-drag--none"
                    width={100}
                    src={findBox(item?.box)}
                    alt="box"
                  />
                  <img
                    width={50}
                    src={
                      item?.status === 'correct'
                        ? imageResources?.ico_result_correct
                        : imageResources?.ico_result_wrong
                    }
                    alt="fish"
                    className="user-drag--none box-finish-summary-action"
                  />
                </div>
              )
            })}
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
              <img className="w-100" src={imageResources?.ico_board_text} alt="chat" />
            </div>
          </div>
          <div className="again-game">
            <img
              className="result-game user-drag--none"
              src={imageResources?.ico_robo_happy}
              alt="continue"
            />
            <div className="cursor-pointer" onClick={() => retryGame()}>
              <p className="btn__continue--text">TRY AGAIN</p>
              <img
                className="continue-game game-button user-drag--none"
                src={imageResources?.btn}
                onClick={() => retryGame()}
                alt="continue-button"
              />
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default GameSummary
