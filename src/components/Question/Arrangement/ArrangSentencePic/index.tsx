import React, { useState, useEffect, useMemo } from 'react'
import { Image } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import Swal from 'sweetalert2'
import _ from 'lodash'
import Button from '../../../Button'
import ico_error from '../../../../assets/images/ico_error.svg'
import ico_correct from '../../../../assets/images/ico_correct.svg'
import backArrow from '../../../../assets/images/ico_arrowLeft-blue.svg'
import NavbarTest from '../../../NavbarTest'
import { shuffleArray, openError, convertUrl } from '../../../../utils/common'
import { actionSendAnswer } from '../../../../store/lesson/actions'
import ResultAns from '../../ResultAns'
import KImage from '../../../KImage'

type Props = {
  lession?: {
    answers?: AnswerType[]
    audioUrl?: string
    id?: number
    imageText?: string
    metas?: MetaType[]
    questionExplain?: string
    questionText?: string
    questionTitle?: string
  }
  onNextLession: () => void
  onSetResults: (data: any) => void
  currentTestIndex?: number
  totalTest?: number
  backCourse: () => void
}

type AnswerType = {
  audioUrl?: string
  id?: number
  imageUrl?: string
  isCorrect?: boolean
  questionId?: number
  value?: string
}
type MetaType = {
  id?: number
  key?: string
  questionId?: number
  value?: string
}

type UserAnsType = { key: number; text: string }

const ArrangSentencePic: React.FC<Props> = ({
  lession,
  onNextLession,
  onSetResults,
  currentTestIndex,
  totalTest,
  backCourse,
}) => {
  const [userAns, setUserAns] = useState<UserAnsType[]>([])
  const [questionType, setQuestionType] = useState<'letter' | 'word' | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [listQuestion, setListQuestion] = useState<UserAnsType[]>([])
  const [questImage, setQuestImage] = useState<string>('')

  useEffect(() => {
    if (!_.isEmpty(lession) && !_.isEmpty(lession?.metas)) {
      const listMetas: any = lession?.metas
      const objImage: any = listMetas.find((item: any) => item?.key === 'image')
      if (!_.isEmpty(objImage)) {
        setQuestImage(objImage?.value)
      } else {
        setQuestImage('')
      }
    }
    setUserAns([])
    setIsCorrect(null)
    if (!_.isEmpty(lession)) {
      const answerAPI = JSON.parse(lession?.answers?.[0]?.value || '')?.[0]
      const valueQ: string = answerAPI?.value?.trim() || ''

      /**
       * @valueQ : Đáp án đúng từ API
       */
      const arrAnswer: { key: number; text: string }[] = valueQ.includes(' ')
        ? valueQ.split(' ').map((word: string, index: number) => ({
          key: index,
          text: word,
        }))
        : valueQ.split('').map((word: string, index: number) => ({
          key: index,
          text: word,
        }))
      setQuestionType(valueQ?.includes(' ') ? 'word' : 'letter')
      setListQuestion(shuffleArray(arrAnswer))
    } else {
      setListQuestion([])
    }
  }, [lession])

  const sendAnswer = async () => {
    let userString = ''
    userAns.forEach((item: UserAnsType) => {
      userString += `${item.text}${questionType === 'word' ? ' ' : ''}`
    })

    // const dataAns: any = await dispatch(
    //   actionSendAnswer({
    //     questionId: lession?.id || '',
    //     result: isCorrect || false,
    //     answer: userString?.trim(),
    //     score: isCorrect ? 1 : 0,
    //     duration: 0
    //   })
    // )
    onSetResults({
      questionId: lession?.id || '',
      result: isCorrect || false,
      answer: userString?.trim(),
      score: isCorrect ? 1 : 0,
      duration: 0,
    })
  }

  const correctString = useMemo(() => {
    let text = ''
    _.orderBy(listQuestion, 'key', 'asc').forEach((item: UserAnsType) => {
      text += `${item.text}${questionType === 'word' ? ' ' : ''}`
    })
    return text?.trim()
  }, [listQuestion, questionType])

  const onCheck = () => {
    let userString = ''
    let answerCorrect = false
    userAns.forEach((item: UserAnsType) => {
      userString += `${item.text}${questionType === 'word' ? ' ' : ''}`
    })
    if (userString?.trim()?.toUpperCase() === correctString?.trim()?.toUpperCase()) {
      setIsCorrect(true)
      answerCorrect = true
    } else {
      setIsCorrect(false)
    }

    onSetResults({
      questionId: lession?.id || '',
      result: answerCorrect || false,
      answer: userString?.trim(),
      score: answerCorrect ? 1 : 0,
      duration: 0,
    })
  }

  const onHint = () => {
    Swal.fire({
      title: 'Gợi ý',
      text: 'Bạn có chắc chắn muốn xem gợi ý',
      confirmButtonText: 'Tôi muốn xem',
      showCancelButton: true,
      cancelButtonText: 'Không, tôi có thể làm được',
    })
      .then((results: { isConfirmed: boolean }) => {
        if (results.isConfirmed) {
          Swal.fire('Gợi ý !', lession?.questionExplain, 'info')
        }
        return ''
      })
      .catch((error) => console.error(error))
  }
  const onSkip = () => {
    Swal.fire({
      title: 'Bạn muốn bỏ qua bài tập này',
      text: 'Bài tập này sẽ không được tính điểm',
      confirmButtonText: 'Bỏ qua',
      showCancelButton: true,
      cancelButtonText: 'Ở lại',
      icon: 'warning',
    })
      .then((results: { isConfirmed: boolean }) => {
        if (results.isConfirmed) {
          sendAnswer()
        }
        return ''
      })
      .catch((error) => console.error(error))
  }

  return (
    <div className="lession__arrange--sentence--pic pb-5">
      <p className="subTitle__lession">{lession?.questionTitle}</p>
      <p className="title__lession mb-5">{`${lession?.questionText}`}</p>
      
      <Button.Shadow
        className="button__back"
        color="gray"
        content={<img src={backArrow} alt="back" />}
        onClick={() => backCourse()}
      />
      <div className="main__question mb-4">
        <div className="text__holder">
          <Image src={questImage} className="question__images" />
        </div>
      </div>

      <div className="d-flex align-items-center justify-content-center mb-4">
        <div
          className={`answer__box ${isCorrect !== null ? (isCorrect ? 'correct' : 'error') : ''}`}
        >
          {userAns.map((item: { key: number; text: string }) => (
            <div className="mx-1 mb-2" key={item?.key}>
              <Button.Shadow
                className="answer_btn"
                content={item?.text || ''}
                block
                color="blue"
                onClick={() => {
                  if (isCorrect !== null) setIsCorrect(null)
                  const newListAns = userAns.filter((a: UserAnsType) => a.key !== item.key)
                  setUserAns(newListAns)
                }}
                disabled={isCorrect !== null}
              />
            </div>
          ))}
        </div>
      </div>

      {isCorrect !== null && (
        <div className="d-flex justify-content-center">
          <img className="mx-auto" src={isCorrect ? ico_correct : ico_error} alt="results" />
        </div>
      )}

      <div className="answers__section d-flex align-items-center flex-wrap">
        {listQuestion.map((item: UserAnsType) => {
          const isHidden = userAns.findIndex((i: UserAnsType) => i.key === item.key) >= 0
          return (
            <div className={`mx-1 mb-2 ${isHidden && 'd-hidden'}`} key={item.key}>
              <Button.Shadow
                className="answer_btn"
                content={item.text || ''}
                block
                color="gray"
                disabled={isHidden || isCorrect !== null}
                onClick={() => {
                  if (isCorrect !== null) setIsCorrect(null)
                  const newListAns = [...userAns]
                  newListAns.push(item)
                  setUserAns(newListAns)
                }}
              />
            </div>
          )
        })}
      </div>

      <NavbarTest
        currentTest={(currentTestIndex || 0) + 1}
        totalTest={totalTest}
        onCheck={onCheck}
        onHint={onHint}
        onSkip={onSkip}
        isDisabled={_.isEmpty(userAns)}
      />
      <ResultAns
        onContinue={() => {
          onNextLession()
          setIsCorrect(null)
        }}
        show={isCorrect !== null}
        correct={!!isCorrect}
        explain={lession?.questionExplain}
        correctAns={correctString}
        questionId={lession?.id || 0}
        isLastQuestion={(currentTestIndex || 0) + 1 === (totalTest || 0)}
      />
    </div>
  )
}

export default ArrangSentencePic
