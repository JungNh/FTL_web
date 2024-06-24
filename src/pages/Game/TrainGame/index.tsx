/* eslint-disable radix */
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Sound from 'react-sound'
import _ from 'lodash'
import { Image } from 'react-bootstrap'
import TweenOne from 'rc-tween-one'
import Animate from 'rc-animate'
import Swal from 'sweetalert2'
import { useDispatch, useSelector } from 'react-redux'
import { differenceInSeconds } from 'date-fns'
import GamePlay from './components/GamePlay'
import GameSummary from './components/GameSummary'
import { randomItems, randomPosition } from '../../../utils/common'
import { GameMaxScreenOverlay, SumaryModal } from '../../../components'
import { GameResoucesType, ResourceType } from '../../../store/study/types'
import { RootState } from '../../../store'
import { AudioResourcesType, ImageResourcesType } from './types'
import { actionSaveScoreLession, getGameResource } from '../../../store/study/actions'
import LoadingGame from '../../../components/LoadingGame'
import IconTime from '../../../assets/images/Icon_time.svg'

type UserAnsType = {
  src: string
  sound: string
  box: string
  status: 'correct' | 'wrong' | 'not-answer'
  correctText: string
}

type DataQues = {
  answers: string[]
  correct: string
  sound: string
  correctText: string
}

type Props = {
  backCourse: (isDone?: boolean) => void
  lesson: any
  highestScore: any
  onNextLession: () => void
}

const GamePage: React.FC<Props> = ({ backCourse, lesson, onNextLession, highestScore }) => {
  const [gameStatus, setGameStatus] = useState<'welcome' | 'playing' | 'summary'>('welcome')
  const [life, setLife] = useState(5)
  const dispatch = useDispatch()
  const [userAnswers, setUserAnswers] = useState<UserAnsType[]>([])
  const [quesIndex, setQuesIndex] = useState(0)
  const [data, setData] = useState<DataQues[]>([])
  const [playTrainSound, setPlayTrainSound] = useState(true)
  const [isFinishGame, setIsFinishGame] = useState(false)
  const [isScreenCorrect, setIsScreenCorrect] = useState(false)

  const [isPlayTheme, setIsPlayTheme] = useState<boolean>(false)
  const [loadingGame, setIsLoadingGame] = useState(true)

  const [startTime, setStartTime] = useState<string | null>(null)
  const [counter, setCounter] = useState<string>('00:00')
  const [showTimer, setShowTimer] = useState<boolean>(false)
  // const [showModal, setShowModal] = useState<boolean>(false)

  const course = useSelector((state: RootState) => state.study.currentCourse)
  const sectionId = useSelector((state: RootState) => state.study.parentLessons?.data?.sectionId)

  const gameResources: GameResoucesType | undefined = useSelector((state: RootState) =>
    state.study.gameResouces?.find((i: GameResoucesType) => i.name === 'game_train')
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
    dispatch(getGameResource({ name: 'game_train' }))
  }, [dispatch])

  useEffect(() => {
    if (!_.isEmpty(gameResources)) {
      setIsPlayTheme(true)
      setIsLoadingGame(false)
    }
  }, [gameResources])

  useEffect(() => {
    const listAns = lesson?.questions?.[0]?.answers
    const listValue = _.map(listAns, 'imageUrl')
    const randomeAns = randomPosition(listAns)?.map((item: any) => {
      const [value2, value3] = randomItems(listValue, [item?.imageUrl], 2)
      const answers = [item?.imageUrl, value2, value3]
      return {
        ...item,
        answers: randomPosition(answers),
        correct: item?.imageUrl,
        sound: item?.audioUrl,
        correctText: item?.value
      }
    })
    setData(randomeAns)
  }, [lesson?.questions])

  const onStartGame = () => {
    setStartTime(new Date().toISOString())
    setGameStatus('playing')
    setQuesIndex(0)
    const initAns = lesson?.questions?.[0]?.answers?.map(() => ({
      src: '',
      sound: '',
      box: '',
      status: 'not-answer',
      correctText: ''
    }))
    setUserAnswers(initAns)
    setLife(5)
  }
  const findBox = useCallback(
    (boxType: string) => {
      switch (boxType) {
        case 'green':
          return imageResources?.ico_box_green
        case 'blue':
          return imageResources?.ico_box_blue
        case 'red':
          return imageResources?.ico_box_red
        default:
          return imageResources?.ico_box_red
      }
    },
    [imageResources]
  )

  const animation = [
    {
      y: -5
    }
  ]
  const animationSmoke = [
    {
      opacity: 1,
      duration: 0
    },
    {
      left: 80,
      y: -80,
      opacity: 0,
      rotate: 180,
      scale: 2,
      duration: 1000
    },
    {
      duration: 500
    }
  ]
  const animationSmoke2 = [
    {
      opacity: 1,
      duration: 0,
      delay: 500
    },
    {
      left: 80,
      y: -80,
      opacity: 0,
      rotate: 180,
      scale: 2,
      duration: 1000
    }
  ]

  const goBackCourse = () => {
    if (!isFinishGame) {
      backCourse(true)
    } else {
      onNextLession()
    }
  }

  const info = () => {
    const correct = userAnswers?.filter((i: any) => i?.status === 'correct')?.length
    const durationTime = differenceInSeconds(new Date(), new Date(startTime as any))
    const total = data?.length || 1
    return { correct, total, durationTime }
  }

  const updateUnitPercent = useCallback(
    async (isDone?: boolean) => {
      let percentage = 100
      if (!isDone && data && quesIndex !== data.length - 1) {
        percentage = Math.floor(((quesIndex + 1) / data.length) * 100)
      }

      const answersCorrect = userAnswers.filter((i: any) => i?.status === 'correct')?.length
      const durationTime = differenceInSeconds(new Date(), new Date(startTime as any))

      const dataResult = {
        course_id: course?.id,
        section_id: sectionId,
        unit_id: lesson?.id,
        unit_score: answersCorrect / userAnswers.length,
        unit_percentage: percentage,
        unit_duration: durationTime || 0
      }

      // if (isDone && !isBack) setShowModal(true)
      await dispatch(actionSaveScoreLession(dataResult))
    },
    [data, quesIndex, dispatch, lesson?.id, userAnswers, startTime, course?.id, sectionId]
  )

  const onGoBack = () => {
    if (gameStatus === 'welcome') {
      goBackCourse()
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
            updateUnitPercent(false)
            setGameStatus('welcome')
          }
          return ''
        })
        .catch(() => {
          Swal.fire('Có lỗi xảy ra', '', 'error')
        })
    } else if (gameStatus === 'summary') {
      updateUnitPercent(false)
      setIsFinishGame(true)
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
    let timeout: any
    if (gameStatus === 'playing' && playTrainSound === false) {
      timeout = setTimeout(() => setPlayTrainSound(true), 5000)
    }
    return () => {
      clearTimeout(timeout)
    }
  }, [gameStatus, playTrainSound])

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
    <div className="train___game">
      <GameMaxScreenOverlay />
      {loadingGame && <LoadingGame />}

      <div className="game__background">
        <img src={imageResources?.bg} className="back__ground--1" alt="bg1" />
        <img src={imageResources?.bg} className="back__ground--2" alt="bg2" />
        <img src={imageResources?.bg} className="back__ground--3" alt="bg3" />
        <img src={imageResources?.bg} className="back__ground--4" alt="bg4" />
      </div>

      <div>
        <Image className="btn__time" src={IconTime} onClick={handleShowTimer} />

        {(gameStatus === 'welcome' || showTimer) && (
          <span className="label_time">{gameStatus !== 'welcome' && counter}</span>
        )}
      </div>

      <Sound
        url={
          (gameStatus !== 'summary' ? audioResources?.theme : audioResources?.theme_summary) || ''
        }
        volume={15}
        playStatus={isPlayTheme ? 'PLAYING' : 'STOPPED'}
        loop
      />
      {gameStatus === 'playing' && (
        <Sound
          url={audioResources?.sound_train || ''}
          volume={40}
          playStatus={playTrainSound ? 'PLAYING' : 'STOPPED'}
          onFinishedPlaying={() => setPlayTrainSound(false)}
        />
      )}
      {gameStatus === 'welcome' && (
        <div className="w-100 container-game">
          <img
            src={imageResources?.game_logo}
            className="game-train-train user-drag--none"
            alt="button-back"
          />
          <img
            src={imageResources?.game_name}
            className="game-train-text user-drag--none"
            alt="button-back"
          />
          <div className="w--100 start-button" onClick={onStartGame}>
            <p className="btn__play--text">PLAY NOW</p>
            <img
              width={400}
              src={imageResources?.btn}
              alt="button-back"
              className="game-button user-drag--none"
            />
          </div>
        </div>
      )}

      {/* TRAIN ANIMATION */}

      <div
        className={`train-container ${
          gameStatus === 'playing' || gameStatus === 'summary' ? 'start__game' : ''
        }
        ${isScreenCorrect ? 'disapear' : ''}`}
      >
        <TweenOne animation={animationSmoke} repeat={-1} className="ico__smoke">
          <img
            width={300}
            src={imageResources?.ico_smoke}
            alt="ico_smoke"
            className="ico__smoke--image game-button user-drag--none"
          />
        </TweenOne>
        <TweenOne animation={animationSmoke2} repeat={-1} className="ico__smoke">
          <img
            width={300}
            src={imageResources?.ico_smoke}
            alt="ico_smoke"
            className="ico__smoke--image game-button user-drag--none"
          />
        </TweenOne>
        <TweenOne animation={animation} yoyo repeat={-1} className="train__header">
          <img
            width={300}
            src={imageResources?.ico_train_head}
            alt="headtrain"
            className="game-button user-drag--none"
          />
        </TweenOne>

        {userAnswers?.map((item: UserAnsType, index: number) => (
          <div key={index} className="train-result">
            <Animate transitionName="fadeCustom" transitionAppear>
              {item?.status === 'correct' && (
                <img
                  src={findBox(item?.box)}
                  alt="body"
                  className="game-button train-contain user-drag--none"
                />
              )}
            </Animate>
            <Animate transitionName="fadeCustom" transitionAppear>
              {item?.status === 'correct' && (
                <img
                  src={item.src}
                  alt="body"
                  className="game-button train-number user-drag--none"
                />
              )}
            </Animate>

            <img
              src={imageResources?.ico_train_wheel}
              alt="body"
              className="game-button train-wheel user-drag--none"
            />
          </div>
        ))}
      </div>
      {gameStatus === 'playing' && (
        <GamePlay
          imageResources={imageResources}
          audioResources={audioResources}
          detailQues={data[quesIndex]}
          userAns={userAnswers[quesIndex]}
          nextQues={(nextQuesIndex: number) => {
            if (nextQuesIndex < data?.length) {
              setQuesIndex(nextQuesIndex)
            } else {
              setGameStatus('summary')
              updateUnitPercent(true)
            }
          }}
          quesIndex={quesIndex}
          quesId={lesson?.questions?.[0]?.id}
          quesLength={data?.length}
          setUserAns={(newUserAns: UserAnsType, index: number) => {
            const newAnsList: UserAnsType[] = userAnswers?.slice()
            newAnsList[index] = newUserAns
            setUserAnswers(newAnsList)
          }}
          onEndGame={() => setGameStatus('summary')}
          setIsScreenCorrect={setIsScreenCorrect}
          life={life}
          setLife={setLife}
          updateUnitPercent={updateUnitPercent}
        />
      )}
      {gameStatus === 'summary' && (
        <GameSummary
          imageResources={imageResources}
          userAnswers={userAnswers}
          retryGame={() => {
            updateUnitPercent(true)
            setIsFinishGame(true)
            setGameStatus('welcome')
            setStartTime(null)
          }}
          results={{
            score: `${info().correct} / ${info().total}`,
            unitScore: Math.round((100 / info().total) * info().correct),
            durationTime: counter,
            highestScore
          }}
        />
      )}

      <div>
        <img
          width={80}
          src={imageResources?.btn_back}
          className="game-button btn-back back-button user-drag--none"
          alt="button-back"
          onClick={() => onGoBack()}
        />
        {gameStatus === 'playing' && (
          <div className={`heart__container heart_ico ${showTimer && 'showTimer'}`} style={{ display: 'flex' }}>
            {[...new Array(5).keys()].map((__item: unknown, index: number) => (
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
        )}
        {/* {gameStatus === 'playing' && (
          <div className="font-text">
            Score:
            {(userAnswers?.filter((item: UserAnsType) => item?.status === 'correct')?.length || 0) *
              Math.round(100 / userAnswers.length)}
          </div>
        )} */}
        <img
          width={200}
          src={imageResources?.logo}
          className="game-logo user-drag--none"
          alt="button-back"
        />
      </div>

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
