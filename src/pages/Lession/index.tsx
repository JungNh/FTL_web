/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useHistory, useLocation } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import _ from 'lodash'
import Swal from 'sweetalert2'
// import moment from 'moment'
import { differenceInSeconds } from 'date-fns'
import { Question, SumaryModal } from '../../components'

import {
  actionGetOneLesson,
  actionResetCorrect,
  actionSendBulkAnswer,
  actionShowReport,
  actionShowReported,
  actionShowSumary
} from '../../store/lesson/actions'
import { openError } from '../../utils/common'
import {
  actionJoinLesson,
  actionFinishedLesson,
  actionGetChildsLesson,
  actionSaveParentLessons,
  actionSaveDurationStudy,
  actionGetSectionScore,
  actionSaveScoreLession,
  actionSaveChildLesson
} from '../../store/study/actions'
import NotFoundLession from './NotFoundLession'
import GamePokemon from '../Game/PokemonGame'
import GameFish from '../Game/FishGame'
import GameSpin from '../Game/SpinGame'
import GameMine from '../Game/GoldGame'
import GameTrain from '../Game/TrainGame'
import GameBrick from '../Game/BrickGame'
import GameBridge from '../Game/BridgeGame'
import GameMixMatch from '../Game/MixAndMatchGame'
import GameBasketball from '../Game/BasketballGame'
import { hideLoading, showLoading } from '../../store/login/actions'
import { RootState } from '../../store'
import ModalReport from '../../components/Question/ResultAns/ModalReport'
import ModalReported from '../../components/Question/ModalReported'
import start_cheer from '../../assets/images/start_cheer.png'
import light_long from '../../assets/images/light_long.png'
import light_short from '../../assets/images/light-short.png'

type Props = Record<string, unknown>
type LessonType = {
  id?: number
  isQuiz?: boolean
  name?: string
  quizType?: string
  content?: string
  questions?: any[]
  sectionId?: number
  sequenceNo?: number
  childs?: any[]
  section?: any
  parentId?: any
}

type DataConverType = {
  score: number
  numQuestion: number
  questionLeng: number
}

const Lesson: React.FC<Props> = () => {
  const history = useHistory()

  const [currentLessionIndex, setCurrentLessionIndex] = useState<number>(0)
  const [lesson, setLesson] = useState<LessonType>({})
  const [questions, setQuestions] = useState<any[]>([])
  const [results, setResults] = useState<any[]>([])
  const [listVob, setListVob] = useState<any[]>([])
  const [isVideo, setIsVideo] = useState<boolean>(false)
  const [isBlankScreen, setIsBlankScreen] = useState(true)
  const [showModal, setShowModal] = useState<boolean>(false)
  const [duration, setDurationQuizz] = useState(0)
  const [answerCorrect, setAnserCorrect] = useState('')
  const [unitScore, setUnitScore] = useState(0)
  const [sectionScore, setSectionScore] = useState<any>([])
  const course = useSelector((state: RootState) => state.study.currentCourse)
  const childLesson = useSelector((state: RootState) => state.study.childLesson)
  const parentLessons = useSelector((state: RootState) => state.study.parentLessons)
  const sectionId = useSelector((state: RootState) => state.study.parentLessons?.data?.sectionId)
  const [vobCorrect, setVobCorrect] = useState<number>(0)
  const [detailDataIndex, setDetailDataIndex] = useState<number | null>(null)

  const location = useLocation()
  const dispatch = useDispatch()
  const [startTime, setStartTime] = useState<string | null>(null)
  const arrNoResults: any = useMemo(() => ['vocabulary', 'video', 'flash_card'], [])
  const arrResults: any = useMemo(
    () => [
      'multiple_choice',
      'fill_word_multiple',
      'fill_word_multiple_answer',
      'arrangement',
      'new_arrange',
      'pair',
      'catching_up',
      'back_talk',
      'back_talk_conversation',
      'back_talk_video',
      'speak_not_text'
    ],
    []
  )

  const indexLoca: number = location.pathname.lastIndexOf('/')
  const idLess: string = location.pathname.substring(indexLoca + 1, location.pathname.length)
  const durationTime = differenceInSeconds(new Date(), new Date(startTime as any))
  const language = useSelector((state: RootState) => state.study.checkLang.language)
  const {
    showCheer,
    showReport,
    showReported,
    questionRpId,
    showSumary,
    numberCorrect,
    numberWrong,
    correctFirstShowed,
    correctSecondShowed,
    wrongShowed
  } = useSelector((state: RootState) => state.lesson)

  console.log(
    'NUMBER_CORRECT',
    numberCorrect,
    numberWrong,
    correctFirstShowed,
    correctSecondShowed,
    wrongShowed
  )
  const questionCurrent = questions[currentLessionIndex]
  /**
   * Save duration learn this lession
   */
  useEffect(() => {
    if (startTime === null) {
      setStartTime(new Date().toISOString())
    }
    const sentLearnedDuration = async () => {
      if (startTime !== null) {
        if (duration > 0) {
          await dispatch(
            actionSaveDurationStudy({
              unitId: lesson?.id || 0,
              duration
            })
          )
        }
      }
    }
    return () => {
      sentLearnedDuration()
    }
  }, [dispatch, lesson?.id, startTime])

  useEffect(() => {
    dispatch(actionResetCorrect())
    const getSectionScore = async () => {
      const dataRes = await dispatch(
        actionGetSectionScore({
          course_id: Number(course?.id),
          section_id: Number(sectionId)
        })
      )

      if (!_.isEmpty(dataRes)) {
        setSectionScore(dataRes)
      }
    }

    getSectionScore()
    dispatch(actionShowSumary(false))
  }, [])

  useEffect(() => {
    /**
     * todo [x] get lesson detail
     * todo [x] get question list
     */
    const getInitData = async () => {
      dispatch(showLoading())
      const dataLess: any = await dispatch(actionGetOneLesson(Number(idLess)))
      console.log('dataLess', dataLess)
      if (!_.isEmpty(dataLess)) {
        const resQuesList: any = _.get(dataLess, 'questions')
        setLesson(dataLess)
        setQuestions(resQuesList)
        if (_.isEmpty(resQuesList)) {
          setIsVideo(true)
        } else {
          setIsVideo(false)
        }
        setIsBlankScreen(false)
        dispatch(hideLoading())
      } else {
        setIsVideo(false)
        dispatch(hideLoading())
        history.push(`/study/${course?.id}`)
      }
    }
    getInitData()
    return () => setIsBlankScreen(true)
  }, [dispatch, location.pathname])

  const finishLession = useCallback(
    async (unitId?: number) => {
      if (unitId !== undefined) {
        const data: any = await dispatch(actionFinishedLesson({ unitId }))
        return data
      }
      return null
    },
    [dispatch]
  )

  const questionType = useMemo(() => {
    /**
     * @lesson Không rỗng
     * @questions rỗng
     * => VIDEO LESSION
     */
    if (!_.isEmpty(lesson) && _.isEmpty(questions) && isVideo) return 'video'

    /**
     * @questions không rỗng
     * => các loại câu hỏi trong bài học
     */

    if (lesson?.isQuiz) return 'quiz'

    if (!_.isEmpty(questions)) {
      if (_.some(questions, { type: 'reading' })) return 'reading'
      if (_.some(questions, { type: 'listening' })) return 'listening'
      if (_.every(questions, { type: 'game_pokemon' })) return 'game_pokemon'
      if (_.every(questions, { type: 'game_fish' })) return 'game_fish'
      if (_.every(questions, { type: 'game_spin' })) return 'game_spin'
      if (_.every(questions, { type: 'game_mine' })) return 'game_mine'
      if (_.every(questions, { type: 'game_train' })) return 'game_train'
      /** NEW GAME */
      if (_.every(questions, { type: 'BricksDownGame' })) return 'game_brick'
      if (_.every(questions, { type: 'BridgeGame' })) return 'game_bridge'
      if (_.every(questions, { type: 'BasketballGame' })) return 'game_basketball'
      if (_.every(questions, { type: 'MixAndMatchGame' })) return 'game_mix_and_match'
    }
    // normal type
    const lessType = questions[currentLessionIndex]?.type
    const answersLength = questions[currentLessionIndex]?.answers?.length || 0
    if (lessType === 'vocabulary') return 'vocabulary'
    if (lessType === 'flash_card') return 'flash_card'
    if (lessType === 'multiple_choice') return 'multiple_choice'
    if (lessType === 'fill_word_multiple') return 'fill_word_multiple'
    if (lessType === 'fill_word_multiple_answer' && answersLength === 1) return 'fill_word_multiple'
    if (lessType === 'fill_word_multiple_answer') return 'fill_word_multiple_answer'
    if (lessType === 'arrangement') return 'arrangement'
    if (lessType === 'new_arrange') return 'new_arrange'
    if (lessType === 'pair') return 'pair'
    if (lessType === 'catching_up') return 'catching_up'
    if (lessType === 'back_talk') return 'back_talk'
    if (lessType === 'back_talk_conversation') return 'back_talk_conversation'
    if (lessType === 'back_talk_video') return 'back_talk_video'
    if (lessType === 'speak_not_text') return 'speak_not_text'
    if (isBlankScreen) return 'blank'
    return undefined
  }, [currentLessionIndex, isBlankScreen, isVideo, lesson, questions])

  const callResultsLesson = useCallback(
    async (isBack?: boolean) => {
      const dataR: any = await dispatch(
        actionSendBulkAnswer({
          bulk: results
        })
      )

      if (!_.isEmpty(dataR) && dataR.status === 200) {
        let countAnser = dataR?.data.filter((anw: { result: any }) => anw.result)?.length
        let score = countAnser

        if (questionType === 'catching_up' && dataR?.data) {
          countAnser = dataR.data.filter((anw: { score: any }) => anw.score >= 0.5)?.length

          const accurate = dataR.data.filter((anw: { score: any }) => anw.score >= 0.9)?.length
          const relative30 = dataR.data.filter(
            (anw: { score: any }) => anw.score >= 0.3 && anw.score < 0.49
          )?.length
          const relative60 = dataR.data.filter(
            (anw: { score: any }) => anw.score >= 0.5 && anw.score < 0.69
          )?.length
          const relative80 = dataR.data.filter(
            (anw: { score: any }) => anw.score >= 0.7 && anw.score < 0.89
          )?.length

          const relative = relative30 * 0.3 + relative60 * 0.6 + relative80 * 0.8
          score = accurate + relative

          setUnitScore(Math.round(score * (100 / questions?.length)))
        } else {
          setUnitScore(Math.round((countAnser / questions?.length) * 100))
        }

        setAnserCorrect(`${Math.round(countAnser)}/${questions?.length}`)

        if (duration === 0 && durationTime !== 0) setDurationQuizz(durationTime)

        if (!isBack) setShowModal(true)
        setResults([])
      }
    },
    [results, dispatch]
  )

  // disable send request when enter
  useEffect(() => {
    const keyDownHandler = (event: any) => {
      if (event.key === 'Enter') {
        event.preventDefault()
      }
    }

    document.addEventListener('keydown', keyDownHandler)

    return () => {
      document.removeEventListener('keydown', keyDownHandler)
    }
  }, [])

  useEffect(() => {
    const saveScore = async () => {
      if (results.length > 0) {
        let countAnser = results.filter((anw: { result: any }) => anw.result)?.length

        if (questionType === 'catching_up') {
          const accurate = results.filter((anw: { score: any }) => anw.score >= 0.9)?.length
          const relative30 = results.filter(
            (anw: { score: any }) => anw.score >= 0.3 && anw.score < 0.49
          )?.length
          const relative60 = results.filter(
            (anw: { score: any }) => anw.score >= 0.5 && anw.score < 0.69
          )?.length
          const relative80 = results.filter(
            (anw: { score: any }) => anw.score >= 0.7 && anw.score < 0.89
          )?.length

          const relative = relative30 * 0.3 + relative60 * 0.6 + relative80 * 0.8
          countAnser = accurate + relative
        }

        const { sectionId, section } = lesson
        if (section) {
          const dataSave = {
            course_id: section?.courseId,
            section_id: sectionId,
            unit_id: idLess,
            unit_score: countAnser/ questions?.length,
            unit_percentage: Math.round(results.length * (100 / questions?.length)) || 0,
            unit_duration: durationTime
          }
          await dispatch(actionSaveScoreLession(dataSave))
        }
      }
    }

    saveScore()
  }, [results, dispatch])

  const updateUnitPercent = useCallback(
    async (isDone?: boolean) => {
      let percentage: any = 100
      if (!isDone && questions && currentLessionIndex !== questions.length - 1) {
        percentage = Math.floor(((currentLessionIndex + 1) / questions.length) * 100)
      }
      if (duration === 0 && durationTime !== 0) setDurationQuizz(durationTime)

      const dataTypes: string[] = ['video', 'flash_card']

      if (dataTypes.includes(String(questionType))) {
        const { sectionId, section } = lesson
        percentage = 100
        await dispatch(
          actionSaveScoreLession({
            course_id: section?.courseId,
            section_id: sectionId,
            unit_id: idLess,
            unit_score: percentage / 100,
            unit_percentage: percentage,
            unit_duration: durationTime
          })
        )
      }

      if (questionType === 'vocabulary') {
        const dataIndex = detailDataIndex === null ? 0 : detailDataIndex
        const { sectionId, section } = lesson

        setAnserCorrect(`${Math.round(vobCorrect)}/${listVob?.length}`)
        setUnitScore(Math.round((vobCorrect / listVob?.length) * 100))

        await dispatch(
          actionSaveScoreLession({
            course_id: section?.courseId,
            section_id: sectionId,
            unit_id: idLess,
            unit_score: vobCorrect / listVob?.length,
            unit_percentage: Math.round((dataIndex + 1) * (100 / listVob?.length) || 0),
            unit_duration: durationTime
          })
        )
        setVobCorrect(0)
        setShowModal(true)
      }

      if (questionType === 'multiple_choice') {
        const res = await finishLession(lesson.id)
        // dispatch(hideLoading())
        if (!_.isEmpty(res) && res?.status === 200) {
          if (!_.isEmpty(sectionScore) && lesson.id) {
            const lessionItem = sectionScore[lesson.id]
            setSectionScore(lessionItem)
          }
        }
      }
    },
    [
      currentLessionIndex,
      dispatch,
      lesson?.id,
      questions,
      questionType,
      listVob,
      vobCorrect,
      detailDataIndex
    ]
  )
  const backToStudyPage = useCallback(
    async (isDone?: boolean) => {
      // todo [x] nếu là bài học con ( trong store có dữ liệu bài học cha ) => gọi lại cập nhật dữ liệu thằng cha
      if (!isDone) {
        Swal.fire({
          title: 'Bạn có chắc chắn muốn thoát',
          text: 'Mọi tiến trình sẽ bị mất',
          cancelButtonText: 'Không',
          confirmButtonText: 'Đồng ý',
          showCancelButton: true
        })
          .then(async ({ isConfirmed }: { isConfirmed: boolean }) => {
            if (isConfirmed) {
              if (arrResults.includes(questionType)) {
                await callResultsLesson(true)
                updateUnitPercent(false)
              }
              if (parentLessons?.childLessons?.length) {
                const dataDetail = await dispatch(actionGetChildsLesson(parentLessons?.data?.id))
                await dispatch(
                  actionSaveParentLessons({
                    index: parentLessons?.index,
                    data: parentLessons?.data,
                    childLessons: _.isEmpty(dataDetail) ? null : dataDetail
                  })
                )
              }

              history.push(`/study/${course?.id}`)
            }
            return ''
          })
          .catch(() => {
            Swal.fire('Có lỗi xảy ra', '', 'error')
          })
      } else {
        if (parentLessons?.childLessons?.length) {
          const dataDetail = await dispatch(actionGetChildsLesson(parentLessons?.data?.id))
          await dispatch(
            actionSaveParentLessons({
              index: parentLessons?.index,
              data: parentLessons?.data,
              childLessons: _.isEmpty(dataDetail) ? null : dataDetail
            })
          )
        }

        history.push(`/study/${course?.id}`)
      }
    },
    [
      course?.id,
      dispatch,
      history,
      parentLessons?.childLessons?.length,
      parentLessons?.data,
      parentLessons?.index,
      callResultsLesson,
      updateUnitPercent,
      arrResults,
      questionType
    ]
  )
  const onNextQuestion = useCallback(
    async (skipSmallQues?: boolean, isGame?: boolean) => {
      if (arrNoResults.includes(questionType)) {
        updateUnitPercent(true)
      }
      // dispatch(showLoading())
      if (!skipSmallQues && currentLessionIndex < questions.length - 1) {
        setCurrentLessionIndex(currentLessionIndex + 1)
        // dispatch(hideLoading())
      } else {
        const data = await finishLession(lesson.id)
        // dispatch(hideLoading())
        if (!_.isEmpty(data) && data?.status === 200) {
          if (!_.isEmpty(sectionScore) && lesson.id) {
            const lessionItem = sectionScore[lesson.id]
            setSectionScore(lessionItem)
          }
          // quay lai man hinh cu neu la cac bai hoc
          if (
            questionType?.includes('game') ||
            questionType === 'video' ||
            questionType === 'flash_card'
          ) {
            backToStudyPage(true)
          }

          if (questionType === 'vocabulary') {
            // dispatch(actionShowSumary(true))
            setAnserCorrect(`${vobCorrect}/${listVob?.length}`)
            setUnitScore(Math.round((vobCorrect / listVob?.length) * 100))
          }
          dispatch(actionShowSumary(true))
        }
      }
    },
    [
      backToStudyPage,
      dispatch,
      lesson,
      currentLessionIndex,
      finishLession,
      questions.length,
      questionType,
      updateUnitPercent,
      arrNoResults,
      startTime,
      idLess,
      listVob,
      vobCorrect
    ]
  )

  // post score conversation

  const nextQuestionConversation = async (data: DataConverType) => {
    const { sectionId, section } = lesson
    setAnserCorrect(`${data.score}/${data.questionLeng}`)
    setUnitScore(Math.round((data.score / data.questionLeng) * 100))
    setDurationQuizz(durationTime)
    console.log('DataConverType', data.score)
    await dispatch(
      actionSaveScoreLession({
        course_id: section?.courseId,
        section_id: sectionId,
        unit_id: idLess,
        unit_score: data.score / data.questionLeng,
        unit_percentage: Math.round((data.numQuestion + 1) * (100 / data.questionLeng) || 0),
        unit_duration: durationTime
      })
    )
  }

  const continueQuestion = useCallback(async () => {
    if (parentLessons?.childLessons?.length) {
      let data = null

      const dataDetail: any = await dispatch(actionGetChildsLesson(parentLessons?.data?.id))
      if (parentLessons?.childLessons?.length) {
        await dispatch(
          actionSaveParentLessons({
            index: parentLessons?.index,
            data: parentLessons?.data,
            childLessons: _.isEmpty(dataDetail) ? null : dataDetail
          })
        )
      }

      if (childLesson && lesson) {
        const childsSection = childLesson?.data?.childs
          ? childLesson?.data?.childs.sort((a: any, b: any) => a.sequenceNo - b.sequenceNo)
          : []

        const lessIndex = childsSection.findIndex((cur: any) => cur.id === lesson.id)

        if (lessIndex >= 0 && lessIndex < childsSection.length && childsSection[lessIndex + 1]) {
          data = {
            index: childLesson.index,
            data: dataDetail[childLesson.index]
          }

          dispatch(actionSaveChildLesson(data))

          setCurrentLessionIndex(childLesson.index)
          history.push(`/study/${course?.id}`)
        } else if (
          childLesson &&
          childLesson.index + 1 < dataDetail.length &&
          dataDetail[childLesson.index + 1]
        ) {
          data = {
            index: childLesson.index + 1,
            data: dataDetail[childLesson.index + 1]
          }

          dispatch(actionSaveChildLesson(data))
          setCurrentLessionIndex(0)
          history.push(`/study/${course?.id}`)
        } else {
          history.push(`/study/${course?.id}`)
        }
      }
    } else {
      history.push(`/study/${course?.id}`)
    }
  }, [currentLessionIndex, questionType, lesson])

  const changeLesson = useCallback(
    async (id: number) => {
      const dataLess: any = await dispatch(actionGetOneLesson(id))
      if (dataLess?.canAccess) {
        const dataJoin: any = await dispatch(actionJoinLesson({ unitId: id }))
        if (!_.isEmpty(dataJoin) && dataJoin?.status === 200) {
          const newQuestions: any =
            !_.isEmpty(dataLess) && !_.isEmpty(dataLess.questions)
              ? dataLess.questions
              : !_.isEmpty(dataLess) && !_.isEmpty(dataLess?.childs)
              ? dataLess?.childs
              : []
          setLesson(dataLess)
          setQuestions(newQuestions)
        } else {
          openError('Tham gia bài học không thành công')
        }
      } else {
        openError('Hãy nâng cấp tài khoản VIP để mở khóa tất cả bài học bạn nhé!')
        setTimeout(() => {
          backToStudyPage(true)
        }, 1000)
      }
    },
    [backToStudyPage, dispatch]
  )
  useEffect(() => {
    if (
      arrResults.includes(questionType) &&
      results.length === questions.length &&
      currentLessionIndex === questions.length - 1
    ) {
      callResultsLesson()
      updateUnitPercent(true)
    }
  }, [
    questionType,
    currentLessionIndex,
    questions,
    results,
    callResultsLesson,
    updateUnitPercent,
    arrNoResults,
    arrResults
  ])

  return (
    <div className="lesson__page">
      <ModalReport
        show={showReport}
        handleClose={() => dispatch(actionShowReport({ isShow: false }))}
        questionId={questionRpId}
      />

      <ModalReported
        isShow={showReported}
        handleClose={() => dispatch(actionShowReported(false))}
      />
      <SumaryModal
        showModal={showSumary && !questionType?.includes('game') && questionType !== 'video'}
        countAnser={answerCorrect}
        unitScore={unitScore}
        setShowModal={() => dispatch(actionShowSumary(false))}
        durationTime={duration}
        backCourse={backToStudyPage}
        highestScore={sectionScore?.unit_score}
        continueQuestion={continueQuestion}
      />
      {numberCorrect >= 2 && !showCheer && (
        <div className="bg_number_correct">
          <img src={start_cheer} className="img_start_cheer" />
          <img src={light_short} className="img_light_short" />
          <img src={light_long} className="img_light_long" />
          <div className="number_cheer_text">{numberCorrect} câu</div>
          <div className="continuous_text">liên tiếp</div>
        </div>
      )}
      {questionType === 'video' && (
        <Question.Video
          lesson={lesson}
          course={course}
          backCourse={backToStudyPage}
          callChangeLesson={(id: number) => changeLesson(id)}
          onNextLession={() => onNextQuestion()}
        />
      )}
      {questionType === 'reading' && (
        <Question.Reading
          lession={questions}
          course={course}
          sectionScore={sectionScore[idLess]}
          backCourse={backToStudyPage}
        />
      )}
      {questionType === 'listening' && (
        <Question.Listening
          lession={questions}
          course={course}
          sectionScore={sectionScore[idLess]}
          backCourse={backToStudyPage}
        />
      )}
      {questionType === 'quiz' && (
        <Question.Quiz
          lessionInfo={lesson}
          course={course}
          sectionScore={sectionScore[idLess]}
          backCourse={backToStudyPage}
        />
      )}
      {questionType === 'game_pokemon' && (
        <GamePokemon
          lesson={lesson}
          backCourse={backToStudyPage}
          onNextLession={() => onNextQuestion(true, true)}
          highestScore={sectionScore[idLess]?.unit_score}
          continueQuestion={continueQuestion}
        />
      )}
      {questionType === 'game_fish' && (
        <GameFish
          lesson={lesson}
          backCourse={backToStudyPage}
          onNextLession={() => onNextQuestion(true, true)}
          highestScore={sectionScore[idLess]?.unit_score}
        />
      )}
      {questionType === 'game_spin' && (
        <GameSpin
          lesson={lesson}
          backCourse={backToStudyPage}
          onNextLession={() => onNextQuestion(true, true)}
          highestScore={sectionScore[idLess]?.unit_score}
        />
      )}
      {questionType === 'game_mine' && (
        <GameMine
          lesson={lesson}
          backCourse={backToStudyPage}
          onNextLession={() => onNextQuestion(true, true)}
          highestScore={sectionScore[idLess]?.unit_score}
        />
      )}
      {questionType === 'game_train' && (
        <GameTrain
          lesson={lesson}
          backCourse={backToStudyPage}
          onNextLession={() => onNextQuestion(true, true)}
          highestScore={sectionScore[idLess]?.unit_score}
        />
      )}
      {questionType === 'game_brick' && (
        <GameBrick
          lesson={lesson}
          backCourse={backToStudyPage}
          onNextLession={() => onNextQuestion(true, true)}
          highestScore={sectionScore[idLess]?.unit_score}
        />
      )}
      {questionType === 'game_bridge' && (
        <GameBridge
          lesson={lesson}
          backCourse={backToStudyPage}
          onNextLession={() => onNextQuestion(true, true)}
          highestScore={sectionScore[idLess]?.unit_score}
        />
      )}
      {questionType === 'game_basketball' && (
        <GameBasketball
          lesson={lesson}
          backCourse={backToStudyPage}
          onNextLession={() => onNextQuestion(true, true)}
          highestScore={sectionScore[idLess]?.unit_score}
        />
      )}
      {questionType === 'game_mix_and_match' && (
        <GameMixMatch
          lesson={lesson}
          backCourse={backToStudyPage}
          onNextLession={() => onNextQuestion(true, true)}
          highestScore={sectionScore[idLess]?.unit_score}
        />
      )}
      {questionType === 'vocabulary' && (
        <Question.Vocabulary
          lession={questionCurrent}
          onNextLession={() => onNextQuestion()}
          backCourse={backToStudyPage}
          setListVob={setListVob}
          listVob={listVob}
          setVobCorrect={setVobCorrect}
          setDetailDataIndex={setDetailDataIndex}
          detailDataIndex={detailDataIndex}
          vobCorrect={vobCorrect}
          lengthList={listVob.length}
        />
      )}
      {questionType === 'flash_card' && (
        <Question.Flashcard
          lession={questionCurrent}
          onNextLession={() => onNextQuestion()}
          backCourse={backToStudyPage}
          setListVob={setListVob}
          listVob={listVob}
          setVobCorrect={setVobCorrect}
          setDetailDataIndex={setDetailDataIndex}
          detailDataIndex={detailDataIndex}
          vobCorrect={vobCorrect}
          lengthList={listVob.length}
        />
      )}
      {questionType === 'multiple_choice' && (
        <Question.MultipleChoice
          lession={questionCurrent}
          onNextLession={() => onNextQuestion()}
          onSetResults={(data: any) => {
            const neResults: any = [...results, data]
            setResults(neResults)
          }}
          currentTestIndex={currentLessionIndex}
          totalTest={questions.length}
          backCourse={backToStudyPage}
        />
      )}
      {questionType === 'fill_word_multiple' && (
        <Question.FillWord
          lession={questionCurrent}
          onNextLession={onNextQuestion}
          onSetResults={(data: any) => {
            const neResults: any = [...results, data]
            setResults(neResults)
          }}
          currentTestIndex={currentLessionIndex}
          totalTest={questions.length}
          backCourse={backToStudyPage}
        />
      )}
      {questionType === 'fill_word_multiple_answer' && (
        <Question.FillWordMulti
          lession={questionCurrent}
          onSetResults={(data: any) => {
            const neResults: any = [...results, data]
            setResults(neResults)
          }}
          onNextLession={onNextQuestion}
          currentTestIndex={currentLessionIndex}
          totalTest={questions.length}
          backCourse={backToStudyPage}
        />
      )}
      {questionType === 'arrangement' && (
        <Question.Arrangement
          lession={questionCurrent}
          onSetResults={(data: any) => {
            console.log('DATA_RESULT', data)
            const neResults: any = [...results, data]
            setResults(neResults)
          }}
          onNextLession={onNextQuestion}
          currentTestIndex={currentLessionIndex}
          totalTest={questions?.length}
          backCourse={backToStudyPage}
        />
      )}
      {questionType === 'new_arrange' && (
        <Question.Arrangement
          lession={questionCurrent}
          onSetResults={(data: any) => {
            const neResults: any = [...results, data]
            setResults(neResults)
          }}
          onNextLession={onNextQuestion}
          currentTestIndex={currentLessionIndex}
          totalTest={questions.length}
          backCourse={backToStudyPage}
        />
      )}
      {questionType === 'pair' && (
        <Question.Pair
          lession={questionCurrent}
          onNextLession={(data: any) => {
            const neResults: any = [...results, data]
            setResults(neResults)
            onNextQuestion()
          }}
          currentTestIndex={currentLessionIndex}
          totalTest={questions.length}
          backCourse={backToStudyPage}
        />
      )}
      {(questionType === 'catching_up' || questionType === 'speak_not_text') && (
        <>
          {language == 'zh-CN' || language == 'ko-KR' ? (
            <Question.SpeakCnAI
              lession={questionCurrent}
              onNextLession={(data: any) => {
                const neResults: any = [...results, data]
                setResults(neResults)
                onNextQuestion()
              }}
              currentTestIndex={currentLessionIndex}
              totalTest={questions.length}
              backCourse={backToStudyPage}
            />
          ) : (
            <Question.SpeakAI
              lession={questionCurrent}
              onNextLession={(data: any) => {
                const neResults: any = [...results, data]
                setResults(neResults)
                onNextQuestion()
              }}
              currentTestIndex={currentLessionIndex}
              totalTest={questions.length}
              backCourse={backToStudyPage}
            />
          )}
        </>
      )}
      {questionType === 'back_talk' && (
        <>
          {language == 'zh-CN' || language == 'ko-KR' ? (
            <Question.SpeakAIPictureCn
              lession={questionCurrent}
              onNextLession={(data: any) => {
                const neResults: any = [...results, data]
                setResults(neResults)
                onNextQuestion()
              }}
              currentTestIndex={currentLessionIndex}
              totalTest={questions.length}
              backCourse={backToStudyPage}
            />
          ) : (
            <Question.SpeakAIWithPic
              lession={questionCurrent}
              onNextLession={(data: any) => {
                const neResults: any = [...results, data]
                setResults(neResults)
                onNextQuestion()
              }}
              currentTestIndex={currentLessionIndex}
              totalTest={questions.length}
              backCourse={backToStudyPage}
            />
          )}
        </>
      )}
      {questionType === 'back_talk_conversation' && (
        <Question.BackTalkConversation
          question={questionCurrent}
          onNextLession={(data: any) => {
            nextQuestionConversation(data)
          }}
          currentTestIndex={currentLessionIndex}
          totalTest={questions.length}
          backCourse={backToStudyPage}
        />
      )}
      {questionType === 'back_talk_video' && (
        <Question.BackTalkVideo
          question={questionCurrent}
          onNextLession={(data: any) => {
            nextQuestionConversation(data)
          }}
          currentTestIndex={currentLessionIndex}
          totalTest={questions.length}
          backCourse={backToStudyPage}
        />
      )}

      {questionType === 'blank' && ''}
      {questionType === undefined && <NotFoundLession goBack={() => backToStudyPage()} />}
    </div>
  )
}
export default Lesson
