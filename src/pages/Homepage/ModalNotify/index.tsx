import React, { FC, useRef, useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import { useSelector, useDispatch } from 'react-redux'
import { Modal, Image, Spinner } from 'react-bootstrap'
import _ from 'lodash'

import './styles.scss'
import {
  actionCourseWithId,
  actionGetListNotify,
  actionSaveListNoti,
  actionSaveNumNotiNotRead,
  actionSavePostsNoti,
  actionWatchLastLesson,
  getNewFromNoti,
  markReaded,
  markReadedAll
} from '../../../store/home/actions'
import { RootState } from '../../../store'
// import reactSelect from 'react-select'
import { hideLoading, showLoading } from '../../../store/login/actions'
import {
  actionGetChildsLesson,
  actionSaveChildLesson,
  actionSaveCurrentCourse,
  actionSaveCurrentSection,
  actionSaveParentLessons
} from '../../../store/study/actions'
import { DEFINE_NOTI, RANK_ARR, STATUS } from './constants'
import { IoClose } from 'react-icons/io5'
import Swal from 'sweetalert2'
import { actionUnregisterNotification } from '../../../store/settings/actions'
import ReactHtmlParser from 'react-html-parser'

type Props = {
  show: boolean
  handleClose: () => void
  showNews: () => void
  showPosts: () => void
}

const NotifyModal: FC<Props> = ({ show, handleClose, showNews, showPosts }) => {
  const [status, setStatus] = useState<any>(STATUS.ALL)
  const dispatch = useDispatch()
  const history = useHistory()
  const { listNotiAll, numberNotiNotRead, loadingNoti } = useSelector(
    (state: RootState) => state.home
  )
  const stydyState = useSelector((state: RootState) => state.study)
  //   console.log('LIST_NOTIFY', listNotiAll)
  const currentCourse = useSelector((state: RootState) => state.study.currentCourse)

  useEffect(() => {
    if (show) {
      getListNoti(status)
    }
  }, [show])

  const getDate = (string: any) => {
    const day = string.slice(8, 10)
    const month = string.slice(5, 7)
    return `${day}/${month}`
  }

  const convertTime = (string: string) => {
    let result = string.replace(/-/g, '/')
    let timePast = Math.round(new Date(result).getTime() / 1000)
    let timeShow = result.substring(11, 16)
    let dshow = result.substring(8, 10)
    let mshow = result.substring(5, 7)
    let yshow = result.substring(0, 4)
    const timeNow = Math.round(Date.now() / 1000)
    let interval = timeNow - timePast
    var d = Math.floor(interval / (3600 * 24))
    var h = Math.floor((interval % (3600 * 24)) / 3600)
    var m = Math.floor((interval % 3600) / 60)
    var s = Math.floor(interval % 60)
    if (d >= 6) {
      return `${timeShow} ${dshow}/${mshow}/${yshow}`
    }
    if (d > 0 && d < 6) {
      return `${d} ngày trước`
    }
    if (h > 0) {
      return `${h} giờ trước`
    }
    if (m > 0) {
      return `${m} phút trước`
    }
    return 'Vừa xong'
  }

  //= == cài đặt trước khi sang màn khoá học ===
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

  const getListNoti = async (payload: any) => {
    dispatch(actionGetListNotify({ status: payload }))
  }

  const markReadedNoti = async (id: any, isRead: any) => {
    const res: any = await dispatch(markReaded({ notification_id: id }))
    if (res?.data?.code == 1 && isRead == 0 && numberNotiNotRead > 0) {
      dispatch(actionSaveNumNotiNotRead(numberNotiNotRead - 1))
    }
  }

  const unregisterNotification = async () => {
    await dispatch(actionUnregisterNotification())
  }

  const logOut = () => {
    Swal.fire({
      title: 'Bạn muốn đăng xuất',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Không',
      confirmButtonText: 'Đăng xuất'
    })
      .then(async (result) => {
        if (result.isConfirmed) {
          await unregisterNotification()
          localStorage.clear()
          dispatch({ type: 'RESET' })
          history.push('/login')
        }
        return ''
      })
      .catch((error) => console.error(error))
    // const response = dispatch({

    // })
  }

  return (
    <Modal className="modal-notify" show={show} onHide={handleClose}>
      <Modal.Title>
        <div className="modal-title">
          <span>Thông báo</span>
          <IoClose onClick={handleClose} className="icon-close" />
        </div>
        <div className="modal-line" />
      </Modal.Title>
      <div className="content-modal-notify">
        <div className="header-list-notify">
          <div
            className={`tab-modal-notify ${status === STATUS.ALL ? 'active' : ''}`}
            onClick={() => {
              getListNoti(STATUS.ALL)
              setStatus(STATUS.ALL)
            }}
          >
            Tất cả
          </div>
          <div
            className={`tab-modal-notify ${status === STATUS.NOT_READ ? 'active' : ''}`}
            onClick={() => {
              getListNoti(STATUS.NOT_READ)
              setStatus(STATUS.NOT_READ)
            }}
          >
            {numberNotiNotRead !== 0 && (
              <div className="num_noti">
                <span className="num_text">{numberNotiNotRead}</span>
              </div>
            )}
            Chưa đọc
          </div>
          <div className="tab-modal-notify" onClick={() => dispatch(markReadedAll({ status }))}>
            Đánh dấu đã đọc
          </div>
        </div>
        {loadingNoti ? (
          <div
            className="d-flex align-items-center justify-content-center"
            style={{ height: '100%' }}
          >
            <Spinner animation="grow" style={{ width: 15, height: 15, margin: 10 }} />
            <Spinner animation="grow" style={{ width: 15, height: 15, margin: 10 }} />
            <Spinner animation="grow" style={{ width: 15, height: 15, margin: 10 }} />
            <Spinner animation="grow" style={{ width: 15, height: 15, margin: 10 }} />
            <Spinner animation="grow" style={{ width: 15, height: 15, margin: 10 }} />
          </div>
        ) : (
          <>
            {listNotiAll?.length ? (
              <div className="list-notify">
                {listNotiAll.map((item: any, index: any) => (
                  <div
                    key={index}
                    className={`notify-item ${item.is_read == 0 ? 'not-read' : ''}`}
                    style={{ display: 'flex', alignItems: 'center' }}
                    onClick={async () => {
                      markReadedNoti(item._id, item.is_read)
                      handleClose()
                      switch (item.type) {
                        case DEFINE_NOTI.RANK_UP:
                          history.push(`/leader-board/${item?.payload?.course_id}`)
                          break
                        case DEFINE_NOTI.ATTENDANCE_30_MIN:
                          console.log('Di chuyển đến trang điểm danh')
                          break
                        case DEFINE_NOTI.SECTION_PERCENT_75:
                        case DEFINE_NOTI.SECTION_PERCENT_85:
                        case DEFINE_NOTI.COURSE_PERCENT_75:
                        case DEFINE_NOTI.COURSE_PERCENT_90:
                        case DEFINE_NOTI.SECTION_PERCENT_SCORE_75:
                        case DEFINE_NOTI.SECTION_PERCENT_SCORE_85:
                        case DEFINE_NOTI.COURSE_PERCENT_SCORE_75:
                        case DEFINE_NOTI.COURSE_PERCENT_SCORE_90:
                        case DEFINE_NOTI.WATCH_COURSE:
                          callItemCourse(item?.payload?.course_id)
                          break
                        case DEFINE_NOTI.WATCH_CARD_ACTIVE:
                          history.push({
                            pathname: '/user-setting',
                            state: { tabPanel: 'card-active' }
                          })
                          break
                        case DEFINE_NOTI.WATCH_LANDING_PAGE:
                          window.open(`${item.payload.link_page}`, '_blank')?.focus()
                          break
                        case DEFINE_NOTI.WATCH_NEW:
                          // đang call Api chưa có dữ liệu
                          let res: any = await dispatch(getNewFromNoti(item.payload?.post_id))
                          if (res) {
                            showNews()
                          }
                          break
                        case DEFINE_NOTI.WATCH_POST:
                          showPosts()
                          dispatch(actionSavePostsNoti(item.payload))
                          break
                        case DEFINE_NOTI.WATCH_LOGIN:
                          logOut()
                          break
                        case DEFINE_NOTI.WATCH_LAST_LESSON:
                          const resLes: any = await dispatch(actionWatchLastLesson())
                          if (resLes) {
                            callItemCourse(resLes?.data?.course_id)
                            // const dataDetail: any = await dispatch(
                            //   actionGetChildsLesson(resLes?.data?.unit_id)
                            // )
                            // if (dataDetail) {
                            //   dispatch(
                            //     actionSaveParentLessons({
                            //       ...stydyState,
                            //       childLessons: dataDetail
                            //     })
                            //   )
                            // }
                          }
                          break
                        default:
                          break
                      }
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      {item.payload.imageUrl ? (
                        <Image className="img-notify" src={item.payload?.imageUrl} />
                      ) : (
                        <Image className="img-notify" src={require('../../../assets/icon.png')} />
                      )}
                    </div>
                    <div style={{ flex: 1}}>
                      <div className="text_bold">{item.payload.title || ''}</div>
                      {item.type == DEFINE_NOTI.RANK_UP && (
                        <span>
                          Bạn được thăng hạng{' '}
                          <span className="text_bold">{RANK_ARR[item?.payload?.new_rank]}</span> -
                          khóa <span className="text_bold">{item?.payload.course_name}</span>
                        </span>
                      )}
                      {item.type == DEFINE_NOTI.ATTENDANCE_30_MIN && (
                        <span>
                          Bạn đã hoàn thành nhiệm vụ{' '}
                          <span className="text_bold">
                            điểm danh ngày {getDate(item?.payload?.time)}
                          </span>{' '}
                          bạn được thưởng{' '}
                          <span className="text_bold"> {item?.payload?.amount_diamond}</span>
                          <Image
                            className="img-diamond"
                            src={require('../../../assets/images/diamond-icon.png')}
                          />
                        </span>
                      )}
                      {item.type == DEFINE_NOTI.SECTION_PERCENT_75 && (
                        <span>
                          Bạn đã hoàn thành{' '}
                          <span className="text_bold">
                            75% tiến trình {item?.payload?.section_name}
                          </span>{' '}
                          khoá <span className="text_bold">{item?.payload?.course_name}</span>, bạn
                          được thưởng{' '}
                          <span className="text_bold"> {item?.payload?.amount_diamond}</span>
                          <Image
                            className="img-diamond"
                            src={require('../../../assets/images/diamond-icon.png')}
                          />
                        </span>
                      )}
                      {item.type == DEFINE_NOTI.SECTION_PERCENT_85 && (
                        <span>
                          Bạn đã hoàn thành{' '}
                          <span className="text_bold">
                            85% tiến trình {item?.payload?.section_name}
                          </span>{' '}
                          khoá <span className="text_bold">{item?.payload?.course_name}</span>, bạn
                          được thưởng{' '}
                          <span className="text_bold"> {item?.payload?.amount_diamond}</span>{' '}
                          <Image
                            className="img-diamond"
                            src={require('../../../assets/images/diamond-icon.png')}
                          />
                        </span>
                      )}
                      {item.type == DEFINE_NOTI.COURSE_PERCENT_75 && (
                        <span>
                          Bạn đã hoàn thành <span className="text_bold">75% tiến trình</span> khoá{' '}
                          <span className="text_bold">{item?.payload?.course_name}</span>, bạn được
                          thưởng <span className="text_bold"> {item?.payload?.amount_diamond}</span>{' '}
                          <Image
                            className="img-diamond"
                            src={require('../../../assets/images/diamond-icon.png')}
                          />
                        </span>
                      )}
                      {item.type == DEFINE_NOTI.COURSE_PERCENT_90 && (
                        <span>
                          Bạn đã hoàn thành <span className="text_bold">90% tiến trình</span> khoá{' '}
                          <span className="text_bold">{item?.payload?.course_name}</span>, bạn được
                          thưởng <span className="text_bold"> {item?.payload?.amount_diamond}</span>{' '}
                          <Image
                            className="img-diamond"
                            src={require('../../../assets/images/diamond-icon.png')}
                          />
                        </span>
                      )}
                      {item.type == DEFINE_NOTI.SECTION_PERCENT_SCORE_75 && (
                        <span>
                          Bạn đã hoàn thành{' '}
                          <span className="text_bold">
                            75% tổng điểm {item?.payload?.section_name}
                          </span>{' '}
                          khoá <span className="text_bold">{item?.payload?.course_name}</span>, bạn
                          được thưởng{' '}
                          <span className="text_bold"> {item?.payload?.amount_diamond}</span>{' '}
                          <Image
                            className="img-diamond"
                            src={require('../../../assets/images/diamond-icon.png')}
                          />
                        </span>
                      )}
                      {item.type == DEFINE_NOTI.SECTION_PERCENT_SCORE_85 && (
                        <span>
                          Bạn đã hoàn thành{' '}
                          <span className="text_bold">
                            85% tổng điểm {item?.payload?.section_name}
                          </span>{' '}
                          khoá <span className="text_bold">{item?.payload?.course_name}</span>, bạn
                          được thưởng{' '}
                          <span className="text_bold"> {item?.payload?.amount_diamond}</span>{' '}
                          <Image
                            className="img-diamond"
                            src={require('../../../assets/images/diamond-icon.png')}
                          />
                        </span>
                      )}
                      {item.type == DEFINE_NOTI.COURSE_PERCENT_SCORE_75 && (
                        <span>
                          Bạn đã hoàn thành <span className="text_bold">75% tổng điểm</span> khoá{' '}
                          <span className="text_bold">{item?.payload?.course_name}</span>, bạn được
                          thưởng <span className="text_bold"> {item?.payload?.amount_diamond}</span>{' '}
                          <Image
                            className="img-diamond"
                            src={require('../../../assets/images/diamond-icon.png')}
                          />
                        </span>
                      )}
                      {item.type == DEFINE_NOTI.COURSE_PERCENT_SCORE_90 && (
                        <span>
                          Bạn đã hoàn thành <span className="text_bold">90% tổng điểm</span> khoá{' '}
                          <span className="text_bold">{item?.payload?.course_name}</span>, bạn được
                          thưởng <span className="text_bold"> {item?.payload?.amount_diamond}</span>{' '}
                          <Image
                            className="img-diamond"
                            src={require('../../../assets/images/diamond-icon.png')}
                          />
                        </span>
                      )}
                      {(item.type == DEFINE_NOTI.WATCH_COURSE ||
                        item.type == DEFINE_NOTI.WATCH_NEW ||
                        item.type == DEFINE_NOTI.WATCH_LAST_LESSON ||
                        item.type == DEFINE_NOTI.WATCH_LOGIN ||
                        item.type == DEFINE_NOTI.WATCH_CARD_ACTIVE ||
                        item.type == DEFINE_NOTI.WATCH_HOME_PAGE ||
                        item.type == DEFINE_NOTI.WATCH_LANDING_PAGE ||
                        item.type == DEFINE_NOTI.WATCH_POST ||
                        item.type == DEFINE_NOTI.WATCH_NOTHING) && (
                        <div>
                          <span>
                            {ReactHtmlParser(item?.payload?.content?.replaceAll('\n', '<br>')) ||
                              ''}
                          </span>
                        </div>
                      )}
                      <div className="extra_info">
                        {typeof item.datetime === 'string' ? (
                          <span className="text-time">{convertTime(item.datetime)}</span>
                        ) : (
                          <span>Chưa xác định thời gian</span>
                        )}
                        {item.is_read == 0 && (
                          <div className="seen">
                            <span
                              style={{ fontSize: 12, color: 'red', textDecoration: 'underline' }}
                            >
                              Xem ngay
                            </span>
                            <div className="is-reader"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="noty-empty">Hiện tại bạn chưa có thông báo nào!</div>
            )}
          </>
        )}
      </div>
    </Modal>
  )
}

export default NotifyModal
