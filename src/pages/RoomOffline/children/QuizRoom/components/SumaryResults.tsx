import React, { useEffect, useMemo, useState } from 'react'
import { Col, Row, Table } from 'react-bootstrap'
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar'
import { useDispatch, useSelector } from 'react-redux'
import _ from 'lodash'
import moment from 'moment'
import Button from '../../../../../components/Button'
import backArrow from '../../../../../assets/images/ico_arrowLeft-blue.svg'
import ico_clock from '../../../../../assets/images/ico_clock-green.svg'
import ico_true from '../../../../../assets/images/ico_true-green.svg'
import ico_calendar from '../../../../../assets/images/ico_calendar-green.svg'
import ico_rank from '../../../../../assets/images/ico_rank.svg'
import ico_avata from '../../../../../assets/images/avata.jpg'
import { actionResultContest } from '../../../../../store/roomOffline/actions'
import { RootState } from '../../../../../store'
import { covertTimeFromNum } from '../../../../../utils/common'

type Props = {
  examId: number
  goBack: (data: string) => void
  nameLesson?: string
  currentResult: any[]
  doingTime: { start: string | null; duration: number | null }
}

const SummaryResults: React.FC<Props> = ({
  examId,
  goBack,
  nameLesson,
  currentResult,
  doingTime,
}) => {
  const dispatch = useDispatch()
  const [listResults, setListResults] = useState<any[]>([])
  const [userMaxScore, setUserMaxScore] = useState<number>(0)
  const userInfo = useSelector((state: RootState) => state.login?.userInfo)
  useEffect(() => {
    setListResults([])
    const getResult = async () => {
      const resResult: any = await dispatch(actionResultContest(examId))
      if (!_.isEmpty(resResult)) {
        setListResults(
          _.orderBy(
            resResult,
            [(item: any) => Number(item?.score || 0), (item: any) => Number(item?.duration || 0)],
            ['desc', 'asc']
          ).slice(0, 100)
        )
        const userScore = resResult.find((item: any) => {
          let isUser = false
          if (item.studentId === userInfo?.id) isUser = true
          if (item?.accountId && item?.accountId !== userInfo?.accountId) isUser = false
          return isUser
        })
        setUserMaxScore(userScore?.score || 0)
      }
    }
    if (examId) getResult()
  }, [dispatch, examId, userInfo?.accountId, userInfo?.id])

  const doingTimeResult = useMemo(() => doingTime.duration || 0, [doingTime.duration])

  const info = useMemo(() => {
    const score = _.sumBy(currentResult, 'score') || 0
    const correct = currentResult?.filter((item: any) => item.isCorrect).length || 0
    const total = currentResult?.length || 1
    return { score, total, correct }
  }, [currentResult])

  return (
    <div className="sumary__results">
      <p className="title__lession mb-3">Phân tích kết quả</p>
      <div className="divider__horizontal mb-4" />
      <Button.Shadow
        className="button__back"
        color="gray"
        content={<img src={backArrow} alt="back" />}
        onClick={() => goBack('back')}
      />

      <div className="px-3">
        <Row>
          <Col xs={6}>
            <div className="summary__left">
              <p className="summary__left-title">{nameLesson || ''}</p>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="d-flex justify-content-center align-items-center">
                  <img src={ico_clock} alt="clock" />
                  <p className="fw-bold mb-0 ms-3">{covertTimeFromNum(doingTimeResult)}</p>
                </div>
                <div className="d-flex justify-content-center align-items-center">
                  <img src={ico_true} alt="correct" />
                  <p className="fw-bold mb-0 ms-3">{`${info.correct} / ${info.total}`}</p>
                </div>
                <div className="d-flex justify-content-center align-items-center">
                  <img src={ico_calendar} alt="calendar" />
                  <p className="fw-bold mb-0 ms-3">{moment().format('DD/MM/YYYY')}</p>
                </div>
              </div>

              <div className="d-flex flex-column align-items-center">
                <CircularProgressbar
                  className="circlePercent mb-3"
                  value={Math.round((info.score / info.total) * 100)}
                  text={`${Math.round((info.score / info.total) * 100).toString()}`}
                  strokeWidth={4}
                  styles={buildStyles({
                    textColor: 'black',
                    pathColor: '#04BC8A',
                  })}
                />
                {/* <p className="fs-4">
                  Điểm cao nhất: {Math.round((userMaxScore * 100) / info?.total)}
                </p> */}
              </div>
            </div>
          </Col>
          <Col xs={6}>
            <div className="summary__right">
              <div className="d-flex justify-content-center align-items-center">
                <img src={ico_rank} alt="rank" />
                <p className="summary__right-title ms-3">Bảng xếp hạng</p>
              </div>
              <Table hover>
                <thead>
                  <tr>
                    <th className="rank__th"> </th>
                    <th className="rank__th">Họ tên</th>
                    <th className="rank__th">Điểm</th>
                    <th className="rank__th">Thời gian</th>
                  </tr>
                </thead>
                <tbody>
                  {listResults?.map((item: any, index: number) => (
                    <tr key={item?.studentId}>
                      <td className="rank__td">
                        <div className={`rank-${index} text-center mx-auto`}>{index + 1}</div>
                      </td>
                      <td className="rank__td">
                        <img
                          src={item?.avatar || ico_avata}
                          className="avatar__td me-3"
                          alt="avata"
                        />
                        {item?.fullname}
                      </td>
                      <td className="rank__td text-center">
                        {Math.round((item?.score * 100) / info?.total)}
                      </td>
                      <td className="rank__td text-center">
                        {covertTimeFromNum(item?.duration || 0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Col>
          <Col xs={12}>
            <div className="d-flex justify-content-center mx-auto" style={{ maxWidth: '30rem' }}>
              <Button.Solid
                // color="gray"
                className="my-3 mx-3 prev__button text-uppercase fw-bold"
                content="Về kho đề thi"
                onClick={() => goBack('back')}
              />
              <Button.Solid
                className="my-3 mx-3 text-uppercase fw-bold"
                content="Đáp án"
                onClick={() => goBack('answer')}
              />
            </div>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default SummaryResults
