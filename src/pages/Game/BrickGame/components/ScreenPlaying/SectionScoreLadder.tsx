import React from 'react'
import { Image } from 'react-bootstrap'
import { ImageResourcesType } from '../../types'

const SectionScoreLadder = ({
  imageResources,
  maxQuestionScore,
  questionLength
}: {
  imageResources: ImageResourcesType
  maxQuestionScore: number
  questionLength: number
}) => {
  const maxQuestionScoreMap = {
    [`${Math.round(100 / questionLength)}`]: 5,
    [`${Math.round(((100 / questionLength) * 70) / 100)}`]: 3,
    [`${Math.round(((100 / questionLength) * 40) / 100)}`]: 1,
  }

  return (
    <section className="score__container">
      <Image
        className={`ico__score--arrow score-${maxQuestionScoreMap[maxQuestionScore]}`}
        src={imageResources.ico_score_arrow}
      />
      <Image className="ico__score--ladder" src={imageResources.ico_score_ladder} />
      <div className="ico__score--point ico__score--point-5">
        <Image className="icon__score--pointBoard" src={imageResources.ico_score_point} />
        <p className="icon__score--pointText">{Math.round(100 / questionLength)}</p>
      </div>
      <div className="ico__score--point ico__score--point-3">
        <Image className="icon__score--pointBoard" src={imageResources.ico_score_point} />
        <p className="icon__score--pointText">{Math.round(((100 / questionLength) * 70) / 100)}</p>
      </div>
      <div className="ico__score--point ico__score--point-1">
        <Image className="icon__score--pointBoard" src={imageResources.ico_score_point} />
        <p className="icon__score--pointText">{Math.round(((100 / questionLength) * 40) / 100)}</p>
      </div>
    </section>
  )
}

export default SectionScoreLadder
