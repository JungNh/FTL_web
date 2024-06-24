// import _ from 'lodash'
import _ from 'lodash'
import React, { useEffect, useMemo, useState } from 'react'
import { Image } from 'react-bootstrap'
// import { randomPosition } from '../../../../../utils/common'
import { AnswerType, ImageResourcesType } from '../../types'

type Props = {
  imageResources: ImageResourcesType
  onSubmitAnswer: (ans: AnswerType) => void
  listAnswers: string[]
  correctAns: string
}

const SectionAnswers = ({ imageResources, onSubmitAnswer, listAnswers, correctAns }: Props) => {
  const [listSelected, setListSelected] = useState<({ id: string; text: string } | null)[]>([])

  console.log('listSelected', listSelected, listAnswers, correctAns)

  useEffect(() => {
    if (listAnswers) {
      setListSelected(listAnswers?.map(() => null))
    }
  }, [listAnswers])

  const onSelect = (id: string, text: string) => {
    const indexNull = listSelected.findIndex((i) => i === null)
    if (indexNull >= 0) {
      const newList = listSelected.slice()
      newList[indexNull] = { id, text }
      setListSelected(newList)
    }
  }

  const onRemoveSelected = (id: string) => {
    const newList = listSelected.filter((i) => i?.id !== id)
    setListSelected([...newList, null])
  }

  const submitAnswer = () => {
    const userAns = _.map(listSelected, 'text').join(' ')
    console.log('==CHECK_ANSWER==', userAns, correctAns)
    const isCorrect = userAns === correctAns
    onSubmitAnswer({
      id: correctAns,
      isCorrect,
      value: userAns
    })
  }

  const isShowSubmitBtn = useMemo(() => !listSelected.includes(null), [listSelected])

  return (
    <div className="answers__container">
      <div className="answers__container--selected">
        {listSelected?.map((data: { id: string; text: string } | null, index) => {
          if (data === null) {
            return (
              <div className="answers__item" key={`${index}`}>
                <div className="answer__item--stone">
                  <Image className="stone--blank" src={imageResources.ico_blank} />
                </div>
              </div>
            )
          }
          const ans = listAnswers.find(
            (a: string, ansIndex: number) => `${ansIndex}-${a}` === data?.id
          )
          return (
            <div
              className="answers__item"
              onClick={() => onRemoveSelected(data?.id)}
              key={`${index}-${ans}`}
            >
              <div className="answer__item--stone">
                <Image className="stone--left" src={imageResources.ico_stone_left} />
                <Image className="stone--middle" src={imageResources.ico_stone_middle} />
                <Image className="stone--right" src={imageResources.ico_stone_right} />
                <Image className="stone--full" src={imageResources.ico_stone} />
              </div>
              <p className="answers__item--text">{ans}</p>
            </div>
          )
        })}
      </div>
      <div className="answers__container--not--selected">
        {listAnswers?.map((ans, index) => {
          if (_.map(listSelected, 'id')?.includes(`${index}-${ans}`)) return
          return (
            <div
              className="answers__item mt-3"
              onClick={() => onSelect(`${index}-${ans}`, ans)}
              key={`${index}-${ans}`}
            >
              <div className="answer__item--wood">
                <Image className="wood--left" src={imageResources.ico_wood_left} />
                <Image className="wood--middle" src={imageResources.ico_wood_middle} />
                <Image className="wood--right" src={imageResources.ico_wood_right} />
              </div>
              <p className="answers__item--text">{ans}</p>
            </div>
          )
        })}
      </div>
      {isShowSubmitBtn && (
        <div className="btn__continue" onClick={() => submitAnswer()}>
          <Image className="btn__continue--image" src={imageResources.btn} />
          <p className="btn__continue--text">Continue</p>
        </div>
      )}
    </div>
  )
}

export default SectionAnswers
