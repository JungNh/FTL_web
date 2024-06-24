import React, { useEffect, useState } from 'react'
import { Image } from 'react-bootstrap'
import TweenOne from 'rc-tween-one'
import { AnswerType, ImageResourcesType } from '../../types'

type Props = {
  imageResources: ImageResourcesType
  onSelectAnswer: (ans: AnswerType) => void
  listAnswers: AnswerType[]
  questionText: string
}

const SectionAnswers = ({
  questionText, imageResources, onSelectAnswer, listAnswers,
}: Props) => {
  const [isLockSelectAns, setIsLockSelectAns] = useState(true)
  const [selectedBall, setSelectedBall] = useState<number | null>(null)

  useEffect(() => {
    if (listAnswers) {
      setIsLockSelectAns(false)
      setSelectedBall(null)
    }
  }, [listAnswers])

  const animationBall = {
    rotate: -720,
    opacity: 1,
    duration: 1000,
    onComplete: () => {
      onSelectAnswer(listAnswers[selectedBall || 0])
    },
  }

  const onSelect = (index: number) => {
    if (!isLockSelectAns) {
      setSelectedBall(index)
      setIsLockSelectAns(true)
      // onSelectAnswer(ans)
    }
  }

  return (
    <div className="answers__container">
      <div className="answers__container--ans">
        <div className="question__text">
          <Image className="image--board" src={imageResources.btn_answer} />
          <p className="question__text--content">{questionText}</p>
        </div>
        {listAnswers.slice(0, 4)?.map((ans, index) => (
          <div
            className={`answers__item ${isLockSelectAns ? 'no-hover' : ''}`}
            onClick={() => onSelect(index)}
            key={ans.id}
          >
            <Image className="answers__item--board" src={imageResources.btn_answer} />
            <TweenOne
              className="answers__item--ball"
              animation={selectedBall === index ? animationBall : undefined}
            >
              <Image className="answers__item--image" src={imageResources.ico_ball_small} />
            </TweenOne>
            <p className="answers__item--text">{ans.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SectionAnswers
