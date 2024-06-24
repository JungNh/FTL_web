import React, { useEffect, useState } from 'react'
import { Image } from 'react-bootstrap'
import { AnswerType, ImageResourcesType } from '../../types'

type Props = {
  imageResources: ImageResourcesType
  onSelectAnswer: (ans: AnswerType) => void
  listAnswers: AnswerType[]
}

const SectionAnswers = ({ imageResources, onSelectAnswer, listAnswers }: Props) => {
  const [isLockSelectAns, setIsLockSelectAns] = useState(true)

  useEffect(() => {
    if (listAnswers) {
      setIsLockSelectAns(false)
    }
  }, [listAnswers])

  const onSelect = (ans: AnswerType) => {
    if (!isLockSelectAns) {
      setIsLockSelectAns(true)
      onSelectAnswer(ans)
    }
  }

  return (
    <div className="answers__container">
      {listAnswers?.map((ans) => (
        <div
          className={`answers__item ${isLockSelectAns ? 'no-hover' : ''}`}
          onClick={() => onSelect(ans)}
          key={ans.id}
        >
          <Image
            className="answers__item--board"
            src={isLockSelectAns ? imageResources.btn_answer_off : imageResources.btn_answer}
          />
          <p className="answers__item--text">{ans.value}</p>
        </div>
      ))}
    </div>
  )
}

export default SectionAnswers
