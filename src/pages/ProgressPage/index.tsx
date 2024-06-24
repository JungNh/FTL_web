import _, { union, values } from 'lodash'
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import {
  LineChart,
  Line,
  Tooltip,
  CartesianGrid,
  YAxis,
  ResponsiveContainer,
  XAxis
} from 'recharts'
import { daysInWeek, endOfWeek, format, startOfWeek, sub } from 'date-fns'
import {
  actionGetStatisV2,
  actionGetHistoryProgressV2,
  actionGetMyProgressV2
} from '../../store/progress/actions'
import ProgressLession from './components/ProgressLession'
import { Button, Tab, Tabs } from 'react-bootstrap'
import iconTime from '../../assets/images/note.png'
import PanelTab from '../../components/PanelTab'
import { useHistory } from 'react-router'
import HeaderHome from '../Homepage/HeaderHome'
import { RootState } from '../../store'
import PanelTabMobile from '../../components/PanelTab/PanelTabMobile'

type Props = Record<string, unknown>

const ProgressPage: FC<Props> = () => {
  const HISTORY_STATUS = {
    TODAY: 'today',
    THIS_WEEK: 'this_week'
  }
  let data2 = {
    labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
    datasets: [
      {
        data: [10, 10, 10, 10, 10, 10, 10],
        color: (opacity = 1) => `rgba(255, 0, 0)`,
        strokeWidth: 2
      }
    ]
  }
  const dispatch = useDispatch()
  const history = useHistory()
  const [dataStatis, setDataStatis] = useState(data2) as any
  const [average, setAverage] = useState(0)
  const [hisAction, setHisAction] = useState(HISTORY_STATUS.THIS_WEEK)
  const [activityHis, setActivityHis] = useState<any[] | null>(null)
  const [dataProgress, setDataProgress] = useState<any[] | null>(null)
  const userInfo = useSelector((state: RootState) => state.login.userInfo)

  let NewData = [
    { day: 'T2', time: 0 },
    { day: 'T3', time: 0 },
    { day: 'T4', time: 0 },
    { day: 'T5', time: 0 },
    { day: 'T6', time: 0 },
    { day: 'T7', time: 0 },
    { day: 'CN', time: 0 }
  ]
  const [newData, setNewData] = useState(NewData)

  const data = {
    labels: HISTORY_STATUS,
    datasets: [
      {
        label: 'newData',
        data: newData,
        stack: 'combined',
        type: 'bar'
      }
    ]
  }

  const dataEmpty = [
    { day: 'T2', time: 0 },
    { day: 'T3', time: 0 },
    { day: 'T4', time: 0 },
    { day: 'T5', time: 0 },
    { day: 'T6', time: 0 },
    { day: 'T7', time: 0 },
    { day: 'CN', time: 0 }
  ]

  const getStatis = async () => {
    try {
      const res = await dispatch(actionGetStatisV2())
      if (res) {
        const staticData = (res as any).data.this_week
        console.log('staticData', staticData)
        const time = new Date().getDay()
        let data3 = {
          labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
          datasets: [
            {
              data: [
                staticData.monday / 60,
                staticData.tuesday / 60,
                staticData.wednesday / 60,
                staticData.thursday / 60,
                staticData.friday / 60,
                staticData.saturday / 60,
                staticData.sunday / 60
              ],
              color: (opacity = 1) => `rgba(255, 0, 0)`,
              strokeWidth: 2
            }
          ]
        }
        let arr = [
          { day: 'T2', time: staticData.monday / 60 },
          { day: 'T3', time: staticData.tuesday / 60 },
          { day: 'T4', time: staticData.wednesday / 60 },
          { day: 'T5', time: staticData.thursday / 60 },
          { day: 'T6', time: staticData.friday / 60 },
          { day: 'T7', time: staticData.saturday / 60 },
          { day: 'CN', time: staticData.sunday / 60 }
        ]
        setNewData(arr)
        setDataStatis(data3)
        setAverage(
          Math.round(
            (staticData.monday +
              staticData.tuesday +
              staticData.wednesday +
              staticData.thursday +
              staticData.friday +
              staticData.saturday +
              staticData.sunday) /
              (time * 60)
          )
        )
      }
    } catch (error) {
      console.error(error)
    }
  }

  const getActivityHis = async (time: any) => {
    try {
      const res = await dispatch(actionGetHistoryProgressV2(time))
      if (res) {
        setActivityHis((res as any).data)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const getDataProgress = async () => {
    try {
      const res = await dispatch(actionGetMyProgressV2())
      if (res) {
        setDataProgress((res as any).data)
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getActivityHis(hisAction)
    getStatis()
    getDataProgress()
  }, [dispatch])

  const convertTimeHM = (value: any) => {
    const sec = parseInt(value, 10)
    let hours = Math.floor(sec / 60)
    return hours
  }

  const chartBlock = useMemo(() => {
    const week = []
    for (let index = 0; index < 7; index++) {
      const date = sub(endOfWeek(new Date(), { weekStartsOn: 0 }), { days: 6 - index })
      const label = format(new Date(date), 'yyyy-MM-dd')
      const dayOfWeek = format(new Date(date), 'c')
      const dayWeek = String(Number(dayOfWeek) + 1)
      const dateObj = {
        dayOfWeek: dayWeek === '8' ? 'CN' : `T${dayWeek}`,
        label,
        count: convertTimeHM(dataStatis.datasets[0].data[index])
      }
      week.push(dateObj)
    }
    return week
  }, [dataStatis])

  const sumTimeLearn = (args: any) => {
    let sum = 0
    for (let i = 0; i < args.length; i++) {
      sum += args[i]
    }
    return sum
  }

  const convertHMS = (value: any) => {
    const sec = parseInt(value, 10)
    let hours = Math.floor(sec / 60)
    let minutes = Math.floor(sec - hours * 60)
    return hours + ' giờ ' + minutes + ' phút'
  }

  const convertTime = (value: any) => {
    let string = value
    let time = string.slice(11, 16)
    return time
  }

  const convertDate = (value: any) => {
    let string = value
    let year = string.slice(0, 4)
    let month = string.slice(5, 7)
    let day = string.slice(8, 10)
    return day + '-' + month + '-' + year
  }

  return (
    <div style={{ position: 'relative' }}>
      <PanelTab />
      <PanelTabMobile/>
      <div className="homePage">
        <HeaderHome
          title={<div className='say_hi' style={{ display: 'flex' }}>Tiến trình học tập</div>}
        />
        <div className="bg_content_progress content_has_tab_margin">
          <div className="time__learn" style={{ display: 'inline-block', width: '50%' }}>
            <p className="h4 fw-bold my-4" style={{ float: 'left', fontSize: '24px' }}>
              Thời gian học
            </p>
          </div>
          <div
            style={{
              backgroundColor: '#eee',
              borderRadius: 16,
              padding: 30,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* <img src={iconTime} style={{ float: 'right', width: '27%', margin: '24px' }}></img> */}
            <img
              src={iconTime}
              style={{ display: 'flex', width: '10%', alignSelf: 'flex-end', marginBottom: 30 }}
            ></img>
            <div style={{ backgroundColor: 'white', borderRadius: 16 }}>
              {sumTimeLearn(dataStatis.datasets[0].data) !== 0 ? (
                <div className="section__wrap">
                  <div style={{ display: 'inline-block', width: '100%' }}>
                    <p
                      className="mb-0"
                      style={{
                        marginLeft: '20px',
                        marginTop: '20px',
                        float: 'left',
                        fontSize: '18px'
                      }}
                    >
                      Trung bình hàng ngày
                    </p>
                    <p
                      className="mb-0"
                      style={{
                        float: 'right',
                        marginTop: '20px',
                        marginRight: '10%',
                        fontSize: '18px'
                      }}
                    >
                      <strong>{convertHMS(average)}</strong>
                    </p>
                  </div>
                  <div
                    style={{
                      backgroundColor: '#fff',
                      borderRadius: '10px',
                      margin: '20px',
                      fontWeight: 600
                    }}
                  >
                    <sub className="name01">Phút</sub>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart
                        data={newData}
                        margin={{ left: 5, right: 50, top: 50, bottom: 30 }}
                      >
                        <Line dataKey="time" stroke="red" dot={false} />
                        <CartesianGrid stroke="#ccc" vertical={false} />
                        <XAxis dataKey="day" type={'category'} axisLine={false} tickLine={true} />
                        <YAxis dataKey={'time'} />
                        {/* <Tooltip cursor={{ strokeDasharray: '5 5' }} /> */}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              ) : (
                <div className="section__wrap">
                  <div style={{ display: 'inline-block', width: '100%' }}>
                    <p
                      className="mb-0"
                      style={{
                        marginLeft: '20px',
                        marginTop: '20px',
                        float: 'left',
                        fontSize: '18px'
                      }}
                    >
                      Trung bình hàng ngày
                    </p>
                    <p
                      className="mb-0"
                      style={{
                        float: 'right',
                        marginTop: '20px',
                        marginRight: '10%',
                        fontSize: '18px'
                      }}
                    >
                      <strong>{convertHMS(average)}</strong>
                    </p>
                  </div>
                  <div
                    style={{
                      backgroundColor: '#fff',
                      borderRadius: '10px',
                      margin: '20px',
                      fontWeight: 600
                    }}
                  >
                    <sub className="name01">Phút</sub>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart
                        data={dataEmpty}
                        margin={{ left: 5, right: 50, top: 50, bottom: 30 }}
                      >
                        <Line dataKey="num" stroke="red" dot={true} />
                        <CartesianGrid stroke="#ccc" vertical={false} />
                        <XAxis dataKey="day" type={'category'} axisLine={false} tickLine={true} />
                        <YAxis dataKey={'num'} />
                        <Tooltip cursor={{ strokeDasharray: '5 5' }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Lịch sử hoạt động */}
          <p className="h4 fw-bold my-4" style={{ fontSize: '24px' }}>
            Lịch sử hoạt động
          </p>
          <div style={{ backgroundColor: '#eee', borderRadius: 16, padding: 30 }}>
            <div style={{ backgroundColor: 'white', borderRadius: 16 }}>
              {sumTimeLearn(dataStatis.datasets[0].data) !== 0 ? (
                <div className="log__body">
                  <div className="warp__text_log">
                    <div className="list__time_text">
                      <b>Thời gian</b>
                    </div>
                    <div className="list__title_text">
                      <b>Bài học</b>
                    </div>
                  </div>
                  {activityHis?.map((item: any) => {
                    return (
                      <div className="warp__log_ct">
                        <div className="list__time_text">
                          <span>
                            {convertTime(item.activity_time)}, {convertDate(item.activity_time)}
                          </span>
                        </div>
                        <div className="list__title_text">
                          <span>
                            {item.course_name}
                            {`\n`}
                            {item.section_name}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="empty__bar__chart">
                  {' '}
                  <b className="wap1">{userInfo.fullname}</b> ơi, hôm nay bạn chưa học bài nào. Hãy
                  bắt đầu học một bài học ngay nhé!
                </div>
              )}
            </div>
          </div>
          <div className="rogress_wrap">
            <p className="h4 fw-bold my-4" style={{ fontSize: '24px', marginBottom: '10px' }}>
              Tiến trình học tập{' '}
            </p>
            {dataProgress?.map((item: any, index: number) => (
              <ProgressLession title={item.title} lession={item.progresses} key={index} />
            ))}
          </div>
        </div>
      </div>

      {/* <AssistiveTouch /> */}
      {/* <DefaultNav
        activePanel="progress"
        changePanel={(panel: string) => console.log('change panel to ', panel)}
      /> */}
    </div>
  )
}

export default ProgressPage
