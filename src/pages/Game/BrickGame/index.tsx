// import axios from 'axios'
import React, {
  FC, useCallback, useEffect, useMemo, useState,
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Image } from 'react-bootstrap'
import Sound from 'react-sound'
import _ from 'lodash'
import { differenceInSeconds } from 'date-fns'
import { actionSaveScoreLession, getGameResource } from '../../../store/study/actions'
import HeaderGame from './components/HeaderGame'
import ScreenPlaying from './components/ScreenPlaying'
import ScreenWelcome from './components/ScreenWelcome'
import type { AudioResourcesType, ImageResourcesType, UserAnswerType } from './types'
import type { GameResoucesType, ResourceType } from '../../../store/study/types'
import { RootState } from '../../../store'
import LoadingGame from '../../../components/LoadingGame'
import SummarySound from './components/SummarySound'
import SummaryFinal from './components/SummaryFinal'
import { GameMaxScreenOverlay, SumaryModal } from '../../../components'

type Props = {
  lesson: any
  highestScore: any
  backCourse: (isFinish: boolean) => void
  onNextLession: () => void
}

const BrickGame: FC<Props> = ({
  backCourse, onNextLession, lesson, highestScore,
}) => {
  const [screen, setScreen] = useState<'welcome' | 'playing' | 'soundSummary' | 'finalSummary'>(
    'welcome'
  )
  const [isPlayTheme, setIsPlayTheme] = useState<boolean>(false)
  const [score, setScore] = useState(0)
  const [life, setLife] = useState<number>(5)
  const [loadingGame, setIsLoadingGame] = useState(true)
  const [isFinishGame, setIsFinishGame] = useState(false)
  const [userAnswers, setUserAnswer] = useState<(UserAnswerType | null)[]>([])

  const [counter, setCounter] = useState<string>('00:00')
  // const [showModal, setShowModal] = useState<boolean>(false)

  const course = useSelector((state: RootState) => state.study.currentCourse)
  const sectionId = useSelector((state: RootState) => state.study.parentLessons?.data?.sectionId)

  const gameResources: GameResoucesType | undefined = useSelector((state: RootState) =>
    state.study.gameResouces?.find((i: GameResoucesType) => i.name === 'game_brick'))

  const dispatch = useDispatch()

  useEffect(() => {
    if (lesson) {
      setUserAnswer(lesson?.questions?.map(() => null) || [])
    }
  }, [lesson])

  useEffect(() => {
    dispatch(getGameResource({ name: 'game_brick' }))
  }, [dispatch])

  useEffect(() => {
    if (!_.isEmpty(gameResources)) {
      setIsPlayTheme(true)
      setIsLoadingGame(false)
    }
  }, [gameResources])

  const onTryAgain = () => {
    setLife(5)
    setScore(0)
    setUserAnswer(lesson?.questions?.map(() => null) || [])
    setScreen('welcome')
  }

  /** Game DATA CONVERTER
   * @imageResoureces : Game images from api
   * @audioResoureces : Game audio from api
   * @dataGame : Game Question and answers from api
   */
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

  const dataGame = useMemo(
    () =>
      lesson?.questions?.map((question: any) => {
        const quesImg = question?.metas?.find((i: any) => i.key === 'image')
        const quesAudio = question?.metas?.find((i: any) => i.key === 'audio')

        const answersList = question?.answers
        const answers = answersList?.map((i: any) => ({
          id: i?.value,
          value: i?.value,
          isCorrect: i?.isCorrect || false,
        }))

        return {
          quesImg: quesImg?.value || '',
          quesAudio: quesAudio?.value || '',
          answers,
        }
      }),
    [lesson?.questions]
  )

  const info = () => {
    const correct = userAnswers?.filter((i: any) => i?.isCorrect)?.length
    const total = userAnswers?.length || 1
    return { correct, total }
  }

  /** Game Function */
  const updateUnitPercent = useCallback(
    async (isDone?: boolean, time?: any) => {
      let percentage = 100
      if (!isDone) {
        const doneQuesLeng = userAnswers.filter((i: UserAnswerType | null) => i !== null).length
        percentage = Math.floor((doneQuesLeng / dataGame.length) * 100)
      }

      const dataResult = {
        course_id: course?.id,
        section_id: sectionId,
        unit_id: lesson?.id,
        unit_score: Number((score / 100).toFixed(1)),
        unit_percentage: percentage,
        unit_duration: time || 0,
      }
      await dispatch(actionSaveScoreLession(dataResult))

      // if (isDone && !isBack) setShowModal(true)
    },
    [dispatch, lesson?.id, userAnswers, course?.id, sectionId, dataGame.length, score]
  )

  const onStartGame = () => {
    setScreen('playing')
  }

  const goBackCourse = () => {
    if (!isFinishGame) {
      updateUnitPercent(false, readTime(counter))
      backCourse(true)
    } else {
      onNextLession()
    }
  }

  const readTime = (s: any) => {
    const r = s.split(':')

    // eslint-disable-next-line radix
    return parseInt(r[0]) * 3600 + parseInt(r[1])
  }

  return (
    <div className="game__brick">
      <GameMaxScreenOverlay />
      {loadingGame && <LoadingGame />}
      <Image className="game__background" src={imageResources?.bg} />
      <Sound
        url={audioResources.theme || ''}
        playStatus={isPlayTheme ? 'PLAYING' : 'STOPPED'}
        loop
        volume={15}
      />
      <HeaderGame
        imageResources={imageResources}
        score={score}
        life={life}
        isPlayTheme={isPlayTheme}
        setIsPlayTheme={setIsPlayTheme}
        screen={screen}
        backCourse={goBackCourse}
        setCounter={setCounter}
        counter={counter}
        resetGame={() => {
          updateUnitPercent(false, readTime(counter))
          onTryAgain()
        }}
      />

      {screen === 'welcome' && (
        <ScreenWelcome imageResources={imageResources} onStartGame={onStartGame} />
      )}

      {screen === 'playing' && (
        <ScreenPlaying
          audioResources={audioResources}
          imageResources={imageResources}
          dataGame={dataGame}
          increaseScore={(point: number) => setScore((curScore) => curScore + point)}
          loseOneLife={() => setLife((curLife) => curLife - 1)}
          endGame={() => {
            updateUnitPercent(true, readTime(counter))
            setIsFinishGame(true)
            setScreen('soundSummary')
          }}
          saveUserAnswer={(newAnswer: UserAnswerType, questionIndex: number) =>
            setUserAnswer((data: (UserAnswerType | null)[]) => {
              data[questionIndex] = newAnswer
              return data
            })}
          life={life}
        />
      )}
      {screen === 'soundSummary' && (
        <SummarySound
          quesLength={dataGame?.length}
          imageResources={imageResources}
          userAnswers={userAnswers as UserAnswerType[]}
          onNextScreen={() => setScreen('finalSummary')}
        />
      )}
      {screen === 'finalSummary' && (
        <SummaryFinal
          imageResources={imageResources}
          userAnswers={userAnswers as UserAnswerType[]}
          onTryAgain={onTryAgain}
          results={{
            score: `${info().correct} / ${info().total}`,
            unitScore: Number((score / 100).toFixed(1)) * 100,
            durationTime: counter,
            highestScore,
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

export default BrickGame
