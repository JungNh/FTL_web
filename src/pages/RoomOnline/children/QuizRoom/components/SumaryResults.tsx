import React, { useEffect, useMemo, useState } from 'react'
import { Col, Row, Table } from 'react-bootstrap'
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar'
import { useDispatch } from 'react-redux'
import _ from 'lodash'
import { format } from 'date-fns'
import Button from '../../../../../components/Button'
import backArrow from '../../../../../assets/images/ico_arrowLeft-blue.svg'
import ico_clock from '../../../../../assets/images/ico_clock-green.svg'
import ico_true from '../../../../../assets/images/ico_true-green.svg'
import ico_calendar from '../../../../../assets/images/ico_calendar-green.svg'
import ico_rank from '../../../../../assets/images/ico_rank.svg'
import ico_avata from '../../../../../assets/images/avata.jpg'
import { actionResultsOnline } from '../../../../../store/roomOnline/actions'
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

  useEffect(() => {
    setListResults([])
    const getResult = async () => {
      const resResult: any = await dispatch(actionResultsOnline({ examId }))
      if (!_.isEmpty(resResult)) {
        setListResults(_.orderBy(resResult, 'score', 'desc').slice(0, 100))
      }
    }
    if (examId) getResult()
  }, [dispatch, examId])

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
                  <p className="fw-bold mb-0 ms-3">{format(new Date(), 'dd/MM/yyyy')}</p>
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
                  </tr>
                </thead>
                <tbody>
                  {listResults?.map((item: any, index: number) => (
                    <tr key={item?.userId}>
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
                content="Về danh sách phòng thi"
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
