/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react'
import { useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useLocation } from 'react-router'
import moment from 'moment'
import _ from 'lodash'
import {
  Button as ButtonBootstrap,
  ListGroup,
  Tabs,
  Tab,
  ButtonGroup,
  Table,
  Modal
} from 'react-bootstrap'

import {
  actionCourseWithId,
  actionGetCourseScore,
  actionGetCurrentRankUser,
  actionGetLeaderBoard
} from '../../store/study/actions'
import { RootState } from '../../store'
import { Button } from '../../components'
import DefaultNav from '../../components/Navbar'

import backArrow from '../../assets/images/ico_arrowLeft-blue.svg'
// import headerBg from '../../assets/images/leader-board-header.png'
import backgroundBxh from '../../assets/images/background-bxh.png'
import ellipseRanking from '../../assets/images/ellipse-ranking.png'
import rank1st from '../../assets/images/rank_thuhang-01.png'
import rank2nd from '../../assets/images/rank_thuhang-02.png'
import rank3rd from '../../assets/images/rank_thuhang-03.png'
import rank4th from '../../assets/images/rank_thuhang-04.png'
import rank5th from '../../assets/images/rank_thuhang-05.png'
import rank6th from '../../assets/images/rank_thuhang-06.png'
import triangleLeft from '../../assets/images/triangle-left.png'
import ico_prev from '../../assets/images/ico_prev-white.svg'
import ico_next from '../../assets/images/ico_next-white.svg'
import icon_diamond from '../../assets/images/diamond-icon.png'
import rulesTitle from '../../assets/images/rules-title.png'
import closeRules from '../../assets/images/close-rules.png'
import avt_nam from '../../assets/images/avt_nam.jpg'
import avt_nu from '../../assets/images/avt_nu.jpg'
import { RankUser } from '../../store/study/types'
import './styles.scss'

type Props = Record<string, unknown>

const LeaderBoard: React.FC<Props> = () => {
  const history = useHistory()
  const location = useLocation()
  const dispatch = useDispatch()

  const currentWeek = moment().week()
  const currentMonth = moment().month() + 1
  const [key, setKey] = useState<any>('week')
  const [rankUser, setRankUser] = useState<RankUser | null>(null)
  const [currentRank, setCurrentRank] = useState<any>(null)
  const [totalScore, setTotalScore] = useState<any>(0)
  const [weekNumber, setWeekNumber] = useState<any>(currentWeek)
  const [monthNumber, setMonthNumber] = useState<any>(currentMonth)
  const [leaderBoard, setLeaderBoard] = useState<any>([])
  const [show, setShow] = useState(false)
  const [courseResult, setCourseResult] = useState<any>({})
  const userInfo = useSelector((state: RootState) => state.login.userInfo)
  // * get course id
  const indexLoca: number = location.pathname.lastIndexOf('/')
  const idCourse: string = location.pathname.substring(indexLoca + 1, location.pathname.length)
  const rankList = Array.from({ length: 6 }, (v, k) => k * 10000 + 1)

  const rankImgs = [rank1st, rank2nd, rank3rd, rank4th, rank5th, rank6th]
  const styleRank = ['#FF5F5F', '#FFA463', '#F5CB5D']

  useEffect(() => {
    if (key !== 'full_course') {
      getInitData(key, {
        [key]: key === 'week' ? weekNumber : monthNumber,
        year: moment().year()
      })
    } else {
      getInitData('time', { rank: currentRank?.rank })
    }
  }, [weekNumber, monthNumber, key])

  useEffect(() => {
    const getCourseScore = async () => {
      const dataRes = (await dispatch(
        actionGetCourseScore({
          course_id: Number(idCourse)
        })
      )) as any
      if (!_.isEmpty(dataRes)) {
        setTotalScore(dataRes.course_total_score)
      }
    }

    getCourseScore()
  }, [])

  const isHasRank: any = useMemo(() => {
    if (_.get(rankUser, 'score', false)) {
      return true
    }

    return false
  }, [rankUser])

  useEffect(() => {
    getCurrentRank()
  }, [])

  const getCurrentRank = async () => {
    const dataRank: any = await dispatch(actionGetCurrentRankUser({ courseId: idCourse }))
    const courseResult: any = await dispatch(actionCourseWithId(idCourse as any))
    if (!_.isEmpty(courseResult)) setCourseResult(courseResult)

    if (!_.isEmpty(dataRank)) {
      const rankListByItem = _.get(dataRank, 'score_full_time')
      setCurrentRank(rankListByItem ?? null)
    }
  }

  const getInitData = async (time: string, data: object) => {
    const dataLess: any = await dispatch(actionGetLeaderBoard({ courseId: idCourse, time, data }))
    if (!_.isEmpty(dataLess)) {
      setLeaderBoard(dataLess.rank_chart)
      if (dataLess.ranking_user && dataLess.ranking_user?.[0]) {
        setRankUser(dataLess.ranking_user[0])
      } else {
        setRankUser(null)
      }
    } else {
      setRankUser(null)
    }
  }
  const onSelect = (k: any) => {
    setKey(k)
  }

  const getPrevWeek = () => {
    if (weekNumber >= currentWeek - 5) {
      setWeekNumber(weekNumber - 1)
    }
  }

  const getNextWeek = () => {
    if (weekNumber < currentWeek) {
      setWeekNumber(weekNumber + 1)
    }
  }

  const getPrevMonth = () => {
    if (monthNumber >= currentMonth - 3) {
      setMonthNumber(monthNumber - 1)
    }
  }

  const getNextMonth = () => {
    if (monthNumber < currentMonth) {
      setMonthNumber(monthNumber + 1)
    }
  }

  const getUserIndex = () =>
    leaderBoard.findIndex((leader: any) => leader.user_id === userInfo.id) || []

  const getMedalUser = () => {
    const scoreUser = leaderBoard[getUserIndex()]?.score
    let medal = 0
    rankList.forEach((rank: number, index: number) => {
      if (rankList.length >= index) {
        if (scoreUser > rank && scoreUser < rankList[index + 1]) {
          medal = index
        } else if (scoreUser > rankList[rankList.length]) {
          medal = rankList.length + 1
        }
      }
    })

    return medal
  }

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const listRank = ['Đồng', 'Bạc', 'Vàng', 'Bạch Kim', 'Kim Cương', 'Cao Thủ']
  const sizes = [35, 35, 40, 45, 45, 40]

  return (
    <div className="leaderBoard__page--detail">
      <div className="leaderBoard__header_bg">
        <Button.Shadow
          className="button__back"
          color="gray"
          onClick={() => history.push('/home')}
          content={<img src={backArrow} alt="bageSection" />}
        />
        <div className="leaderBoard_time">
          <Tabs
            activeKey={key}
            onSelect={onSelect}
            transition={false}
            className="leaderBoard_tab_time mb-3"
          >
            <Tab eventKey="week" title="Tuần">
              <ButtonGroup className="leaderBoard_change_time" aria-label="leader board time">
                <ButtonBootstrap style={{ borderRadius: '12px 0 0 12px' }}>
                  {weekNumber >= currentWeek - 5 && (
                    <img
                      className="ico__prev"
                      src={ico_prev}
                      alt={ico_prev}
                      onClick={getPrevWeek}
                    />
                  )}
                </ButtonBootstrap>
                <ButtonBootstrap>{`Tuần ${weekNumber}`}</ButtonBootstrap>
                <ButtonBootstrap style={{ borderRadius: '0 12px 12px 0' }}>
                  {weekNumber < currentWeek && (
                    <img
                      className="ico__prev"
                      src={ico_next}
                      alt={ico_next}
                      onClick={getNextWeek}
                    />
                  )}
                </ButtonBootstrap>
              </ButtonGroup>
            </Tab>
            <Tab eventKey="month" title="Tháng">
              <ButtonGroup className="leaderBoard_change_time" aria-label="leader board time">
                <ButtonBootstrap style={{ borderRadius: '12px 0 0 12px' }}>
                  {monthNumber > currentMonth - 4 && (
                    <img
                      className="ico__prev"
                      src={ico_prev}
                      alt={ico_prev}
                      onClick={getPrevMonth}
                    />
                  )}
                </ButtonBootstrap>
                <ButtonBootstrap>{`Tháng ${monthNumber}`}</ButtonBootstrap>
                <ButtonBootstrap style={{ borderRadius: '0 12px 12px 0' }}>
                  {monthNumber < currentMonth && (
                    <img
                      className="ico__prev"
                      src={ico_next}
                      alt={ico_next}
                      onClick={getNextMonth}
                    />
                  )}
                </ButtonBootstrap>
              </ButtonGroup>
            </Tab>
            <Tab eventKey="full_course" title="Toàn khóa" />
          </Tabs>
        </div>
        {/* <img className="leaderBoard__header" src={headerBg} alt="" /> */}

        <img className="leaderBoard__logo" src={backgroundBxh} alt="" />

        <div className="leaderBoard__title">{courseResult?.name}</div>

        <div className="leaderBoard__ranking">
          <div
            className="leaderBoard__ranking--left d-flex-center"
            style={{
              background: `url(${ellipseRanking})`,
              backgroundSize: 'cover',
              opacity: 0.7
            }}
          >
            <img src={rankImgs[currentRank?.rank - 2]} alt="" />
          </div>
          <div
            className="leaderBoard__ranking--middle d-flex-center"
            style={{
              background: `url(${ellipseRanking})`,
              backgroundSize: 'cover'
            }}
          >
            <img src={rankImgs[currentRank?.rank - 1]} alt="" />
          </div>
          <div
            className="leaderBoard__ranking--right d-flex-center"
            style={{
              background: `url(${ellipseRanking})`,
              backgroundSize: 'cover',
              opacity: 0.7
            }}
          >
            <img src={rankImgs[currentRank?.rank]} alt="" />
          </div>
        </div>

        <Button.Shadow
          className="button__rules"
          color="gray"
          onClick={handleShow}
          content="Quy luật"
        />
      </div>

      <div className="leaderBoard__list">
        <div className="leaderBoard__list--header">
          <div className="leaderBoard-header">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Top</th>
                  <th>Họ và tên</th>
                  <th>Tổng điểm</th>
                  <th>Kim Cương</th>
                </tr>
              </thead>
              <img className="triangle_left" src={triangleLeft} alt="" />
              <img className="triangle_right" src={triangleLeft} alt="" />
            </Table>
          </div>
        </div>
        <div className="leaderBoard__list--item">
          {leaderBoard.length > 0 ? (
            leaderBoard.map((item: any, index: number) => (
              <ListGroup key={index} horizontal>
                <ListGroup.Item
                  style={{
                    backgroundColor: styleRank[index] || '#FFFFFF',
                    border: `1px solid ${styleRank[index] || '#FFFFFF'}`
                  }}
                >
                  <div className="circle-item">{index + 1}</div>
                  <img
                    className="user_avatar"
                    src={item.user_avatar || (item?.user_sex === 'M' ? avt_nam : avt_nu)}
                    alt=""
                  />
                </ListGroup.Item>
                <ListGroup.Item
                  style={{
                    backgroundColor: styleRank[index] || '#FFFFFF',
                    border: `1px solid ${styleRank[index] || '#FFFFFF'}`
                  }}
                >
                  {item?.user_name}
                </ListGroup.Item>
                <ListGroup.Item
                  style={{
                    backgroundColor: styleRank[index] || '#FFFFFF',
                    border: `1px solid ${styleRank[index] || '#FFFFFF'}`
                  }}
                >
                  {item?.score}
                </ListGroup.Item>
                <ListGroup.Item
                  className="diamond_item"
                  style={{
                    backgroundColor: styleRank[index] || '#FFFFFF',
                    border: `1px solid ${styleRank[index] || '#FFFFFF'}`
                  }}
                >
                  <img src={icon_diamond} alt="diamond" />
                  <span>
                    <b>{item?.diamond_available}</b>
                  </span>
                </ListGroup.Item>
              </ListGroup>
            ))
          ) : (
            <ListGroup horizontal className="leader__no_data">
              <div>Khoảng thời gian này bạn chưa tích lũy điểm!</div>
            </ListGroup>
          )}

          {rankUser && (
            <ListGroup className="my_rank" key="my-rank" horizontal>
              <ListGroup.Item>
                <div className="rank_item">
                  <span>Top</span>
                  <span>{rankUser?.ranking}</span>
                </div>
                <img
                  className="user_avatar"
                  src={rankUser?.user_avatar || (rankUser?.user_sex === 'M' ? avt_nam : avt_nu)}
                  alt=""
                />
              </ListGroup.Item>
              <ListGroup.Item>{rankUser?.user_name}</ListGroup.Item>
              <ListGroup.Item>{rankUser?.score}</ListGroup.Item>
              <ListGroup.Item className="diamond_item">
                <img src={icon_diamond} alt="diamond" />
                <span>
                  <b>{rankUser?.diamond_available}</b>
                </span>
              </ListGroup.Item>
            </ListGroup>
          )}
        </div>
      </div>

      <Modal className="modal-rules" show={show} onHide={handleClose}>
        <Modal.Title>
          <div>
            <img className="rules-title" src={rulesTitle} alt="" />
            <img className="rules-close" onClick={handleClose} src={closeRules} alt="" />
          </div>
        </Modal.Title>
        <Modal.Body>
          <div className="content-rules">
            Khoá học có 6 hạng (Đồng, Bạc, Vàng, Bạch Kim, Kim Cương, Cao Thủ) được sắp xếp theo
            khoảng điểm tương ứng.
            <div className="list-ranking">
              {listRank.map((rank: string, index: number) => (
                <p>
                  <img
                    width={sizes[index]}
                    height={35}
                    style={{ paddingRight: 8 }}
                    src={rankImgs[index]}
                    alt=""
                  />
                  {`${rank}: ${Math.round((index * totalScore) / 6 + 1)} - ${Math.round(
                    ((index + 1) * totalScore) / 6
                  )}`}
                </p>
              ))}
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <DefaultNav
        activePanel="study"
        changePanel={(panel: string) => console.log('change panel to ', panel)}
      />
    </div>
  )
}

export default LeaderBoard
