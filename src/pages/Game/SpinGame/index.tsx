/* eslint-disable radix */
import React, { useState, useEffect, useMemo, useCallback } from 'react'
import Sound from 'react-sound'
import _ from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import { Image } from 'react-bootstrap'
import GamePlay from './components/GamePlay'
import GameSummary from './components/GameSummary'

import { randomItems, randomPosition } from '../../../utils/common'
import WelcomeScreen from './components/WelcomeScreen'
import SoundSummary from './components/SoundSummary'
import { GameMaxScreenOverlay, SumaryModal } from '../../../components'
import LoadingGame from '../../../components/LoadingGame'
import { AudioResourcesType, ImageResourcesType } from './types'
import { GameResoucesType, ResourceType } from '../../../store/study/types'
import { RootState } from '../../../store'
import { actionSaveScoreLession, getGameResource } from '../../../store/study/actions'
import IconTime from '../../../assets/images/Icon_time.svg'

type Props = {
  backCourse: (isDone?: boolean) => void
  lesson: any
  highestScore: any
  onNextLession: (results?: boolean) => void
}

const GamePage: React.FC<Props> = ({ backCourse, lesson, onNextLession, highestScore }) => {
  const [data, setData] = useState([])
  const [life, setLife] = useState<number>(5)
  const dispatch = useDispatch()
  const [isFinishGame, setIsFinishGame] = useState(false)
  const [question, setQuestion] = useState(0)
  const [gameScreen, setGameScreen] = useState<'welcome' | 'playing' | 'soundSummary' | 'summary'>(
    'welcome'
  )
  const [isPlayTheme, setIsPlayTheme] = useState<boolean>(false)
  const [loadingGame, setIsLoadingGame] = useState(true)
  const [startTime, setStartTime] = useState<string | null>(null)
  // const [showModal, setShowModal] = useState<boolean>(false)
  const [showTimer, setShowTimer] = useState<boolean>(false)
  const [counter, setCounter] = useState<any>('00:00')

  const course = useSelector((state: RootState) => state.study.currentCourse)
  const sectionId = useSelector((state: RootState) => state.study.parentLessons?.data?.sectionId)

  const gameResources: GameResoucesType | undefined = useSelector((state: RootState) =>
    state.study.gameResouces?.find((i: GameResoucesType) => i.name === 'game_spin')
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
    dispatch(getGameResource({ name: 'game_spin' }))
  }, [dispatch])

  useEffect(() => {
    if (!_.isEmpty(gameResources)) {
      setIsPlayTheme(true)
      setIsLoadingGame(false)
    }
  }, [gameResources])

  useEffect(() => {
    const convertData = lesson?.questions?.[0]?.answers?.map((item: any, index: number) => {
      const listValue = _.map(lesson?.questions?.[0]?.answers, 'value')
      const otherAns = randomItems(listValue, [item?.value], 5)
      const finalAns = lesson?.questions?.[0]?.answers?.filter((other: any) =>
        [...otherAns, item?.value].includes(other?.value)
      )
      return {
        answers: randomPosition(finalAns),
        correct: item?.value,
        percent: 100 / (lesson?.answers?.length || 1),
        sound: item?.audioUrl,
        imageUrl: item?.imageUrl,
        value: index + 1
      }
    })
    setData(convertData)
  }, [lesson?.answers?.length, lesson?.questions])

  const [score, setScore] = useState<
    {
      answerA?: string
      answerB?: string
      answerC?: string
      correct?: string
      sound?: string
      fish?: string
    }[]
  >([])

  const theme = useMemo(() => {
    if (gameScreen === 'summary' || gameScreen === 'soundSummary')
      return audioResources?.theme_summary
    return audioResources?.theme
  }, [gameScreen, audioResources])

  const info = () => {
    const correct = score.filter((i: any) => i?.point)?.length
    const total = data?.length || 1
    return { correct, total }
  }

  const updateUnitPercent = useCallback(
    async (isDone?: boolean) => {
      let percentage = 100
      if (!isDone && data && question !== data.length - 1) {
        percentage = Math.floor(((question + 1) / data.length) * 100)
      }

      const answersCorrect = score.filter((i: any) => i?.point)?.length

      const r = counter.split(':')
      const finalTime = parseInt(r[0]) * 60 + parseInt(r[1])

      const dataResult = {
        course_id: course?.id,
        section_id: sectionId,
        unit_id: lesson?.id,
        unit_score: answersCorrect / data.length,
        unit_percentage: percentage,
        unit_duration: finalTime || 0
      }

      // if (isDone && !isBack) setShowModal(true)
      await dispatch(actionSaveScoreLession(dataResult))
    },
    [data, question, dispatch, lesson?.id, score, counter, course?.id, sectionId]
  )

  useEffect(() => {
    if (gameScreen === 'playing' && (question >= data?.length || life <= 0)) {
      setGameScreen('soundSummary')
    }
    // if (question < data?.length && life <= 0) {
    //   updateUnitPercent(true)
    // }
  }, [data?.length, gameScreen, life, question, updateUnitPercent])

  const goBackCourse = () => {
    if (!isFinishGame) {
      backCourse(true)
    } else {
      onNextLession()
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
      if (gameScreen === 'playing') {
        if (!startTime) setStartTime(new Date().toISOString())
        const currentTime = formatTime(readTime(counter))
        setCounter(currentTime) // <-- Change this line!
      } else if (gameScreen === 'welcome') {
        setCounter('00:00')
      }
    }, 1000)
    return () => {
      clearInterval(timer)
    }
  }, [counter, gameScreen])

  return (
    <div className="spin__game">
      <GameMaxScreenOverlay />
      {loadingGame && <LoadingGame />}
      <img src={imageResources?.bg} className="game__background" alt="background" />

      <div>
        <Image className="btn__time" src={IconTime} onClick={handleShowTimer} />

        {gameScreen === 'welcome' && <span className="label_time">00:00</span>}
        {gameScreen !== 'welcome' && showTimer && <span className="label_time">{counter}</span>}
      </div>

      <Sound url={theme || ''} playStatus={isPlayTheme ? 'PLAYING' : 'STOPPED'} loop volume={15} />
      {gameScreen === 'welcome' && (
        <WelcomeScreen
          imageResources={imageResources}
          backCourse={goBackCourse}
          onStartGame={() => {
            setLife(5)
            setScore([])
            setQuestion(0)
            setGameScreen('playing')
          }}
        />
      )}
      {gameScreen === 'playing' && (
        <GamePlay
          imageResources={imageResources}
          audioResources={audioResources}
          dataGame={data}
          quesLength={data?.length}
          backToWelcome={() => {
            updateUnitPercent(false)
            setLife(5)
            setScore([])
            setQuestion(0)
            setGameScreen('welcome')
            setStartTime(null)
          }}
          life={life}
          setLife={setLife}
          score={score}
          setScore={setScore}
          question={question}
          setQuestion={setQuestion}
          showTimer={showTimer}
        />
      )}
      {gameScreen === 'soundSummary' && (
        <SoundSummary
          imageResources={imageResources}
          score={score}
          quesLength={data?.length}
          onNextScreen={() => {
            setGameScreen('summary')
            updateUnitPercent(true)
          }}
          onFinishGame={() => {
            updateUnitPercent(true)
            onNextLession()
          }}
        />
      )}
      {gameScreen === 'summary' && (
        <GameSummary
          imageResources={imageResources}
          score={score}
          quesLength={data?.length}
          onRetry={() => {
            setIsFinishGame(true)
            setLife(5)
            setScore([])
            setQuestion(0)
            setGameScreen('welcome')
            setStartTime(null)
          }}
          onFinishGame={() => {
            updateUnitPercent(true)
            onNextLession()
          }}
          results={{
            score: `${info().correct} / ${info().total}`,
            unitScore: Math.round((100 / info().total) * info().correct),
            durationTime: counter,
            highestScore
          }}
        />
      )}
      {/* <SumaryModal
        showModal={showModal}
        closeButton={false}
        countAnser={`${info().correct} / ${info().total}`}
        unitScore={Math.round((100 / info().total) * info().correct)}
        setShowModal={setShowModal as any}
        durationTime={info().durationTime}
        highestScore={highestScore}
      /> */}
    </div>
  )
}
export default GamePage
