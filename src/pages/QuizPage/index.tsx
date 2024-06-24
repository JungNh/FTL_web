import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router'
import _ from 'lodash'
import './styles.scss'

import QuestionDisplay from './components/QuestionDisplay'
import QuestionChoose from './components/QuestionChoose'
import PopupSubmitSucceed from './components/PopupSubmitSucceed'
import PopupSubmit from './components/PopupSubmit'
import Button from '../../components/Button'
import Timer from './components/Timer'

import { submit, resetSubmit } from '../../store/quizPage/actions'
import { RootState } from '../../store'
import PopupNoData from './components/PopupNoData'
import { arenaApi as api } from '../../lib'
import PopupPlayed from './components/PopupPlayed'
import PopupOnLeave from './components/PopupOnLeave'
import { saveDataRoundInfo } from '../../store/arena/actions'
import { Types } from '../../store/arena/types'
import PopupSubmitFail from './components/PopupSubmitFail'
import { cleanSentence } from '../../utils/common'

const milisecondsToSeconds = (m: number) => {
  const b = m % 1000
  if (b >= 500) return Math.floor(m / 1000) + 1
  return Math.floor(m / 1000)
}

const makeSubmitResult = (round_id: number, questions: Question[]) => {
  return new Promise((resolve, reject) => {
    const result: {
      round_id: number
      answers: { quest_id: number; answer_ids: number[] }[]
    } = {
      round_id,
      answers: []
    }

    try {
      questions.forEach((question) => {
        if (question.answered) {
          const answer_ids: number[] = question.answered.length > 0 ? question.answered : []
          result.answers.push({
            quest_id: question.id,
            answer_ids
          })
        }
      })

      resolve(result)
    } catch (error) {
      reject(error)
    }
  })
}

const SHUFFLE_MODE = false
// let isSubmited = false

const QuizPagePage: React.FC = () => {
  // =================================================== HOOKS ===================================================
  const dispatch = useDispatch()
  const history = useHistory()
  const { id } = useParams<{ id: string }>()
  const { submit_state, auto_submit_state } = useSelector((state: RootState) => state.quizPage)
  const [contest, setContest] = React.useState<Contest | undefined>(undefined)

  // =================================================== STATES ===================================================
  const [currentQuestion, setCurrentQuestion] = React.useState(0)
  const [popupSubmit, setPopupSubmit] = React.useState(false)
  const [questions, setQuestions] = React.useState<Question[]>([])
  const [onLeave, setOnLeave] = React.useState(false)
  const [isSubmited, setIsSubmited] = React.useState<boolean>(false)
  const [mesErrSub, setMesErrSub] = React.useState<string>('')
  const [showSubFail, setShowSubFail] = React.useState<boolean>(false)
  const [quiz, setQuiz] = React.useState<Quiz | undefined>(undefined)
  const [errorMessage, setErrorMessage] = React.useState<string | undefined>(undefined)
  const { data_round_info, answers } = useSelector((state: RootState) => state.arena)
  // =================================================== EFFECTS ===================================================

  React.useEffect(() => {
    if (id) {
      getQuestions(+id)
      getContest(+id)
    }
    const visibilityChange = () => {
      getContest(+id)
      if (!document.hidden) {
        // setOnLeave(true)
      }
    }
    document.addEventListener('visibilitychange', visibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', visibilityChange)
    }
  }, [id])

  React.useEffect(() => {
    if (!_.isEmpty(quiz?.sections)) {
      const res: Question[] = []
      quiz?.sections.forEach((section: any) => {
        section.questions.forEach((question: any) => {
          question.section_name = section.name
          question.section_prefer = section.prefer
          question.section_audio = section.audio
          question.section_image = section.image
          question.section_video = section.video
          question.answered = []
          question.fill_text = ''
          if (SHUFFLE_MODE) question.answers = _.shuffle(question.answers)
          res.push(question)
        })
      })
      if (SHUFFLE_MODE) {
        setQuestions(_.shuffle(res))
        dispatch({ type: Types.GET_ANSWER, payload: _.shuffle(res) })
      } else {
        setQuestions(res)
        dispatch({ type: Types.GET_ANSWER, payload: res })
      }
    }
  }, [quiz])

  // =================================================== CALLBACKS ===================================================
  const getQuestions = async (id: number) => {
    try {
      const response = await api.post('/contests/take_exam_questions/', { round_id: id })
      if (response.data.c === 1) {
        setQuiz(response.data.d[0])
        setErrorMessage(undefined)
      } else if (response.data.c === -12) {
        setQuiz(undefined)
        setErrorMessage('-12')
      } else {
        setQuiz(undefined)
        setErrorMessage(response.data.m)
      }
    } catch (error) {
      setQuiz(undefined)
      setErrorMessage('Có lỗi xảy ra! Vui lòng thử lại sau.')
    }
  }

  const getContest = async (id: number) => {
    console.log('gotoExam')
    try {
      const start = window.performance.now()
      const response = await api.post('/contests/get_contest_round_info/', {
        round_id: id
      })
      if (response.data.c === 1) {
        const data = response.data.d[0]
        dispatch(saveDataRoundInfo(data))
        //   const end = window.performance.now()
        //   const delta = Math.floor(Math.abs(end - start) / 2 / 1000)
        //   data.exam_start_time_remaining_timestamp = milisecondsToSeconds(
        //     data.exam_start_time_remaining_mili_timestamp + delta
        //   )
        //   data.exam_end_time_remaining_timestamp = milisecondsToSeconds(
        //     data.exam_end_time_remaining_mili_timestamp + delta
        //   )
        //   setContest(data)
        // } else {
        //   setContest(undefined)
        //   setErrorMessage(response.data.m)
      }

      if (data_round_info && data_round_info.exam_start_time_remaining_timestamp === 0) {
        history.push(`/quiz/${+id}`)
      }
      const end = window.performance.now()
      const delta = Math.floor(Math.abs(end - start) / 2 / 1000)
      data_round_info.exam_start_time_remaining_timestamp = milisecondsToSeconds(
        data_round_info.exam_start_time_remaining_mili_timestamp + delta
      )
      data_round_info.exam_end_time_remaining_timestamp = milisecondsToSeconds(
        data_round_info.exam_end_time_remaining_mili_timestamp + delta
      )
    } catch (error) {
      setContest(undefined)
      setErrorMessage('Có lỗi xảy ra! Vui lòng thử lại sau.')
    }
  }

  const chooseQuestion: any = (index: number) => {
    if (index >= 0 && index <= questions.length - 1) {
      setCurrentQuestion(index)
    }
  }

  const answerQuestion: any = (answerId: number, fillText?: any) => {
    const q = _.cloneDeep(questions)
    if (q[currentQuestion].type === 'one_correct') {
      q[currentQuestion].answered = [answerId]
      dispatch({
        type: Types.SET_ANSWER,
        payload: { index: currentQuestion, answer_ids: [answerId] }
      })
    }
    if (q[currentQuestion].type === 'many_correct') {
      if (q[currentQuestion].answered?.includes(answerId)) {
        q[currentQuestion].answered = q[currentQuestion].answered?.filter(
          (item) => item !== answerId
        )
      } else {
        q[currentQuestion].answered?.push(answerId)
      }
      dispatch({
        type: Types.SET_MUTI_ANSWER,
        payload: { index: currentQuestion, answer_ids: answerId }
      })
    }
    if (q[currentQuestion].type_article === 'fill_out') {
      let cleanFillText = cleanSentence(fillText)
      let ansCorrect = q[currentQuestion]?.answers[0]?.text || ''
      let cleanAnsCorrect = cleanSentence(ansCorrect)
      console.log('cleanFillText', cleanFillText, 'cleanAnsCorrect', cleanAnsCorrect)
      q[currentQuestion].fill_text = fillText
      q[currentQuestion].answered = cleanFillText == cleanAnsCorrect ? [answerId] : [0]
      dispatch({
        type: Types.SET_ANSWER,
        payload: {
          index: currentQuestion,
          answer_ids: cleanFillText == cleanAnsCorrect ? [answerId] : [0]
        }
      })
    }
    setQuestions(q)
  }

  const onSubmit = async (type: 'submit' | 'auto_submit', maxRetries = 4) => {
    let data = localStorage.getItem('answer_arena')
    console.log('data',data)
    let input = {
      round_id: +id,
      answers: JSON.parse(String(data))
    }
    try {
      const res: any = await dispatch(submit(input, type))
      console.log('res', res)
      if (res?.c == 1) {
        setPopupSubmit(false)
        setIsSubmited(true)
        return res?.data
      } else {
        setPopupSubmit(false)
        // throw new Error('API call failed')
        setMesErrSub(res?.m || '')
        setShowSubFail(true)
      }
    } catch (error) {
      if (maxRetries > 0) {
        onSubmit(type, maxRetries - 1)
      } else {
        console.log('Max retries exceeded. Unable to complete API call.', error)
        setPopupSubmit(false)
        // throw new Error('Max retries exceeded')
      }
    }
  }

  const closePopup = () => {
    dispatch(resetSubmit())
    history.replace(`/contest-summary/${+id}`)
  }

  // =================================================== RENDERS ===================================================
  return quiz && data_round_info ? (
    <div className="quizpage__page">
      <div className="quizpage__header"> {quiz?.name} </div>
      <div className="quizpage__body">
        <div className="body__left">
          <Timer
            ended={data_round_info.exam_end_time_remaining_timestamp}
            onTimeOut={() => {
              onSubmit('auto_submit')
            }}
          />
          <QuestionChoose
            questions={questions}
            currentQuestion={currentQuestion}
            chooseQuestion={chooseQuestion}
          />
          <Button.Solid content="Nộp bài" onClick={() => setPopupSubmit(true)} />
        </div>
        <div className="body__right">
          <QuestionDisplay
            data={questions?.[currentQuestion]}
            currentQuestion={currentQuestion}
            questionLength={questions.length}
            chooseQuestion={chooseQuestion}
            answerQuestion={answerQuestion}
            submit={() => setPopupSubmit(true)}
          />
        </div>
      </div>
      <PopupSubmit
        open={popupSubmit}
        isDisable={isSubmited}
        questions={questions}
        onClose={() => setPopupSubmit(false)}
        onSubmit={() => onSubmit('submit')}
      />
      <PopupSubmitFail
        contest={mesErrSub}
        open={showSubFail}
        onClose={() => {
          history.push(`/arena`)
          setShowSubFail(true)
        }}
      />
      {/* //======================================= */}
      {auto_submit_state && (
        <PopupSubmitSucceed
          type="auto_submit"
          contest={data_round_info}
          open={auto_submit_state}
          onClose={closePopup}
        />
      )}
      {submit_state && (
        <PopupSubmitSucceed
          type="submit"
          contest={data_round_info}
          open={submit_state}
          onClose={closePopup}
        />
      )}
      {onLeave && (
        <PopupOnLeave
          open={onLeave}
          onClose={() => {
            setOnLeave(false)
            getContest(+id)
          }}
          onSubmit={() => onSubmit('submit')}
        />
      )}
    </div>
  ) : errorMessage === '-12' ? (
    <PopupPlayed contest={data_round_info} onRedirect={() => history.push('/arena')} />
  ) : errorMessage ? (
    <PopupNoData message={errorMessage} onRedirect={() => history.push('/arena')} />
  ) : (
    <React.Fragment />
  )
}

export default QuizPagePage
