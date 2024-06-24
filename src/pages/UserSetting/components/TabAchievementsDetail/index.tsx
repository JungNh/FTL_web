import _ from 'lodash'
import React, { useState, useEffect } from 'react'
import { Modal, Col, Row, Button } from 'react-bootstrap'
import target from './main.png'
import rank1 from './imgs/rank1.png'
import rank2 from './imgs/rank2.png'
import rank from './imgs/rank.png'
import rank4 from './imgs/rank4.png'
import rank5 from './imgs/rank5.png'
import rank6 from './imgs/rank6.png'
import diamond from './diamond.png'
import cn from './cn.png'
import bk from './bk.png'
import download from './download.png'
import { useDispatch } from 'react-redux'
import { actionGetAchivementByCouseId } from '../../../../store/achivements/actions'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import './style.scss'
import { openError } from '../../../../utils/common'
import backArrow from '../../../../assets/images/left.png'

type Props = { goToSubAccTab: () => void }

const TabAchievementsDetail: React.FC<Props> = ({ goToSubAccTab }) => {
  const dispatch = useDispatch()
  const [showPopup, setShowPopup] = useState(false)
  const [courseDetail, setCourseDetail] = useState([])
  const [date, setDate] = useState(0)
  const [month, setMonth] = useState(0)
  const [year, setYear] = useState(0)

  const getCertifications = () => {
    const percent = (courseDetail as any)?.course_percentage
    if (percent >= 0.8) {
      setShowPopup(true)
    } else {
      openError('Bạn chưa hoàn thành khóa học này!')
    }
  }

  const outputPdf = () => {
    let content = document.getElementById('content_popup_wrap') as HTMLElement
    html2canvas(content).then((canvas) => {
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('landscape', 'px', 'a4', false)
      pdf.addImage(imgData, 'PNG', 0, 0, 0, 0)
      pdf.save('Bằng Khen.pdf')
    })
  }

  useEffect(() => {
    let dateObj = new Date()
    let day = dateObj.getUTCDate()
    let month = dateObj.getUTCMonth() + 1
    let year = dateObj.getUTCFullYear()
    setDate(day)
    setMonth(month)
    setYear(year)

    let courseId: any = localStorage.getItem('courseId')
    const getAchimentDetail = async () => {
      const dataAchimentByCourseId: any = await dispatch(actionGetAchivementByCouseId(courseId))
      if (!_.isEmpty(dataAchimentByCourseId.data)) {
        setCourseDetail(dataAchimentByCourseId.data)
      } else {
        setCourseDetail([])
      }
    }
    getAchimentDetail()
  }, [dispatch])

  const ranks: any = {
    1: {
      text: 'Đồng',
      img: rank1
    },
    2: {
      text: 'Bạc',
      img: rank2
    },
    3: {
      text: 'Vàng',
      img: rank
    },
    4: {
      text: 'Bạch Kim',
      img: rank4
    },
    5: {
      text: 'Kim Cương',
      img: rank5
    },
    6: {
      text: 'Cao Thủ',
      img: rank6
    }
  }

  return (
    <>
      <Modal
        dialogClassName="popupCc"
        show={showPopup}
        onHide={() => setShowPopup(false)}
        size="lg"
        animation={false}
      >
        <div id="content_popup_wrap">
          <div className="bg_img">
            <div className="info">
              <p className="name">{(courseDetail as any).user_name}</p>
              <div className="rank_bg">
                <p className="text">Hạng:</p>
                <p className="rank">{ranks[(courseDetail as any)?.course_rank]?.text}</p>
              </div>
              <p className="text">Đã hoàn thành khóa học</p>
              <p className="course">{(courseDetail as any).course_name}</p>
            </div>
            <h3 className="date">
              Futurelang - {date}/{month}/{year}
            </h3>
          </div>
        </div>
        <Button className="popup_btn" onClick={outputPdf}>
          <img className="icon_down" src={download} alt="" />
          <h3 className="txt_down">Tải về</h3>
        </Button>
      </Modal>
      <div className="tab__info">
        {/* <div
          style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}
          onClick={goToSubAccTab}
        >
          <img src={backArrow} alt="bageSection" style={{ marginRight: 10, height: 16 }} />
          <div className="h4" style={{ margin: 0 }}>
            Thành tích cá nhân
          </div>
        </div> */}
        {/* <hr /> */}
        <p
          className="h5 fw-bold achive_detail_title"
          style={{ marginBottom: '25px', textAlign: 'center' }}
        >
          {(courseDetail as any).course_name}
        </p>
        <div className="tab__achive_detail_wrap">
          <div className="achievenment_detail__wrap mb-3">
            <Row>
              <Col xs={12} sm={6} lg={6}>
                <div className="achive_detail__item">
                  <div className="item_img_wrap" style={{ top: '13%' }}>
                    <img src={target} alt="" />
                  </div>
                  <div className="achive_detail_item_ct">
                    <h3 className="achive_detail_item__title">Tổng điểm</h3>
                    <h2 className="achive_detail_item__desc">
                      {(courseDetail as any).course_score}
                    </h2>
                  </div>
                </div>
              </Col>
              <Col xs={12} sm={6} lg={6}>
                <div className="achive_detail__item">
                  <div className="item_img_wrap" style={{ top: '26%' }}>
                    <img src={diamond} alt="" />
                  </div>
                  <div className="achive_detail_item_ct">
                    <h3 className="achive_detail_item__title">Kim cương</h3>
                    <h2 className="achive_detail_item__desc">
                      {(courseDetail as any).diamond_available}
                    </h2>
                  </div>
                </div>
              </Col>
              <Col xs={12} sm={6} lg={6}>
                <div className="achive_detail__item">
                  <div className="item_img_wrap" style={{ top: '18%' }}>
                    <img src={ranks[(courseDetail as any)?.course_rank]?.img} alt="" />
                  </div>
                  <div className="achive_detail_item_ct">
                    <h3 className="achive_detail_item__title">Hạng hiện tại</h3>
                    <h2 className="achive_detail_item__desc">
                      {ranks[(courseDetail as any)?.course_rank]?.text}
                    </h2>
                  </div>
                </div>
              </Col>
              <Col xs={12} sm={6} lg={6}>
                <div
                  className="achive_detail__item"
                  onClick={getCertifications}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="item_img_wrap" style={{ top: '23%' }}>
                    <img src={cn} alt="" />
                  </div>
                  <div className="achive_detail_item_ct">
                    <h3 className="achive_detail_item__title">Chứng nhận</h3>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </>
  )
}
export default TabAchievementsDetail
