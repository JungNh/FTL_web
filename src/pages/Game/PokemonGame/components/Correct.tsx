import React, { FC, useCallback, useEffect, useMemo, useState } from 'react'
import '../styles.scss'
import Sound from 'react-sound'
import { KImage } from '../../../../components'
import { AudioResourcesType, ImageResourcesType } from '../types'

type Props = {
  dataGame: any
  score: any
  setScore: any
  answer: string
  quesLength: number
  onNextQuestion: () => void
  imageResources: ImageResourcesType
  audioResources: AudioResourcesType
}

const CorrectScreen: FC<Props> = ({
  onNextQuestion,
  answer,
  score,
  setScore,
  dataGame,
  quesLength,
  imageResources,
  audioResources
}) => {
  const [catchPokemon, setCatchPokemon] = useState(false)
  const [shake, setShake] = useState(true)
  const [soundEffect, setSoundEffect] = useState(true)
  const [soundCatchPokemon, setSoundCatchPokemon] = useState(true)
  const [playCorrectSound, setPlayCorrectSound] = useState(true)

  useEffect(() => {
    let timeObj: any
    if (dataGame?.sound) {
      timeObj = setTimeout(() => {
        setSoundCatchPokemon(true)
      }, 1000)
    }
    return () => clearTimeout(timeObj)
  }, [dataGame?.sound])

  const randomGamePokemon = useCallback(() => {
    const index = Math.floor(Math.random() * 18)
    switch (index) {
      case 0:
        return imageResources?.ico_pokemon_1
      case 1:
        return imageResources?.ico_pokemon_2
      case 2:
        return imageResources?.ico_pokemon_3
      case 3:
        return imageResources?.ico_pokemon_4
      case 4:
        return imageResources?.ico_pokemon_5
      case 5:
        return imageResources?.ico_pokemon_6
      case 6:
        return imageResources?.ico_pokemon_7
      case 7:
        return imageResources?.ico_pokemon_8
      case 8:
        return imageResources?.ico_pokemon_9
      case 9:
        return imageResources?.ico_pokemon_10
      case 10:
        return imageResources?.ico_pokemon_11
      case 11:
        return imageResources?.ico_pokemon_12
      case 12:
        return imageResources?.ico_pokemon_13
      case 13:
        return imageResources?.ico_pokemon_14
      case 14:
        return imageResources?.ico_pokemon_15
      case 15:
        return imageResources?.ico_pokemon_16
      case 16:
        return imageResources?.ico_pokemon_17
      case 17:
        return imageResources?.ico_pokemon_18
      default:
        return null
    }
  }, [imageResources])

  const newPokemon = useMemo(() => randomGamePokemon(), [randomGamePokemon])

  const nextQuestion = () => {
    const newScore = [...score]
    newScore.push({ ...dataGame, pokemon: newPokemon, point: true })
    setScore(newScore)
    onNextQuestion()
  }

  useEffect(() => {
    let timer: any
    if (catchPokemon) {
      timer = setTimeout(() => {
        setShake(false)
      }, 1763)
    }
    return () => {
      clearTimeout(timer)
    }
  }, [catchPokemon])

  return (
    <>
      {soundEffect && dataGame?.sound && (
        <Sound
          url={dataGame?.sound}
          playStatus={soundEffect ? 'PLAYING' : 'STOPPED'}
          onFinishedPlaying={() => setSoundEffect(false)}
        />
      )}
      {!catchPokemon && (
        <>
          {playCorrectSound && audioResources?.sound_correct && (
            <Sound
              url={audioResources?.sound_correct}
              playStatus={playCorrectSound ? 'PLAYING' : 'STOPPED'}
              onFinishedPlaying={() => setPlayCorrectSound(false)}
            />
          )}
          <div className="container-correct-game-pokemon">
            <div className="result-game">
              <img
                className="container-result-game user-drag--none"
                src={imageResources?.ico_board_correct}
                alt="result"
              />
              <div className="result-text-game">{answer}</div>
              {dataGame?.imageCorrect && (
                <KImage
                  wrapperClassName="result-image-game user-drag--none"
                  className="game__image--contain"
                  src={dataGame?.imageCorrect}
                  alt="point"
                />
              )}
            </div>
          </div>
          <div className="result-game-answer">
            <div className="result-game-answer-box">
              <img
                className="text_backround--image"
                src={imageResources?.ico_board_correct_text}
                alt="point"
              />
              <span className="result-game-answer-text user-select--none">
                {dataGame?.questionExplain}
              </span>
            </div>
          </div>
          <div className="sound-result-game">
            <img
              width={100}
              src={imageResources?.ico_sound}
              alt="sound"
              className="game-button user-drag--none"
              onClick={() => setSoundEffect(true)}
            />
          </div>
          <div className="container-point-game-pokemon">
            <div className="result-game">
              <img
                className="container-result-game user-drag--none"
                src={imageResources?.ico_board_text}
                alt="result"
              />
              <div className="result-text-game">
                <p>Excellent!</p>
              </div>
            </div>

            <div className="continue-game">
              <img
                className="result-game user-drag--none"
                src={imageResources?.ico_robo_happy}
                alt="continue"
              />
              <div className="cursor-pointer" onClick={() => setCatchPokemon(true)}>
                <p className="btn__continue--text">Continue</p>
                <img
                  className="continue-game game-button user-drag--none"
                  src={imageResources?.btn}
                  alt="continue-button"
                />
              </div>
            </div>
          </div>
        </>
      )}
      {catchPokemon && (
        <>
          <Sound
            url={audioResources?.sound_open}
            playStatus={soundCatchPokemon ? 'PLAYING' : 'STOPPED'}
            onFinishedPlaying={() => setSoundCatchPokemon(false)}
          />
          {shake && (
            <img
              className="pokeball-animation user-drag--none"
              src={imageResources?.ico_pokeball_big}
              alt="pokeball"
            />
          )}
          {!shake && (
            <>
              <img
                className="robot__blur user-drag--none"
                src={imageResources?.ico_robo_blur}
                alt="robot__blur"
              />
              <div className="pokeball-result">
                <img
                  className="pokeball-result-box user-drag--none"
                  src={imageResources?.ico_pokeball_open}
                  alt="pokeball"
                />
                <img
                  className="pokemon-result user-drag--none"
                  src={newPokemon || undefined}
                  alt="pokeball"
                />
              </div>
              <div className="pokeball-text">
                <p style={{ fontSize: 43, marginBottom: 0 }}>Flareon was caught!</p>
                <p style={{ textAlign: 'center' }}>{`+${Math.round(100 / quesLength)} xp!`}</p>
              </div>
              <div
                className="continue-game-pokemon game-button user-drag--none"
                onClick={() => nextQuestion()}
              >
                <p className="btn__continue--text">Continue</p>
                <img className="contiue-game-btn" src={imageResources?.btn} alt="continue-button" />
              </div>
            </>
          )}
        </>
      )}
    </>
  )
}

export default CorrectScreen
