import React, { FC, useRef, useEffect, useState, useCallback } from 'react'
import AliceCarousel from 'react-alice-carousel'
import ReactHtmlParser from 'react-html-parser'
import { useHistory } from 'react-router'
import { Modal, Image, Spinner, ProgressBar } from 'react-bootstrap'
import { format } from 'date-fns'
import viLocale from 'date-fns/locale/vi'
import _ from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import ico_prev from '../../../assets/images/ico_prev-white.svg'
import ico_next from '../../../assets/images/ico_next-white.svg'
import {
  actionGetAllSlider,
  actionCourseWithId,
  actionPostWithId
} from '../../../store/home/actions'
import { openError, convertUrl, openInNewTab } from '../../../utils/common'
import {
  actionSaveChildLesson,
  actionSaveCurrentCourse,
  actionSaveCurrentSection,
  actionSaveParentLessons
} from '../../../store/study/actions'
import { hideLoading, showLoading } from '../../../store/login/actions'
import '../styles.scss'
import { KImage } from '../../../components'
import { FaChevronCircleLeft, FaChevronCircleRight } from 'react-icons/fa'
import { RootState } from '../../../store'
import { apiCore } from '../../../lib-core'
import { itemPopupSlider, saveListDataSlider } from '../../../store/popup/actions'
import { actionGetNews } from '../../../store/settings/actions'
import empty_courses from '../../../assets/images/empty_courses.png'
import { api2 } from '../../../lib2'
import Swal from 'sweetalert2'
import fubo_blink from '../../../assets/images/ico_fubo.svg'
import ic_play from '../../../assets/images/ic_play.png'

type Props = {
  dataCourese?: any[]
  loadingCourses: boolean
}
export type SliderType = {
  imageUrl?: string
  model?: string
  sequenceNo?: number
  sourceId?: number
  title?: string
  url?: any
  id?: number | string
  post_id?: number | any
  coures_id?: number | any
  dataCourese?: any[]
}

const BannerHome: FC<Props> = ({ dataCourese, loadingCourses }) => {
  const carousel = useRef<AliceCarousel>(null)
  const [listSlider, setListSlider] = useState<any[]>([])
  const [isViewPost, setIsViewPost] = useState<boolean>(false)
  const [dataPost, setDataPost] = useState<any>({})
  const dispatch = useDispatch()
  const history = useHistory()
  const userID = useSelector((state: RootState) => state.login.userInfo.id)
  const [calledItems, setCalledItems] = useState<any>([])
  const { list_item_slider } = useSelector((state: RootState) => state.popup)
  const [dataPosts, setDataPosts] = useState<string[]>([])

  // const handleScroll = () => {
  //   const currentPosition = window.scrollY || window.pageYOffset
  //   setScrollPosition(currentPosition)
  // }

  // useEffect(() => {
  //   window.addEventListener('scroll', handleScroll)
  //   return () => {
  //     window.removeEventListener('scroll', handleScroll)
  //   }
  // }, [])

  const callItemCourse = async (id: number) => {
    dispatch(showLoading())
    const courseResult: any = await dispatch(actionCourseWithId(id))
    if (!_.isEmpty(courseResult)) {
      dispatch(actionSaveCurrentCourse(courseResult))
      dispatch(actionSaveCurrentSection(null))
      dispatch(actionSaveParentLessons(null))
      dispatch(actionSaveChildLesson(null))
      dispatch(hideLoading())
      history.push({
        pathname: `/study/${courseResult?.id}`,
        state: { showPopup: true }
      })
    } else {
      dispatch(hideLoading())
    }
  }

  useEffect(() => {
    getListNews({ offset: 0, limit: 10 })
  }, [])

  const getListNews = useCallback(
    async ({ offset, limit }: { offset: number; limit: number }) => {
      const response: any = await dispatch(
        actionGetNews({
          offset,
          limit,
          order: 'ASC'
        })
      )
      if (response?.data) {
        setDataPosts(response?.data?.data)
      }
    },
    [dispatch]
  )

  useEffect(() => {
    const initDataSlider = async () => {
      const response = await apiCore.get('/admin/advertisements/slider')
      if (response?.data?.data) {
        const data = response?.data?.data.filter((item: any) => {
          if (item.device === 'Cả hai' || item.device === 'Web') {
            return item.status === 'Hiện' // Chỉ hiển thị nếu device là 'Cả hai' hoặc 'Web' và status là 'Hiện'
          }
          return false // Loại bỏ các mục có device là 'Mobile'
        })

        dispatch(saveListDataSlider(data))
      }
    }

    initDataSlider()
  }, [])

  useEffect(() => {
    const getListSlider = async () => {
      const data: any = await dispatch(actionGetAllSlider('web'))
      if (!_.isEmpty(data)) {
        setListSlider(data)
      } else {
        setListSlider([])
      }
    }
    getListSlider()
  }, [dispatch])

  // const viewPost = async (id: number) => {
  //   const dataResult: any = await dispatch(actionPostWithId(id))
  //   if (!_.isEmpty(dataResult)) {
  //     setDataPost(dataResult)
  //     setIsViewPost(true)
  //   } else {
  //     openError('Không tìm thấy bài viết. Bạn vui lòng thử lại')
  //   }
  // }

  function findItemById(id: number) {
    return new Promise((resolve, reject) => {
      const itemPost = dataPosts?.find((item: any) => item.id === id)
      if (itemPost) {
        resolve(itemPost)
      } else {
        reject(new Error(`Item not found with id: ${id}`))
      }
    })
  }

  const callViewClick = async (item: SliderType) => {
    const body = {
      type: 2,
      user_id: userID,
      slideshow_popup_id: item?.id
    }
    await apiCore.post('/api/view-click', body)
  }

  const handleClickSlider = async (item: SliderType) => {
    if (item?.coures_id >= 0 && item?.coures_id != null) {
      console.log(item, 'item ==>>')

      callViewClick(item)
      callItemCourse(item?.coures_id || 0)
    } else if (item?.post_id >= 0 && item?.post_id != null) {
      const itemPost = await findItemById(item?.post_id || 0)

      dispatch(itemPopupSlider(itemPost))
      callViewClick(item)

      history.push('/posts')
      // viewPost(item?.sourceId || 0)
    } else if (item?.url?.length > 0 && item?.url.includes('https://')) {
      callViewClick(item)

      openInNewTab(item?.url)
    }
  }

  const renderRecent = () => {
    if (loadingCourses)
      return (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            marginTop: 100
          }}
        >
          <Spinner animation="grow" />
          <Spinner animation="grow" style={{ marginLeft: 5, marginRight: 5 }} />
          <Spinner animation="grow" />
        </div>
      )
    return (
      <>
        {dataCourese?.length == 0 ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              height: 250
            }}
          >
            <div style={{ flex: 1, paddingTop: 10 }}>
              <div style={{ textAlign: 'center' }}>Bạn chưa học bài nào?</div>
              <div style={{ textAlign: 'center' }}>Hãy bắt đầu học bài nhé!</div>
            </div>
            <img className="bg_course" src={empty_courses} style={{ height: 160, bottom: 0 }} />
          </div>
        ) : (
          <>
            <div
              style={{ display: 'flex', justifyContent: 'center', margin: 10, fontWeight: '500' }}
            >
              Hãy tiếp tục bài học nhé!
            </div>
            <AliceCarousel
              mouseTracking
              autoWidth
              ref={carousel}
              disableDotsControls
              renderPrevButton={({ isDisabled }: any) => (
                <FaChevronCircleLeft
                  className={`btn__left ${isDisabled ? 'disabled' : ''}`}
                  style={{ display: 'none' }}
                />
              )}
              renderNextButton={() => (
                <FaChevronCircleRight className={`btn__right'}`} style={{ display: 'none' }} />
              )}
            >
              {dataCourese?.map((item: any, index: number) => {
                const displayedPercentage =
                  item?.percentage !== 0 ? Math.round(item?.percentage) + '%' : '0%'
                return (
                  <div
                    style={{
                      position: 'relative',
                      width: 160,
                      backgroundColor: 'white',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center'
                    }}
                  >
                    <img
                      style={{ width: 140, height: 140, borderRadius: 10 }}
                      key={index}
                      src={convertUrl(item?.imageUrl, 'image') || ''}
                      alt=""
                    />
                    <div
                      style={{
                        width: 140,
                        height: 140,
                        borderRadius: 10,
                        position: 'absolute',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: `rgba(0, 0, 0, 0.24)`
                      }}
                    >
                      <img
                        style={{ width: 50, height: 50 }}
                        className="cursor_play"
                        src={ic_play}
                        onClick={async () => {
                          const response = await apiCore.post(`/course/${item.id}`)
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
                          callItemCourse(item?.id)
                        }}
                      />
                    </div>
                    {item?.model !== 'contest' && (
                      <div style={{ marginTop: 5, width: 140 }}>
                        <ProgressBar
                          now={(item?.percentage)}
                          style={{ backgroundColor: '#214B6F', height: 10 }}
                        />
                        <div
                          style={{
                            position: 'relative',
                            bottom: 10,
                            left: 0,
                            textAlign: 'center',
                            color: 'white',
                            fontSize: 9
                          }}
                        >
                          {displayedPercentage}
                        </div>
                      </div>
                    )}
                    <div
                      style={{ fontSize: 12, paddingLeft: 10, paddingRight: 10, fontWeight: '500' }}
                      className="two-line-text"
                    >
                      {item?.name}
                    </div>
                  </div>
                )
              })}
            </AliceCarousel>
          </>
        )}
      </>
    )
  }

  return (
    <div className="bannerHome">
      <div className='bg_banner'>
        <div className='slide_banner'>
          <AliceCarousel
            infinite
            autoPlay={true}
            autoPlayInterval={3000}
            mouseTracking
            autoWidth
            items={list_item_slider}
            onSlideChange={async (currentIndex: any) => {
              const currentItem = list_item_slider[currentIndex.item]
              if (!calledItems.includes(currentItem?.id)) {
                setCalledItems([...calledItems, currentItem?.id])
                if (currentItem?.type) {
                  const body = {
                    type: 1,
                    user_id: userID,
                    slideshow_popup_id: currentItem?.id
                  }
                  try {
                    const response = await apiCore.post('/api/view-click', body)
                  } catch (error) {
                    console.log('Lỗi khi gọi API:', error)
                  }
                }
              }
            }}
            ref={carousel}
            renderPrevButton={() => <FaChevronCircleLeft className={`ico__prev`} />}
            renderNextButton={() => <FaChevronCircleRight className={`ico__next`} />}
          >
            {list_item_slider?.map((item: SliderType, index: number) => (
              <div className="carousel__wrapper" key={index}>
                <div className="item__baner" onClick={() => handleClickSlider(item)}>
                  <img
                    onClick={() => console.log(item)}
                    className="image__baner"
                    key={index}
                    src={item?.imageUrl}
                    alt=""
                  />
                </div>
              </div>
            ))}
          </AliceCarousel>
        </div>
        <div
          style={{
            paddingLeft: 10,
            paddingRight: 10,
            borderRadius: 15,
            height: 250
          }}
          className="shadow-box render_recent"
        >
          {renderRecent()}
        </div>
      </div>
      <Modal
        size="xl"
        show={isViewPost}
        onHide={() => {
          setIsViewPost(false)
          setDataPost({})
        }}
      >
        <div className="p-3">
          <div className="d-flex justify-content-end mb-3">
            <small className="ms-auto">
              {dataPost?.createdAt
                ? format(new Date(dataPost?.createdAt), 'eeee, dd/MM/yyyy, HH:mm (z)', {
                    locale: viLocale
                  })
                : ''}
            </small>
          </div>
          <h1 className="fw-bold">{dataPost?.title}</h1>
          <Image width="100%" className="mb-3" src={convertUrl(dataPost?.imageUrl, 'image')} />
          <div className="html__container">{ReactHtmlParser(dataPost?.content)}</div>
          <div className="d-flex justify-content-end mb-3">
            <h4 className="fw-bold fst-italic">{dataPost?.createdUser?.email}</h4>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default BannerHome
