/* eslint-disable radix */
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import _ from 'lodash'
import Sound from 'react-sound'
import { Image } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { differenceInSeconds } from 'date-fns'
import GamePlay from './components/GamePlay'
import GameSummary from './components/GameSummary'
import { randomPosition } from '../../../utils/common'
import GameWelcome from './components/GameWelcome'
import { GameMaxScreenOverlay, SumaryModal } from '../../../components'
import { GameResoucesType, ResourceType } from '../../../store/study/types'
import { RootState } from '../../../store'
import { actionSaveScoreLession, getGameResource } from '../../../store/study/actions'
import { AudioResourcesType, ImageResourcesType } from './types'
import LoadingGame from '../../../components/LoadingGame'
import IconTime from '../../../assets/images/Icon_time.svg'

type Props = {
  backCourse: (idDone?: boolean) => void
  onNextLession: () => void
  continueQuestion: () => void
  lesson: any
  highestScore: any
}

const GamePage: React.FC<Props> = ({
  backCourse,
  lesson,
  onNextLession,
  highestScore,
  continueQuestion
}) => {
  const [screen, setScreen] = useState<'welcome' | 'playing' | 'summary'>('welcome')
  const [life, setLife] = useState<number>(5)
  const [score, setScore] = useState<any>([])
  const [question, setQuestion] = useState(0)
  const [data, setData] = useState([])
  const [isDoneGame, setIsDoneGame] = useState(false)
  const dispatch = useDispatch()
  const [isPlayTheme, setIsPlayTheme] = useState<boolean>(false)
  const [loadingGame, setIsLoadingGame] = useState(true)
  const [counter, setCounter] = useState<string>('00:00')
  const [showTimer, setShowTimer] = useState<boolean>(false)

  const course = useSelector((state: RootState) => state.study.currentCourse)
  const sectionId = useSelector((state: RootState) => state.study.parentLessons?.data?.sectionId)

  const gameResources: GameResoucesType | undefined = useSelector((state: RootState) =>
    state.study.gameResouces?.find((i: GameResoucesType) => i.name === 'game_pokemon')
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
    dispatch(getGameResource({ name: 'game_pokemon' }))
  }, [dispatch])

  useEffect(() => {
    if (!_.isEmpty(gameResources)) {
      setIsPlayTheme(true)
      setIsLoadingGame(false)
    }
  }, [gameResources])

  const initGame = useCallback(() => {
    setScreen('welcome')

    if (!_.isEmpty(lesson)) {
      const convertData = lesson?.questions?.map((item: any) => {
        const metas = item?.metas
        const imageObj = metas?.find((metaItem: any) => metaItem?.key === 'image')
        const audioObj = metas?.find((metaItem: any) => metaItem?.key === 'audio')
        const correctObj = item?.answers?.find((answerItem: any) => answerItem?.isCorrect)
        return {
          answers: item?.answers,
          question: `${item?.questionText}`,
          correct: correctObj?.value,
          imageCorrect: imageObj?.value,
          sound: audioObj?.value,
          questionExplain: item?.questionExplain
        }
      })

      setData(randomPosition(convertData))
    }
  }, [lesson])

  useEffect(() => {
    initGame()
    return () => {
      setData([])
    }
  }, [initGame])

  const info = () => {
    const correct = score?.filter((i: any) => i?.point)?.length
    const total = data?.length || 1
    return { correct, total }
  }

  const updateUnitPercent = useCallback(
    async (isDone?: boolean, time?: any) => {
      let percentage = 100
      if (!isDone && data && question !== data.length - 1) {
        percentage = Math.floor(((question + 1) / data.length) * 100)
      }
      const answersCorrect = score.filter((i: any) => i?.point)?.length
      const r = time.split(':')
      const finalTime = parseInt(r[0]) * 60 + parseInt(r[1])

      const dataResult = {
        course_id: course?.id,
        section_id: sectionId,
        unit_id: lesson?.id,
        unit_score: Math.floor(answersCorrect * (100 / data.length)) / 100,
        unit_percentage: percentage,
        unit_duration: finalTime || 0
      }

      // !isBack && setShowModal(true)
      await dispatch(actionSaveScoreLession(dataResult))
    },
    [question, data, dispatch, lesson, score]
  )

  useEffect(() => {
    if (screen === 'playing' && (question >= data?.length || life <= 0)) {
      updateUnitPercent(true, counter)
      setScreen('summary')
    }
  }, [data?.length, life, question, screen, updateUnitPercent])

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
    <div className="pokemon__game">
      <GameMaxScreenOverlay />
      {loadingGame && <LoadingGame />}
      <img src={imageResources?.bg} className="game__background" alt="background" />
      {/* SOUND */}
      <Sound
        url={screen === 'summary' ? audioResources?.theme_summary : audioResources?.theme}
        playStatus={isPlayTheme ? 'PLAYING' : 'STOPPED'}
        loop
        volume={10}
      />

      <div>
        <Image className="btn__time" src={IconTime} onClick={handleShowTimer} />

        {screen === 'welcome' && <span className="label_time">00:00</span>}
        {screen !== 'welcome' && showTimer && <span className="label_time">{counter}</span>}
      </div>
      {/* GAME SCREEN */}
      {screen === 'welcome' && (
        <GameWelcome
          imageResources={imageResources}
          backCourse={() => {
            if (!isDoneGame) {
              backCourse(true)
            }
            if (isDoneGame) {
              onNextLession()
            }
          }}
          onStartPlay={() => {
            setLife(5)
            setScore([])
            setQuestion(0)
            setScreen('playing')
          }}
        />
      )}
      {screen === 'playing' && (
        <GamePlay
          imageResources={imageResources}
          audioResources={audioResources}
          dataGame={data[question]}
          setPlaying={() => {
            updateUnitPercent(false, counter)
            setScreen('welcome')
          }}
          life={life}
          setLife={setLife}
          score={score}
          setScore={setScore}
          question={question}
          showTimer={showTimer}
          setQuestion={setQuestion}
          questionId={lesson?.questions?.[question]?.id}
          quesLength={data?.length}
        />
      )}
      {screen === 'summary' && (
        <GameSummary
          score={score}
          imageResources={imageResources}
          goBack={() => {
            onNextLession()
          }}
          onTryAgain={() => {
            setIsDoneGame(true)
            initGame()
          }}
          quesLength={data?.length}
          results={{
            score: `${info().correct} / ${info().total}`,
            unitScore: Math.round((100 / info().total) * info().correct),
            durationTime: counter,
            highestScore
          }}
        />
      )}

    </div>
  )
}
export default GamePage
