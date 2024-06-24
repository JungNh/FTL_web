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
import SummarySound from './components/SummarySound'
import SummaryFinal from './components/SummaryFinal'
import { randomItems, randomPosition } from '../../../utils/common'
import { GameMaxScreenOverlay, SumaryModal } from '../../../components'

type Props = {
  lesson: any
  highestScore: any
  backCourse: (isFinish: boolean) => void
  onNextLession: () => void
}

const MixAndMatchGame: FC<Props> = ({ backCourse, onNextLession, lesson, highestScore }) => {
  const [screen, setScreen] = useState<'welcome' | 'playing' | 'soundSummary' | 'finalSummary'>(
    'welcome'
  )
  const [isPlayTheme, setIsPlayTheme] = useState<boolean>(false)
  const [score, setScore] = useState(0)
  const [life, setLife] = useState<number>(5)
  const [loadingGame, setIsLoadingGame] = useState(true)
  const [isFinishGame, setIsFinishGame] = useState(false)
  const [userAnswers, setUserAnswer] = useState<(UserAnswerType | null)[]>([])

  const [startTime, setStartTime] = useState<string>('00:00')
  // const [showModal, setShowModal] = useState<boolean>(false)

  const course = useSelector((state: RootState) => state.study.currentCourse)
  const sectionId = useSelector((state: RootState) => state.study.parentLessons?.data?.sectionId)

  const gameResources: GameResoucesType | undefined = useSelector((state: RootState) =>
    state.study.gameResouces?.find((i: GameResoucesType) => i.name === 'game_mix_match')
  )

  const dispatch = useDispatch()

  useEffect(() => {
    if (lesson) {
      setUserAnswer(lesson?.questions?.map(() => null) || [])
    }
  }, [lesson])

  useEffect(() => {
    dispatch(getGameResource({ name: 'game_mix_match' }))
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
      const questions = lesson?.questions
      const listAns: any = []
      const listInit = questions?.map((ques: any) => {
        try {
          const answersRaw = ques?.answers?.[0]?.value
          const answer = JSON.parse(answersRaw)?.[0]
          const questionText = ques?.questionText || ''
          listAns?.push(answer.value)
          return {
            questionText,
            answers: [],
            correct: answer?.value,
            quesAudio: answer?.audioUrl,
            quesImg: answer?.imageUrl
          }
        } catch (err) {
          return {}
        }
      })

      const listConverted = listInit?.map((ques: any) => {
        const correctAns = ques?.correct
        const wrongAns = randomItems(listAns, [correctAns], 7)
        const answers = wrongAns
          .map((i: string) => ({ id: i?.toString(), value: i, isCorrect: false }))
          .concat([{ id: correctAns?.toString(), value: correctAns, isCorrect: true }])
        return { ...ques, answers: randomPosition(answers) }
      })

      return listConverted
    } catch (error) {
      return []
    }
  }, [lesson?.questions])

  const info = () => {
    const correct = userAnswers?.filter((i: any) => i?.isCorrect)?.length
    const total = dataGame?.length || 1
    return { correct, total }
  }

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
        unit_score: answersCorrect / userAnswers.length,
        unit_percentage: percentage,
        unit_duration: finalTime || 0
      }

      if (dataResult.unit_duration !== 0) {
        await dispatch(actionSaveScoreLession(dataResult))
      }
    },
    [course?.id, dataGame?.length, dispatch, lesson?.id, sectionId, userAnswers]
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

  return (
    <div className="game__mix__match">
      <GameMaxScreenOverlay />
      {loadingGame && <LoadingGame />}
      <Image className="game__background" src={imageResources?.bg} />
      <Sound
        url={audioResources.theme || ''}
        playStatus={isPlayTheme ? 'PLAYING' : 'STOPPED'}
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
        setStartTime={setStartTime}
        resetGame={(time: string) => {
          saveScoreCallBack(time)
          updateUnitPercent(false)
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
            setScreen('soundSummary')
          }}
          saveUserAnswer={(newAnswer: UserAnswerType, questionIndex: number) =>
            setUserAnswer((data: (UserAnswerType | null)[]) => {
              data[questionIndex] = newAnswer
              return data
            })
          }
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

export default MixAndMatchGame
