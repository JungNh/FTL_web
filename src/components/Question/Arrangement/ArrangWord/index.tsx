import React, { useEffect, useMemo, useState } from 'react'
import { Image } from 'react-bootstrap'
import Swal from 'sweetalert2'
import { useDispatch, useSelector } from 'react-redux'
import _ from 'lodash'
import Button from '../../../Button'
import ico_error from '../../../../assets/images/ico_error.svg'
import ico_correct from '../../../../assets/images/ico_correct.svg'
import backArrow from '../../../../assets/images/ico_arrowLeft-blue.svg'
import NavbarTest from '../../../NavbarTest'
import { shuffleArray, convertUrl } from '../../../../utils/common'
import ResultAns from '../../ResultAns'
import HandleMetas from '../HandleMetas'
import Cheering from '../../../Cheering'
import { RootState } from '../../../../store'
import { actionAddCorrect, actionAddWrong, actionCheerWrong, actionFirstCheerCorrect, actionSecondCheerCorrect, actionShowCheer } from '../../../../store/lesson/actions'

type Props = {
  lession?: {
    answers?: Answer[]
    audioUrl?: string
    id?: number
    questionExplain?: string
    questionText?: string
    questionTitle?: string
    hasImage?: boolean
  }
  onNextLession: () => void
  onSetResults: (data: any) => void
  currentTestIndex?: number
  totalTest?: number
  backCourse: () => void
  metas: any
}

type Answer = {
  audioUrl?: string
  id?: number
  imageUrl?: string
  isCorrect?: boolean
  questionId?: number
  value?: string
}

type UserAnsType = { key: number; text: string }

const ArrangWord: React.FC<Props> = ({
  lession,
  onNextLession,
  onSetResults,
  currentTestIndex,
  totalTest,
  backCourse,
  metas
}) => {
  const dispatch = useDispatch()
  const [userAns, setUserAns] = useState<UserAnsType[]>([])
  const [questionType, setQuestionType] = useState<'letter' | 'word' | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [listQuestion, setListQuestion] = useState<UserAnsType[]>([])
  const [curImageUrl, setCurImageUrl] = useState<string>('')
  const { showCheer, numberCorrect, numberWrong, correctFirstShowed, correctSecondShowed, wrongShowed } = useSelector((state: RootState) => state.lesson)

  useEffect(() => {
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
          text: word
        }))
        : valueQ.split('').map((word: string, index: number) => ({
          key: index,
          text: word
        }))
      setQuestionType(valueQ?.includes(' ') ? 'word' : 'letter')
      setListQuestion(shuffleArray(arrAnswer))
      setCurImageUrl(answerAPI?.imageUrl || undefined)
    } else {
      setListQuestion([])
      setCurImageUrl('')
    }
  }, [lession])

  const sendAnswer = async () => {
    let userString = ''
    userAns.forEach((item: UserAnsType) => {
      userString += `${item.text}${questionType === 'word' ? ' ' : ''}`
    })
    onSetResults({
      questionId: lession?.id || '',
      result: isCorrect || false,
      answer: userString?.trim(),
      score: isCorrect ? 1 : 0,
      duration: 0
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
      dispatch(actionAddCorrect())
      answerCorrect = true
    } else {
      dispatch(actionAddWrong())
      setIsCorrect(false)
    }

    onSetResults({
      questionId: lession?.id || '',
      result: answerCorrect || false,
      answer: userString?.trim(),
      score: answerCorrect ? 1 : 0,
      duration: 0
    })
  }

  const onHint = () => {
    Swal.fire({
      title: 'Gợi ý',
      text: 'Bạn có chắc chắn muốn xem gợi ý',
      confirmButtonText: 'Tôi muốn xem',
      showCancelButton: true,
      cancelButtonText: 'Không, tôi có thể làm được'
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
      icon: 'warning'
    })
      .then((results: { isConfirmed: boolean }) => {
        if (results.isConfirmed) {
          if(numberWrong == 2 && !wrongShowed){
            dispatch(actionShowCheer(true))
          } else {
            onNextLession()
          }
          setUserAns([])
          sendAnswer()
          checkShowCheer()
          dispatch(actionAddWrong())
        }
        return ''
      })
      .catch((error) => console.error(error))
  }

  const checkShowCheer = () => {
    if (numberCorrect == 5) dispatch(actionFirstCheerCorrect())
    if (numberCorrect == 10) dispatch(actionSecondCheerCorrect())
    if (numberWrong == 3) dispatch(actionCheerWrong())
  }

  const renderBody = () => {
    return (
      <div className='bg_renderBody'>
        <p className="subTitle__lession">{lession?.questionTitle || ''}</p>
        <p className="title__lession mb-5">{lession?.questionText || ''}</p>
        {lession?.hasImage && (
          <div className="main__question mb-4">
            <div className="card__lession">
              <Image src={convertUrl(curImageUrl, 'image')} className="question__images" />
              <p className="fw-bold image__text">{lession?.questionText || ''}</p>
            </div>
          </div>
        )}
        <HandleMetas metas={metas} />
        <div className="d-flex align-items-center justify-content-center mb-4">
          <div
            className={`answer__box ${isCorrect !== null ? (isCorrect ? 'correct' : 'error') : ''}`}
          >
            {userAns?.map((item: { key: number; text: string }) => (
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
      </div>
    )
  }

  return (
    <div className="lession__translate--order">
      <Button.Shadow
        className="button__back"
        color="gray"
        content={<img src={backArrow} alt="back" />}
        onClick={() => backCourse()}
      />
      {showCheer ? <Cheering /> : renderBody()}

      <NavbarTest
        currentTest={(currentTestIndex || 0) + 1}
        totalTest={totalTest}
        onCheck={() => {
          if (showCheer) {
            dispatch(actionShowCheer(false))
            onNextLession()
            checkShowCheer()
          } else {
            onCheck()
          }
        }}
        onHint={onHint}
        onSkip={onSkip}
        isDisabled={_.isEmpty(userAns) && !showCheer}
      />

      <ResultAns
        showCheerScreen={() => {
          dispatch(actionShowCheer(true))
          setIsCorrect(null)
        }}
        onContinue={() => {
          setIsCorrect(null)
          onNextLession()
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

export default ArrangWord
