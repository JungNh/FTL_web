import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router'
import { Col, Row } from 'react-bootstrap'
import _ from 'lodash'
import { differenceInSeconds } from 'date-fns'
import Button from '../../Button'
import backArrow from '../../../assets/images/ico_arrowLeft-blue.svg'
import WordHolder from './WordHolder'
import DetailWord from './DetailWord'
import { convertUrl } from '../../../utils/common'
import { actionSaveScoreLession, actionTextToSpeech } from '../../../store/study/actions'
import { RootState } from '../../../store'

type Props = {
  lession?: {
    metas?: Meta[]
    questionExplain?: string
    questionText?: string
    questionTitle?: string
    audioUrl?: string
    id?: number
  }
  onNextLession: () => void
  backCourse: () => void
  setListVob: (list: any) => void
  listVob: any[]
  setVobCorrect: (corr: number) => void
  setDetailDataIndex: (index: any) => void
  vobCorrect: number
  detailDataIndex: any
  lengthList: number
}
type Meta = {
  id?: number
  key?: string
  questionId?: number
  value?: string
}

const VocabularyWithPic: React.FC<Props> = ({
  lession,
  listVob,
  vobCorrect,
  onNextLession,
  backCourse,
  setListVob,
  setVobCorrect,
  detailDataIndex,
  setDetailDataIndex,
  lengthList
}) => {
  const [startTime, setStartTime] = useState<string | null>(null)
  const dispatch = useDispatch()
  const location = useLocation()

  const course = useSelector((state: RootState) => state.study.currentCourse)
  const sectionId = useSelector((state: RootState) => state.study.parentLessons?.data?.sectionId)
  const indexLoca: number = location.pathname.lastIndexOf('/')
  const idLess: string = location.pathname.substring(indexLoca + 1, location.pathname.length)
  const [arrScore, setArrScore] = useState<any>([])

  useMemo(() => {
    if (lengthList > 0) {
      setArrScore(new Array(lengthList).fill(0))
    }
  }, [lengthList])

  useEffect(() => {
    const convertListVoice = async () => {
      if (!_.isEmpty(lession)) {
        const metas: any = lession?.metas
        const convetMeta: any = !_.isEmpty(metas)
          ? [
              ...metas?.map((item: any) => ({
                ...item,
                value: JSON.parse(item?.value)
              }))
            ]
          : []

        const finalList = await Promise.all(
          _.orderBy(convetMeta, (item: any) => item?.value?.stt, 'asc')?.map(async (item: any) => {
            if (item?.value?.audio !== undefined) {
              return { ...item, value: { ...item?.value, audio: convertUrl(item?.value?.audio) } }
            }
            const response: any = await dispatch(
              actionTextToSpeech({ text: item?.value?.word || '' })
            )
            if (response) {
              return { ...item, value: { ...item?.value, audio: response?.url } }
            }
            return item
          })
        )
        setListVob(finalList)
        if (startTime === null) {
          setStartTime(new Date().toISOString())
        }
      }
    }
    convertListVoice()
  }, [dispatch, lession])

  const handleScoreCorrect = () => {
    var arr = arrScore
    arr.fill(1, detailDataIndex, detailDataIndex + 1)
    setArrScore(arr)
    var sum = arrScore.reduce(function (a: number, b: number) {
      return a + b
    }, 0)
    setVobCorrect(sum)
  }

  const openWord = (item: number) => setDetailDataIndex(item)

  const changeWord = async (data: 'prev' | 'next') => {
    if (detailDataIndex !== null) {
      if (data === 'prev' && detailDataIndex > 0) {
        return setDetailDataIndex(detailDataIndex - 1)
      }
      if (data === 'prev' && detailDataIndex === 0) {
        return
      }
      if (data === 'next' && detailDataIndex + 1 < (listVob.length || 1)) {
        return setDetailDataIndex(detailDataIndex + 1)
      }
      if (data === 'next' && detailDataIndex + 1 === (listVob.length || 1)) {
        onNextLession()
      }
    }
  }

  const onCloseDetail = async () => {
    const percentage = Math.floor(((detailDataIndex || 0 + 1) / listVob.length) * 100)
    const durationTime = differenceInSeconds(new Date(), new Date(startTime as any))

    await dispatch(
      actionSaveScoreLession({
        course_id: Number(course?.id),
        section_id: sectionId,
        unit_id: idLess,
        unit_score: vobCorrect / listVob.length,
        unit_percentage: percentage,
        unit_duration: durationTime
      })
    )
    // if (!_.isEmpty(dataPercent) && dataPercent?.status === 200) {
      setDetailDataIndex(null)
    // }
  }
  return (
    <div className="lession__vocabulary">
      {detailDataIndex === null ? (
        <>
          <h1 className="page__title">{lession?.questionTitle || 'Từ vựng'}</h1>
          <Button.Shadow
            className="button__back"
            color="gray"
            content={<img src={backArrow} alt="back" />}
            onClick={() => backCourse()}
          />

          <Row className="mx-auto word__wrapper mt-5">
            {listVob?.map((item: any, index: number) => (
              <Col xs={6} key={index}>
                <WordHolder data={item} openWord={() => openWord(index)} />
              </Col>
            ))}
          </Row>
          <div className="btn__start__learn">
            <Button.Solid
              className="continue__btn mt-5"
              onClick={() => openWord(0)}
              content={
                <div className="flex justify-content-center align-items-center fw-bold">
                  HỌC TỪ VỰNG
                </div>
              }
            />
          </div>
        </>
      ) : (
        <DetailWord
          detailData={listVob[detailDataIndex]}
          changeWord={changeWord}
          onClose={onCloseDetail}
          dataLength={listVob.length || 1}
          currentIndex={detailDataIndex}
          handleScoreCorrect={handleScoreCorrect}
        />
      )}
    </div>
  )
}

export default VocabularyWithPic
