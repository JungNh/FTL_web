import React, { useEffect, useMemo, useState } from 'react'
import Swal from 'sweetalert2'
import _ from 'lodash'
import Button from '../../Button'
import backArrow from '../../../assets/images/ico_arrowLeft-blue.svg'
import NavbarTest from '../../NavbarTest'
import ResultAns from '../ResultAns'
import HandleMetas from '../Arrangement/HandleMetas'
import { Image } from 'react-bootstrap'
import Sound from 'react-sound'
import ico_sound from '../../../assets/images/ico_sound-white.svg'
import { convertUrl } from '../../../utils/common'
import { useDispatch, useSelector } from 'react-redux'
import {
  actionAddCorrect,
  actionAddWrong,
  actionCheerWrong,
  actionFirstCheerCorrect,
  actionSecondCheerCorrect,
  actionShowCheer
} from '../../../store/lesson/actions'
import { RootState } from '../../../store'
import Cheering from '../../Cheering'

type Props = {
  lession?: {
    id?: number
    questionTitle?: string
    questionText?: string
    questionExplain?: string
    audioUrl?: string
    answers?: any[]
    metas?: any
  }
  onNextLession: () => void
  onSetResults: (data: any) => void
  currentTestIndex?: number
  totalTest?: number
  backCourse: () => void
}

const FillMultiWord: React.FC<Props> = ({
  lession,
  onNextLession,
  onSetResults,
  currentTestIndex,
  totalTest,
  backCourse
}) => {
  const dispatch = useDispatch()
  const [feedBackResult, setFeedBackResult] = useState<boolean | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean>(false)
  const [userAns, setUserAns] = useState<any[]>([])
  const [listCorrectAns, setListCorrectAns] = useState<any[]>([])
  const [originalAns, setOriginalAns] = useState<any[]>([])
  const {
    numberCorrect,
    numberWrong,
    correctFirstShowed,
    correctSecondShowed,
    wrongShowed,
    showCheer
  } = useSelector((state: RootState) => state.lesson)

  console.log('FillMultiWord')

  useEffect(() => {
    setUserAns([])
    if (!_.isEmpty(lession?.answers)) {
      const newArr: any = lession?.answers?.map((item: any) => JSON.parse(item.value))
      if (!_.isEmpty(newArr)) {
        setListCorrectAns(newArr)
      } else {
        setListCorrectAns([])
      }
    }
  }, [lession])

  useEffect(() => {
    const changeQues: string = (lession?.questionText || '').replaceAll('_____', '/---/_____/---/')
    const questionConvert = changeQues.split('/---/')
    const answers: any = []
    questionConvert.forEach((item: string, index: number) => {
      if (item === '_____') {
        answers[index] = ''
      }
    })
    setUserAns(answers)
    setOriginalAns(answers)
  }, [lession])

  const onCheck = () => {
    const correctOrWrong: any = []
    const convertArray: any = _.compact(userAns)
    if (
      !_.isEmpty(listCorrectAns) &&
      !_.isEmpty(convertArray) &&
      listCorrectAns.length === convertArray.length
    ) {
      listCorrectAns.forEach((itemCorr: any, index: number) => {
        if (!_.isEmpty(itemCorr) && itemCorr.length > 1) {
          if (itemCorr.includes(convertArray[index].trim())) {
            correctOrWrong[index] = true
          } else {
            correctOrWrong[index] = false
          }
        } else if (!_.isEmpty(itemCorr) && itemCorr.length === 1) {
          if (itemCorr[0]?.trim()?.toUpperCase() === convertArray[index]?.trim()?.toUpperCase()) {
            correctOrWrong[index] = true
          } else {
            correctOrWrong[index] = false
          }
        } else {
          correctOrWrong[index] = false
        }
      })
    } else {
      correctOrWrong[0] = false
    }

    if (_.every(correctOrWrong, (item: boolean) => item)) {
      dispatch(actionAddCorrect())
    } else {
      dispatch(actionAddWrong())
    }
    setIsCorrect(_.every(correctOrWrong, (item: boolean) => item))
    setFeedBackResult(_.every(correctOrWrong, (item: boolean) => item))
    sendAnswer(_.every(correctOrWrong, (item: boolean) => item))
  }

  const sendAnswer = async (result: boolean) => {
    onSetResults({
      questionId: lession?.id,
      result: result,
      answer: '',
      score: 0,
      duration: 0
    })
  }

  const onHint = () => {
    Swal.fire({
      title: 'Gợi ý',
      text: 'Bạn có chắc chắn muốn xem gợi ý',
      confirmButtonText: 'Tôi muốn xem',
      showCancelButton: true,
      cancelButtonText: 'Không, tôi có thể làm được'
    })
      .then((results: { isConfirmed: boolean }) => {
        if (results.isConfirmed) {
          Swal.fire('Gợi ý !', lession?.questionExplain, 'info')
        }
        return ''
      })
      .catch((error) => console.error(error))
  }
  const onSkip = () => {
    Swal.fire({
      title: 'Bạn muốn bỏ qua bài tập này',
      text: 'Bài tập này sẽ không được tính điểm',
      confirmButtonText: 'Bỏ qua',
      showCancelButton: true,
      cancelButtonText: 'Ở lại',
      icon: 'warning'
    })
      .then((results: { isConfirmed: boolean }) => {
        if (results.isConfirmed) {
          if (numberWrong == 2 && !wrongShowed) {
            dispatch(actionShowCheer(true))
          } else {
            onNextLession()
          }
          sendAnswer(false)
          checkShowCheer()
          dispatch(actionAddWrong())
        }
        return ''
      })
      .catch((error) => console.error(error))
  }

  const convertQuestion = useMemo(() => {
    const changeQues: string = (lession?.questionText || '').replaceAll('_____', '/---/_____/---/')
    const questionConvert = changeQues.split('/---/')
    return questionConvert.map((item: string, index: number) => {
      if (item === '_____') {
        return (
          <input
            key={index}
            maxLength={20}
            value={userAns[index]}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const newData: any[] = userAns.slice()
              newData[index] = e.target.value
              setUserAns(newData)
            }}
            disabled={feedBackResult !== null}
          />
        )
      }
      return <span key={index}>{item}</span>
    })
  }, [lession?.questionText, userAns, feedBackResult])
  // 5 dấu gach chân ở question thì là 1 input

  const checkShowCheer = () => {
    if (numberCorrect == 5) dispatch(actionFirstCheerCorrect())
    if (numberCorrect == 10) dispatch(actionSecondCheerCorrect())
    if (numberWrong == 3) dispatch(actionCheerWrong())
  }

  const renderBody = () => {
    return (
      <div className="bg_renderBody">
        <p className="subTitle__lession">{lession?.questionTitle}</p>
        <HandleMetas metas={lession?.metas} />
        <div className="question__holder">{convertQuestion}</div>
      </div>
    )
  }

  return (
    <div className="lession__fillWordMulti">
      <Button.Shadow
        className="button__back"
        color="gray"
        content={<img src={backArrow} alt="back" />}
        onClick={() => backCourse()}
      />
      {showCheer ? <Cheering /> : renderBody()}
      <NavbarTest
        currentTest={(currentTestIndex || 0) + 1}
        totalTest={totalTest}
        onCheck={() => {
          if (showCheer) {
            dispatch(actionShowCheer(false))
            onNextLession()
            checkShowCheer()
          } else {
            onCheck()
          }
        }}
        onHint={onHint}
        onSkip={onSkip}
        isDisabled={_.isEqual(userAns, originalAns) && !showCheer}
      />

      <ResultAns
        showCheerScreen={() => {
          dispatch(actionShowCheer(true))
          setFeedBackResult(null)
        }}
        onContinue={() => {
          setFeedBackResult(null)
          onNextLession()
        }}
        show={feedBackResult !== null}
        correct={!!feedBackResult}
        explain={lession?.questionExplain}
        correctAns={listCorrectAns}
        type="multi_array"
        questionId={lession?.id || 0}
        isLastQuestion={(currentTestIndex || 0) + 1 === (totalTest || 0)}
      />
    </div>
  )
}

export default FillMultiWord
