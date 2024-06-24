import _ from 'lodash'
import React, { useEffect, useMemo, useState } from 'react'
import { Image } from 'react-bootstrap'
import { randomPosition } from '../../../../../utils/common'
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

  const listButtonImage = useMemo(() => {
    const list = [
      imageResources.btn_answer_blue,
      imageResources.btn_answer_gray,
      imageResources.btn_answer_green,
      imageResources.btn_answer_pink,
      imageResources.btn_answer_red,
      imageResources.btn_answer_teal,
      imageResources.btn_answer_yellow,
      imageResources.btn_answer_off
    ]
    if (!_.isEmpty(listAnswers)) return randomPosition(list)
    return []
  }, [
    imageResources.btn_answer_blue,
    imageResources.btn_answer_gray,
    imageResources.btn_answer_green,
    imageResources.btn_answer_off,
    imageResources.btn_answer_pink,
    imageResources.btn_answer_red,
    imageResources.btn_answer_teal,
    imageResources.btn_answer_yellow,
    listAnswers
  ])

  return (
    <div className="answers__container">
      <div className="answers__container--left">
        {listAnswers.slice(0, 4)?.map((ans, index) => (
          <div
            className={`answers__item ${isLockSelectAns ? 'no-hover' : ''}`}
            onClick={() => onSelect(ans)}
            key={ans.id}
          >
            <Image className="answers__item--board" src={listButtonImage[index]} />
            <p className="answers__item--text">{ans.value}</p>
          </div>
        ))}
      </div>
      <div className="answers__container--right">
        {listAnswers.slice(4, 8)?.map((ans, index) => (
          <div
            className={`answers__item ${isLockSelectAns ? 'no-hover' : ''}`}
            onClick={() => onSelect(ans)}
            key={ans.id}
          >
            <Image className="answers__item--board" src={listButtonImage[index + 4]} />
            <p className="answers__item--text">{ans.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SectionAnswers
