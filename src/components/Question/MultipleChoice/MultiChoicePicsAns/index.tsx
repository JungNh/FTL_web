import React, { useEffect, useMemo, useState } from 'react'
import { Col, Image, Row } from 'react-bootstrap'
import Swal from 'sweetalert2'
import ReactHtmlParser from 'react-html-parser'
import { useDispatch, useSelector } from 'react-redux'
import _ from 'lodash'
import { differenceInSeconds } from 'date-fns'
import Sound from 'react-sound'
import Button from '../../../Button'
import backArrow from '../../../../assets/images/ico_arrowLeft-blue.svg'
import NavbarTest from '../../../NavbarTest'
import ResultAns from '../../ResultAns'
import {
  actionAddCorrect,
  actionAddWrong,
  actionCheerWrong,
  actionFirstCheerCorrect,
  actionSecondCheerCorrect,
  actionSendAnswer,
  actionShowCheer
} from '../../../../store/lesson/actions'
import { openError, convertUrl } from '../../../../utils/common'
import { AnswerType, LessionType } from '../type'
import KImage from '../../../KImage'
import { RootState } from '../../../../store'
import Cheering from '../../../Cheering'

type Props = {
  lession?: LessionType
  onNextLession: () => void
  onSetResults: (data: any) => void
  currentTestIndex?: number
  totalTest?: number
  backCourse: () => void
}

const MultiChoicePicsAns: React.FC<Props> = ({
  lession,
  onNextLession,
  currentTestIndex,
  totalTest,
  backCourse,
  onSetResults
}) => {
  const dispatch = useDispatch()
  const [userAns, setUserAns] = useState<number[]>([])
  const [startTime, setStartTime] = useState<string | null>(null)
  const [correctAns, setCorrectAns] = useState<string>('')
  const [feedBackResult, setFeedBackResult] = useState<boolean | null>(null)
  const [ansAudioUrl, setAnsAudioUrl] = useState<string | null>(null)
  const {
    numberCorrect,
    numberWrong,
    correctFirstShowed,
    correctSecondShowed,
    wrongShowed,
    showCheer
  } = useSelector((state: RootState) => state.lesson)

  useEffect(() => {
    setFeedBackResult(null)
    setUserAns([])
    setStartTime(new Date().toISOString())
    if (!_.isEmpty(lession) && !_.isEmpty(lession?.answers)) {
      const listAns: any = lession?.answers
      const itemCorrect: any = listAns.filter((item: AnswerType) => item.isCorrect)
      if (!_.isEmpty(itemCorrect)) {
        setCorrectAns(itemCorrect?.map((i: AnswerType) => i?.value).join('</br>'))
      }
    }
  }, [lession])

  const onCheck = () => {
    const listCorrect: number[] = []
    lession?.answers?.forEach((item: any) => {
      if (item?.isCorrect) listCorrect.push(item.id)
    })
    if (_.isEqual(_.orderBy(userAns), _.orderBy(listCorrect))) {
      setFeedBackResult(true)
    } else {
      setFeedBackResult(false)
    }
  }
  const sendAnswer = async () => {
    const listCorrect: number[] = []
    const userValues: any[] = []
    lession?.answers?.forEach((item: any) => {
      if (item?.isCorrect) listCorrect.push(item.id)
      if (userAns.includes(item.id)) userValues.push(item?.value)
    })
    const listUserCorrect = _.intersection(listCorrect, userAns)

    // * calculate score
    let score = 0
    if (_.isEqual(_.orderBy(userAns), _.orderBy(listCorrect))) {
      dispatch(actionAddCorrect())
      score = 1
    } else if (listUserCorrect.length > 0 && listUserCorrect.length === userAns.length) {
      score = Math.floor((listUserCorrect.length * 100) / (listCorrect.length || 1)) / 100
    }
    if (score != 1 && userAns.length != 0) dispatch(actionAddWrong())
    // * calculate duration
    const duration = startTime !== null ? differenceInSeconds(new Date(), new Date(startTime)) : 0

    onSetResults({
      questionId: lession?.id,
      result: score === 1,
      answer: userValues?.join('; '),
      score,
      duration
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
          }else {
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

  const numOfCorrAns = useMemo(() => {
    let num = 0
    lession?.answers?.forEach((item: any) => {
      if (item?.isCorrect) num++
    })
    return num
  }, [lession?.answers])
  const onClickAns = (ans: AnswerType) => {
    if (feedBackResult !== null) return
    const isIncludes = userAns.includes(ans.id)
    if (numOfCorrAns >= 2) {
      if (isIncludes) {
        const newAns = userAns.filter((item) => item !== ans.id)
        setUserAns(newAns)
      }
      if (userAns.length < numOfCorrAns && !isIncludes) {
        setUserAns([...userAns, ans.id])
        if (ans?.audioUrl) setAnsAudioUrl(ans?.audioUrl)
      }
    } else if (numOfCorrAns === 1) {
      setUserAns([ans.id])
      if (ans?.audioUrl) setAnsAudioUrl(ans?.audioUrl)
    }
  }

  const checkShowCheer = () => {
    if (numberCorrect == 5) dispatch(actionFirstCheerCorrect())
    if (numberCorrect == 10) dispatch(actionSecondCheerCorrect())
    if (numberWrong == 3) dispatch(actionCheerWrong())
  }

  const renderBody = () => {
    return (
      <div className="bg_renderBody">
        <p className="subTitle__lession">{ReactHtmlParser(lession?.questionTitle || '')}</p>
        <p className="title__lession mb-5">{ReactHtmlParser(lession?.questionText || '')}</p>
        <div className="answers__section">
          <Row>
            {lession?.answers?.map((item: AnswerType) => (
              <Col xs={6} className="mb-3" key={item?.id}>
                <div
                  className={`card__lession ${userAns?.includes(item?.id) ? 'active' : ''}`}
                  onClick={() => onClickAns(item)}
                  onKeyPress={(e: any) => e.preventDefault()}
                  tabIndex={-1}
                >
                  <KImage src={convertUrl(item?.imageUrl || '', 'image')} />
                  <p className="fw-bold image__text">{ReactHtmlParser(item?.value || '')}</p>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </div>
    )
  }

  return (
    <div className="lession__multiChoicePicsAns">
      <Button.Shadow
        className="button__back"
        color="gray"
        content={<img src={backArrow} alt="back" />}
        onClick={() => backCourse()}
      />
      {showCheer ? <Cheering /> : renderBody()}
      {/* <div className="container justify-content-center">
        <div className="row justify-content-center">
          {lession?.answers?.map((item: AnswerType) => (
            <div className="p-3 col-sm-12 col-md-6">
              <div
                className={` bg_answer flex-column align-items-center justify-content-center d-md-flex d-sm-flex ${
                  userAns?.includes(item?.id) ? 'active' : ''
                }`}
                onClick={() => onClickAns(item)}
                onKeyPress={(e: any) => e.preventDefault()}
                tabIndex={-1}
              >
                <Image src={convertUrl(item?.imageUrl || '', 'image')} className="answer_choice " />
                <div className="mt-2">
                  <p className="fw-bold image__text">{ReactHtmlParser(item?.value || '')}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div> */}
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
            sendAnswer()
          }
        }}
        onHint={onHint}
        onSkip={onSkip}
        isDisabled={_.isEmpty(userAns) && !showCheer}
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
        correctAns={ReactHtmlParser(correctAns)}
        explain={lession?.questionExplain}
        questionId={lession?.id || 0}
        isLastQuestion={(currentTestIndex || 0) + 1 === (totalTest || 0)}
      />
      <Sound
        url={ansAudioUrl || ''}
        playStatus={ansAudioUrl ? 'PLAYING' : 'STOPPED'}
        playFromPosition={0}
        onLoading={() => {}}
        onPlaying={() => {}}
        onFinishedPlaying={() => setAnsAudioUrl(null)}
      />
    </div>
  )
}

export default MultiChoicePicsAns
