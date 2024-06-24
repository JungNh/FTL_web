import React, { useEffect, useState } from 'react'
import { Image } from 'react-bootstrap'
import _ from 'lodash'
import Button from '../../../../../components/Button'
import { shuffleArray, convertUrl } from '../../../../../utils/common'
import { QuestionType } from './types'

type Props = {
  question: QuestionType
  quesIndex: number
  setAnswer: (answers: any) => void
  answers: { isCorrect: boolean; value: number[] }
  isAnswerShow: boolean
}

type UserAnsType = { key: number; text: string }

const QuizArrangement: React.FC<Props> = ({
  question,
  quesIndex,
  answers,
  setAnswer,
  isAnswerShow
}) => {
  const [userAns, setUserAns] = useState<UserAnsType[]>([])
  const [correctString, setCorrectString] = useState<string>('')
  const [listQuesWord, setListQuesWord] = useState<UserAnsType[]>([])
  const [curImageUrl, setCurImageUrl] = useState<string>('')
  const [arrangementType, setArrangementType] = useState<'letter' | 'word' | null>(null)

  useEffect(() => {
    if (answers && listQuesWord.length && arrangementType !== null) {
      const arrAnswer = answers?.value || []
      const convertAns: (UserAnsType | undefined)[] = arrAnswer.map((item: number) =>
        listQuesWord.find((v) => v.key === item)
      )

      setUserAns(_.compact(convertAns))
    }
    return () => {
      setUserAns([])
    }
  }, [answers, arrangementType, listQuesWord, userAns.length])

  useEffect(() => {
    if (!_.isEmpty(question)) {
      const answerAPI = JSON.parse(question?.answers?.[0]?.value || '')?.[0]
      const valueQ: string = answerAPI?.value?.trim() || ''

      /**
       * @valueQ : Đáp án đúng từ API
       */
      const arrType = valueQ.includes(' ') ? 'word' : 'letter'
      const arrAnswer: { key: number; text: string }[] = valueQ.includes(' ')
        ? valueQ.split(' ').map((word: string, index: number) => ({
            key: index,
            text: word
          }))
        : valueQ.split('').map((word: string, index: number) => ({
            key: index,
            text: word
          }))
      setArrangementType(arrType)
      setCorrectString(valueQ)
      setListQuesWord(shuffleArray(arrAnswer))
      setCurImageUrl(answerAPI?.imageUrl || undefined)
    } else {
      setListQuesWord([])
      setCurImageUrl('')
    }
    return () => {
      setArrangementType(null)
    }
  }, [question])

  const updateAns = (ans: UserAnsType[]) => {
    let userString = ''
    ans.forEach((item: UserAnsType) => {
      userString += `${item?.text || ''}${arrangementType === 'word' ? ' ' : ''}`
    })

    const isCorrect = userString?.trim()?.toUpperCase() === correctString?.trim()?.toUpperCase()

    setAnswer({
      questionId: question.id,
      isCorrect,
      score: isCorrect ? 1 : 0,
      value: ans.map((a: UserAnsType) => a?.key || 0),
      valueString: userString.trim(),
      desCorrectAns: correctString?.trim(),
      desUserAns: userString?.trim()
    })
    // setUserAns(ans)
  }

  return (
    <div className="lession__translate--order pb-5" style={{ paddingTop: 0 }}>
      <p className="question__title">Câu hỏi {quesIndex + 1}</p>
      <p className="subTitle__lession">{question?.questionTitle}</p>
      <p className="title__lession mb-5">{question?.questionText}</p>
      {question?.hasImage && (
        <div className="main__question mb-4">
          <div className="card__lession">
            <Image src={convertUrl(curImageUrl, 'image')} />
            <p className="fw-bold image__text">{question?.questionText}</p>
          </div>
        </div>
      )}
      <div className="d-flex align-items-center justify-content-center mb-4">
        <div className="answer__box">
          {userAns.map((item: { key: number; text: string }) => (
            <div className="mx-1 mb-2" key={item?.key}>
              <Button.Shadow
                className="answer_btn"
                // style={{
                //   width: `${listQuestion[item].length || 0}rem`
                // }}
                content={item?.text || ''}
                block
                color="blue"
                onClick={() => {
                  const newListAns = userAns.filter((a: UserAnsType) => a.key !== item.key)
                  updateAns(newListAns)
                }}
                disabled={isAnswerShow}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="answers__section d-flex align-items-center flex-wrap">
        {listQuesWord.map((item: UserAnsType) => {
          const isHidden = userAns.findIndex((i: UserAnsType) => i.key === item.key) >= 0
          return (
            <div className={`mx-1 mb-2 ${isHidden && 'd-hidden'}`} key={item.key}>
              <Button.Shadow
                className="answer_btn"
                content={item.text || ''}
                block
                color="gray"
                disabled={isHidden || isAnswerShow}
                onClick={() => {
                  const newListAns = [...userAns]
                  newListAns.push(item)
                  updateAns(newListAns)
                }}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default QuizArrangement
