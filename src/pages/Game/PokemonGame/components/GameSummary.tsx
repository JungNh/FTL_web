import React, { FC, useMemo } from 'react'
import { Button } from 'react-bootstrap'
import { ImageResourcesType } from '../types'
import PokemonResult from '../../../../assets/images/pokemon_result.svg'
import '../styles.scss'

type Props = {
  score: any
  goBack: () => void
  quesLength: number
  results: any
  onTryAgain: () => void
  imageResources: ImageResourcesType
}

const GameSummary: FC<Props> = ({
  score,
  goBack,
  onTryAgain,
  quesLength,
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
            onClick={goBack}
          />
        </div>
        <img
          width={200}
          src={imageResources?.logo}
          className="game-logo user-drag--none"
          alt="button-back"
        />
      </div>
      <>
        {/* <div className="table-summary-pokemon" style={{ display: 'flex' }}>
          {newResult?.map((item: any, key: number) => {
            if (item?.unSelected) {
              return (
                <div key={key} className="box-finish-summary">
                  <img width={80} src={PokemonResult} alt="summary-box" />
                </div>
              )
            }
            if (item?.point) {
              return (
                <div key={key} className="box-finish-summary">
                  <img width={80} src={item?.pokemon} alt="pokemon" className="user-drag--none" />
                </div>
              )
            }
            return (
              <div key={key} className="box-finish-summary">
                <img
                  width={80}
                  className="box__wrong"
                  src={imageResources?.ico_result_wrong}
                  alt="summary-box"
                />
                <img width={80} src={imageResources?.btn_null} alt="summary-box" />
              </div>
            )
          })}
        </div> */}
        <div>
          <img width={80} className="img-result" src={PokemonResult} alt="summary-box" />
          <div className="again-game-pokemon cursor-pointer" onClick={() => onTryAgain()}>
            <p className="btn__continue--text">TRY AGAIN</p>
            <img
              className="continue-game game-button user-drag--none"
              src={imageResources?.btn}
              alt="continue-button"
            />
          </div>
        </div>
        <div className="game__name">
          <div className="game__title">RESULT BOARD</div>
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
        {/* <div className="container-again">
          <div className="again-container-text">
            <div className="again-text">Congratulations! These are what you got!</div>
            <img className="w-100" src={imageResources?.ico_board_text} alt="chat" />
          </div>
        </div> */}
      </>
    </div>
  )
}

export default GameSummary
