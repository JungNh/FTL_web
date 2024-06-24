import React, { Suspense, useEffect, useMemo, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import Swal from 'sweetalert2'
import _ from 'lodash'
import ReactHtmlParser from 'react-html-parser'
import AudioPlayer, { RHAP_UI } from 'react-h5-audio-player'
import { differenceInSeconds } from 'date-fns'
import Sound from 'react-sound'
import Button from '../../../Button'
import backArrow from '../../../../assets/images/ico_arrowLeft-blue.svg'
import ico_sound from '../../../../assets/images/ico_sound-blue.svg'
import ResultAns from '../../ResultAns'
import NavbarTest from '../../../NavbarTest'
import { convertUrl } from '../../../../utils/common'
import { AnswerType, LessionType } from '../type'
import KImage from '../../../KImage'
import { Image } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../../store'
import Cheering from '../../../Cheering'
import {
  actionAddCorrect,
  actionAddWrong,
  actionCheerWrong,
  actionFirstCheerCorrect,
  actionSecondCheerCorrect,
  actionShowCheer
} from '../../../../store/lesson/actions'

type Props = {
  lession?: LessionType
  onNextLession: () => void
  onSetResults: (data: any) => void
  currentTestIndex?: number
  totalTest?: number
  backCourse: () => void
}

const MultiChoiceWithPic: React.FC<Props> = ({
  lession,
  onNextLession,
  currentTestIndex,
  totalTest,
  backCourse,
  onSetResults
}) => {
  const dispatch = useDispatch()
  const [isListening, setIsListening] = useState(false)
  const [userAns, setUserAns] = useState<number[]>([])
  const [feedBackResult, setFeedBackResult] = useState<boolean | null>(null)
  const audioPlayer = React.createRef<AudioPlayer>()
  const [questImage, setQuestImage] = useState<string>('')
  const [questAudio, setQuestAudio] = useState<string>('')
  const [correctAns, setCorrectAns] = useState<string>('')
  const [startTime, setStartTime] = useState<string | null>(null)
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
    if (!_.isEmpty(lession) && !_.isEmpty(lession?.metas)) {
      const listMetas: any = lession?.metas
      const objImage: any = listMetas.find((item: any) => item?.key === 'image')
      const objAudio: any = listMetas.find((item: any) => item?.key === 'audio')
      if (!_.isEmpty(objImage)) {
        setQuestImage(objImage?.value)
      } else {
        setQuestImage('')
      }
      if (!_.isEmpty(objAudio)) {
        setQuestAudio(objAudio?.value)
      } else {
        setQuestAudio('')
      }
    }
  }, [lession])
  const playAudio = () => {
    if (audioPlayer.current?.audio?.current?.src) {
      audioPlayer.current.audio.current
        .play()
        .then(() => setIsListening(true))
        .catch(() => {
          Swal.fire(
            'File âm thanh của câu hỏi không hợp lệ',
            'Vui lòng báo cáo lỗi câu hỏi cho chúng tôi',
            'error'
          )
        })
    } else {
      Swal.fire('Câu hỏi không có âm thanh', '', 'error')
    }
  }
  const pauseAudio = () => {
    if (audioPlayer.current?.audio?.current?.src) {
      audioPlayer.current.audio.current.pause()
      setIsListening(false)
    } else {
      Swal.fire('Câu hỏi không có âm thanh', '', 'error')
    }
  }

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

    if (score == 0 && userAns.length != 0) {
      dispatch(actionAddWrong())
    }
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
          if (numberWrong == 2 && !wrongShowed) {
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

  const numOfCorrAns = useMemo(() => {
    let num = 0
    lession?.answers?.forEach((item: any) => {
      if (item?.isCorrect) num++
    })
    return num
  }, [lession?.answers])

  const onClickAns = (ans: AnswerType) => {
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
    // setCurrentIndex(index)
  }

  const renderBody = () => {
    return (
      <div className="bg_renderBody">
        <p className="subTitle__lession">{ReactHtmlParser(lession?.questionTitle || '')}</p>
        <p className="title__lession mb-2">{ReactHtmlParser(lession?.questionText || '')}</p>
        <div className="main__question mb-4">
          <KImage className="main__question--image" src={convertUrl(questImage, 'image') || ''} />
        </div>
        {questAudio && (
          <div className="d-flex align-items-center justify-content-center">
            <img
              src={ico_sound}
              alt="sound"
              className="cursor-pointer"
              onClick={() => {
                if (!isListening) playAudio()
                if (isListening) pauseAudio()
              }}
            />
          </div>
        )}

        <div className="answers__section">
          {questAudio && (
            <AudioPlayer
              ref={audioPlayer}
              autoPlay={false}
              src={convertUrl(questAudio, 'audio')}
              showJumpControls={false}
              customControlsSection={[<div key="blank" className="w-100" />, RHAP_UI.CURRENT_TIME]}
              customProgressBarSection={[RHAP_UI.PROGRESS_BAR]}
              layout="stacked-reverse"
              style={{ boxShadow: 'none' }}
              className="audioPlayer_custom"
              onEnded={() => pauseAudio()}
              onError={() => Swal.fire('Lỗi', 'File âm thanh của câu hỏi lỗi', 'error')}
            />
          )}
          <Row>
            {lession?.answers?.map((item: AnswerType) => (
              <Col xs={6} className="mb-3" key={item?.id}>
                <Button.Shadow
                  className="answer_btn"
                  content={ReactHtmlParser(item?.value || '')}
                  block
                  color={userAns?.includes(item?.id) ? 'blue' : 'gray'}
                  onClick={() => onClickAns(item)}
                  onKeyPress={(e: any) => {
                    e.preventDefault()
                  }}
                  tabIndex={-1}
                  disabled={feedBackResult !== null}
                />
              </Col>
            ))}
          </Row>
        </div>
      </div>
    )
  }

  return (
    <div className="lession__multiChoice--picture ">
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
        explain={lession?.questionExplain || ''}
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

export default MultiChoiceWithPic
