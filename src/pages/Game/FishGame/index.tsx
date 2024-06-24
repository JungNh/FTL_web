/* eslint-disable radix */
import _ from 'lodash'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Image } from 'react-bootstrap'

import Sound from 'react-sound'
import { useDispatch, useSelector } from 'react-redux'
import { differenceInSeconds } from 'date-fns'
import { randomPosition, randomItems } from '../../../utils/common'
import { saveHightScoreGame } from '../../../store/lesson/actions'

import GamePlay from './components/GamePlay'
import GameSummary from './components/GameSummary'
import GameWelcome from './components/GameWelcome'
import { AudioResourcesType, ImageResourcesType, ScreenType } from './types'
import { GameMaxScreenOverlay } from '../../../components'
import { GameResoucesType, ResourceType } from '../../../store/study/types'
import { actionSaveScoreLession, getGameResource } from '../../../store/study/actions'
import { RootState } from '../../../store'
import LoadingGame from '../../../components/LoadingGame'
import IconTime from '../../../assets/images/Icon_time.svg'

type Props = {
  backCourse: (idDone?: boolean) => void
  onNextLession: (results?: boolean) => void
  lesson: any
  highestScore: any
}

type ScoreType = {
  answers: { value: string; src: string }[]
  correct?: string
  sound?: string
  fish?: string
  point?: boolean
}[]

const GamePage: React.FC<Props> = ({ backCourse, lesson, onNextLession, highestScore }) => {
  const [life, setLife] = useState(5)
  const [score, setScore] = useState<ScoreType>([])
  const [data, setData] = useState<any[]>([])
  const [question, setQuestion] = useState(0)
  const dispatch = useDispatch()
  const [screen, setScreen] = useState<ScreenType>('welcome')
  const [isPlayTheme, setIsPlayTheme] = useState<boolean>(false)
  const [loadingGame, setIsLoadingGame] = useState(true)
  const [startTime, setStartTime] = useState<string | null>(null)
  const [durationTime, setDurationTime] = useState<any>(null)
  // const [showModal, setShowModal] = useState<boolean>(false)

  useEffect(() => {
    dispatch(saveHightScoreGame(highestScore))
  }, [highestScore])

  const course = useSelector((state: RootState) => state.study.currentCourse)
  const sectionId = useSelector((state: RootState) => state.study.parentLessons?.data?.sectionId)

  const gameResources: GameResoucesType | undefined = useSelector((state: RootState) =>
    state.study.gameResouces?.find((i: GameResoucesType) => i.name === 'game_fish')
  )

  const [counter, setCounter] = useState<string>('00:00')
  // const [showModal, setShowModal] = useState<boolean>(false)
  const [showTimer, setShowTimer] = useState<boolean>(false)

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
    dispatch(getGameResource({ name: 'game_fish' }))
  }, [dispatch])

  useEffect(() => {
    if (!_.isEmpty(gameResources)) {
      setIsPlayTheme(true)
      setIsLoadingGame(false)
    }
  }, [gameResources])

  const [isFinishGame, setIsFinishGame] = useState(false)

  const initGame = useCallback(() => {
    const listAns = lesson?.questions?.[0]?.answers
    const listValue = _.map(listAns, 'value')

    const randomeAns = randomPosition(
      randomPosition(listAns)?.map((item: any, index: number) => {
        const listIndex = [...new Array(10).keys()]
        const correctAns = item?.value
        const [index2, index3] = randomItems(listIndex, [index], 2)
        const [value2, value3] = randomItems(listValue, [correctAns], 2)
        const answers = [
          { value: correctAns, src: String(index) },
          { value: value2, src: String(index2) },
          { value: value3, src: String(index3) }
        ]

        return {
          answers: randomPosition(answers),
          correct: item?.value,
          sound: item?.audioUrl,
          correctSrc: item?.imageUrl,
          background: Math.floor(Math.random() * 2) ? 'bg1' : 'bg2'
        }
      })
    )

    setData(randomeAns)
    setQuestion(0)
    setLife(5)
    setScore([])
  }, [lesson?.questions])

  useEffect(() => initGame(), [initGame])

  useEffect(() => {
    if ((screen === 'playing' && question >= data?.length) || life <= 0) {
      setScreen('summary')
      updateUnitPercent(true)

      const r = counter.split(':')
      const finalTime = parseInt(r[0]) * 60 + parseInt(r[1])
      setDurationTime(finalTime)
    }
  }, [counter, data?.length, life, question, screen, startTime])

  const theme = useMemo(
    () => (screen !== 'summary' ? audioResources?.theme : audioResources?.theme_summary || ''),
    [audioResources, screen]
  )

  const info = () => {
    const correct = score?.filter((i: any) => i?.point)?.length
    const total = data?.length || 1
    return { correct, total }
  }

  const updateUnitPercent = useCallback(
    async (isDone?: boolean, isBack?: boolean) => {
      let percentage = 100
      if (!isDone && data && question !== data.length - 1) {
        percentage = Math.floor(((question + 1) / data.length) * 100)
      }

      const answersCorrect = score.filter((i: any) => i?.point)?.length

      const dataResult = {
        course_id: course?.id,
        section_id: sectionId,
        unit_id: lesson?.id,
        unit_score: answersCorrect / data.length,
        unit_percentage: percentage,
        unit_duration: durationTime || 0
      }

      // if (isDone && !isBack) setShowModal(true)
      await dispatch(actionSaveScoreLession(dataResult))
    },
    [data, question, dispatch, lesson?.id, score, course?.id, sectionId, durationTime]
  )

  const goBackCourse = () => {
    if (!isFinishGame) {
      backCourse(true)
    } else {
      onNextLession()
    }
  }
  const getUrlFish = (index?: string) => {
    switch (index) {
      case '0':
        return imageResources?.ico_fish_1
      case '1':
        return imageResources?.ico_fish_2
      case '2':
        return imageResources?.ico_fish_3
      case '3':
        return imageResources?.ico_fish_4
      case '4':
        return imageResources?.ico_fish_5
      case '5':
        return imageResources?.ico_fish_6
      case '6':
        return imageResources?.ico_fish_7
      case '7':
        return imageResources?.ico_fish_8
      case '8':
        return imageResources?.ico_fish_9
      case '9':
        return imageResources?.ico_fish_10
      default:
        return imageResources?.ico_fish_1
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
      if (screen === 'playing') {
        if (!startTime) setStartTime(new Date().toISOString())
        const currentTime = formatTime(readTime(counter))
        setCounter(currentTime) // <-- Change this line!
      } else if (screen === 'welcome') {
        setCounter('00:00')
      }
    }, 1000)
    return () => {
      clearInterval(timer)
    }
  }, [counter, isPlayTheme, screen])

  return (
    <div className="fish__game">
      <GameMaxScreenOverlay />
      {loadingGame && <LoadingGame />}
      <img
        src={data[question]?.background === 'bg1' ? imageResources?.bg_1 : imageResources?.bg_2}
        className="game__background"
        alt="background"
      />

      <div>
        <Image className="btn__time" src={IconTime} onClick={handleShowTimer} />

        {screen === 'welcome' && <span className="label_time">00:00</span>}
        {screen !== 'welcome' && showTimer && <span className="label_time">{counter}</span>}
      </div>

      <Sound url={theme || ''} playStatus={isPlayTheme ? 'PLAYING' : 'STOPPED'} volume={30} loop />

      {screen === 'welcome' && (
        <GameWelcome
          backCourse={goBackCourse}
          imageResources={imageResources}
          startGame={() => {
            setLife(5)
            setScreen('playing')
            setScore([])
            setQuestion(0)
          }}
        />
      )}
      {screen === 'playing' && (
        <GamePlay
          dataGame={data[question]}
          imageResources={imageResources}
          audioResources={audioResources}
          questionLength={data?.length}
          getUrlFish={getUrlFish}
          backToWelComeScreen={() => {
            updateUnitPercent(false, true)
            setScreen('welcome')
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
      {screen === 'summary' && (
        <GameSummary
          getUrlFish={getUrlFish}
          score={score}
          imageResources={imageResources}
          questionLength={data?.length}
          backToWelComeScreen={() => {
            setIsFinishGame(true)
            initGame()
            setScreen('welcome')
            setStartTime(null)
          }}
          onNextLession={() => {
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
