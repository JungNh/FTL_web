import React, { FC, useMemo } from 'react'
import { Button } from 'react-bootstrap'
import { ImageResourcesType } from '../types'

type DataGameType = {
  answers: string[]
  correct: number
  correctSrc: string
  sound: string
  correctText: string
  status: 'correct' | 'wrong' | 'not-ans'
}

type Props = {
  dataGame: DataGameType[]
  tryAgain: () => void
  results: any
  imageResources: ImageResourcesType
}

const ScreenEnd: FC<Props> = ({ dataGame, tryAgain, imageResources, results }) => {
  const getHighestScore = useMemo(() => {
    const { highestScore, unitScore } = results
    if (highestScore) {
      return unitScore > highestScore ? unitScore : highestScore
    }

    return unitScore || 0
  }, [results])

  return (
    <div className="screen__end">
      <img className="blur__background" src={imageResources?.bg} alt="bg" />
      {/* <div className="screen__end--container">
        {dataGame?.map((item: DataGameType, index: number) => (
          <div className="position-relative">
            {item?.status === 'correct' && (
              <img
                className="icon__result-boolean"
                src={imageResources?.ico_result_correct}
                key={index}
                alt="results"
              />
            )}
            {item?.status === 'wrong' && (
              <img
                className="icon__result-boolean"
                src={imageResources?.ico_result_wrong}
                key={index}
                alt="results"
              />
            )}
            <img
              className="icon__result"
              src={imageResources?.btn_null}
              key={index}
              alt="results"
            />
          </div>
        ))}
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
      <img
        className="screen__end--chatbox"
        src={imageResources?.ico_board_text}
        width={400}
        alt="chat__box"
      />
      <p className="screen__end--text">
        Congratulations! <br />
        These are what you got!
      </p>
      <div className="robot__button">
        <img
          className="screen__end--robot"
          src={imageResources?.ico_robo_happy}
          width={400}
          alt="robot"
        />
        <div className="cursor-pointer" onClick={() => tryAgain()}>
          <p className="btn__continue--text">TRY AGAIN</p>
          <img
            className="screen__end--tryagain"
            src={imageResources?.btn}
            width={400}
            alt="btn__try__again"
          />
        </div>
      </div>
    </div>
  )
}

export default ScreenEnd
