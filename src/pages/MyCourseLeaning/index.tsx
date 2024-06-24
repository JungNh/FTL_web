import React, { useCallback, useEffect, useState } from 'react'
import ContainerWithBack from '../../components/ContainerWithBack'
import { Button, Card, Col, ProgressBar, Row, Spinner } from 'react-bootstrap'
import { EMTYP_IMG } from './components/images'
import './styles.scss'
import { api } from '../../lib'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { hideLoading, showLoading } from '../../store/login/actions'
import {
  actionSaveChildLesson,
  actionSaveCurrentCourse,
  actionSaveCurrentSection,
  actionSaveParentLessons
} from '../../store/study/actions'
import { useHistory } from 'react-router'
import { actionCourseWithId } from '../../store/home/actions'
import { RootState } from '../../store'
import _ from 'lodash'
import IconFubo from './components/Svg/IconFubo'
import { apiCore } from '../../lib-core'
import Swal from 'sweetalert2'
import fubo_blink from '../../assets/images/ico_fubo.svg'
import PanelTab from '../../components/PanelTab'
import HeaderHome from '../Homepage/HeaderHome'
import backArrow from '../../assets/images/left.png'
import PanelTabMobile from '../../components/PanelTab/PanelTabMobile'

interface ItemCourse {
  id: number
  name: string
  imageUrl: string
  percentage: number
  score: number
  type?: string
}

const MyCourseLeaning = () => {
  const [listLeaning, setListLeaning] = useState<ItemCourse[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const dispatch = useDispatch()
  const history = useHistory()
  const currentCourse = useSelector((state: RootState) => state.study.currentCourse)

  const dataContest = [
    {
      id: -1,
      type: 'contest',
      name: 'Luyện thi',
      imageUrl:
        'https://5501513-s3user.s3.cloudstorage.com.vn/future-app/images/938350be-51be-4f54-b393-9c98e0fc4322.png',
      score: 0,
      percentage: 0
    }
  ]

  const loadData = async () => {
    setLoading(true)
    await api
      .post(`${process.env.REACT_APP_API_V2}/courses/learning`)
      .then((success) => {
        setListLeaning(dataContest.concat(success?.data?.data))
        setLoading(false)
      })
      .catch((err) => {
        setLoading(false)
        console.log(err)
      })
  }

  useEffect(() => {
    loadData()
  }, [])

  const callItemCourse = async (id: number) => {
    dispatch(showLoading())
    const response = await apiCore.post(`/course/${id}`)
    if (_.get(response, 'data.data.isComingSoon') == 1) {
      Swal.fire({
        title: `<div style="color: #000; font-weight:bold;font-size:30px">THÔNG BÁO</div>`,
        html: ' Khóa học sắp được ra mắt. Xin vui lòng quay lại sau!',
        confirmButtonText: `<div style="
          padding-left:20px;padding-right: 20px; padding-top:5px,padding-bottom:5px
        ">ĐỒNG Ý</div>`,
        iconHtml: `<img src="${fubo_blink}">`,
        customClass: {
          icon: 'icon-style',
          title: 'title-popup',
          container: 'container-popup'
        }
      })
      return
    }

    const courseResult: any = await dispatch(actionCourseWithId(id))
    if (!_.isEmpty(courseResult)) {
      if (currentCourse?.id !== courseResult?.id) {
        dispatch(actionSaveCurrentCourse(courseResult))
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

  const onClickHandleCourse = (item: ItemCourse) => {
    if (item?.type === 'contest') {
      history.push('/exam-offline')
      return
    }
    console.log(item, 'item ')
    callItemCourse(item.id)
  }

  const renderData = () => {
    if (loading) {
      return (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            marginTop: 20
          }}
        >
          <Spinner animation="grow" />
          <Spinner animation="grow" style={{ marginLeft: 5, marginRight: 5 }} />
          <Spinner animation="grow" />
        </div>
      )
    } else {
      if (listLeaning.length > 0) {
        return (
          <div style={{ display: 'flex', flexWrap: 'wrap'}}>
            {listLeaning?.map((item, index) => {
              const percentage = item?.percentage ?? 0 // Giá trị phần trăm, nếu không có giá trị thì sẽ là 0
              const displayedPercentage = percentage !== 0 ? Math.round(percentage) + '%' : '0%' // Làm tròn giá trị phần trăm đến 1 chữ số thập phân, nếu là 0 thì chỉ là 0%

              return (
                <div>
                  <Card
                    className="tag__item"
                    style={{
                      width: '15rem',
                      height: '20rem',
                      border: 0,
                      marginBottom: 20,
                      marginRight: 15
                    }}
                  >
                    <div
                      style={{
                        height: '14rem'
                      }}
                    >
                      <Card.Img
                        className="tag__image"
                        variant="top"
                        src={item?.imageUrl ? item?.imageUrl : EMTYP_IMG}
                        onClick={() => onClickHandleCourse(item)}
                        style={{
                          height: '14rem'
                        }}
                      />
                    </div>
                    {item?.type !== 'contest' && (
                      <div style={{ marginTop: 10 }}>
                        <ProgressBar
                          now={item?.percentage}
                          style={{ backgroundColor: '#214B6F' }}
                        />
                        <div
                          style={{
                            position: 'relative',
                            bottom: 16,
                            left: 0,
                            textAlign: 'center',
                            color: 'white',
                            fontSize: 12
                          }}
                        >
                          {displayedPercentage}
                        </div>
                      </div>
                    )}

                    <Card.Body style={{ marginTop: item?.type !== 'contest' ? -30 : 0 }}>
                      <Card.Text>{item?.name}</Card.Text>
                    </Card.Body>
                  </Card>
                </div>
              )
            })}
          </div>
        )
      } else {
        return (
          <div
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              display: 'flex',
              flexDirection: 'column',
              marginTop: 30
            }}
          >
            <IconFubo />
            <div style={{ fontSize: 20, fontWeight: '500' }}>Bạn chưa có khóa học nào!</div>
            <Button
              variant="primary"
              style={{
                width: '15rem',
                marginTop: 10,
                borderRadius: 10
              }}
              onClick={() => {
                history.push({
                  pathname: '/user-setting',
                  state: { my_leaning: true }
                })
              }}
            >
              Kích hoạt thẻ
            </Button>
          </div>
        )
      }
    }
  }

  // const renderData = () => {
  //   if (loading) {
  //     return (
  //       <div
  //         style={{
  //           display: 'flex',
  //           justifyContent: 'center',
  //           alignItems: 'center',
  //           flexDirection: 'row',
  //           marginTop: 20
  //         }}
  //       >
  //         <Spinner animation="grow" />
  //         <Spinner animation="grow" style={{ marginLeft: 5, marginRight: 5 }} />
  //         <Spinner animation="grow" />
  //       </div>
  //     )
  //   } else {
  //     if (listLeaning.length > 0) {
  //       return (
  //         <>
  //           {listLeaning?.map((item, index) => {
  //             const percentage = item?.percentage ?? 0 // Giá trị phần trăm, nếu không có giá trị thì sẽ là 0
  //             const displayedPercentage = percentage !== 0 ? percentage.toFixed(1) + '%' : '0%' // Làm tròn giá trị phần trăm đến 1 chữ số thập phân, nếu là 0 thì chỉ là 0%

  //             return (
  //               <Col xs={12} sm={6} lg={3} key={item?.id}>
  //                 <Card
  //                   className="tag__item"
  //                   style={{
  //                     width: '16rem',
  //                     height: '20rem',
  //                     border: 0,
  //                     marginBottom: 20
  //                   }}
  //                 >
  //                   <div
  //                     style={{
  //                       height: '14rem'
  //                     }}
  //                   >
  //                     <Card.Img
  //                       className="tag__image"
  //                       variant="top"
  //                       src={item?.imageUrl ? item?.imageUrl : EMTYP_IMG}
  //                       onClick={() => onClickHandleCourse(item)}
  //                       style={{
  //                         height: '14rem'
  //                       }}
  //                     />
  //                   </div>
  //                   {item?.type !== 'contest' && (
  //                     <div style={{ marginTop: 10 }}>
  //                       <ProgressBar now={item?.percentage} />
  //                       <div
  //                         style={{ position: 'relative', bottom: 20, left: 0, textAlign: 'center' }}
  //                       >
  //                         {displayedPercentage}
  //                       </div>
  //                     </div>
  //                   )}

  //                   <Card.Body style={{ marginTop: item?.type !== 'contest' ? -30 : 0 }}>
  //                     <Card.Text>{item?.name}</Card.Text>
  //                   </Card.Body>
  //                 </Card>
  //               </Col>
  //             )
  //           })}
  //         </>
  //       )
  //     } else {
  //       return (
  //         <div
  //           style={{
  //             justifyContent: 'center',
  //             alignItems: 'center',
  //             display: 'flex',
  //             flexDirection: 'column',
  //             marginTop: 30
  //           }}
  //         >
  //           <IconFubo />
  //           <div style={{ fontSize: 20, fontWeight: '500' }}>Bạn chưa có khóa học nào!</div>
  //           <Button
  //             variant="primary"
  //             style={{
  //               width: '15rem',
  //               marginTop: 10,
  //               borderRadius: 10
  //             }}
  //             onClick={() => {
  //               history.push({
  //                 pathname: '/user-setting',
  //                 state: { my_leaning: true }
  //               })
  //             }}
  //           >
  //             Kích hoạt thẻ
  //           </Button>
  //         </div>
  //       )
  //     }
  //   }
  // }

  return (
    <div style={{ position: 'relative' }}>
      <PanelTab />
      <PanelTabMobile/>
      <div className="homePage">
        <HeaderHome
          title={
            <div className='say_hi' style={{ display: 'flex', alignItems: 'center' }} onClick={() => history.goBack()}>
              <img src={backArrow} alt="bageSection" style={{ marginRight: 10, height: 16 }} />
              <div className="h4" style={{ margin: 0 }}>
                Khóa học của tôi
              </div>
            </div>
          }
        />
        <div style={{ marginTop: '3rem' }}>
          <Row>{renderData()}</Row>
        </div>
      </div>
    </div>
  )
}

export default MyCourseLeaning

{
  /* <ContainerWithBack>
<div className="contestrule__component">
  <div className="header">
    <h2 className="content-title">Khóa học của tôi</h2>
  </div>
  <Row>{renderData()}</Row>
</div>
</ContainerWithBack> */
}


