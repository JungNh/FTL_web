import * as React from 'react'
import _ from 'lodash'
import PanelTab from '../../components/PanelTab'
import TabCardActive from '../UserSetting/components/TabCardActive'
import HeaderHome from '../Homepage/HeaderHome'
import { api2 } from '../../lib2'
import backArrow from '../../assets/images/left.png'
import { useHistory } from 'react-router'
import PanelTabMobile from '../../components/PanelTab/PanelTabMobile'

type Props = Record<string, never>

const Attendance: React.FC<Props> = () => {
  const history = useHistory()
  const d = new Date()
  const date = d.getDate()
  const day = d.getDay()
  const [dateAttendanceArr, setDateAttendanceArr] = React.useState<any>([])
  const [disableAttendance, setDisableAttendance] = React.useState<boolean>(false)
  function getMonday(d: any) {
    const day = d.getDay(),
      diff = d.getDate() - day + (day == 0 ? -6 : 1), // adjust when day is sunday
      monday = new Date(d.setDate(diff))
    return monday.getTime()
  }

  function getDateStr(num: number) {
    const date = getMonday(d) + num * 24 * 60 * 60 * 1000,
      timeSt = new Date(date)
    return {
      key: timeSt.getDate(),
      value: `${timeSt.getDate()}/${timeSt.getMonth() + 1}`
    }
  }

  const DAY_OF_WEEK = [
    getDateStr(0),
    getDateStr(1),
    getDateStr(2),
    getDateStr(3),
    getDateStr(4),
    getDateStr(5),
    getDateStr(6)
  ]

  React.useEffect(() => {
    attendanceHistory()
  }, [])

  const attendanceHistory = async () => {
    try {
      const res = await api2.post('/attendance/history')
      if (res?.data?.code == 1) {
        console.log('res', res)
        setDateAttendanceArr(res?.data?.data?.dates || [])
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleAttendance = async () => {
    try {
      const res = await api2.post('/attendance/daily-attendance', {
        attendance_30_min: true
      })
      if (res?.data?.code == 1) {
        console.log('res', res)
        attendanceHistory()
      }
    } catch (error) {
      console.log(error)
    }
  }

  const checkIfIdExists = (arr: any, num: number) => {
    return _.some(arr, { day_of_week: num })
  }

  return (
    <div style={{ position: 'relative' }}>
      <PanelTab />
      <PanelTabMobile />
      <div className="homePage">
        <HeaderHome
          title={
            <div
              style={{ display: 'flex', alignItems: 'center' }}
              onClick={() => history.goBack()}
              className="say_hi"
            >
              <img src={backArrow} alt="bageSection" style={{height: 16 }} />
              <div style={{ marginLeft: 10 }}>
                Điểm danh
              </div>
            </div>
          }
        />
        <div
          className="bg_content_progress"
          style={{
            width: '90%',
            display: 'flex',
            flexDirection: 'column',
            marginLeft: 50
          }}
        >
          <img
            src={require('../../assets/images/attendance_slide.png')}
            style={{ width: '80%', alignSelf: 'center' }}
          />
          <div
            style={{
              display: 'flex',
              background: '#f9f9f9',
              borderRadius: 20,
              justifyContent: 'space-around',
              paddingTop: 30,
              paddingBottom: 30,
              marginTop: 30
            }}
          >
            {DAY_OF_WEEK.map((item: any, index: any) => {
              const isCheck = checkIfIdExists(dateAttendanceArr, index + 1)
              return (
                <div className="box_attendance" key={index}>
                  <div
                    className={`item_attendance ${
                      isCheck || index + 1 == day ? `bg_attendance` : ``
                    }`}
                  >
                    {item.value}

                    {isCheck ? (
                      <>
                        <img
                          src={require('../../assets/images/attendance_diamon.png')}
                          style={{ marginTop: 20, width: 70, height: 70 }}
                        />
                        <div style={{ fontSize: 14, color: '#018CFF', marginTop: 10 }}>
                          Đã điểm danh
                        </div>
                      </>
                    ) : (
                      <div>
                        <div style={{ position: 'relative' }}>
                          <img
                            src={require('../../assets/images/attendance_diamon.png')}
                            style={{ marginTop: 20, height: 70 }}
                          />
                        </div>
                        {date == item.key && (
                          <button
                            disabled={disableAttendance}
                            className="btn_attendance"
                            onClick={() => {
                              setDisableAttendance(true)
                              handleAttendance()
                            }}
                          >
                            {' '}
                            Điểm danh
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Attendance
