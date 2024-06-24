import React, { useMemo } from 'react'
import { Image, Button } from 'react-bootstrap'
import { ImageResourcesType, UserAnswerType } from '../types'

type Props = {
  userAnswers: (UserAnswerType | null)[]
  imageResources: ImageResourcesType
  onTryAgain: () => void
  results: any
}

const SummaryFinal = ({ userAnswers, imageResources, onTryAgain, results }: Props) => {
  const getImage = (isCorrect: boolean | null) => {
    switch (isCorrect) {
      case true:
        return imageResources.ico_result_correct
      case false:
        return imageResources.ico_result_wrong
      default:
        return null
    }
  }

  const imgUrlConvertedByScore = useMemo(() => {
    const score = userAnswers.filter((i: UserAnswerType | null) => i?.isCorrect).length
    const quesLength = userAnswers.length

    const percent = Math.floor((score * 100) / quesLength)
    let cupUrl = null
    if (percent >= 50) cupUrl = imageResources.ico_cup_silver
    if (percent >= 80) cupUrl = imageResources.ico_cup_silver
    if (percent === 100) cupUrl = imageResources.ico_cup_gold

    return {
      roboUrl: percent >= 50 ? imageResources.ico_robo_happy : imageResources.ico_robo_lose,
      bottom: percent >= 50 ? '4.5rem' : '0.5rem',
      // roboUrl: imageResources.ico_robo_happy,
      // bottom: '4.5rem',
      cupUrl
    }
  }, [
    imageResources.ico_cup_gold,
    imageResources.ico_cup_silver,
    imageResources.ico_robo_happy,
    imageResources.ico_robo_lose,
    userAnswers
  ])

  const getHighestScore = useMemo(() => {
    const { highestScore, unitScore } = results
    if (highestScore) {
      return unitScore > highestScore ? unitScore : highestScore
    }

    return unitScore || 0
  }, [results])

  return (
    <div className="summary__final">
      {/* <div className="summary__score--list">
        {userAnswers?.map((ans: UserAnswerType | null, index: number) => {
          const image = getImage(ans && ans?.isCorrect)
          return (
            <div key={index} className="image__score--wrapper">
              {image && <Image src={image} className="image__score--content" />}
              <Image src={imageResources.btn_null} className="image__score--btn" key={index} />
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
            <Button variant="warning">{results.unitScore}</Button>
            <Button variant="warning">{results.score}</Button>
            <Button variant="warning">{results.durationTime}</Button>
            <Button variant="warning">{getHighestScore}</Button>
          </div>
        </div>
      </div>
      <div className="continue__wraper">
        <div className="board__wraper">
          <Image className="board--image" src={imageResources.ico_board_text} />
          <div className="board--text">
            <p className="mb-0">Congratulations!</p>
            <p className="mb-0">These are what you got!</p>
          </div>
        </div>
        <div className="robo__wraper">
          <Image className="robo__image" src={imageResources.ico_robo_happy} />
          <div className="btn__try" onClick={() => onTryAgain()}>
            <Image className="btn__try--image" src={imageResources.btn} />
            <p className="btn__try--text">TRY AGAIN</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SummaryFinal
