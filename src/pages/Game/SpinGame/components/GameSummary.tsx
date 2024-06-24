import React, { FC, useMemo } from 'react'
import '../styles.scss'
import { Row, Col, Button } from 'react-bootstrap'
import { ImageResourcesType } from '../types'

type Props = {
  score: any
  onFinishGame: () => void
  quesLength: number
  results: any
  onRetry: () => void
  imageResources: ImageResourcesType
}

const GameSummary: FC<Props> = ({
  score,
  onFinishGame,
  quesLength,
  onRetry,
  imageResources,
  results
}) => {
  const boxNull: { unSelected: boolean }[] = useMemo(() => {
    const dataBox = []
    const number = quesLength - score?.length
    for (let i = 0; i < number; i++) {
      dataBox.push({ unSelected: true })
    }
    return dataBox
  }, [quesLength, score?.length])
  const newResult: any = [...score, ...boxNull]

  const getHighestScore = useMemo(() => {
    const { highestScore, unitScore } = results
    if (highestScore) {
      return unitScore > highestScore ? unitScore : highestScore
    }

    return unitScore || 0
  }, [results])

  return (
    <div className="w-100 container-game">
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
        {/* <div className="font-text">
          Score:
          {(score?.filter((item: any) => item?.point)?.length || 0) * Math.round(100 / quesLength)}
        </div> */}
        <img
          width={200}
          src={imageResources?.logo}
          className="game-logo user-drag--none"
          alt="button-back"
        />
      </div>
      {/*

        END GAME

      */}
      {/* <Row className="table-summary-spin">
        {newResult?.map((item: any, key: number) => {
          if (item?.point) {
            return (
              <Col xs={1} key={key} className="box-finish-summary">
                <img
                  className="icon__result-boolean"
                  src={imageResources?.ico_result_correct}
                  alt="correct"
                />
                <img src={imageResources?.btn_null} alt="correct" className="user-drag--none" />
              </Col>
            )
          }
          if (item?.unSelected) {
            return (
              <Col xs={1} key={key} className="box-finish-summary">
                <img src={imageResources?.btn_null} alt="incorrect" className="user-drag--none" />
              </Col>
            )
          }
          return (
            <Col xs={1} key={key} className="box-finish-summary">
              <img
                className="icon__result-boolean"
                src={imageResources?.ico_result_wrong}
                alt="incorrect"
              />
              <img src={imageResources?.btn_null} alt="incorrect" className="user-drag--none" />
            </Col>
          )
        })}
      </Row> */}
      <div className="container-again">
        <div className="again-container-text">
          <div className="again-text">Congratulations! These are what you got!</div>
          <img className="w-100 user-drag--none" src={imageResources?.ico_board_text} alt="chat" />
        </div>
      </div>
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
            <Button variant="warning">{results.unitScore}</Button>
            <Button variant="warning">{results.score}</Button>
            <Button variant="warning">{results.durationTime}</Button>
            <Button variant="warning">{getHighestScore}</Button>
          </div>
        </div>
      </div>
      <div className="again-game">
        <img
          className="result-game user-drag--none"
          src={imageResources?.ico_robo_happy}
          alt="continue"
        />
        <div className="cursor-pointer" onClick={() => onRetry()}>
          <p className="btn__continue--text">TRY AGAIN</p>
          <img
            className="continue-game game-button user-drag--none"
            src={imageResources?.btn}
            alt="retry-button"
          />
        </div>
      </div>
    </div>
  )
}

export default GameSummary
