/* eslint-disable react/require-default-props */
import React, { FC, useEffect, useMemo, useRef, useState } from 'react'
import { Image, Spinner } from 'react-bootstrap'
import { SwitchTransition, CSSTransition } from 'react-transition-group'
import { useDispatch } from 'react-redux'
import Swal from 'sweetalert2'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import ico_sound from '../../../assets/images/ico_sound-green.svg'
import backArrow from '../../../assets/images/ico_arrowLeft-blue.svg'
import ico_record from '../../../assets/images/ico_record-white.svg'
import ico_doubleArrLeft from '../../../assets/images/ico_doubleArr-left.svg'
import ico_doubleArrRight from '../../../assets/images/ico_doubleArr-right.svg'
import Button from '../../Button'
import NavbarTest from '../../NavbarTest'
import {
  checkPointEng,
  cleanAndSplitSentence,
  convertUrl,
  handleTextEN,
  openError
} from '../../../utils/common'
import useKeyBoard from '../../../utils/keybroad'
import useRecorder from '../../../utils/useRecorder'
import { speechToText } from '../../../store/lesson/actions'
import { actionGetHomophones } from '../../../store/study/actions'

type Props = {
  detailData: {
    id?: number
    key?: string
    questionId?: number
    value: DataVocal
  }
  changeWord: (data: 'prev' | 'next') => void
  onClose: () => void
  handleScoreCorrect?: any
  dataLength: number
  currentIndex: number | null
}
type DataVocal = {
  audio?: string
  mean?: string
  partOfSpeech?: string
  spell?: string
  thumb?: string
  word?: string
}

type WordType = {
  id: number | null
  letters: string[]
}

const DetailWord: FC<Props> = ({
  dataLength,
  currentIndex,
  detailData,
  changeWord,
  onClose,
  handleScoreCorrect
}) => {
  const audioRef = useRef<HTMLAudioElement>(null)
  const { listening, resetTranscript, finalTranscript } = useSpeechRecognition()
  const dispatch = useDispatch()
  const [isPlay, setIsPlay] = useState(false)
  const [isConverting, setIsConverting] = useState(false)
  const [ansHomos, setAnsHomos] = useState<WordType[]>([])
  const [userHomos, setUserHomos] = useState<WordType[]>([])
  const [answerChecked, setAnswerChecked] = useState<any>(null)

  const handleLoadData = () => {
    if (isPlay && audioRef?.current?.play) {
      audioRef.current.play()
    }
  }
  const playSound = () => {
    if (!audioRef.current?.src) return
    if (isPlay && audioRef.current?.currentTime && audioRef?.current?.pause) {
      setIsPlay(false)
      audioRef.current.currentTime = 0
      audioRef.current.pause()
    } else if (audioRef?.current?.play) {
      setIsPlay(true)
      audioRef.current.play()
    }
  }

  useEffect(() => {
    setUserHomos([])
    setAnswerChecked(null)
  }, [detailData])

  useEffect(() => {
    const getHomoPhones = async (item: any) => {
      const words = item.split(' ')
      const homoWords: any[] = await Promise.all(
        words.map(async (word: string) => {
          const cleanWord = word?.toLowerCase()
          const response: any = await dispatch(actionGetHomophones({ word: cleanWord || '' }))
          if (response) {
            let arr: any = []
            Object.keys(response).forEach(function (key) {
              if (key.includes('word') && response[key] !== null) arr.push(response[key])
            })
            return { text: word, homo: arr }
          }
          return { text: word, homo: [] }
        })
      )
      console.log('homoWords', homoWords)
      setAnsHomos(homoWords)
    }

    getHomoPhones(detailData?.value?.word)
  }, [detailData, dispatch])

  useEffect(() => {
    const convertSpeechToText = async () => {
      if (finalTranscript) {
        console.log('finalTranscript',finalTranscript)
        let arrScript = handleTextEN(finalTranscript).split(' ')
        const restCompare: any = checkPointEng(ansHomos, arrScript)
        console.log('restCompare', restCompare, arrScript)
        if (restCompare?.point == 100) {
          handleScoreCorrect()
        }
        setAnswerChecked(restCompare)
      }
    }
    convertSpeechToText()
  }, [dispatch, finalTranscript])

  const keyBoard = useKeyBoard()

  useEffect(() => {
    if (keyBoard !== null) {
      if (keyBoard === 'ArrowRight' || keyBoard === 'ArrowUp' || keyBoard === 'Enter') {
        changeWord('next')
      }
      if (keyBoard === 'ArrowLeft' || keyBoard === 'ArrowDown') {
        changeWord('prev')
      }
      if (keyBoard === 'r') {
        playSound()
      }
    }
  }, [keyBoard])
  const recordVoice = () => {
    setAnswerChecked(null)
    try {
      const isSupport = SpeechRecognition.browserSupportsSpeechRecognition()
      if (!isSupport) {
        Swal.fire(
          'Trình duyệt không hỗ trợ nhận diện giọng nói',
          'Vui lòng liên hệ quản trị viên',
          'error'
        )
        return
      }
      navigator.mediaDevices.getUserMedia({ audio: true }).then(() => {
        if (!isConverting) {
          if (listening) {
            SpeechRecognition.stopListening()
          } else {
            SpeechRecognition.startListening({ language: 'en' })
          }
        }
      })
    } catch (error) {
      Swal.fire(
        'Trang web không được cấp phép ghi âm',
        'Vui lòng cấp quyền sử dụng micro',
        'warning'
      )
    }
  }

  return (
    <div className="detail_word">
      <Button.Shadow
        className="button__back"
        color="gray"
        content={<img src={backArrow} alt="back" />}
        onClick={() => onClose()}
      />

      <h1 className="title_detail">Luyện phát âm</h1>
      <div className="d-flex justify-content-center align-items-center">
        <img
          className="arrow_change_detail"
          src={ico_doubleArrLeft}
          alt=""
          style={{ opacity: currentIndex !== null && currentIndex > 0 ? 1 : 0 }}
          onClick={() => {
            if (currentIndex !== null && currentIndex > 0) {
              changeWord('prev')
            }
          }}
        />
        <div className="detail__holder">
          <SwitchTransition>
            <CSSTransition
              type="out-in"
              key={currentIndex}
              addEndListener={(node, done) => node.addEventListener('transitionend', done, false)}
              classNames="fade"
            >
              <img
                draggable={false}
                className="detail__img"
                src={convertUrl(detailData?.value?.thumb, 'image')}
                alt="img"
              />
            </CSSTransition>
          </SwitchTransition>
          <div className="speak__wrap my-3">
            <div>
              {isPlay && <div className="spinner-grow effect__sound " />}
              <img
                className="cursor-pointer "
                src={ico_sound}
                alt="ico_sound"
                onClick={() => {
                  if (!listening) {
                    playSound()
                  }
                }}
              />
            </div>
            <audio
              autoPlay
              ref={audioRef}
              src={detailData?.value?.audio}
              onLoadedData={() => handleLoadData()}
              onEnded={(e: any) => {
                setIsPlay(false)
                e.target.currentTime = 0
              }}
            >
              <track kind="captions" />
            </audio>
            <p className="word__title">{detailData?.value?.word}</p>
          </div>
          <div className="mb-2">
            <p className="mb-0 text-center">{detailData?.value?.mean}</p>
            <p className="mb-0 text-center">
              {detailData?.value?.partOfSpeech ? `(${detailData?.value?.partOfSpeech})` : ''}
            </p>
            <p className="mb-0 text-center">{detailData?.value?.spell}</p>
          </div>
          <div className="results__holder">
            {/* {isConverting ? (
              <>
                <p className="mb-0 small">Đang phân tích kết quả </p>
                <Spinner animation="grow" className="loading__icon" />
                <Spinner animation="grow" className="loading__icon" />
                <Spinner animation="grow" className="loading__icon" />
              </>
            ) : (
              results
            )} */}
            {finalTranscript == '' || !answerChecked ? (
              <span style={{ color: '#8e8e93' }}>{detailData?.value?.word}</span>
            ) : (
              <div>
                {answerChecked?.result?.map((letter: any, i: number) => {
                  return (
                    <span key={i} style={{ color: letter.check ? 'green' : 'red' }}>
                      {letter.key}{' '}
                    </span>
                  )
                })}
              </div>
            )}
          </div>
          <div id="interim" />
          <div id="final" />
          <div
            className={`icon__record--wrap  ${isConverting ? 'gray' : ''} ${
              listening ? 'isRecording' : ''
            }`}
            onClick={recordVoice}
          >
            {/* {isRecording && <div className="spinner-grow effect__sound" role="status" />} */}
            {listening ? (
              <div className="recording__wav">
                <div className="path path_1" />
                <div className="path path_2" />
                <div className="path path_3" />
              </div>
            ) : (
              <Image className="main__image " src={ico_record} />
            )}
          </div>
        </div>
        <img
          className="arrow_change_detail"
          src={ico_doubleArrRight}
          style={{ opacity: currentIndex !== null && currentIndex < dataLength - 1 ? 1 : 0 }}
          alt=""
          onClick={() => {
            if (currentIndex !== null && currentIndex < dataLength - 1) {
              changeWord('next')
            }
          }}
        />
      </div>

      <NavbarTest
        currentTest={(currentIndex || 0) + 1}
        totalTest={dataLength}
        onCheck={() => changeWord('next')}
        onHint={() => changeWord('next')}
        onSkip={() => changeWord('next')}
        type="vocabulary"
      />
    </div>
  )
}

export default DetailWord
