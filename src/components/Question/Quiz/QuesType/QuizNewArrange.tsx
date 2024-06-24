import React, { useEffect, useMemo, useState } from 'react'
import { Image } from 'react-bootstrap'
import _ from 'lodash'
import Button from '../../../Button'
import { shuffleArray, convertUrl, cleanSentence } from '../../../../utils/common'
import { QuestionType } from './types'
import SubTitleQues from '../SubTitleQues'
import HandleMetas from '../../Arrangement/HandleMetas'

type Props = {
  question: any
  quesIndex: number
  setAnswer: (answers: any) => void
  answers: { isCorrect: boolean; value: number[] }
  isAnswerShow: boolean
}

type UserAnsType = { key: number; text: string }

const QuizNewArrange: React.FC<Props> = ({
  question,
  quesIndex,
  answers,
  setAnswer,
  isAnswerShow
}) => {
  const [userAns, setUserAns] = useState<UserAnsType[]>([])
  const [correctString, setCorrectString] = useState<string>('')
  const [correctArr, setCorrectArr] = useState<UserAnsType[]>([])
  const [listQuesWord, setListQuesWord] = useState<UserAnsType[]>([])
  const [curImageUrl, setCurImageUrl] = useState<string>('')
  const [arrangementType, setArrangementType] = useState<'letter' | 'word' | null>(null)
  console.log('questionQuizNewArrange', question, answers)

  useEffect(() => {
    if (answers && listQuesWord.length && arrangementType !== null) {
      const arrAnswer = answers?.value || []
      const convertAns: (UserAnsType | undefined)[] = arrAnswer?.map((item: number) =>
        listQuesWord.find((v) => v.key === item)
      )

      setUserAns(_.compact(convertAns))
    }
    return () => {
      setUserAns([])
    }
  }, [answers, arrangementType, listQuesWord, userAns.length])

  const getCorrect = useMemo(() => {
    let text = ''
    _.orderBy(listQuesWord, 'key', 'asc').forEach((item: UserAnsType) => {
      text += `${item.text || ''}`
    })
    setCorrectString(text?.trim())
    return text?.trim()
  }, [listQuesWord])

  const getQuestionText = useMemo(() => {
    let text = ''
    listQuesWord.forEach((item: UserAnsType, index: number) => {
      text += index < listQuesWord.length - 1 ? `${item.text}/` : `${item.text}`
    })
    setCorrectString(text?.trim())
    return text?.trim()
  }, [listQuesWord])

  useEffect(() => {
    if (!_.isEmpty(question)) {
      const answerAPI = JSON.parse(question?.answers?.[0]?.value || '')?.[0]
      const questionText: string = answerAPI?.value?.trim() || ''
      const questions: any = questionText?.split('/')
      const arrAnswer: { key: number; text: string }[] = questions?.map(
        (word: string, index: number) => ({
          key: index,
          text: word
        })
      )
      setArrangementType('word')
      // setCorrectArr(arrAnswer)
      setListQuesWord(shuffleArray(arrAnswer))
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
      userString += `${item?.text || ''}`
    })

    const isCorrect =
      userString?.toUpperCase()?.replace(/\s/g, '') ===
      getCorrect?.toUpperCase()?.replace(/\s/g, '')

    console.log(
      'isCorrect',
      isCorrect,
      userString?.toUpperCase()?.replace(/\s/g, ''),
      getCorrect?.toUpperCase()?.replace(/\s/g, '')
    )
    setAnswer({
      questionId: question.id,
      isCorrect,
      score: isCorrect ? 1 : 0,
      value: ans?.map((a: UserAnsType) => a?.key || 0),
      valueString: userString.trim(),
      desCorrectAns: correctString?.trim(),
      desUserAns: userString?.trim()
    })
    // setUserAns(ans)
  }

  return (
    <div className="lession__translate--order pb-5" style={{ paddingTop: 0 }}>
      <p className="question__title">
        Câu hỏi 
        {quesIndex + 1}
      </p>
      <p className="subTitle__lession">{question?.questionText}</p>
      <p className="subTitle__lession">{question?.questionTitle}</p>
      <p className="title__lession mb-5">{getQuestionText}</p>
      <HandleMetas metas={question?.metas} />

      <div className="d-flex align-items-center justify-content-center mb-4">
        <div className="answer__box">
          {userAns?.map((item: { key: number; text: string }) => (
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
        {listQuesWord?.map((item: UserAnsType) => {
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

export default QuizNewArrange
