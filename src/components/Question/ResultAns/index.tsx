import React, { useEffect, useRef, useState } from 'react'
import type { FC } from 'react'
import Button from '../../Button'
import correctAudio from '../../../assets/files/correct.mp3'
import wrongAudio from '../../../assets/files/wrong.mp3'
import icoFlag from '../../../assets/images/icon_flag_white.png'
import ModalReport from './ModalReport'
import ReactHtmlParser from 'react-html-parser'
import {
  actionShowCheer,
  actionShowReport,
  actionShowReported,
  actionShowSumary,
  checkReport
} from '../../../store/lesson/actions'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../store'

type Props = {
  show: boolean
  correct: boolean
  onContinue: () => void
  correctAns?: any
  explain?: any
  type?: '' | 'array' | 'multi_array'
  currentQuestion?: number
  questionId: number
  isLastQuestion?: boolean
  correctCount?: number
  numOfQuestion?: number
  questionType?: string
  showCheerScreen?: any
}

const ResultAns: FC<Props> = ({
  show,
  correct,
  onContinue,
  correctAns,
  explain,
  type = '',
  currentQuestion,
  questionId,
  isLastQuestion,
  correctCount,
  numOfQuestion,
  questionType,
  showCheerScreen
}) => {
  const audioRef = useRef<HTMLAudioElement>(null)
  const dispatch = useDispatch()
  const { userInfo } = useSelector((state: RootState) => state.login)
  const showCheer = useSelector((state: RootState) => state.lesson.showCheer)
  const numberCorrect = useSelector((state: RootState) => state.lesson.numberCorrect)
  const numberWrong = useSelector((state: RootState) => state.lesson.numberWrong)
  const correctFirstShowed = useSelector((state: RootState) => state.lesson.correctFirstShowed)
  const correctSecondShowed = useSelector((state: RootState) => state.lesson.correctSecondShowed)
  const wrongShowed = useSelector((state: RootState) => state.lesson.wrongShowed)

  useEffect(() => {
    if (show) {
      audioRef?.current?.play()
    }
    if (currentQuestion) {
      audioRef?.current?.play()
    }
  }, [show, currentQuestion])

  return (
    <div className={`result__ans ${correct ? 'correct' : 'wrong'} ${show ? 'show' : ''}`}>
      <audio ref={audioRef} src={correct ? correctAudio : wrongAudio}>
        <track kind="captions" />
      </audio>
      <p>
        {correct ? (
          <b style={{ textTransform: 'uppercase' }}>Chính xác !!!</b>
        ) : (
          <b style={{ textTransform: 'uppercase' }}>
            Đáp án đúng&nbsp;
            {correctCount !== undefined && correctCount >= 0
              ? `(${correctCount}/${numOfQuestion})`
              : ''}
          </b>
        )}
      </p>
      {type === 'array' &&
        correctAns &&
        correctAns.map((item: any, index: number) => (
          <p key={index}>{`${item.key} - ${item.value}`}</p>
        ))}
      {type === 'multi_array' &&
        correctAns &&
        correctAns.map((item: any, index: number) => (
          <div className="d-flex justify-content-between" key={index}>
            <p>{`Đáp án ô số ${index + 1}:`}</p>
            {item.length > 1 &&
              item?.map((iChild: any, childIndex: number) => (
                <p className={childIndex === 0 ? 'ml-2' : 'ml-1'} key={childIndex}>
                  {`${iChild}, `}
                </p>
              ))}
            {item.length === 1 && (
              <p className="ml-2" key={item[0]}>
                {item[0]}
              </p>
            )}
          </div>
        ))}
      {correctAns && type === '' && <p>{correctAns}</p>}
      {explain && (
        <p>
          <b>Giải thích:</b>
          <div style={{ marginTop: 20 }}>{ReactHtmlParser(explain)}</div>
        </p>
      )}
      <div
        className="ico__flag--container"
        onClick={async () => {
          try {
            const res = await checkReport(questionId, userInfo?.id)
            if (res?.status == 200)
              dispatch(actionShowReport({ isShow: true, questionID: questionId }))
            else {
              dispatch(actionShowReported(true))
            }
          } catch (error) {
            console.log(error)
          }
        }}
      >
        <img src={icoFlag} className="ico__flag" alt="flag" />
        <p
          className="text_respone"
          style={{ alignSelf: 'center', display: 'contents', color: 'white', fontSize: 12 }}
        >
          BÁO CÁO
        </p>
      </div>
      <Button.Solid
        content={isLastQuestion ? 'HOÀN THÀNH' : 'TIẾP TỤC'}
        disabled={!show}
        onClick={() => {
          if (
            (numberCorrect == 5 && !correctFirstShowed) ||
            (numberCorrect == 10 && !correctSecondShowed) ||
            (numberWrong == 3 && !wrongShowed)
          ) {
            showCheerScreen()
          } else {
            onContinue()
          }

          // if (isLastQuestion) {
          //   dispatch(actionShowSumary(true))
          // } else {
          //   onContinue()
          // }
        }}
      />
    </div>
  )
}

export default ResultAns
