import React, { useState, useEffect, useCallback } from 'react'
import { Image } from 'react-bootstrap'
import Swal from 'sweetalert2'
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar'
import { useDispatch, useSelector } from 'react-redux'
import _ from 'lodash'
import Sound from 'react-sound'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import { differenceInSeconds } from 'date-fns'
import Button from '../../Button'
import ico_speaker from '../../../assets/images/ico_speaker.svg'
import ico_record from '../../../assets/images/ico_record-white.svg'
import backArrow from '../../../assets/images/ico_arrowLeft-blue.svg'
import NavbarTest from '../../NavbarTest'
import { actionGetHomophones, actionTextToSpeech } from '../../../store/study/actions'
import { cleanAndSplitSentence, cleanSentence, convertUrl } from '../../../utils/common'
import ImgTitle from './ImgTitle'
import TextTitle from './TextTitle'
import FbSpeakRobo from '../FbSpeakRobo'
import { RootState } from '../../../store'
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
  lession?: {
    id?: number
    questionTitle?: string
    type?: string
    questionText?: string
    questionExplain?: string
    answers?: any[]
    audioUrl?: string
    metas?: {
      id: number
      key: 'audio' | 'image'
      questionId: number
      value: string | null
    }
  }
  onNextLession: (data: any) => void
  currentTestIndex?: number
  totalTest?: number
  backCourse: () => void
}

type WordType = {
  id: number | null
  text: string
}

const SpeakAIWithPic: React.FC<Props> = ({
  lession,
  onNextLession,
  currentTestIndex,
  totalTest,
  backCourse
}) => {
  const [startTime, setStartTime] = useState<string | null>(null)
  const [audioQuesUrl, setAudioQuesUrl] = useState<string | null>(null)
  const [imgQuesUrl, setImgQuesUrl] = useState<string | null>(null)
  const [ansSuggest, setAnsSuggest] = useState<{ text: string; audioUrl: string } | null>(null)
  const [ansHomos, setAnsHomos] = useState<WordType[]>([])
  const [userHomos, setUserHomos] = useState<WordType[]>([])
  const [isConverting, setIsConverting] = useState(false)
  const [isPlayQuesAudio, setIsPlayQuesAudio] = useState(false)
  const [isPlayAnsAudio, setIsPlayAnsAudio] = useState(false)
  const [isError, setIsError] = useState(false)
  const [correct100Time, setCorrect100Time] = useState<number>(0)
  const [realPercent, setRealPercent] = useState<number | null>(null)
  const [convertPercent, setConvertPercent] = useState<number | null>(null)
  const [textColor, setTextColor] = useState<any>(null)
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

  const languageChoice =
    language == LANG.KO
      ? LANG.ko
      : language == LANG.JA
      ? LANG.ja
      : language == LANG.CN
      ? LANG.cn
      : LANG.en

  console.log('SPEAK_WITH_PIC')

  const dispatch = useDispatch()

  const { listening, resetTranscript, finalTranscript } = useSpeechRecognition()

  /**
   *  Lấy audio câu hỏi
   *  Lấy từ đồng nghĩa, lưu danh sách chữ cái của câu hỏi
   *  RESET ALL TO DEFAULT
   */
  useEffect(() => {
    const convertAudioQues = async () => {
      const metas: any = lession?.metas
      const imgObj = metas?.find((item: any) => item?.key === 'image')
      const audioObj = metas?.find((item: any) => item?.key === 'audio')
      const answers = JSON.parse(lession?.answers?.[0]?.value)?.[0]

      setImgQuesUrl(convertUrl(imgObj?.value, 'image') || null)
      if (audioObj?.value) {
        setAudioQuesUrl(convertUrl(audioObj?.value) || null)
      } else {
        const response: any = await dispatch(
          actionTextToSpeech({ text: lession?.questionText || '' })
        )
        if (response) setAudioQuesUrl(response?.url)
      }
      if (answers?.key) {
        setAnsSuggest({ text: answers?.key || '', audioUrl: answers?.audioUrl || '' })
      }
    }

    const getHomoPhones = async () => {
      const answers = JSON.parse(lession?.answers?.[0]?.value)?.[0]?.value || ''
      const words = answers.split(' ')
      const homoWords: any[] = await Promise.all(
        words.map(async (word: string) => {
          const cleanWord = word
            ?.trim()
            .toLowerCase()
            .replace(/[&\\/\\#,+()$~%.":*?!<>{}-]/g, '')
          const response: any = await dispatch(actionGetHomophones({ word: cleanWord || '' }))
          if (response) {
            return { id: Number(response?.id), text: word }
          }
          return { id: null, text: word }
        })
      )

      setAnsHomos(homoWords)
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

  /**
   * Auto chạy quesiton audio
   */
  // useEffect(() => {
  //   let timeOutObj: any
  //   if (audioQuesUrl) {
  //     timeOutObj = setTimeout(() => {
  //       setIsPlayQuesAudio(true)
  //     }, 500)
  //   }
  //   return () => clearTimeout(timeOutObj)
  // }, [audioQuesUrl])

  useEffect(() => {
    const convertSpeechToText = async () => {
      if (finalTranscript) {
        setIsConverting(true)

        /**
         * ? Check user word
         */
        const userHomo: WordType[] = await Promise.all(
          cleanAndSplitSentence(finalTranscript).map(async (item: string) => {
            const responseHomo: any = await dispatch(actionGetHomophones({ word: item || '' }))
            if (responseHomo) {
              return { id: Number(responseHomo?.id), text: item }
            }
            return { id: null, text: item }
          })
        )
        setUserHomos(userHomo)
        setIsConverting(false)
      }
    }
    convertSpeechToText()
  }, [dispatch, finalTranscript])

  const recordVoice = () => {
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
          setIsError(false)
          if (listening) {
            SpeechRecognition.stopListening()
          } else if (!isPlayQuesAudio && !isPlayAnsAudio) {
            setIsError(false)
            SpeechRecognition.startListening({ language: languageChoice })
          }
        }
      })
    } catch (error) {
      setIsError(true)
      Swal.fire(
        'Trang web không được cấp phép ghi âm',
        'Vui lòng cấp quyền sử dụng micro',
        'warning'
      )
    }
  }

  useEffect(() => {
    let correctLetters = 0
    const answers = JSON.parse(lession?.answers?.[0]?.value)?.[0]?.value || ''
    const totalLetter = cleanSentence(answers)?.replaceAll(' ', '')?.length || 1
    const textWithColor = ansHomos.map((word: WordType, wIndex: number) => {
      const cleanWord = cleanSentence(word?.text)
      if (word?.id !== null && word?.id === userHomos?.[wIndex]?.id) {
        correctLetters += cleanWord?.length
        return (
          <React.Fragment key={`word-${wIndex}`}>
            <span style={{ color: '#0066ff' }}>
              {word?.text?.trim()?.replace(/[&\\/\\#,+()$~%.":*?!<>{}-]/g, '')}
            </span>
            &nbsp;
          </React.Fragment>
        )
      }
      return (
        <React.Fragment key={`word-${wIndex}`}>
          {word?.text?.split('')?.map((letter: string, letIndex: number) => {
            const convertLetter = letter?.toLowerCase().replace(/[&\\/\\#,+()$~%.":*?!<>{}-]/g, '')
            const isCorrect = convertLetter === userHomos[wIndex]?.text?.[letIndex]?.toLowerCase()
            if (isCorrect) {
              correctLetters += 1
            }

            // * là ký tự đặc biệt
            if (userHomos.length <= 0) return <span key={`letter-${letIndex}`}>{letter}</span>
            if (convertLetter === '') {
              return (
                <span key={`letter-${letIndex}`} style={{ color: '#0066ff' }}>
                  {letter}
                </span>
              )
            }
            // * đúng sai theo màu
            return (
              <span key={`letter-${letIndex}`} style={{ color: isCorrect ? '#0066ff' : 'red' }}>
                {letter}
              </span>
            )
          })}
          &nbsp;
        </React.Fragment>
      )
    })
    const realPercent = Math.floor((correctLetters * 100) / totalLetter)

    if (realPercent === 100) setCorrect100Time((n) => n + 1)
    setRealPercent(realPercent)
    setTextColor(textWithColor)
  }, [ansHomos, lession?.answers, userHomos])

  useEffect(() => {
    if (realPercent === 100 && correct100Time < 3) {
      // setConvertPercent(Math.floor(Math.random() * 5) + 95)
      setConvertPercent(100)
    } else if (realPercent === 100 && correct100Time >= 3) {
      setConvertPercent(100)
    } else if (correct100Time !== 0) {
      setConvertPercent(realPercent)
      setCorrect100Time(0)
    } else {
      setConvertPercent(realPercent)
    }
  }, [correct100Time, realPercent])

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
      checkShowCheer()
      sendAnswer()
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
          if(numberWrong == 2 && !wrongShowed){
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

  // new function for speech recognition
  useEffect(() => {
    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
      Swal.fire('Web không hỗ trợ nhận diện giọng nói', '', 'error')
    }
  }, [])

  const checkShowCheer = () => {
    if (numberCorrect == 5) dispatch(actionFirstCheerCorrect())
    if (numberCorrect == 10) dispatch(actionSecondCheerCorrect())
    if (numberWrong == 3) dispatch(actionCheerWrong())
  }

  const renderBody = () => {
    return (
      <div className="bg_renderBody">
        <div className="d-flex align-items-center justify-content-center mb-3">
          <img
            src={ico_speaker}
            alt="sound"
            className={`cursor-pointer small_speaker ${isPlayQuesAudio ? 'playing' : ''}`}
            onClick={() => {
              if (audioQuesUrl && !listening) setIsPlayQuesAudio(true)
            }}
          />
          &nbsp;
          <h1 className="mb-0 ms-2 fw-bold title__lession">{lession?.questionText}</h1>
        </div>
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
        {imgQuesUrl ? (
          <ImgTitle
            imgQuesUrl={imgQuesUrl || ''}
            ansText={finalTranscript ? textColor : ansSuggest?.text}
            suggestAudioUrl={ansSuggest?.audioUrl || ''}
            setIsPlayAnsAudio={setIsPlayAnsAudio}
            isPlayAudio={isPlayAnsAudio}
            isDisabled={listening}
          />
        ) : (
          <TextTitle
            quesionTitle={lession?.questionTitle || ''}
            suggestAudioUrl={ansSuggest?.audioUrl || ''}
            suggestText={finalTranscript ? textColor : ansSuggest?.text}
            isDisabled={listening}
            setIsPlayAnsAudio={setIsPlayAnsAudio}
            isPlayAudio={isPlayAnsAudio}
          />
        )}

        <div className="main__question">
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
    <div className="lession__speakAIWithPic">
      {/**
       * // ? SOUND AND AUDIO
       *  */}
      <Sound
        url={audioQuesUrl || ''}
        playStatus={isPlayQuesAudio ? 'PLAYING' : 'STOPPED'}
        // playFromPosition={0}
        onLoad={() => {
          if (isUserInteract) setIsPlayQuesAudio(true)
        }}
        autoLoad
        onFinishedPlaying={() => setIsPlayQuesAudio(false)}
        onError={() => {
          setIsPlayQuesAudio(false)
        }}
      />

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

export default SpeakAIWithPic
