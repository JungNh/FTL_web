import React, { useMemo, useCallback, useEffect, useState } from 'react'
import { Image, Col, Row } from 'react-bootstrap'
import _ from 'lodash'
import { LabelList, BarChart, Bar, XAxis, ResponsiveContainer, Cell } from 'recharts'
import { useDispatch, useSelector } from 'react-redux'
import { format, differenceInYears, sub, endOfWeek } from 'date-fns'
import { Button } from '../../../../components'
import avata from '../../../../assets/images/avata.jpg'
import ico_up from '../../../../assets/images/ico_arrowUp-black.svg'

import CardInfo from './CardInfo'
import ProgressLession from './ProgressLession'
import { actionGetAccounts } from '../../../../store/settings/actions'
import { RootState } from '../../../../store'
import {
  actionGetHistoryAccLessons,
  actionGetHistoryAcount
} from '../../../../store/progress/actions'
import { actionGetAllCourse, actionGetHomeBlocks } from '../../../../store/home/actions'
import { float2Number, numberTwoDigits } from '../../../../utils/common'
import { hideLoading, showLoading } from '../../../../store/login/actions'

type Props = Record<string, unknown>

const TabParentControl: React.FC<Props> = () => {
  const [activeFilter, setActiveFilter] = useState<'today' | 'week' | 'month'>('today')
  const [accounts, setAccounts] = useState<any[]>([])
  const [viewAccIndex, setViewAccIndex] = useState(0)
  const [categories, setCategories] = useState<any[] | null>(null)
  const [historyLessons, setHistoryLessons] = useState<any[]>([])
  const historyMe = useSelector((state: RootState) => state.progress.historyMe)
  const dispatch = useDispatch()

  useEffect(() => {
    const getHistoryLessons = async () => {
      dispatch(showLoading())
      if (accounts[viewAccIndex]) {
        const response: any = await dispatch(
          actionGetHistoryAccLessons({
            accountId: accounts[viewAccIndex]?.id,
            offset: 0,
            limit: 1000,
            order: 'ASC',
            mode: activeFilter
          })
        )
        if (response?.data) {
          setHistoryLessons(response.data)
        }
      }
      dispatch(hideLoading())
    }
    getHistoryLessons()
  }, [accounts, activeFilter, dispatch, viewAccIndex])

  const getAccount = useCallback(async () => {
    const response: any = await dispatch(actionGetAccounts())

    if (response?.status === 200 && response?.data) {
      setAccounts(response?.data)
    }
  }, [dispatch])

  useEffect(() => {
    getAccount()
  }, [getAccount])

  useEffect(() => {
    const getCourseWithSourceId = async ({
      sourceId,
      title,
      sequenceNo
    }: {
      sourceId: number
      title: string
      sequenceNo: number
    }) => {
      const dataCourse: any = await dispatch(
        actionGetAllCourse({
          categoryId: sourceId
        })
      )
      if (!_.isEmpty(dataCourse)) {
        return dataCourse?.data?.map((item: any) => ({
          courseId: item?.id,
          title,
          sequenceNo
        }))
      }
    }
    const convertDataList = async (dataList: any[]) => {
      const mapData = dataList.reduce((array: any, nextItem: any) => {
        const list =
          nextItem?.blocks?.map((item: any) => ({
            ...item,
            title: nextItem?.title,
            sequenceNo: nextItem?.sequenceNo
          })) || []
        const newArray = array.concat(list)
        return newArray
      }, [])
      const dataWithApi = await Promise.all(
        mapData.map((item: any) => {
          if (item?.model === 'courses') {
            return { courseId: item.sourceId, title: item?.title, sequenceNo: item?.sequenceNo }
          }
          if (item?.model === 'categories') return getCourseWithSourceId(item)
          return null
        })
      )
      const finalConvertData = _.flatMap(dataWithApi)
      return finalConvertData
    }
    const getCategory = async () => {
      const dataList: any = await dispatch(actionGetHomeBlocks())
      if (!_.isEmpty(dataList)) {
        const list = await convertDataList(dataList)
        return list
      }
      return []
    }
    const getStatisticData = async () => {
      if (accounts?.[viewAccIndex]?.id === undefined) return
      dispatch(showLoading())
      // * Lấy dữ liệu tiến trình về
      const response: any = await dispatch(
        actionGetHistoryAcount({ accountId: accounts?.[viewAccIndex]?.id })
      )

      // * Lấy dữ liệu khóa học từ block home về
      const listCourseFromCategory: any = await getCategory()
      const categoriesList = listCourseFromCategory.map((item: any) => {
        const dataWithStatic = response?.courseBlock?.find(
          (course: any) => course?.id === item?.courseId
        )
        if (dataWithStatic) {
          return {
            ...item,
            name: dataWithStatic?.name,
            timeFinishCourse: dataWithStatic?.timeFinishCourse,
            unitCount: dataWithStatic?.unitCount,
            unitLearnedCount: dataWithStatic?.unitLearnedCount
          }
        }
        return null
      })
      const groupList: any = _.groupBy(_.compact(categoriesList), 'title')
      const mapArray =
        Object.keys(groupList).map((key: string) => ({
          title: key,
          sequenceNo: groupList?.[key]?.[0]?.sequenceNo,
          courses: groupList?.[key]
        })) || []
      setCategories(_.sortBy(mapArray, 'sequenceNo'))
      dispatch(hideLoading())
    }
    getStatisticData()
  }, [accounts, dispatch, viewAccIndex])

  const statisticBlock = useMemo(() => {
    const longestHour: any = _.maxBy(historyMe?.chartBlock?.data, 'count')
    const questionCount = historyMe?.statisticCountBlock?.questionCount || 0
    const prevQuestionCount = historyMe?.statisticCountBlock?.prevQuestionCount || 0
    const score = historyMe?.statisticCountBlock?.score || 0
    const prevScore = historyMe?.statisticCountBlock?.prevScore || 0
    const timeLearned = historyMe?.statisticCountBlock?.timeLearned || 0
    const prevTimeLearned = historyMe?.statisticCountBlock?.prevTimeLearned || 0
    const unitCount = historyMe?.statisticCountBlock?.unitCount || 0
    const prevUnitCount = historyMe?.statisticCountBlock?.prevUnitCount || 0

    return {
      questionCount: {
        current: questionCount,
        direction: questionCount >= prevQuestionCount ? 'up' : 'down',
        percent: prevQuestionCount
          ? Math.abs(
              float2Number(((questionCount - prevQuestionCount) * 100) / (prevQuestionCount || 1))
            )
          : 0
      },
      score: {
        current: score || 0,
        direction: score >= prevScore ? 'up' : 'down',
        percent: prevScore
          ? Math.abs(float2Number(((score - prevScore) * 100) / (prevScore || 1)))
          : 0
      },
      timeLearned: {
        current: Math.floor((timeLearned || 0) / 3600),
        direction: timeLearned >= prevTimeLearned ? 'up' : 'down',
        percent: prevTimeLearned
          ? Math.abs(float2Number(((timeLearned - prevTimeLearned) * 100) / (prevTimeLearned || 1)))
          : 0
      },
      unitCount: {
        current: unitCount || 0,
        direction: unitCount >= prevUnitCount ? 'up' : 'down',
        percent: prevUnitCount
          ? Math.abs(float2Number((unitCount - prevUnitCount || 0 * 100) / (prevUnitCount || 1)))
          : 0
      },
      longestHour
    }
  }, [
    historyMe?.chartBlock?.data,
    historyMe?.statisticCountBlock?.prevQuestionCount,
    historyMe?.statisticCountBlock?.prevScore,
    historyMe?.statisticCountBlock?.prevTimeLearned,
    historyMe?.statisticCountBlock?.prevUnitCount,
    historyMe?.statisticCountBlock?.questionCount,
    historyMe?.statisticCountBlock?.score,
    historyMe?.statisticCountBlock?.timeLearned,
    historyMe?.statisticCountBlock?.unitCount
  ])

  const chartBlock = useMemo(() => {
    const blocks = historyMe?.chartBlock?.data
    const week = []
    for (let index = 0; index < 7; index++) {
      const date = sub(endOfWeek(new Date(), { weekStartsOn: 0 }), { days: 6 - index })
      const label = format(new Date(date), 'yyyy-MM-dd')
      const dayOfWeek = format(new Date(date), 'c')

      const dateObj = {
        dayOfWeek: dayOfWeek === '1' ? 'CN' : `T${dayOfWeek}`,
        label,
        count: 0
      }
      const item = blocks?.find((d: any) => d.label === label)

      if (item) {
        dateObj.count = item.count
      }
      week.push(dateObj)
    }
    return week
  }, [historyMe?.chartBlock?.data])

  const convertTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (seconds > 3600) {
      return `${numberTwoDigits(hours)} giờ ${numberTwoDigits(minutes)} phút`
    }
    if (seconds > 60) return `${numberTwoDigits(minutes)} phút`
    if (seconds >= 0) return `${numberTwoDigits(seconds)} giây`
    return seconds
  }

  return (
    <div className="tab_parent_control">
      {accounts?.length > 0 ? (
        <div className="tab__wrap">
          <p className="h4 fw-bold">Kiểm soát của cha mẹ</p>
          <p className="mb-0 small">
            Xem nội dung và thông tin khác để giúp con bạn cân bằng thời gian học.
          </p>
          <p className="mb-3 small">Chọn các tài khoản phụ để xem thông tin.</p>

          <div className="sub__acc__list d-flex flex-wrap mb-3">
            {accounts?.map((accItem: any, accIndex: number) => (
              <div
                className={`d-flex sub__acc--item me-3 ${
                  accIndex === viewAccIndex ? 'active' : ''
                }`}
                key={accItem?.id}
                onClick={() => setViewAccIndex(accIndex)}
              >
                <Image
                  src={accItem.avatar || avata}
                  className="avatar__holder me-3"
                  roundedCircle
                />
                <div>
                  <p className="fw-bold small mb-0">{accItem?.fullname}</p>
                  <p className="sub__text mb-0">
                    {accItem?.dob
                      ? `${differenceInYears(new Date(), new Date(accItem?.dob || ''))} tuổi`
                      : ''}
                  </p>
                  {/* <p className="sub__text mb-0">Có 2 bài học</p> */}
                  {/* <div className="sub__status sub__text small" style={{ color: 'green' }}>
                  <span className="dot me-2" style={{ backgroundColor: 'green' }} />
                  Đang học
                </div> */}
                </div>
              </div>
            ))}
          </div>

          <p className="h4 fw-bold my-4">Thời gian học</p>

          {historyMe?.chartBlock?.data?.length ? (
            <div className="section__wrap">
              <p className="mb-0">Trung bình hàng ngày</p>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <p className="h2 mb-0">{convertTime(historyMe?.chartBlock?.avgPerDay)}</p>
                <div className="d-flex">
                  <img src={ico_up} alt="" className="me-2" />
                  <p className="mb-0">
                    Tăng {historyMe?.chartBlock?.percentage || 0}% so với tuần trước
                  </p>
                </div>
              </div>
              <div className="chart__graph">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    width={150}
                    height={40}
                    margin={{
                      top: 20
                    }}
                    data={chartBlock}
                    maxBarSize={100}
                  >
                    <Bar dataKey="count">
                      {chartBlock?.map((entry: any, index: number) => (
                        <Cell
                          key={`cell-${index}`}
                          fill="#0066FF"
                          fillOpacity={
                            ((entry?.count || 0) / (statisticBlock.longestHour?.count || 1)) * 0.8 +
                            0.2
                          }
                          radius={5}
                        />
                      ))}
                      <LabelList
                        dataKey="count"
                        position="top"
                        content={(props: any) => {
                          const { x, y, width, height, value } = props
                          return (
                            <g>
                              <text
                                x={x + width / 2}
                                y={y - 10}
                                fill="#aeb7c0"
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fontSize={10}
                              >
                                {convertTime(value)}
                              </text>
                            </g>
                          )
                        }}
                      />
                    </Bar>
                    <XAxis dataKey="dayOfWeek" axisLine={false} tickLine={false} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : (
            <div className="empty__bar__chart">Không có dữ liệu</div>
          )}
          <div className="d-flex justify-content-between align-items-center my-3">
            <p className="h4 fw-bold">Lịch sử hoạt động</p>
            <div className="d-flex">
              <Button.Shadow
                className="btn__small btn_date me-3"
                color={activeFilter === 'today' ? 'blue' : 'gray'}
                content="Ngày"
                onClick={() => setActiveFilter('today')}
              />
              <Button.Shadow
                className="btn__small btn_date me-3"
                color={activeFilter === 'week' ? 'blue' : 'gray'}
                content="Tuần"
                onClick={() => setActiveFilter('week')}
              />
              <Button.Shadow
                className="btn__small btn_date"
                color={activeFilter === 'month' ? 'blue' : 'gray'}
                content="Tất cả"
                onClick={() => setActiveFilter('month')}
              />
            </div>
          </div>

          <div>
            <Row>
              <Col xs={4}>
                <p className="fw-bold">Thời gian</p>
              </Col>
              <Col xs={8}>
                <p className="fw-bold">Bài học</p>
              </Col>
            </Row>
            <Row className="history__scrollable">
              {/* // !!!!! */}
              {historyLessons?.length ? (
                _.orderBy(historyLessons, 'time', 'desc')?.map((item: any, index: number) => (
                  <React.Fragment key={index}>
                    <Col xs={4}>
                      <p className="time__text">
                        {item?.time
                          ? `${format(new Date(item?.time), 'HH')}h${format(
                              new Date(item?.time),
                              'mm dd.MM.yyyy'
                            )}`
                          : ''}
                      </p>
                    </Col>
                    <Col xs={8}>
                      <p className="lession__text">{item?.unit?.name}</p>
                    </Col>
                  </React.Fragment>
                ))
              ) : (
                <Col xs={12}>
                  <div className="empty__placeholder">Không có dữ liệu</div>
                </Col>
              )}
            </Row>
          </div>

          <p className="h4 fw-bold mt-3">Tiến trình học tập</p>
          <Row>
            <Col xs={3}>
              <CardInfo
                number={statisticBlock.unitCount.current}
                type="Bài"
                updown={statisticBlock.unitCount.direction === 'up' ? 'up' : 'down'}
                percent={statisticBlock?.unitCount.percent}
              />
              Số bài đã học
            </Col>
            <Col xs={3}>
              <CardInfo
                number={statisticBlock.questionCount.current}
                type="Bài"
                updown={statisticBlock.questionCount.direction === 'up' ? 'up' : 'down'}
                percent={statisticBlock.questionCount.percent}
              />
              Số bài tập đã làm
            </Col>
            <Col xs={3}>
              <CardInfo
                number={statisticBlock.score.current}
                type="Điểm"
                updown={statisticBlock.score.direction === 'up' ? 'up' : 'down'}
                percent={statisticBlock.score.percent}
              />
              Tổng điểm
            </Col>
            <Col xs={3}>
              <CardInfo
                number={statisticBlock.timeLearned.current}
                type="Giờ"
                updown={statisticBlock.timeLearned.direction === 'up' ? 'up' : 'down'}
                percent={statisticBlock.timeLearned.percent}
              />
              Thời gian đã học
            </Col>
          </Row>

          {categories?.map((item: any, index: number) => (
            <ProgressLession title={item.title} lession={item.lession} key={index} />
          ))}
        </div>
      ) : (
        <div className="tab__wrap">
          <h2 className="text-center py-5 fw-bold" style={{ color: 'gray' }}>
            Hãy tạo tài khoản phụ để xem tiến trình học tập
          </h2>
        </div>
      )}
    </div>
  )
}

export default TabParentControl
