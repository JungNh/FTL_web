import React, { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router'
import { Col, Row, Table } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import _ from 'lodash'
import Button from '../../Button'
import { SumaryModal } from '../..'
import backArrow from '../../../assets/images/ico_arrowLeft-blue.svg'
import ico_clock from '../../../assets/images/ico_clock-green.svg'
import ico_true from '../../../assets/images/ico_true-green.svg'
import ico_calendar from '../../../assets/images/ico_calendar-green.svg'
import ico_rank from '../../../assets/images/ico_rank.svg'
import ico_avata from '../../../assets/images/avata.jpg'
import { actionResultReadingOrListening } from '../../../store/lesson/actions'
import { RootState } from '../../../store'
import { covertTimeFromNum } from '../../../utils/common'
import { actionSaveScoreLession } from '../../../store/study/actions'

type Props = {
  idLession?: number
  goBack: (data: string) => void
  nameLesson?: string
  currentResult: any[]
  doingTime: { start: string | null; duration: number | null }
  highestScore: number
}

const SummaryResults: React.FC<Props> = ({
  idLession,
  goBack,
  nameLesson,
  currentResult,
  doingTime,
  highestScore
}) => {
  const location = useLocation()
  const dispatch = useDispatch()
  const [listResults, setListResults] = useState<any[]>([])
  const [userMaxScore, setUserMaxScore] = useState<number>(0)
  const [showModal, setShowModal] = useState<boolean>(true)
  const userInfo = useSelector((state: RootState) => state.login?.userInfo)
  const course = useSelector((state: RootState) => state.study.currentCourse)
  const sectionId = useSelector((state: RootState) => state.study.parentLessons?.data?.sectionId)
  const indexLoca: number = location.pathname.lastIndexOf('/')
  const idLess: string = location.pathname.substring(indexLoca + 1, location.pathname.length)

  useEffect(() => {
    setListResults([])
    const getResult = async () => {
      const resResult: any = await dispatch(actionResultReadingOrListening(idLession))
      if (!_.isEmpty(resResult)) {
        const newListResults = resResult.map((item: any) => {
          const score = Math.round(
            (_.sumBy(item?.results, (iSo: any) => iSo?.score) * 100) / item.results?.length
          )
          const duration = _.sumBy(item?.results, (iSo: any) => iSo?.duration)
          return { ...item, score, duration }
        })
        setListResults(
          _.orderBy(newListResults, ['score', 'duration'], ['desc', 'asc']).slice(0, 100)
        )
        const userScore = newListResults.find((item: any) => {
          let isUser = false
          if (item.studentId === userInfo?.id) isUser = true
          if (item?.accountId && item?.accountId !== userInfo?.accountId) isUser = false
          return isUser
        })
        setUserMaxScore(userScore?.score || 0)
      }
    }
    if (idLession) getResult()
  }, [dispatch, idLession, userInfo?.accountId, userInfo?.id])

  const doingTimeResult = useMemo(() => doingTime.duration || 0, [doingTime.duration])

  const info = useMemo(() => {
    const score = _.sumBy(currentResult, 'score') || 0
    const correct = currentResult?.filter((item: any) => item.result).length || 0

    const total = currentResult?.length || 1
    return { score, total, correct }
  }, [currentResult])

  useEffect(() => {
    // const numberAnswer = currentResult.filter((r) => r.answer !== '').length
    const correct = currentResult?.filter((item: any) => item.result).length || 0
    const total = currentResult?.length || 1

    const saveResult = async () => {
      await dispatch(
        actionSaveScoreLession({
          course_id: course?.id,
          section_id: sectionId,
          unit_id: idLess,
          unit_score: correct / total,
          // unit_percentage: Math.round((numberAnswer / total) * 100),
          unit_percentage: 100,
          unit_duration: doingTime.duration || 0,
        })
      )
    }

    if (currentResult.length > 0) saveResult()
  }, [currentResult && doingTime])

  const FooterCustom = () => (
    <div className="d-flex justify-content-center mx-auto" style={{ maxWidth: '30rem' }}>
      <Button.Solid
        // color="gray"
        className="my-3 mx-3 prev__button text-uppercase fw-bold"
        content="Luyện lại"
        onClick={() => goBack('repeat')}
      />
      <Button.Solid
        className="my-3 mx-3 text-uppercase fw-bold"
        content="Đáp án"
        onClick={() => goBack('answer')}
      />
    </div>
  )

  return (
    <SumaryModal
      showModal={showModal}
      countAnser={`${info.correct} / ${info.total}`}
      unitScore={Math.round((100 / info.total) * info.correct)}
      setShowModal={setShowModal as any}
      durationTime={doingTimeResult}
      footerCustom={<FooterCustom />}
      highestScore={highestScore}
    />
    // <div className="sumary__results">
    //   <p className="title__lession mb-3">Phân tích kết quả</p>
    //   <div className="divider__horizontal mb-4" />
    //   <Button.Shadow
    //     className="button__back"
    //     color="gray"
    //     content={<img src={backArrow} alt="back" />}
    //     onClick={() => goBack('back')}
    //   />
    //   <div className="px-3">
    //     <Row>
    //       <Col xs={12}>
    //         <div className="summary__right">
    //           <div className="d-flex justify-content-center align-items-center">
    //             <img src={ico_rank} alt="rank" />
    //             <p className="summary__right-title ms-3">Bảng xếp hạng</p>
    //           </div>
    //           <Table hover>
    //             <thead>
    //               <tr>
    //                 <th className="rank__th"> </th>
    //                 <th className="rank__th">Họ tên</th>
    //                 <th className="rank__th">Điểm</th>
    //                 <th className="rank__th">Thời gian</th>
    //               </tr>
    //             </thead>
    //             <tbody>
    //               {listResults?.map((item: any, index: number) => (
    //                 <tr key={item?.studentId}>
    //                   <td className="rank__td">
    //                     <div className={`rank-${index} text-center mx-auto`}>{index + 1}</div>
    //                   </td>
    //                   <td className="rank__td">
    //                     <img src={ico_avata} className="avatar__td me-3" alt="avata" />
    //                     {item?.fullname}
    //                   </td>
    //                   <td className="rank__td text-center">{item?.score}</td>
    //                   <td className="rank__td text-center">
    //                     {covertTimeFromNum(item?.duration || 0)}
    //                   </td>
    //                 </tr>
    //               ))}
    //             </tbody>
    //           </Table>
    //         </div>
    //       </Col>
    //     </Row>
    //   </div>
    // </div>
  )
}

export default SummaryResults
