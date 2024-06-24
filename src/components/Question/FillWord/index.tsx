import Sound from 'react-sound'
import React, { useState, useEffect } from 'react'

import Swal from 'sweetalert2'
import { Image } from 'react-bootstrap'
import _ from 'lodash'
import Button from '../../Button'
import backArrow from '../../../assets/images/ico_arrowLeft-blue.svg'
import NavbarTest from '../../NavbarTest'
import ResultAns from '../ResultAns'
import Input from '../../Input'
import { cleanSentence, convertUrl } from '../../../utils/common'
import ico_sound from '../../../assets/images/ico_sound-white.svg'
import ReactHtmlParser from 'react-html-parser'
import HandleMetas from '../Arrangement/HandleMetas'
import { useDispatch, useSelector } from 'react-redux'
import {
  actionAddCorrect,
  actionAddWrong,
  actionCheerWrong,
  actionFirstCheerCorrect,
  actionSecondCheerCorrect,
  actionShowCheer
} from '../../../store/lesson/actions'
import Cheering from '../../Cheering'
import { RootState } from '../../../store'
import start_cheer from '../../../assets/images/start_cheer.png'

type Props = {
  lession?: {
    id?: number
    questionTitle?: string
    questionText?: string
    questionExplain?: string
    audioUrl?: string
    answers?: any[]
    metas?: any
    type?: string
  }
  onSetResults: (data: any) => void
  onNextLession: () => void
  currentTestIndex?: number
  totalTest?: number
  backCourse: () => void
}

const FillWord: React.FC<Props> = ({
  lession,
  onNextLession,
  onSetResults,
  currentTestIndex,
  totalTest,
  backCourse
}) => {
  const dispatch = useDispatch()
  const [feedBackResult, setFeedBackResult] = useState<boolean | null>(null)
  const [userAns, setUserAns] = useState<string>('')
  const [correctAns, setCorrectAns] = useState<string[]>([])
  const [audioQuesUrl, setAudioQuesUrl] = useState<string | null>(null)
  const [imageQuesUrl, setImageQuesUrl] = useState<string | null>(null)
  const [isListening, setIsListening] = useState<boolean>(true)
  const {
    numberCorrect,
    numberWrong,
    correctFirstShowed,
    correctSecondShowed,
    wrongShowed,
    showCheer
  } = useSelector((state: RootState) => state.lesson)
  useEffect(() => {
    document.getElementById('inputAns')?.focus()
    setUserAns('')
    if (!_.isEmpty(lession?.answers)) {
      const arrAnswer: any = lession?.answers
      const objCorrect: any = !_.isEmpty(arrAnswer) ? arrAnswer[0] : {}
      const valueAns: any = !_.isEmpty(objCorrect) ? JSON.parse(objCorrect?.value) : []

      if (!_.isEmpty(valueAns)) {
        if (lession?.type === 'fill_word_multiple_answer') {
          setCorrectAns(valueAns.map((i: string) => i.trim()))
        }
        if (lession?.type === 'fill_word_multiple') {
          setCorrectAns(valueAns.map((i: any) => i?.value?.trim()))
        }
      } else {
        setCorrectAns([])
      }
    }
    // const audioObj = lession?.metas?.find((item: any) => item?.key === 'audio')
    // if (audioObj?.value) {
    //   setAudioQuesUrl(convertUrl(audioObj?.value) || null)
    // }
    // const imageObj = lession?.metas?.find((item: any) => item?.key === 'image')
    // if (imageObj?.value) {
    //   setImageQuesUrl(convertUrl(imageObj?.value, 'image') || null)
    // }
  }, [lession])

  const sendAnswer = async (result: boolean) => {
    onSetResults({
      questionId: lession?.id,
      result,
      answer: userAns ? userAns : '',
      score: 0,
      duration: 0
    })
  }

  const onCheck = () => {
    const listCorrectAns = correctAns.map((i) => cleanSentence(i))
    if (listCorrectAns.includes(cleanSentence(userAns))) {
      sendAnswer(true)
      setFeedBackResult(true)
      dispatch(actionAddCorrect())
    } else {
      sendAnswer(false)
      dispatch(actionAddWrong())
      setFeedBackResult(false)
    }
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
      .catch((error: any) => console.error(error))
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
          if (numberWrong == 2 && !wrongShowed) {
            dispatch(actionShowCheer(true))
          } else {
            onNextLession()
          }
          setUserAns('')
          sendAnswer(false)
          checkShowCheer()
          dispatch(actionAddWrong())
        }
        return ''
      })
      .catch((error: any) => console.error(error))
  }

  const checkShowCheer = () => {
    if (numberCorrect == 5) dispatch(actionFirstCheerCorrect())
    if (numberCorrect == 10) dispatch(actionSecondCheerCorrect())
    if (numberWrong == 3) dispatch(actionCheerWrong())
  }

  const renderBody = () => {
    return (
      <div className="bg_renderBody">
        <p className="subTitle__lession ">{lession?.questionTitle || ''}</p>
        <p className="title__lession mb-5">{ReactHtmlParser(lession?.questionText) || ''}</p>
        <HandleMetas metas={lession?.metas} />
        {imageQuesUrl && (
          <div className="ques__image--container">
            <Image className="ques__image" src={imageQuesUrl} draggable={false} />
          </div>
        )}
        <div className="answers__section d-flex align-items-center">
          <Input.TextArea
            id="inputAns"
            value={userAns}
            className="resize-none"
            onChange={(data: string) => setUserAns(data)}
            placeholder="Điền câu trả lời vào đây"
            rows={3}
            maxLength={1000}
            autoFocus
            disabled={feedBackResult !== null}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="lession__fillWord">
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
        isDisabled={!userAns && !showCheer}
      />
      <ResultAns
        showCheerScreen={() => {
          dispatch(actionShowCheer(true))
          setFeedBackResult(null)
        }}
        onContinue={() => {
          setFeedBackResult(null)
          onNextLession()
        }}
        show={feedBackResult !== null}
        correct={!!feedBackResult}
        explain={lession?.questionExplain}
        correctAns={correctAns.join('/ ')}
        questionId={lession?.id || 0}
        isLastQuestion={(currentTestIndex || 0) + 1 === (totalTest || 0)}
      />
    </div>
  )
}

export default FillWord
