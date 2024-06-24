/* eslint-disable radix */
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { Image } from 'react-bootstrap'
import TweenOne from 'rc-tween-one'
import Animate from 'rc-animate'
import _ from 'lodash'
import Sound from 'react-sound'
import { useDispatch, useSelector } from 'react-redux'
import Swal from 'sweetalert2'
import {
  animationBtnStart,
  aniHookNorm,
  aniHook1,
  aniHook2,
  aniHook3,
  aniHook4,
  aniWrongHook1,
  aniWrongHook2,
  aniWrongHook3,
  aniWrongHook4,
  aniRopeNorm,
  aniRope1,
  aniRope2,
  aniRope3,
  aniRope4,
  aniWrongRope1,
  aniWrongRope2,
  aniWrongRope3,
  aniWrongRope4,
  aniGoldNorm1,
  aniGoldNorm2,
  aniGoldNorm3,
  aniGoldNorm4,
  aniGold1,
  aniGold2,
  aniGold3,
  aniGold4,
  aniWrongGold1,
  aniWrongGold2,
  aniWrongGold3,
  aniWrongGold4
} from './animation'
import { randomItems, randomPosition } from '../../../utils/common'
import ScreenCorrect from './components/ScreenCorrect'
import ScreenInCorrect from './components/ScreenInCorrect'
import ScreenSummary from './components/ScreenSummary'
import ScreenEnd from './components/ScreenEnd'
import { GameMaxScreenOverlay } from '../../../components'
import { GameResoucesType, ResourceType } from '../../../store/study/types'
import { RootState } from '../../../store'
import { AudioResourcesType, ImageResourcesType } from './types'
import { getGameResource, actionSaveScoreLession } from '../../../store/study/actions'
import LoadingGame from '../../../components/LoadingGame'
import IconTime from '../../../assets/images/Icon_time.svg'

type Props = {
  lesson: any
  highestScore: any
  backCourse: (isDone?: boolean) => void
  onNextLession: (result?: boolean) => void
}

type DataGameType = {
  answers: string[]
  correct: number
  correctSrc: string
  correctIndex: number
  sound: string
  correctText: string
  status: 'correct' | 'wrong' | 'not-ans'
}

const GoldGame: FC<Props> = ({ backCourse, lesson, onNextLession, highestScore }) => {
  const [gameStatus, setGameStatus] = useState<'welcome' | 'playing' | 'summary' | 'end'>('welcome')
  const [ansStatus, setAnsStatus] = useState<'correct' | 'wrong' | null>(null)
  const [life, setLife] = useState(5)
  const [action, setAction] = useState<number | null>(null)
  const [dataGame, setDataGame] = useState<DataGameType[]>([])
  const [quesIndex, setQuesIndex] = useState<number | null>(null)
  const [isPlaySound, setIsPlaySound] = useState(false)
  const [isChecking, setIsChecking] = useState(false)
  const [isPlayRopeSound, setIsPlayRopeSound] = useState(false)
  const [easterEgg, setEasterEgg] = useState<number | null>(0)
  const [isPlayTheme, setIsPlayTheme] = useState<boolean>(false)
  const [loadingGame, setIsLoadingGame] = useState(true)
  const dispatch = useDispatch()
  const [showTimer, setShowTimer] = useState<boolean>(false)
  const [counter, setCounter] = useState<any>('00:00')

  const course = useSelector((state: RootState) => state.study.currentCourse)
  const sectionId = useSelector((state: RootState) => state.study.parentLessons?.data?.sectionId)
  const gameResources: GameResoucesType | undefined = useSelector((state: RootState) =>
    state.study.gameResouces?.find((i: GameResoucesType) => i.name === 'game_gold')
  )

  const imageResources: ImageResourcesType = useMemo(() => {
    const res: any = {}
    gameResources?.image?.forEach((r: ResourceType) => {
      res[r.name] = r.url
    })
    return res
  }, [gameResources?.image])

  const audioResources: AudioResourcesType = useMemo(() => {
    const res: any = {}
    gameResources?.audio?.forEach((r: ResourceType) => {
      res[r.name] = r.url
    })
    return res
  }, [gameResources?.audio])

  useEffect(() => {
    dispatch(getGameResource({ name: 'game_gold' }))
  }, [dispatch])

  useEffect(() => {
    if (!_.isEmpty(gameResources)) {
      setIsPlayTheme(true)
      setIsLoadingGame(false)
    }
  }, [gameResources])

  const onStartGame = useCallback(
    (isWelcome?: boolean) => {
      const listAns = lesson?.questions?.[0]?.answers
      const listValue = _.map(listAns, 'imageUrl')

      const randomeDataGame = randomPosition(listAns)?.map((item: any) => {
        const [value2, value3, value4] = randomItems(listValue, [item?.imageUrl], 3)
        const answers = randomPosition([item?.imageUrl, value2, value3, value4])

        const correctIndex = answers.findIndex((a: string) => a === item?.imageUrl)
        return {
          answers,
          correctSrc: item?.imageUrl,
          correctIndex,
          sound: item?.audioUrl,
          correctText: item?.value,
          status: 'not-ans'
        }
      })

      setDataGame(randomeDataGame)
      setGameStatus(isWelcome ? 'welcome' : 'playing')
      setLife(5)
      setAnsStatus(null)
      setQuesIndex(isWelcome ? null : 0)
      setIsChecking(false)
    },
    [lesson]
  )

  useEffect(() => {
    let timeObj: any
    if (quesIndex !== null) {
      timeObj = setTimeout(() => setIsPlaySound(true), 200)
    }
    return () => {
      clearTimeout(timeObj)
    }
  }, [quesIndex])

  useEffect(() => /* convert question to dataGame */ {
    onStartGame(true)
  }, [onStartGame])

  useEffect(() => {
    if (easterEgg === 5 && life < 5) {
      setLife(5)
      setEasterEgg(null)
    }
  }, [easterEgg, life])

  const checkAns = (ansIndex: number) => {
    const answer = dataGame?.[quesIndex || 0]?.answers?.[ansIndex]
    const correct = dataGame?.[quesIndex || 0]?.correctSrc
    if (answer === correct) {
      const newData = dataGame.slice()
      newData[quesIndex || 0].status = 'correct'
      setDataGame(newData)
      setAnsStatus('correct')
    } else {
      setLife(life - 1)
      const newData = dataGame.slice()
      newData[quesIndex || 0].status = 'wrong'
      setDataGame(newData)
      setAnsStatus('wrong')
    }
  }
  const animationForRope = (type: number | null) => {
    const isCorrect = type === dataGame?.[quesIndex || 0]?.correctIndex
    switch (type) {
      case 0:
        return isCorrect ? aniRope1 : aniWrongRope1
      case 1:
        return isCorrect ? aniRope2 : aniWrongRope2
      case 2:
        return isCorrect ? aniRope3 : aniWrongRope3
      case 3:
        return isCorrect ? aniRope4 : aniWrongRope4
      default:
        return aniRopeNorm
    }
  }
  const animationForHook = (type: number | null) => {
    const isCorrect = type === dataGame?.[quesIndex || 0]?.correctIndex
    switch (type) {
      case 0:
        return isCorrect ? aniHook1 : aniWrongHook1
      case 1:
        return isCorrect ? aniHook2 : aniWrongHook2
      case 2:
        return isCorrect ? aniHook3 : aniWrongHook3
      case 3:
        return isCorrect ? aniHook4 : aniWrongHook4
      default:
        return aniHookNorm
    }
  }
  const animationForGold = (type: number | null, isNormal: boolean, isCorrect: boolean) => {
    if (isNormal) {
      switch (type) {
        case 0:
          return aniGoldNorm1
        case 1:
          return aniGoldNorm2
        case 2:
          return aniGoldNorm3
        case 3:
          return aniGoldNorm4
        default:
          return []
      }
    } else if (isCorrect) {
      switch (type) {
        case 0:
          return aniGold1(() => checkAns(0))
        case 1:
          return aniGold2(() => checkAns(1))
        case 2:
          return aniGold3(() => checkAns(2))
        case 3:
          return aniGold4(() => checkAns(3))
        default:
          return []
      }
    } else {
      switch (type) {
        case 0:
          return aniWrongGold1(() => checkAns(0))
        case 1:
          return aniWrongGold2(() => checkAns(1))
        case 2:
          return aniWrongGold3(() => checkAns(2))
        case 3:
          return aniWrongGold4(() => checkAns(3))
        default:
          return []
      }
    }
  }

  const info = () => {
    const correct = dataGame?.filter((i: any) => i?.status === 'correct')?.length
    const total = dataGame?.length || 1
    return { correct, total }
  }

  const updateUnitPercent = useCallback(
    async (isDone?: boolean, isBack?: boolean) => {
      let percentage = 100
      if (!isDone && dataGame && quesIndex !== null && quesIndex !== dataGame.length - 1) {
        percentage = Math.floor(((quesIndex + 1) / dataGame.length) * 100)
      }

      const answersCorrect = dataGame.filter((i: any) => i?.status === 'correct')?.length
      const r = counter.split(':')
      const finalTime = parseInt(r[0]) * 60 + parseInt(r[1])

      const dataResult = {
        course_id: course?.id,
        section_id: sectionId,
        unit_id: lesson?.id,
        unit_score: answersCorrect / dataGame.length,
        unit_percentage: percentage,
        unit_duration: finalTime || 0
      }

      // if (isDone && !isBack) setShowModal(true)
      await dispatch(actionSaveScoreLession(dataResult))
    },
    [quesIndex, dataGame, dispatch, lesson]
  )
  const onNextQuestion = async () => {
    setAnsStatus(null)
    setAction(null)
    setIsPlaySound(false)
    setIsChecking(false)

    if (quesIndex !== null && quesIndex + 1 < dataGame?.length && life > 0) {
      setQuesIndex(quesIndex + 1)
    } else {
      setQuesIndex(null)
      setIsPlaySound(false)
      setGameStatus('summary')
    }
  }

  const formatTime = (t: any) => {
    const h = `0${Math.floor(parseInt(t) / 3600)}`.slice(-2)
    const m = `0${(parseInt(t) / 60) % 60}`.slice(-2)

    return `${h}:${m}`
  }

  const readTime = (s: any) => {
    const r = s.split(':')

    // eslint-disable-next-line radix
    return parseInt(r[0]) * 3600 + parseInt(r[1]) * 60 + 60
  }

  const handleShowTimer = () => {
    setShowTimer(!showTimer)
  }

  useEffect(() => {
    const timer = setInterval(() => {
      if (gameStatus === 'playing') {
        const currentTime = formatTime(readTime(counter))
        setCounter(currentTime) // <-- Change this line!
      } else if (gameStatus === 'welcome') {
        setCounter('00:00')
      }
    }, 1000)
    return () => {
      clearInterval(timer)
    }
  }, [counter, gameStatus])

  return (
    <div className="gold__game">
      <GameMaxScreenOverlay />
      {loadingGame && <LoadingGame />}

      {/*
        SOUND
      */}
      <Sound
        url={
          gameStatus !== 'summary' && gameStatus !== 'end'
            ? audioResources?.theme
            : audioResources?.theme_summary
        }
        playStatus={isPlayTheme ? 'PLAYING' : 'STOPPED'}
        volume={10}
        loop
      />

      <Sound
        url={dataGame?.[quesIndex || 0]?.sound || ''}
        playStatus={isPlaySound ? 'PLAYING' : 'STOPPED'}
        onFinishedPlaying={() => setIsPlaySound(false)}
      />
      <Sound
        url={audioResources?.sound_gold_correct}
        playStatus={isPlayRopeSound ? 'PLAYING' : 'STOPPED'}
        onFinishedPlaying={() => setIsPlayRopeSound(false)}
      />
      {gameStatus === 'playing' && ansStatus !== 'correct' && (
        <img
          src={imageResources?.ico_sound}
          className="sound__item"
          alt="sound__item"
          onClick={() => setIsPlaySound(true)}
        />
      )}
      {/*
        BACK GROUND
     */}
      <div className={`background ${gameStatus === 'playing' ? 'playing' : ''}`}>
        <img src={imageResources?.bg} className="background1" alt="bgxuoi" />
        <img src={imageResources?.bg} className="background2" alt="bgnguoc" />
        <img
          src={imageResources?.bg_gold_item_2}
          className={`backgroundItem ${gameStatus === 'welcome' ? 'welcome' : ''}`}
          alt="backgroundItem"
        />

        {gameStatus === 'welcome' && (
          <TweenOne
            repeat={-1}
            yoyo
            animation={animationBtnStart}
            onClick={() => {
              if (gameStatus === 'welcome') {
                onStartGame()
              } else {
                setGameStatus('welcome')
              }
            }}
            className="btn__startGame"
          >
            <p className="btn__play--text">PLAY NOW</p>

            <img src={imageResources?.btn} alt="btn__start" />
          </TweenOne>
        )}
        <img
          src={imageResources?.ico_tnt}
          className="game__item game__item--tnt"
          alt="tnt"
          onClick={() => {
            if (easterEgg !== null) {
              setEasterEgg(easterEgg + 1)
            }
          }}
        />
        <img
          src={imageResources?.ico_robo_shy}
          className="game__item game__item--robot"
          alt="robot"
        />
        <img
          src={imageResources?.ico_diamond_box}
          className="game__item game__item--diamond"
          alt="diamonBox"
        />
        <img
          src={imageResources?.ico_gold_box}
          className="game__item game__item--gold"
          alt="goldBox"
        />

        <TweenOne
          animation={animationForRope(action)}
          className="game__item game__item--rope"
          style={{
            backgroundImage: `url(${imageResources?.ico_rope})`
          }}
        />
        <TweenOne animation={animationForHook(action)} className="game__item game__item--hook">
          <img src={imageResources?.ico_hook} alt="hook" />
        </TweenOne>
        <img
          src={imageResources?.ico_scroll}
          className="game__item game__item--scroll"
          alt="scroll"
        />
        <img src={imageResources?.ico_man} className="game__item game__item--person" alt="person" />
      </div>
      <div className="header__game">
        <img
          width={80}
          src={imageResources?.btn_back}
          className="btn__back"
          alt="btn__back"
          onClick={() => {
            if (gameStatus === 'welcome') {
              backCourse(true)
            } else if (gameStatus === 'playing') {
              Swal.fire({
                title: 'Bạn muốn dừng chơi',
                text: 'Tiến trình chơi sẽ bị mất',
                cancelButtonText: 'Không',
                confirmButtonText: 'Đồng ý',
                showCancelButton: true
              })
                .then(async ({ isConfirmed }: { isConfirmed: boolean }) => {
                  if (isConfirmed) {
                    updateUnitPercent(false, true)
                    setGameStatus('welcome')
                    setQuesIndex(null)
                    setIsPlaySound(false)
                    setAnsStatus(null)
                    setAction(null)
                  }
                  return ''
                })
                .catch(() => {
                  Swal.fire('Có lỗi xảy ra', '', 'error')
                })
            } else if (gameStatus === 'end' || gameStatus === 'summary') {
              if (gameStatus === 'summary') updateUnitPercent(true, true)
              onNextLession()
            }
          }}
        />

        <div>
          <Image className="btn__time" src={IconTime} onClick={handleShowTimer} />

          {gameStatus === 'welcome' && <span className="label_time">00:00</span>}
          {gameStatus !== 'welcome' && showTimer && <span className="label_time">{counter}</span>}
        </div>

        {gameStatus === 'playing' && (
          <div className={`heart__container heart_ico ${showTimer && 'showTimer'}`}>
            {[...new Array(5).keys()]?.map((__item: unknown, key: number) => (
              <img
                key={key}
                width={70}
                className="heart__item"
                src={key < life ? imageResources?.ico_heart_full : imageResources?.ico_heart_empty}
                alt="life"
              />
            ))}
          </div>
        )}
        {/* {(gameStatus === 'playing' || gameStatus === 'summary' || gameStatus === 'end') && (
          <div className="score__item">
            {`Score: ${
              (dataGame?.filter((item: DataGameType) => item?.status === 'correct')?.length || 0) *
              Math.ceil(100 / dataGame.length)
            }`}
          </div>
        )} */}
        <img width={200} src={imageResources?.logo} className="game__logo" alt="game__logo" />
      </div>

      {/*
        Game ANSWERS
      */}
      <Animate transitionName="fadeBottom" transitionAppear transitionLeave={false}>
        {gameStatus === 'playing' && (
          <div className="game__answers">
            {dataGame?.[quesIndex || 0]?.answers?.map((item: string, index: number) => (
              <TweenOne
                key={item}
                className={`game__answer--${index + 1}`}
                animation={animationForGold(
                  index,
                  action !== index,
                  dataGame?.[quesIndex || 0]?.correctIndex === index
                )}
                onClick={() => {
                  if (!isChecking && !isPlaySound) {
                    setIsChecking(true)
                    setAction(index)
                    setIsPlayRopeSound(true)
                  }
                }}
              >
                <div
                  className={`game__answer--inner ${!isChecking && !isPlaySound && 'can-hover'}`}
                >
                  <img
                    src={imageResources?.ico_gold}
                    className="game__answer--gold"
                    alt="goldPiece"
                  />
                  <img className="game__answer--answer" src={item} alt="gold_answer" />
                </div>
              </TweenOne>
            ))}
          </div>
        )}
      </Animate>

      {/*
        Game Correct/ Incorect/ Summary/ End Screen
      */}
      <Animate transitionName="fadeBottom" transitionAppear>
        {ansStatus === 'correct' && (
          <div className="screen__correct">
            <ScreenCorrect
              imageResources={imageResources}
              audioResources={audioResources}
              dataCorrect={dataGame[quesIndex || 0]}
              onNextQuestion={onNextQuestion}
              pointQuestion={Math.round(100 / info().total)}
            />
          </div>
        )}
      </Animate>
      <Animate transitionName="fadeBottom" transitionAppear>
        {ansStatus === 'wrong' && (
          <div className="screen__inCorrect">
            <ScreenInCorrect
              imageResources={imageResources}
              audioResources={audioResources}
              onNextQuestion={onNextQuestion}
            />
          </div>
        )}
      </Animate>
      <Animate transitionName="fadeBottom" transitionAppear transitionLeave={false}>
        {gameStatus === 'summary' && (
          <ScreenSummary
            imageResources={imageResources}
            dataGame={dataGame}
            nextScreen={() => {
              setGameStatus('end')
              updateUnitPercent(true)
            }}
          />
        )}
      </Animate>
      <Animate transitionName="fadeBottom" transitionAppear transitionLeave={false}>
        {gameStatus === 'end' && (
          <ScreenEnd
            imageResources={imageResources}
            dataGame={dataGame}
            tryAgain={() => {
              onStartGame(true)
            }}
            results={{
              score: `${info().correct} / ${info().total}`,
              unitScore: Math.round((100 / info().total) * info().correct),
              durationTime: counter,
              highestScore
            }}
          />
        )}
      </Animate>
    </div>
  )
}

export default GoldGame
