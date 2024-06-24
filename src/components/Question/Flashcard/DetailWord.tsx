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
import { convertUrl } from '../../../utils/common'
import useKeyBoard from '../../../utils/keybroad'

type Props = {
  detailData: {
    id?: number
    key?: string
    questionId?: number
    value: DataVocal
  }
  changeWord: (data: 'prev' | 'next') => void
  onClose: () => void
  handleScoreCorrect?: () => void
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
  example?: string
  other?: string
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

  return (
    <div className="detail_word">
      <Button.Shadow
        className="button__back"
        color="gray"
        content={<img src={backArrow} alt="back" />}
        onClick={() => onClose()}
      />
      <div className="d-flex justify-content-center container-content">
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
            {detailData?.value?.example && (
              <p className="mb-0 text-center">{detailData?.value?.example}</p>
            )}
            {detailData?.value?.other && (
              <p className="mb-0 text-center">{detailData?.value?.other}</p>
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
