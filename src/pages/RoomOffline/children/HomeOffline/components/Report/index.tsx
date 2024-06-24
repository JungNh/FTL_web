import { format } from 'date-fns'
import _ from 'lodash'
import Table from 'rc-table'
import React, {
  FC, useCallback, useEffect, useState,
} from 'react'
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar'
import { useDispatch } from 'react-redux'
import Select from 'react-select'
import {
  actionGetGradeOffline,
  actionGetHistory,
  actionGetStatistic,
} from '../../../../../../store/roomOffline/actions'
import { covertTimeFromNum } from '../../../../../../utils/common'

type Props = {
  //
}

const ReportPage: FC<Props> = () => {
  const dispatch = useDispatch()
  const [statistics, setStatistics] = useState<any>(null)
  const [historyList, setHistoryList] = useState<any>(null)
  const [gradeOps, setGradeOps] = useState<any>()
  const [gradeIdFilter, setGradeIdFilter] = useState<number | undefined>()
  const [averageScore, setAverageScore] = useState<number>(0)

  const getGrades = useCallback(async () => {
    const response: any = await dispatch(
      actionGetGradeOffline({
        offset: 0,
        limit: 1000,
        order: 'ASC',
      })
    )
    if (response?.data) {
      const responseConvert = response?.data?.map((item: any) => ({ ...item, label: item?.name, value: item?.id })) || []
      setGradeOps([{ label: 'Tất cả đề thi', value: '' }, ...responseConvert])
    }
  }, [dispatch])
  useEffect(() => {
    getGrades()
  }, [getGrades])

  const getStatistics = useCallback(
    async (gradeId?: number) => {
      const response: any = await dispatch(actionGetStatistic({ gradeId }))
      if (response?.data) {
        setStatistics(response?.data)
      }
    },
    [dispatch]
  )
  useEffect(() => {
    getStatistics(gradeIdFilter)
  }, [getStatistics, gradeIdFilter])

  const getHistoryList = useCallback(
    async (gradeId?: number) => {
      const response: any = await dispatch(
        actionGetHistory({
          offset: 0,
          limit: 1000,
          order: 'ASC',
          gradeId,
        })
      )
      if (response?.data) {
        setHistoryList(response?.data?.data || [])
        const totalScore = _.sumBy(response?.data?.data, (obj: any) =>
          Math.round(
            (obj?.contest?.correctQuestionTotal * 100) / (obj?.contest?.questionCount || 1)
          ))
        setAverageScore(Math.round(totalScore / (response?.data?.data?.length || 1)))
      }
    },
    [dispatch]
  )
  useEffect(() => {
    getHistoryList(gradeIdFilter)
  }, [getHistoryList, gradeIdFilter])

  const columns = [
    {
      title: 'Ngày',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: any) => (text ? format(new Date(text), 'dd/MM/yyyy') : ''),
    },
    {
      title: 'Đề',
      dataIndex: 'contest',
      key: 'contest',
      render: (text: any) => text?.name,
    },
    {
      title: 'Điểm số',
      dataIndex: 'contest',
      key: 'score',
      render: (obj: any) => {
        const score = obj?.correctQuestionTotal || 0
        const total = obj?.questionCount || 0
        const percent = Math.round((score * 100) / (total || 1))
        return percent
      },
    },
    {
      title: 'Thời gian',
      dataIndex: 'duration',
      key: 'duration',
      render: (text: number) => covertTimeFromNum(text),
    },
  ]

  return (
    <div className="offline__report">
      <div className="offline__report--header mb-4">
        <p className="fw-bold text-center h2">Thống kê đề thi</p>
        <Select
          className="select_contest"
          defaultValue={{ label: 'Tất cả đề thi', value: '' }}
          options={gradeOps}
          value={gradeOps?.find((item: any) => item?.value === gradeIdFilter)}
          onChange={(ops) => setGradeIdFilter(ops?.value)}
          name="color"
          classNamePrefix="select"
        />
      </div>
      <div className="circle__wraper">
        <div className="circle__item">
          <p className="circle__item--title">Số lượt làm bài</p>
          <CircularProgressbar
            className="circlePercent"
            value={100}
            text={`${statistics?.contestCount}`}
            styles={buildStyles({
              textColor: '#0056D6',
              pathColor: '#0056D6',
            })}
          />
        </div>
        <div className="circle__item">
          <p className="circle__item--title">Thời gian trung bình</p>
          <CircularProgressbar
            className="circlePercent"
            value={100}
            text={covertTimeFromNum(
              Math.round(statistics?.contestDuration / statistics?.contestCount) || 0
            )}
            styles={buildStyles({
              textColor: '#0056D6',
              pathColor: '#0056D6',
            })}
          />
        </div>
        <div className="circle__item">
          <p className="circle__item--title">Điểm số trung bình</p>
          <CircularProgressbar
            className="circlePercent"
            value={100}
            text={averageScore?.toString()}
            styles={buildStyles({
              textColor: '#0056D6',
              pathColor: '#0056D6',
            })}
          />
        </div>
      </div>
      <div className="history__wrapper">
        <p style={{ fontWeight: 'bold', marginTop: 24 }}>Lịch sử làm bài</p>
        <Table
          tableLayout="fixed"
          scroll={{ y: 240 }}
          rowKey="userId"
          rowClassName="border_row"
          className="table__report"
          data={historyList}
          columns={columns}
          emptyText={(
            <div className="empty__placeholder" style={{ border: 'none' }}>
              Không có dữ liệu
            </div>
          )}
        />
      </div>
    </div>
  )
}

export default ReportPage
