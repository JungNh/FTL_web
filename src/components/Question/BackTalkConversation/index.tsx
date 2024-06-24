import React, { useCallback, useEffect, useState } from 'react'
import { Image, ProgressBar } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import _ from 'lodash'
import { differenceInSeconds } from 'date-fns'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import Swal from 'sweetalert2'
import Sound from 'react-sound'
import Button from '../../Button'
import ico_record from '../../../assets/images/ico_record-white.svg'
import ico_robot from '../../../assets/images/ico_robot-head.svg'
import { actionGetHomophones } from '../../../store/study/actions'
import backArrow from '../../../assets/images/ico_arrowLeft-blue.svg'
import { cleanAndSplitSentence, cleanSentence } from '../../../utils/common'
import { RootState } from '../../../store'
import icoFlag from '../../../assets/images/icon_flag_orange.png'
import ModalReport from '../ResultAns/ModalReport'
import {
  actionAddCorrect,
  actionAddWrong,
  actionShowCheer,
  actionShowReport,
  actionShowReported,
  actionShowSumary,
  checkReport
} from '../../../store/lesson/actions'
import Cheering from '../../Cheering'

type Props = {
  question?: {
    id?: number
    questionTitle?: string
    type?: string
    questionText?: string
    questionExplain?: string
    audioUrl?: string
    answers: any[]
  }
  onNextLession: (data: DataConverType) => void
  currentTestIndex: number
  totalTest: number
  backCourse: () => void
}

type DataConverType = {
  score: number
  numQuestion: number
  questionLeng: number
}

type WordType = { id: number | null; text: string }
type HomosType = { quesIndex: number; homos: WordType[] }
type QuesListType = { answer: string; audioUrl: string; question: string }

const BackTalkConversation: React.FC<Props> = ({
  backCourse,
  question,
  onNextLession,
  totalTest,
  currentTestIndex
}) => {
  const dispatch = useDispatch()
  const { listening, resetTranscript, finalTranscript } = useSpeechRecognition()
  const userAvatar = useSelector(
    (state: RootState) =>
      state.login.userInfo?.profile?.avatar || state.login.userInfo?.avatar || ico_robot
  )
  const [startTime, setStartTime] = useState<string | null>(null)
  const [currentRowIndex, setCurrentRowIndex] = useState(0)
  const [ansHomos, setAnsHomos] = useState<HomosType[]>([])
  const [userHomos, setUserHomos] = useState<HomosType[]>([])
  const [isConverting, setIsConverting] = useState(false)
  const [quesList, setQuesList] = useState<QuesListType[]>([])
  const [isPlaySound, setIsPlaySound] = useState(false)

  const [results, setResults] = useState<{ textWithColor: any; percent: number }[]>()
  const userInfo = useSelector((state: RootState) => state.login.userInfo)

  const showCheer = useSelector((state: RootState) => state.lesson.showCheer)
  const numberCorrect = useSelector((state: RootState) => state.lesson.numberCorrect)
  const numberWrong = useSelector((state: RootState) => state.lesson.numberWrong)
  const correctFirstShowed = useSelector((state: RootState) => state.lesson.correctFirstShowed)
  const correctSecondShowed = useSelector((state: RootState) => state.lesson.correctSecondShowed)
  const wrongShowed = useSelector((state: RootState) => state.lesson.wrongShowed)
  const [arrScore, setArrScore] = useState(new Array(quesList?.length).fill(0))

  /**
   * Auto chạy quesiton audio
   */
  useEffect(() => {
    let timeOutObj: any
    if (quesList?.[currentRowIndex]?.audioUrl) {
      timeOutObj = setTimeout(() => {
        setIsPlaySound(true)
      }, 1000)
    }
    return () => clearTimeout(timeOutObj)
  }, [currentRowIndex, quesList])

  // * init all state
  useEffect(() => {
    if (question?.answers) {
      const initQuesList: QuesListType[] = []
      const initHomos: HomosType[] = []

      question?.answers?.map((item: any, index: number) => {
        const value = JSON.parse(item?.value)
        initQuesList.push({
          answer: value?.answer,
          audioUrl: value?.audioUrl,
          question: value?.question
        })
        initHomos.push({ quesIndex: index, homos: [] })
      })

      setQuesList(initQuesList)
      setAnsHomos(initHomos)
      setUserHomos(initHomos)
      setResults([])
      setCurrentRowIndex(0)
      // setIsPlaySound(false)
      setStartTime(new Date().toISOString())
    }
  }, [question?.answers])

  const scrollConversation = () => {
    const conversation = document.querySelector('.main__question')
    if (conversation) {
      conversation.scrollTop = conversation.scrollHeight
    }
  }

  useEffect(() => {
    const getHomoPhones = async () => {
      const words = quesList?.[currentRowIndex]?.answer?.split(' ') || []
      const homoWords: any[] = await Promise.all(
        words?.map(async (word: string) => {
          const cleanWord = cleanSentence(word)
          const responseHomo: any = await dispatch(actionGetHomophones({ word: cleanWord || '' }))
          if (responseHomo) {
            return { id: Number(responseHomo?.id), text: word }
          }
          return { id: null, text: word }
        })
      )

      setAnsHomos((ans) => {
        const newAnsHomos = ans.slice()
        newAnsHomos[currentRowIndex] = { quesIndex: currentRowIndex, homos: homoWords }
        return newAnsHomos
      })
      scrollConversation()
    }
    if (quesList.length) {
      getHomoPhones()
    }
  }, [currentRowIndex, dispatch, quesList])

  // const sendAnswer = useCallback(async () => {
  //   console.log('results?.[currentRowIndex]?.percent', results?.[currentRowIndex]?.percent)
  //   const percentAvr = Math.floor(_.sumBy(results, 'percent') / (results?.length || 1))
  //   const duration = startTime !== null ? differenceInSeconds(new Date(), new Date(startTime)) : 0
  //   if ((percentAvr || 0) >= 70) {
  //     if (
  //       (numberCorrect == 4 && !correctFirstShowed) ||
  //       (numberCorrect == 9 && !correctSecondShowed)
  //     ) {
  //       dispatch(actionShowCheer(true))
  //     } else {
  //       postPoint()
  //     }
  //     dispatch(actionAddCorrect())
  //   } else {
  //     if (numberWrong == 2 && !wrongShowed) {
  //       dispatch(actionShowCheer(true))
  //     } else {
  //       postPoint()
  //     }
  //     dispatch(actionAddWrong())
  //   }
  // }, [onNextLession, question?.id, results, startTime])

  // const postPoint = useCallback(async () => {
  //   const percentAvr = Math.floor(_.sumBy(results, 'percent') / (results?.length || 1))
  //   const duration = startTime !== null ? differenceInSeconds(new Date(), new Date(startTime)) : 0
  //   onNextLession({
  //     questionId: question?.id,
  //     result: (percentAvr || 0) >= 70,
  //     answer: '',
  //     score: percentAvr,
  //     duration
  //   })
  // }, [onNextLession, question?.id, results, startTime])

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

        setUserHomos((old) => {
          const newUserHomos = old.slice()
          newUserHomos[currentRowIndex] = { quesIndex: currentRowIndex, homos: userHomo }
          return newUserHomos
        })
        resetTranscript()
        setIsConverting(false)

        // if (currentRowIndex + 1 < quesList.length) {
        //   setCurrentRowIndex(currentRowIndex + 1)
        // } else {
        //   dispatch(actionShowSumary(true))
        //   setIsPlaySound(false)
        // setCurrentRowIndex(currentRowIndex + 1)
        // setTimeout(() => {
        // sendAnswer()
        // }, 1000)
        // }
      }
    }
    convertSpeechToText()
  }, [currentRowIndex, dispatch, finalTranscript, quesList.length, resetTranscript])

  useEffect(() => {
    const textCheckedWithHomos = (rowIndex: number, userHomosProps: any) => {
      let correctLetters = 0
      const answerApi = quesList[rowIndex]?.answer
      const totalLetter = cleanSentence(answerApi)?.replaceAll(' ', '')?.length || 1
      // * new
      const textWithColor = ansHomos?.[rowIndex]?.homos?.map((word: WordType, wIndex: number) => {
        const cleanWord = cleanSentence(word?.text)
        if (word?.id !== null && word?.id === userHomosProps?.[rowIndex]?.homos?.[wIndex]?.id) {
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
              const convertLetter = cleanSentence(letter)
              const isCorrect =
                convertLetter ===
                userHomosProps?.[rowIndex]?.homos?.[wIndex]?.text?.[letIndex]?.toLowerCase()
              if (isCorrect) {
                correctLetters += 1
              }

              // * là ký tự đặc biệt
              if (userHomosProps.length <= 0) {
                return <span key={`letter-${letIndex}`}>{letter}</span>
              }
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

      return {
        percent: Math.floor((correctLetters * 100) / totalLetter),
        textWithColor
      }
    }

    const convertResults = async () => {
      const newResult = await textCheckedWithHomos(currentRowIndex, userHomos)
      if (newResult.percent >= 70) {
        if (
          (numberCorrect == 4 && !correctFirstShowed) ||
          (numberCorrect == 9 && !correctSecondShowed)
        ) {
          dispatch(actionShowCheer(true))
        } else {
          if (currentRowIndex + 1 < quesList.length) {
            setCurrentRowIndex(currentRowIndex + 1)
          } else {
            setTimeout(() => {
              dispatch(actionShowSumary(true))
            }, 1000)
            setIsPlaySound(false)
          }
        }
        getSummary(true)
        dispatch(actionAddCorrect())
      } else {
        console.log('Ko Đạt', newResult.percent)
      }
      setResults((a: any) => {
        const b = a?.slice() || []
        b[currentRowIndex] = newResult
        return b
      })
    }

    convertResults()
  }, [ansHomos, currentRowIndex, quesList, userHomos])

  const getSummary = (isCorrect: boolean) => {
    let arr = arrScore
    arr[currentRowIndex] = isCorrect ? 1 : 0
    var sum = arr.reduce(function (a, b) {
      return a + b
    }, 0)
    setArrScore(arr)
    onNextLession({
      score: sum,
      numQuestion: currentRowIndex,
      questionLeng: quesList.length
    })
    console.log('SUMMARY', sum)
  }

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

  const renderBody = () => {
    return (
      <div className="bg_renderBody">
        <p className="title__lession mb-5">Luyện nói kỹ năng</p>
        <p className="number_question">Hội thoại {currentRowIndex + 1}</p>
        <div
          className="button__report"
          onClick={async () => {
            try {
              const res = await checkReport(Number(question?.id), userInfo?.id)
              if (res?.status == 200)
                dispatch(actionShowReport({ isShow: true, questionID: Number(question?.id) }))
              else {
                dispatch(actionShowReported(true))
              }
            } catch (error) {
              console.log(error)
            }
          }}
        >
          <img src={icoFlag} className="ico__flag" alt="flag" />
          <div className="text_respone">BÁO CÁO</div>
        </div>

        <Sound
          url={quesList?.[currentRowIndex]?.audioUrl || ''}
          playStatus={isPlaySound && quesList?.[currentRowIndex]?.audioUrl ? 'PLAYING' : 'STOPPED'}
          playFromPosition={0}
          onLoading={() => {}}
          onPlaying={() => {}}
          onFinishedPlaying={() => setIsPlaySound(false)}
        />

        <div className="main__question">
          {quesList.map((item: any, index: number) => (
            <React.Fragment key={index}>
              {index < currentRowIndex && (
                <React.Fragment>
                  <div className="message_left">
                    <Image src={ico_robot} />
                    <div className="message_container text-center">{item.question}</div>
                  </div>

                  <div className="message_right">
                    <div className="message_container">
                      <div className="text-center">{results?.[index]?.textWithColor}</div>
                      <div className="progress__wrap">
                        <ProgressBar
                          className="progress__bar"
                          variant="success"
                          now={results?.[index]?.percent}
                        />
                        <p className="progress__percent">{results?.[index]?.percent}%</p>
                      </div>
                    </div>
                    <Image className="avatar" src={userAvatar} />
                  </div>
                </React.Fragment>
              )}
              {currentRowIndex === index && (
                <React.Fragment>
                  <div className="message_left">
                    <Image src={ico_robot} />
                    <div className="message_container">{item.question}</div>
                  </div>
                  <div className="message_right">
                    <div className="message_container recording">
                      <div className="text-center">
                        {userHomos?.[index]?.homos?.length > 0
                          ? results?.[index]?.textWithColor
                          : item?.answer}
                      </div>
                      {isConverting ? (
                        <div className="progress__wrap">
                          <ProgressBar
                            className="progress__bar"
                            striped
                            animated
                            variant="info"
                            now={100}
                          />
                        </div>
                      ) : (
                        <>
                          <div className="progress__wrap">
                            <ProgressBar
                              className="progress__bar"
                              variant="success"
                              now={results?.[index]?.percent}
                            />
                            <p className="progress__percent">{results?.[index]?.percent}%</p>
                          </div>
                          <div
                            className={`main__image--container cursor-pointer mx-auto my-3 ${
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
                              <Image className="main__image cursor-pointer" src={ico_record} />
                            )}
                          </div>
                        </>
                      )}
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <div
                          className="fast__next"
                          onClick={() => {
                            setIsPlaySound(false)
                            getSummary(false)
                            if (currentRowIndex + 1 < quesList.length) {
                              setCurrentRowIndex(currentRowIndex + 1)
                            } else {
                              dispatch(actionShowSumary(true))
                            }
                          }}
                        >
                          HIỆN KHÔNG NÓI ĐƯỢC
                        </div>
                      </div>
                    </div>
                    <Image className="avatar" src={userAvatar} />
                  </div>
                </React.Fragment>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="lession__backTalkConversation">
      <Button.Shadow
        className="button__back"
        color="gray"
        content={<img src={backArrow} alt="back" />}
        onClick={() => backCourse()}
      />
      {showCheer ? (
        <Cheering
          showBtn
          showSum={() => {
            if (currentRowIndex + 1 < quesList.length) {
              setCurrentRowIndex(currentRowIndex + 1)
            } else {
              dispatch(actionShowSumary(true))
            }
          }}
        />
      ) : (
        renderBody()
      )}
    </div>
  )
}

export default BackTalkConversation
