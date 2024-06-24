import React, { useCallback, useEffect, useState } from 'react'
import { Image } from 'react-bootstrap'
import Swal from 'sweetalert2'
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar'
import _ from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import Sound from 'react-sound'
import { differenceInSeconds } from 'date-fns'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import Button from '../../Button'
import ico_speaker from '../../../assets/images/ico_speaker.svg'
import ico_record from '../../../assets/images/ico_record-white.svg'
import backArrow from '../../../assets/images/ico_arrowLeft-blue.svg'
import NavbarTest from '../../NavbarTest'
import { actionGetHomophones, actionTextToSpeech } from '../../../store/study/actions'
import {
  checkPointChina,
  cleanAndSplitSentence,
  cleanSentence,
  convertUrl,
  openError
} from '../../../utils/common'
import FbSpeakRobo from '../FbSpeakRobo'
import { RootState } from '../../../store'
import KImage from '../../KImage'
import ReactHtmlParser from 'react-html-parser'
import ModalReport from '../ResultAns/ModalReport'
import icoFlag from '../../../assets/images/icon_flag_orange.png'
import {
  actionAddCorrect,
  actionAddWrong,
  actionCheerWrong,
  actionFirstCheerCorrect,
  actionSecondCheerCorrect,
  actionShowCheer,
  actionShowReport,
  actionShowReported,
  checkReport
} from '../../../store/lesson/actions'
import Cheering from '../../Cheering'

type Props = {
  lession?: any
  onNextLession: (data: any) => void
  currentTestIndex?: number
  totalTest?: number
  backCourse: () => void
}

type WordType = {
  id: number | null
  text: string
}

const SpeakCnAI: React.FC<Props> = ({
  lession,
  onNextLession,
  currentTestIndex,
  totalTest,
  backCourse
}) => {
  const [startTime, setStartTime] = useState<string | null>(null)
  const [audioQuesUrl, setAudioQuesUrl] = useState<string | null>(null)
  const [ansHomos, setAnsHomos] = useState<WordType[]>([])
  const [userHomos, setUserHomos] = useState<any>(null)
  const [isConverting, setIsConverting] = useState(false)
  const [isPlayQuesAudio, setIsPlayQuesAudio] = useState(false)
  const [isError, setIsError] = useState(false)

  const [correct100Time, setCorrect100Time] = useState<number>(0)
  const [realPercent, setRealPercent] = useState<number | null>(null)
  const [convertPercent, setConvertPercent] = useState<number | null>(null)
  const [textColor, setTextColor] = useState<any>(null)

  const dispatch = useDispatch()

  const { listening, resetTranscript, finalTranscript } = useSpeechRecognition()
  const isUserInteract = useSelector((state: RootState) => state.login.userInteract)
  const language = useSelector((state: RootState) => state.study.checkLang.language)
  const userInfo = useSelector((state: RootState) => state.login?.userInfo)
  const showCheer = useSelector((state: RootState) => state.lesson.showCheer)
  const numberCorrect = useSelector((state: RootState) => state.lesson.numberCorrect)
  const numberWrong = useSelector((state: RootState) => state.lesson.numberWrong)
  const correctFirstShowed = useSelector((state: RootState) => state.lesson.correctFirstShowed)
  const correctSecondShowed = useSelector((state: RootState) => state.lesson.correctSecondShowed)
  const wrongShowed = useSelector((state: RootState) => state.lesson.wrongShowed)

  const LANG = {
    KO: 'ko-KR',
    JA: 'ja-JP',
    CN: 'zh-CN',
    ko: 'ko',
    ja: 'ja',
    cn: 'zh-CN',
    en: 'en'
  }

  // console.log('===CHINE=====')
  /**
   *  Lấy audio câu hỏi
   *  Lấy từ đồng nghĩa, lưu danh sách chữ cái của câu hỏi
   *  RESET ALL TO DEFAULT
   */

  const languageChoice =
    language == LANG.KO
      ? LANG.ko
      : language == LANG.JA
      ? LANG.ja
      : language == LANG.CN
      ? LANG.cn
      : LANG.en

  // console.log('SPEAK_AI', languageChoice)

  // const myObject = { a: 1, b: 2, c: 3 }
  // let b: any = []
  // Object.keys(myObject).forEach(function (key, value) {
  //   b.push(value)
  //   console.log('value', value)
  // })

  const convertAudioQues = async () => {
    const metas: any = lession?.metas
    const audioObj = metas?.find((item: any) => item?.key === 'audio')
    if (audioObj?.value) {
      setAudioQuesUrl(convertUrl(audioObj?.value) || null)
    } else {
      const response: any = await dispatch(
        actionTextToSpeech({ text: lession?.questionText || '' })
      )
      if (response) setAudioQuesUrl(response?.url)
    }
  }

  useEffect(() => {
    convertAudioQues()
    const getHomoPhones = async () => {
      const answers = JSON.parse(lession?.answers?.[0]?.value)?.[0]?.value || ''
      const words = answers.split('')
      const homoWords: any[] = await Promise.all(
        words.map(async (word: string) => {
          const cleanWord = word?.trim().toLowerCase()
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
      setAnsHomos(homoWords)
      console.log('homoWords', homoWords)
    }

    if (!_.isEmpty(lession)) {
      convertAudioQues()
      getHomoPhones()
      resetTranscript()

      setStartTime(new Date().toISOString())
      setIsError(false)
      setUserHomos([])
      setCorrect100Time(0)
      setRealPercent(0)
      setConvertPercent(0)
    }
  }, [dispatch, lession, resetTranscript])

  // /**
  //  * Auto chạy question audio
  //  */
  // useEffect(() => {
  //   let timeOutObj: any
  //   if (audioQuesUrl) {
  //     timeOutObj = setTimeout(() => {
  //       setIsPlayQuesAudio(true)
  //     }, 500)
  //   }
  //   return () => clearTimeout(timeOutObj)
  // }, [audioQuesUrl])

  const renderImg = () => {
    let url = ''
    if (lession?.metas?.length) {
      lession?.metas?.map?.((item: any) => {
        if (item.key === 'image') {
          // if (item?.value?.includes('http')) {
          url = item?.value
          // } else url = MEDIA_LINK + item?.value;
        }
      })
    }
    // console.log('url', url);
    if (url) {
      return <KImage src={url} alt="lession-image" />
    } else {
      return <></>
    }
  }

  useEffect(() => {
    const convertSpeechToText = async () => {
      if (finalTranscript) {
        setIsConverting(true)
        console.log('speech', finalTranscript)
        setIsConverting(false)
        const restCompare: any = checkPointChina(ansHomos, finalTranscript)
        setUserHomos(restCompare)
        setConvertPercent(restCompare?.point)
        console.log(restCompare)
      }
    }
    convertSpeechToText()
  }, [dispatch, finalTranscript])

  const recordVoice = () => {
    const isSupport = SpeechRecognition.browserSupportsSpeechRecognition()
    if (!isSupport) {
      Swal.fire(
        'Trình duyệt không hỗ trợ nhận diện giọng nói',
        'Vui lòng liên hệ quản trị viên',
        'error'
      )
      return
    }
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(() => {
        if (!isConverting) {
          setIsError(false)
          if (listening) {
            SpeechRecognition.stopListening()
          } else if (!isPlayQuesAudio) {
            setIsError(false)
            SpeechRecognition.startListening({ language: languageChoice })
            setConvertPercent(0)
          }
        }
      })
      .catch((error: any) => {
        setIsError(true)
        Swal.fire(
          'Trang web không được cấp phép ghi âm',
          'Vui lòng cấp quyền sử dụng micro',
          'warning'
        )
      })
  }

  const sendAnswer = useCallback(async () => {
    const duration = startTime !== null ? differenceInSeconds(new Date(), new Date(startTime)) : 0

    onNextLession({
      questionId: lession?.id,
      result: (convertPercent || 0) >= 70,
      answer: '',
      score: (convertPercent || 0) / 100,
      duration
    })
  }, [lession?.id, onNextLession, convertPercent, startTime])

  /**
   * BASIC FUNCTION
   */
  const onCheck = () => {
    if (listening) {
      SpeechRecognition.abortListening()
    }
    resetTranscript()
    if (showCheer) {
      dispatch(actionShowCheer(false))
      sendAnswer()
      checkShowCheer()
    } else {
      if ((convertPercent || 0) >= 70) {
        if (
          (numberCorrect == 4 && !correctFirstShowed) ||
          (numberCorrect == 9 && !correctSecondShowed)
        ) {
          dispatch(actionShowCheer(true))
        } else {
          sendAnswer()
        }
        dispatch(actionAddCorrect())
      } else {
        if (numberWrong == 2 && !wrongShowed) {
          dispatch(actionShowCheer(true))
        } else {
          sendAnswer()
        }
        dispatch(actionAddWrong())
      }
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
      .then((result: { isConfirmed: boolean }) => {
        if (result.isConfirmed) {
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
      .then((result: { isConfirmed: boolean }) => {
        if (result.isConfirmed) {
          if (numberWrong == 2 && !wrongShowed) {
            dispatch(actionShowCheer(true))
          } else {
            sendAnswer()
          }
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
      <div className="bg_renderBody">
        <div
          className="button__report"
          onClick={async () => {
            if (!isPlayQuesAudio) {
              try {
                const res = await checkReport(Number(lession?.id), userInfo?.id)
                if (res?.status == 200)
                  dispatch(actionShowReport({ isShow: true, questionID: Number(lession?.id) }))
                else {
                  dispatch(actionShowReported(true))
                }
              } catch (error) {
                console.log(error)
              }
            }
          }}
        >
          <img src={icoFlag} className="ico__flag" alt="flag" />
          <div className="text_respone">BÁO CÁO</div>
        </div>

        <p className="title__lession">{lession?.questionTitle}</p>
        <p className="subTitle__lession mb-5">
          {/* {lession?.questionText} */}
          {ReactHtmlParser(lession?.questionText)}
        </p>
        <div className="d-flex align-items-center justify-content-center mb-5">
          <img
            src={ico_speaker}
            alt="sound"
            className={`cursor-pointer small_speaker ${isPlayQuesAudio ? 'playing' : ''}`}
            onClick={() => {
              if (audioQuesUrl && !listening) setIsPlayQuesAudio(true)
            }}
          />
          &nbsp;
          <div className="container_lesson">
            {renderImg()}
            {lession.type !== 'speak_not_text' && (
              <p className="mb-0 ms-2 fw-bold audio__text">
                {finalTranscript == '' ? (
                  <span style={{ color: '#8e8e93' }}>
                    {JSON.parse(lession?.answers?.[0]?.value)?.[0]?.value}
                  </span>
                ) : (
                  <div>
                    {userHomos?.result?.map((letter: any, i: number) => {
                      return (
                        <span key={i} style={{ color: letter.check ? '#0066ff' : 'red' }}>
                          {letter.key}
                        </span>
                      )
                    })}
                  </div>
                )}
              </p>
            )}
          </div>
        </div>

        <div className="main__question my-5">
          <FbSpeakRobo
            isListening={listening}
            isConverting={isConverting}
            isError={isError}
            percent={finalTranscript ? convertPercent : null}
          />

          <div className="d-flex align-items-center justify-content-center mt-4">
            <CircularProgressbar
              className="circlePercent"
              value={convertPercent || 0}
              text={`${convertPercent || 0}%`}
              styles={buildStyles({
                textColor: 'black',
                pathColor: '#04BC8A'
              })}
            />
            <div
              className={`main__image--container cursor-pointer mx-5 ${
                listening ? 'isRecording' : ''
              }`}
              onClick={recordVoice}
            >
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
            <div className="head__phone__container" />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="fast__next" onClick={() => sendAnswer()}>
              HIỆN KHÔNG NÓI ĐƯỢC
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="lession__speakAI">
      {/**
       * // ? SOUND AND AUDIO
       *  */}
      {audioQuesUrl && (
        <Sound
          url={audioQuesUrl}
          playStatus={isPlayQuesAudio ? 'PLAYING' : 'STOPPED'}
          playFromPosition={0}
          onLoad={() => {
            if (isUserInteract) setIsPlayQuesAudio(true)
          }}
          onFinishedPlaying={() => setIsPlayQuesAudio(false)}
          autoLoad
          onError={() => {
            setIsPlayQuesAudio(false)
            console.log('there iss a a error')
          }}
        />
      )}
      <Button.Shadow
        className="button__back"
        color="gray"
        onClick={() => backCourse()}
        content={<img src={backArrow} alt="back" />}
      />
      {showCheer ? <Cheering /> : renderBody()}

      <NavbarTest
        currentTest={(currentTestIndex || 0) + 1}
        totalTest={totalTest}
        onCheck={onCheck}
        onHint={onHint}
        onSkip={onSkip}
        isDisabled={
          (!finalTranscript || listening || isConverting) &&
          Number(currentTestIndex) + 1 != totalTest &&
          !showCheer
        }
        type="vocabulary"
      />
    </div>
  )
}

export default SpeakCnAI
