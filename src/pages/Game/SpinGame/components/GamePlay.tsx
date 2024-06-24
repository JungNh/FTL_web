import React, { FC, useEffect, useState } from 'react'
import '../styles.scss'
import { css } from '@emotion/css'
import Sound from 'react-sound'
import _ from 'lodash'
import Swal from 'sweetalert2'
import Incorrect from './Incorrect'
import Correct from './Correct'
import { ImageResourcesType, AudioResourcesType } from '../types'

type Props = {
  dataGame: any
  backToWelcome: () => void
  life: number
  quesLength: number
  setLife: (value: number) => void
  score: any
  setScore: (
    value: {
      answers: any[]
      correct: string
      sound: string
      fish: string
      imageUrl: string
    }[]
  ) => void
  question: number
  showTimer?: boolean
  setQuestion: (value: number) => void
  imageResources: ImageResourcesType
  audioResources: AudioResourcesType
}

const GamePlay: FC<Props> = ({
  backToWelcome,
  life,
  setLife,
  score,
  setScore,
  dataGame,
  question,
  setQuestion,
  imageResources,
  audioResources,
  quesLength,
  showTimer
}) => {
  const [result, setResult] = useState('')
  const [rotate, setRotate] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const [isChecking, setIsChecking] = useState(false)
  const [sound, setSound] = useState(false)
  const [waitAnswer, setWaitAnswer] = useState(false)
  const [lastValue, setLastValue] = useState(0)
  const [data, setData] = useState<any>([])
  const [selectedSpin, setSelectedSpin] = useState<any>(null)

  useEffect(() => {
    if (dataGame) {
      setData(dataGame)
    }
  }, [dataGame])

  const onNextQuestion = async () => {
    setSelectedSpin(null)
    setResult('')
    setQuestion(question + 1)
  }

  const checkResult = async (value: any) => {
    if (value === selectedSpin?.correct) {
      const newScore: any = [...score]
      newScore.push({ ...selectedSpin, point: true })
      setScore(newScore)
      setResult('correct')
    } else {
      setResult('incorrect')
    }
    setIsChecking(false)
    setWaitAnswer(false)
  }

  const calcRotate = (index: number) => {
    const rotateSpin = (360 / 10) * index
    return css`
      transform: rotate(-${rotateSpin}deg) translateY(-80%);
    `
  }

  const calcSpin = () => {
    setSound(true)
    const dataPercent: any = []
    data.map(
      (item: {
        answers: any[]
        correct: string
        sound: string
        value: number
        percent: number
      }) => {
        for (let i = 0; i < item.percent; i++) {
          dataPercent.push(item.value)
        }
        return item
      }
    )

    const percent = Math.floor(Math.random() * dataPercent?.length)
    const randomRound = Math.floor(Math.random() * 15) + 4
    setRotate(lastValue * 360 + randomRound * 360 + (360 / 10) * dataPercent[percent] - 36)
    const dataSelect: any = data.find(
      (item: {
        answers: any[]
        correct: string
        sound: string
        imageUrl: string
        value: number
        percent: number
      }) => item.value === dataPercent[percent]
    )
    const newData = data?.map((item: any) => {
      if (item.value === dataPercent[percent]) {
        return { ...item, percent: 0 }
      }
      return item
    })
    setData(newData)
    setSpinning(true)
    setWaitAnswer(true)
    setTimeout(() => {
      setSelectedSpin(dataSelect)
      setSpinning(false)
    }, 5000)
    setLastValue(randomRound + lastValue)
  }

  const onWrongDone = () => {
    const newScore: any = [...score]
    newScore.push({ ...selectedSpin, point: false })
    setScore(newScore)
    setLife(life - 1)
    onNextQuestion()
    setIsChecking(false)
    setWaitAnswer(false)
  }

  const onGoBack = () => {
    Swal.fire({
      title: 'Bạn muốn dừng chơi',
      text: 'Tiến trình chơi sẽ bị mất',
      cancelButtonText: 'Không',
      confirmButtonText: 'Đồng ý',
      showCancelButton: true,
    })
      .then(async ({ isConfirmed }: { isConfirmed: boolean }) => {
        if (isConfirmed) {
          backToWelcome()
        }
        return ''
      })
      .catch(() => {
        Swal.fire('Có lỗi xảy ra', '', 'error')
      })
  }

  return (
    <>
      <div className="w-100 container-game">
        <div>
          <div className="header-game">
            <img
              width={80}
              src={imageResources?.btn_back}
              className="game-button user-drag--none"
              alt="button-back"
              onClick={() => onGoBack()}
            />
            <div className={`heart_ico ${showTimer && 'showTimer'}`}>
              {[...Array(5).keys()]?.map((__item: unknown, index: number) => (
                <img
                  key={index}
                  width={70}
                  className="heart__icon user-drag--none"
                  src={
                    index < life ? imageResources?.ico_heart_full : imageResources?.ico_heart_empty
                  }
                  alt="life"
                />
              ))}
            </div>
          </div>
          {/* <div className="font-text">
            Score:
            {(score?.filter((item: any) => item?.point)?.length || 0)
              * Math.round(100 / quesLength)}
          </div> */}
          <img
            width={200}
            src={imageResources?.logo}
            className="game-logo user-drag--none"
            alt="button-back"
          />
        </div>
        {result !== 'correct' && (
          <>
            <img
              width={180}
              src={imageResources?.ico_spin}
              onClick={() => {
                if (!spinning && !waitAnswer) calcSpin()
              }}
              className={`game-spinner-btn user-drag--none ${
                _.isEmpty(selectedSpin) ? 'effect__scale' : ''
              }`}
              alt="button-spin"
            />
            {selectedSpin && (
              <div className="high__light">
                <span className="light light_1" />
                <span className="light light_2" />
                <span className="light light_3" />
                <span className="light light_4" />
                <span className="light light_5" />
                <span className="light light_6" />
                <span className="light light_7" />
                <span className="light light_8" />
                <span className="light light_9" />
                <span className="light light_10" />
                <span className="light light_11" />
              </div>
            )}
            {/**
             *
             *  SPINNER
             *
             * */}
            <div className="container-spinner" style={{ transform: `rotate(${rotate}deg)` }}>
              <img
                width={550}
                src={imageResources?.ico_spin_board}
                alt="button-spin-bg"
                className="game-spinner user-drag--none"
              />

              {/* Text trên spiner */}
              {[...new Array(10).keys()]?.map((__value: unknown, index: number) => (
                <div className={`lucky-item ${calcRotate(index)}`} key={index}>
                  {dataGame?.[index]
                    ? dataGame?.[index]?.correct
                    : dataGame?.[index + 1 - dataGame?.length]?.correct}
                </div>
              ))}
            </div>

            {/**
             *
             * ANSWERS
             *
             */}
            {selectedSpin && (
              <div className="container-spin-answer">
                {/* left */}
                <div className="container-spin-answer__left">
                  {selectedSpin?.answers?.slice(0, 3)?.map((item: any) => (
                    <div
                      className="container-anwsers game-button"
                      key={item?.value}
                      onClick={() => {
                        if (!spinning && !isChecking) {
                          setIsChecking(true)
                          checkResult(item?.value)
                        }
                      }}
                    >
                      <img
                        className="answer-border user-drag--none"
                        src={imageResources?.btn_answer}
                        alt="border"
                      />
                      <img
                        className="answer-spin user-drag--none"
                        src={item?.imageUrl}
                        alt="button-spin"
                      />
                    </div>
                  ))}
                </div>

                {/* RIGHT */}
                <div className="container-spin-answer__right">
                  {selectedSpin?.answers?.slice(3, 6)?.map((item: any) => (
                    <div
                      className="container-anwsers game-button"
                      key={item?.value}
                      onClick={() => {
                        if (!spinning && !isChecking) {
                          setIsChecking(true)
                          checkResult(item?.value)
                        }
                      }}
                    >
                      <img
                        className="answer-border user-drag--none"
                        src={imageResources?.btn_answer}
                        alt="border"
                      />
                      <img
                        className="answer-spin user-drag--none"
                        src={item?.imageUrl}
                        alt="button-spin"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="text-spinner">
              {_.isEmpty(selectedSpin)
                ? 'Click the Spin button to spin'
                : 'Select the most correct answer!'}
            </div>
          </>
        )}
      </div>
      <Sound
        url={audioResources?.sound_spin || ''}
        playStatus={sound ? 'PLAYING' : 'STOPPED'}
        onFinishedPlaying={() => {
          setSound(false)
        }}
      />
      {result === 'correct' && (
        <Correct
          imageResources={imageResources}
          audioResources={audioResources}
          dataGame={selectedSpin}
          quesLength={quesLength}
          onNextQuestion={onNextQuestion}
        />
      )}
      {result === 'incorrect' && (
        <Incorrect
          imageResources={imageResources}
          audioResources={audioResources}
          onEnded={() => onWrongDone()}
        />
      )}
    </>
  )
}

export default GamePlay
