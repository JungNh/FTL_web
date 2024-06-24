import * as React from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { Spinner } from 'react-bootstrap'
import './styles.scss'

import { Button } from '../../components'
import { arenaApi as api } from '../../lib'
import Popup from './components/PopupShare'
import CountDown from './components/CountDown'
import ArenaBanner from '../../components/ArenaBanner'
import CountDownText from './components/CountDownText'
import ContainerWithBack from '../../components/ContainerWithBack'
import Cadidates from './components/Cadidates'

const milisecondsToSeconds = (m: number) => {
  const b = m % 1000
  if (b >= 500) return Math.floor(m / 1000) + 1
  return Math.floor(m / 1000)
}

const JoiningRoomPage: React.FC = () => {
  const history = useHistory()
  const { id } = useParams<{ id: string }>()
  const [contest, setContest] = React.useState<Contest | null>(null)
  const [popup, setPopup] = React.useState(false)

  const getContest = async (id: number) => {
    try {
      const start = window.performance.now()
      const response = await api.post('/contests/get_contest_round_info/', {
        round_id: id
      })
      if (response.data.c === 1) {
        const data = response.data.d[0]
        if (data && data.exam_start_time_remaining_timestamp === 0) {
          history.push(`/quiz/${+id}`)
        }
        const end = window.performance.now()
        const delta = Math.floor(Math.abs(end - start) / 2 / 1000)
        data.exam_start_time_remaining_timestamp = milisecondsToSeconds(
          data.exam_start_time_remaining_mili_timestamp + delta
        )
        data.exam_end_time_remaining_timestamp = milisecondsToSeconds(
          data.exam_end_time_remaining_mili_timestamp + delta
        )
        setContest(data)
      }
    } catch (error) {}
  }

  const onRedirect = () => {
    history.push(`/quiz/${+id}`)
  }

  React.useEffect(() => {
    if (id) {
      getContest(+id)
    }
    const visibilityChange = () => {
      if (!document.hidden) {
        getContest(+id)
      }
    }
    document.addEventListener('visibilitychange', visibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', visibilityChange)
    }
  }, [id])

  return (
    <ContainerWithBack background="#f5f5f5">
      <div className="joiningroom__page">
        {!contest ? (
          <div className="loading__icon">
            <Spinner animation="grow" />
          </div>
        ) : (
          <>
            <ArenaBanner data={contest} />
            <div className="content__buttons">
              {/* <Button.Solid
                onClick={() => setPopup(true)}
                content={
                  <>
                    <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M8.42105 10.7278V17H2.17648e-07C-0.000261149 16.0115 0.234881 15.036 0.687409 14.1484C1.13994 13.2607 1.79784 12.4844 2.61071 11.879C3.42358 11.2735 4.36983 10.855 5.37697 10.6555C6.38411 10.4559 7.4254 10.4807 8.42105 10.7278ZM6.73684 9.71429C3.94526 9.71429 1.68421 7.54071 1.68421 4.85714C1.68421 2.17357 3.94526 0 6.73684 0C9.52842 0 11.7895 2.17357 11.7895 4.85714C11.7895 7.54071 9.52842 9.71429 6.73684 9.71429ZM11.7895 12.9524V10.5238H13.4737V12.9524H16V14.5714H13.4737V17H11.7895V14.5714H9.26316V12.9524H11.7895Z"
                        fill="#EEEEEE"
                      />
                    </svg>
                    Mời bạn bè
                  </>
                }
              /> */}
              <Button.Solid
                onClick={() => history.push(`/contest-rule/${+id}`)}
                content={
                  <>
                    <svg
                      width="18"
                      height="21"
                      viewBox="0 0 18 21"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="2.77777"
                        y="3.8335"
                        width="8.77419"
                        height="1.33333"
                        rx="0.666666"
                        fill="white"
                      />
                      <rect
                        x="2.77777"
                        y="6.94482"
                        width="8.77419"
                        height="1.33333"
                        rx="0.666666"
                        fill="white"
                      />
                      <rect
                        x="2.77777"
                        y="10.0557"
                        width="6.70967"
                        height="1.33333"
                        rx="0.666666"
                        fill="white"
                      />
                      <rect
                        x="2.77777"
                        y="13.167"
                        width="4.64516"
                        height="1.33333"
                        rx="0.666666"
                        fill="white"
                      />
                      <path
                        d="M9.25806 17.4678H3C1.89543 17.4678 1 16.5723 1 15.4678V3.46777C1 2.3632 1.89543 1.46777 3 1.46777H10.871C11.9755 1.46777 12.871 2.3632 12.871 3.46777V11.2742"
                        stroke="white"
                        strokeWidth="1.5"
                      />
                      <circle
                        cx="12.871"
                        cy="15.4034"
                        r="4.12903"
                        stroke="white"
                        strokeWidth="1.5"
                      />
                      <rect
                        x="14.6288"
                        y="13.855"
                        width="1.03226"
                        height="3.97192"
                        rx="0.516129"
                        transform="rotate(45.0288 14.6288 13.855)"
                        fill="white"
                      />
                      <rect
                        width="1.03226"
                        height="2.48468"
                        rx="0.516129"
                        transform="matrix(0.706752 -0.707462 -0.707462 -0.706752 12.5643 17.3926)"
                        fill="white"
                      />
                    </svg>
                    Thể lệ
                  </>
                }
              />
            </div>
            <div className="content__timmer">
              <p>Cuộc thi sẽ diễn ra sau</p>
              <CountDownText start={contest?.exam_start_time_remaining_timestamp} />
              <p>Số thí sinh tham gia thi đấu</p>

              <Cadidates init={contest?.total_candidates ?? 0} />
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 20
                }}
              >
                <div style={{ width: 200 }}>
                  <Button.Shadow
                    content="Trang chủ"
                    onClick={() => {
                      history.push(`/home`)
                    }}
                  />
                </div>
              </div>
            </div>
            <Popup open={popup} onClose={() => setPopup(false)} />
            {contest?.exam_start_time_remaining_timestamp && (
              <CountDown
                start={contest.exam_start_time_remaining_timestamp}
                onRedirect={onRedirect}
              />
            )}
          </>
        )}
      </div>
    </ContainerWithBack>
  )
}

export default JoiningRoomPage
