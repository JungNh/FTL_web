import React, { FC, useState } from 'react'
import TweenOne from 'rc-tween-one'
import Swal from 'sweetalert2'
import Incorrect from './Incorrect'
import Correct from './Correct'
import '../styles.scss'
import { AudioResourcesType, ImageResourcesType } from '../types'

type Props = {
  dataGame: any
  setPlaying: (value: boolean) => void
  life: number
  setLife: (value: number) => void
  score: any
  setScore: any
  question: number
  quesLength: number
  setQuestion: (value: number) => void
  questionId?: number
  showTimer?: boolean
  imageResources: ImageResourcesType
  audioResources: AudioResourcesType
}

const SectionGame: FC<Props> = ({
  setPlaying,
  life,
  setLife,
  score,
  setScore,
  dataGame,
  question,
  quesLength,
  setQuestion,
  imageResources,
  showTimer,
  audioResources
}) => {
  const [result, setResult] = useState('')
  const [answer, setAnswer] = useState('')
  const [selectedAnswer, setSelectedAnswer] = useState('')

  const onNextQuestion = async () => {
    setQuestion(question + 1)
    setResult('')
    setSelectedAnswer('')
  }

  const checkResult = () => {
    if (selectedAnswer === dataGame?.correct) {
      setAnswer(dataGame?.correct)
      setResult('correct')
    } else {
      setResult('incorrect')
    }
  }

  const animation = [
    { rotate: '-2deg', duration: 3000 },
    { rotate: '2deg', duration: 3000 }
  ]

  const onGoBack = () => {
    Swal.fire({
      title: 'Bạn muốn dừng chơi',
      text: 'Tiến trình chơi sẽ bị mất',
      cancelButtonText: 'Không',
      confirmButtonText: 'Đồng ý',
      showCancelButton: true
    })
      .then(async ({ isConfirmed }: { isConfirmed: boolean }) => {
        if (isConfirmed) setPlaying(false)
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
              {[...Array(5).keys()]?.map((_item: unknown, index: number) => (
                <img
                  key={index}
                  width={70}
                  className="user-drag--none"
                  src={
                    index < life ? imageResources?.ico_heart_full : imageResources?.ico_heart_empty
                  }
                  alt="life"
                />
              ))}
            </div>
          </div>

          <img
            width={200}
            src={imageResources?.logo}
            className="game-logo"
            alt="button-back user-drag--none"
          />
        </div>
        {result !== 'correct' && (
          <>
            <div className="game-score-container">
              <div className="container__instruction">
                <div className="container__instruction--text">
                  <div className="instruction__text">Choose the correct answer</div>
                  <img className="w-100" src={imageResources?.ico_board_text} alt="chat" />
                </div>
              </div>
              <TweenOne animation={animation} repeat={-1} yoyo className="logo__animation-gameplay">
                <div className="game-score-relative">
                  <div className="game-score-text user-select--none">
                    Score:
                    {(score?.filter((item: any) => item?.point)?.length || 0) *
                      Math.round(100 / quesLength)}
                  </div>
                </div>
                <img
                  className="game-score-box user-drag--none"
                  src={imageResources?.ico_game_score}
                  alt="score"
                />
              </TweenOne>
            </div>
            <div className="game-question-container">
              <div className="game-question-relative">
                <img
                  src={imageResources?.ico_board_question}
                  className="game-question-box user-drag--none"
                  alt="container"
                />
                <img
                  src={imageResources?.ico_pokeball}
                  className="game-question-box-pokemon user-drag--none"
                  alt="pokeball"
                />
                {dataGame?.answers?.map((item: any, index: number) => (
                  <div
                    className={`game-question-answer answer-${index} game-button`}
                    key={item?.value}
                    onClick={() => setSelectedAnswer(item?.value)}
                  >
                    <div className="game-question-answer-text user-select--none">{item?.value}</div>
                    <img
                      src={
                        selectedAnswer === item?.value
                          ? imageResources?.btn_answer_selected
                          : imageResources?.btn_answer
                      }
                      className="answers_bg"
                      alt="btn answer"
                    />
                  </div>
                ))}

                <img
                  width={200}
                  src={
                    selectedAnswer === ''
                      ? imageResources?.btn_confirm_disable
                      : imageResources?.btn_confirm
                  }
                  className="game-question-button game-button user-drag--none"
                  alt="button"
                  onClick={() => checkResult()}
                />
                <div className="game-question-text user-select--none">
                  <span>{dataGame?.question}</span>
                </div>
              </div>
            </div>
          </>
        )}

        {result === 'correct' && (
          <Correct
            imageResources={imageResources}
            audioResources={audioResources}
            dataGame={dataGame}
            answer={answer}
            score={score}
            quesLength={quesLength}
            setScore={setScore}
            onNextQuestion={() => {
              onNextQuestion()
            }}
          />
        )}
      </div>
      {result === 'incorrect' && (
        <Incorrect
          imageResources={imageResources}
          audioResources={audioResources}
          onNextQuestion={() => {
            const newScore = [...score]
            newScore.push({ ...dataGame, point: false })
            setScore(newScore)
            setLife(life - 1)
            onNextQuestion()
          }}
        />
      )}
    </>
  )
}

export default SectionGame
