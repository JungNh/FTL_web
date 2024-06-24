import _ from 'lodash'
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import DefaultNav from '../../components/Navbar'
import AssistiveTouch from '../../components/AssistiveTouch'
import { actionGetProgressByIdV2 } from '../../store/progress/actions'
import imgTitle from './img/image-title.png'
import img1 from './img/image1.png'
import img2 from './img/image2.png'
import img3 from './img/image3.png'
import img5 from './img/image5.png'
import iconLoading from './img/bg-loading.png'
import imgDefault from './img/default.png'
import clk1 from './img/clk1.png'
import { useParams, useLocation, Link, useHistory } from 'react-router-dom'
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar'
import { position } from 'polished'
import avt_nam from '../../assets/images/avt_nam.jpg'
import avt_nu from '../../assets/images/avt_nu.jpg'
import backArrow from '../../assets/images/left.png'
import PanelTab from '../../components/PanelTab'
import HeaderHome from '../Homepage/HeaderHome'
import image3 from './img/image3.png'
import { url } from 'inspector'
import { hideLoading, showLoading } from '../../store/login/actions'
import { actionCourseWithId, actionSaveChildLesson, actionSaveCurrentCourse, actionSaveCurrentSection, actionSaveParentLessons } from '../../store/study/actions'
import { RootState } from '../../store'
import PanelTabMobile from '../../components/PanelTab/PanelTabMobile'

type Props = Record<string, unknown>

const Cource: FC<Props> = () => {
  const history = useHistory()
  const location = useLocation()
  const params = useParams()
  const dispatch = useDispatch()
  const [listData, setListData] = useState([])
  const [infoCource, setInfoCource] = useState([])
  const [userInfo, setUserInfo] = useState(0)
  const currentCourse = useSelector((state: RootState) => state.study.currentCourse)
  useEffect(() => {
    let getDataLocalStorage: any = localStorage.getItem('state')
    let dataLocalStorage = JSON.parse(getDataLocalStorage)
    setUserInfo(dataLocalStorage.login.userInfo)
    const getCategory = async () => {
      const dataList: any = await dispatch(actionGetProgressByIdV2((params as any).id))
      if (!_.isEmpty(dataList.course)) {
        setListData(dataList.course.section)
        setInfoCource(dataList.course)
      } else {
        setListData([])
      }
    }
    getCategory()
  }, [dispatch])

  console.log('infoCource', infoCource)

  const convertHMS = (value: number) => {
    let hours: any = Math.floor(value / 3600)
    let minutes: any = Math.floor((value - hours * 3600) / 60)
    let seconds: any = value - hours * 3600 - minutes * 60
    if (hours < 10) {
      hours = '0' + hours
    }
    if (minutes < 10) {
      minutes = '0' + minutes
    }
    if (seconds < 10) {
      seconds = '0' + seconds
    }
    return hours + ':' + minutes + ':' + seconds
  }

  const callItemCourse = async (id: number) => {
    dispatch(showLoading())
    const courseResult: any = await dispatch(actionCourseWithId(id))
    console.log('courseResult', courseResult)
    if (!_.isEmpty(courseResult)) {
      dispatch(actionSaveCurrentCourse(courseResult))
      if (currentCourse?.id !== courseResult?.id) {
        dispatch(actionSaveCurrentSection(null))
        dispatch(actionSaveParentLessons(null))
        dispatch(actionSaveChildLesson(null))
      }

      dispatch(hideLoading())
      history.push({
        pathname: `/study/${courseResult?.id}`,
        state: { showPopup: true }
      })
    } else {
      dispatch(hideLoading())
    }
  }

  return (
    <div className="homePage">
      <HeaderHome
        title={
          <div style={{ display: 'flex', alignItems: 'center' }} onClick={() => history.goBack()} >
            <img src={backArrow} alt="bageSection" style={{ marginRight: 10, height: 16 }} />
            <div className='say_hi' style={{ margin: 0 }}>
              Tiến trình học tập
            </div>
          </div>
        }
      />
      <div style={{ position: 'relative' }}>
        <PanelTab />
        <PanelTabMobile/>
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <div className="courses__page--detail">
            <div className="progress__page container">
              <div
                className="cource_header"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
              >
                <div className="cource_header__title">
                  <div className="cource_title">
                    <span className="cource_text_title">{(location as any).state.title}</span>
                  </div>
                </div>
              </div>

              <div className="cource_info">
                <Row>
                  <Col className="cource_info__item" xs={4}>
                    <div className="cource_info_detail_point">
                      <p className="detail__text">Tổng điểm</p>
                      <p className="detail__point">
                        {infoCource.length !== 0
                          ? (infoCource as any).course_score +
                            '/' +
                            (infoCource as any).course_total_score
                          : 0}
                      </p>
                    </div>
                    <img src={img1} alt="" />
                  </Col>
                  <Col className="cource_info__item" xs={4}>
                    <div className="cource_info_detail">
                      <p className="detail__text">Thời gian </p>
                      <p className="detail__point">
                        {infoCource.length !== 0
                          ? convertHMS((infoCource as any).course_duration)
                          : 0}
                      </p>
                    </div>
                    <img src={img1} alt="" />
                  </Col>
                  <Col className="cource_info__item" xs={4}>
                    <div className="cource_info_detail_done">
                      <p className="detail__text">Hoàn thành</p>
                      <p className="detail__point">
                        {infoCource.length !== 0
                          ? `${Math.round((infoCource as any).course_percentage * 100)}%`
                          : 0}
                      </p>
                    </div>
                    <img src={img1} alt="" />
                  </Col>
                </Row>
              </div>

              <Row style={{ justifyContent: 'center' }}>
                {listData.map((item: any, index: number) => {
                  return (
                    <div
                      style={{
                        width: 400,
                        height: 330,
                        margin: 10,
                        marginTop: 30,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        position: 'relative'
                      }}
                      onClick={() => callItemCourse((infoCource as any).course_id)}
                    >
                      <div
                        className="cource_body_title"
                        style={{
                          width: 300,
                          height: 73,
                          backgroundRepeat: 'no-repeat',
                          backgroundImage: `url(${img2})`,
                          backgroundSize: 'cover',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {item.section_name}
                      </div>
                      <div
                        style={{
                          width: 400,
                          height: 257,
                          backgroundRepeat: 'no-repeat',
                          backgroundImage: `url(${image3})`,
                          backgroundSize: 'cover',
                          margin: 5,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center'
                        }}
                      >
                        <Row
                          style={{
                            flex: 1,
                            height: 200,
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            padding: 40,
                            position: 'relative'
                          }}
                        >
                          <Col
                            sm={5}
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 90,
                                height: 90,
                                backgroundColor: '#eee',
                                borderRadius: 45
                              }}
                            >
                              <CircularProgressbar
                                className="circlePercent_process"
                                value={Math.round(item?.section_percentage * 100)}
                                text={`${Math.round(item?.section_percentage * 100)}%`}
                                strokeWidth={10}
                                styles={buildStyles({
                                  textColor: '#000000',
                                  pathColor: '#FFA901',
                                  textSize: 25
                                })}
                              />
                            </div>
                            <div className="detail_left_kq">
                              <span>
                                {item.section_score} / {item.section_total_score}
                              </span>
                            </div>
                          </Col>
                          <Col
                            sm={7}
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <div className="detail_right">
                              <div className="detail_right__time">
                                <img src={clk1} />
                                <span>{convertHMS(item?.section_duration)}</span>
                              </div>
                              <div
                                className={`detail_right__success ${
                                  Math.round(item?.section_percentage * 100) === 100
                                    ? 'info_success'
                                    : 'info_learning'
                                }`}
                              >
                                Đã hoàn thành
                              </div>
                              <div
                                className={`detail_right__learing ${
                                  Math.round(item?.section_percentage * 100) !== 100
                                    ? 'info_success'
                                    : 'info_learning'
                                }`}
                              >
                                Chưa hoàn thành
                              </div>
                            </div>
                          </Col>
                        </Row>
                        <div
                          style={{
                            backgroundColor: 'red',
                            padding: 5,
                            paddingLeft: 10,
                            paddingRight: 10,
                            borderRadius: 20,
                            color: 'while',
                            position: 'absolute',
                            bottom: 25
                          }}
                        >
                          <span className="text_link">Xem bài học</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </Row>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cource
