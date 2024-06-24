/* eslint-disable radix */
// import axios from 'axios'
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react'
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
// import SummarySound from './components/SummarySound'
import SummaryFinal from './components/SummaryFinal'
import { randomPosition } from '../../../utils/common'
import { GameMaxScreenOverlay, SumaryModal } from '../../../components'

type Props = {
  lesson: any
  highestScore: any
  backCourse: (isFinish: boolean) => void
  onNextLession: () => void
}

const BridgeGame: FC<Props> = ({ backCourse, onNextLession, lesson, highestScore }) => {
  const [screen, setScreen] = useState<'welcome' | 'playing' | 'soundSummary' | 'finalSummary'>(
    'welcome'
  )
  const [isPlayTheme, setIsPlayTheme] = useState<boolean>(false)
  const [score, setScore] = useState(0)
  const [life, setLife] = useState<number>(5)
  const [loadingGame, setIsLoadingGame] = useState(true)
  const [isFinishGame, setIsFinishGame] = useState(false)
  const [userAnswers, setUserAnswer] = useState<(UserAnswerType | null)[]>([])
  const [isShowDecor, setIsShowDecor] = useState<boolean>(true)

  const [startTime, setStartTime] = useState<string>('00:00')
  // const [showModal, setShowModal] = useState<boolean>(false)

  const course = useSelector((state: RootState) => state.study.currentCourse)
  const sectionId = useSelector((state: RootState) => state.study.parentLessons?.data?.sectionId)

  const gameResources: GameResoucesType | undefined = useSelector((state: RootState) =>
    state.study.gameResouces?.find((i: GameResoucesType) => i.name === 'game_bridge')
  )

  const dispatch = useDispatch()

  useEffect(() => {
    if (lesson) {
      setUserAnswer(lesson?.questions?.map(() => null) || [])
      setIsShowDecor(true)
    }
  }, [lesson])

  useEffect(() => {
    dispatch(getGameResource({ name: 'game_bridge' }))
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
    setStartTime('00:00')
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

  const dataGame = useMemo(() => {
    try {
      const listQuestions = JSON.parse(lesson?.questions?.[0]?.answers?.[0]?.value)
      const list = listQuestions.map((ques: any) => {
        const correctAns = ques?.value || ''
        const quesAudio = ques?.audioUrl || ''
        const quesImg = ques?.imageUrl || ''
        return {
          answers: randomPosition(correctAns?.split(' ') || []),
          correct: correctAns,
          quesAudio,
          quesImg
        }
      })
      return list
    } catch (error) {
      return []
    }
  }, [lesson?.questions])

  const saveScoreCallBack = useCallback(
    async (durationTime: string) => {
      const doneQuesLeng = userAnswers.filter((i: UserAnswerType | null) => i !== null)?.length
      const percentage = Math.floor((doneQuesLeng / dataGame?.length) * 100)

      const answersCorrect = userAnswers.filter((i: any) => i?.isCorrect)?.length
      const r = durationTime.split(':')
      const finalTime = parseInt(r[0]) * 60 + parseInt(r[1])

      const dataResult = {
        course_id: course?.id,
        section_id: sectionId,
        unit_id: lesson?.id,
        unit_score: Number((score / 100).toFixed(1)),
        unit_percentage: percentage,
        unit_duration: finalTime || 0,
      }

      if (dataResult.unit_duration !== 0) {
        await dispatch(actionSaveScoreLession(dataResult))
      }
    },
    [course?.id, dataGame?.length, dispatch, lesson?.id, sectionId, userAnswers, score]
  )

  useEffect(() => {
    const saveScore = async () => {
      const doneQuesLeng = userAnswers.filter((i: UserAnswerType | null) => i !== null)?.length
      const percentage = Math.floor((doneQuesLeng / dataGame?.length) * 100)

      const answersCorrect = userAnswers.filter((i: any) => i?.isCorrect)?.length
      const r = startTime.split(':')
      const finalTime = parseInt(r[0]) * 60 + parseInt(r[1])

      const dataResult = {
        course_id: course?.id,
        section_id: sectionId,
        unit_id: lesson?.id,
        unit_score: answersCorrect / userAnswers.length,
        unit_percentage: percentage,
        unit_duration: finalTime || 0
      }

      if (dataResult.unit_duration !== 0) {
        await dispatch(actionSaveScoreLession(dataResult))
      }
    }

    saveScore()
  }, [course?.id, dataGame?.length, dispatch, lesson?.id, sectionId, startTime, userAnswers])

  const info = () => {
    const correct = userAnswers?.filter((i: any) => i?.isCorrect)?.length
    const total = dataGame?.length || 1
    return { correct, total }
  }

  /** Game Function */
  const updateUnitPercent = useCallback(
    async (isDone?: boolean) => {
      let percentage = 100
      if (!isDone) {
        const doneQuesLeng = userAnswers.filter((i: UserAnswerType | null) => i !== null)?.length
        percentage = Math.floor((doneQuesLeng / dataGame?.length) * 100)
      }
    },
    [dispatch, lesson?.id, userAnswers, dataGame?.length]
  )

  const onStartGame = () => {
    setScreen('playing')
  }

  const goBackCourse = () => {
    if (!isFinishGame) {
      updateUnitPercent(false)
      backCourse(true)
    } else {
      onNextLession()
    }
  }

  // const classHiddenDecorate = screen === 'playing'

  return (
    <div className="game_bridge">
      <GameMaxScreenOverlay />
      {loadingGame && <LoadingGame />}
      {/* Decorate Object */}
      <Image className="game__background" src={imageResources?.bg} />
      <Image className="ico_water" src={imageResources.ico_water} />
      <Image
        className={`fubo_on_moutain ${(!isShowDecor || screen === 'welcome') && 'hidden'}`}
        src={imageResources?.ico_robo_happy}
      />
      <Image
        className={`ico_decorate--left ${!isShowDecor && 'hidden'}`}
        src={imageResources.ico_decorate_left}
      />
      <Image
        className={`ico_decorate--right  ${!isShowDecor && 'hidden'}`}
        src={imageResources.ico_decorate_right}
      />
      {/* Audio */}
      <Sound
        url={audioResources.theme || ''}
        playStatus={isPlayTheme ? 'PLAYING' : 'STOPPED'}
        loop
        volume={10}
      />
      <HeaderGame
        imageResources={imageResources}
        score={score}
        life={life}
        isPlayTheme={isPlayTheme}
        setIsPlayTheme={setIsPlayTheme}
        screen={screen}
        backCourse={goBackCourse}
        setStartTime={setStartTime}
        resetGame={(time: string) => {
          updateUnitPercent(false)
          saveScoreCallBack(time)
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
            updateUnitPercent(true)
            setIsFinishGame(true)
            setScreen('finalSummary')
            setIsShowDecor(true)
          }}
          saveUserAnswer={(newAnswer: UserAnswerType, questionIndex: number) =>
            setUserAnswer((data: (UserAnswerType | null)[]) => {
              data[questionIndex] = newAnswer
              return data
            })
          }
          life={life}
          showDecor={setIsShowDecor}
        />
      )}
      {screen === 'finalSummary' && (
        <SummaryFinal
          imageResources={imageResources}
          userAnswers={userAnswers as UserAnswerType[]}
          onTryAgain={onTryAgain}
          results={{
            score: `${info().correct} / ${info().total}`,
            unitScore: Math.round((100 / info().total) * info().correct),
            durationTime: startTime,
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

export default BridgeGame
