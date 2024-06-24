import React, { FC, useState, useEffect, useCallback } from 'react'

import BannerHome from './BannerHome'
import ListCourse from './ListCourse'
import DefaultNav from '../../components/Navbar'
import AssistiveTouch from '../../components/AssistiveTouch'
import AllCourse from './AllCourse'
import QuickStart from './QuickStartCourse'
import CategoryCourses from './CategoryCourses'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store'
import { Redirect, useHistory } from 'react-router'
import CardCode from './CardCode'
import { apiCore } from '../../lib-core'
import { api2 } from '../../lib2'
import { STATUS } from './ModalNotify/constants'
import { actionGetListNotify, actionSetAffiliate } from '../../store/home/actions'
import PopupModal from './components/Popup'
import { clearDataListPopup, saveListPopup, setStatusItemPopup } from '../../store/popup/actions'
import Affiliate from './Affiliate'
import axios from 'axios'
import { api } from '../../lib'
import Popup from '../ArenaPage/components/Popup'
import ModalCustomArena from '../../components/ModalCustomArena'
import { Button } from 'react-bootstrap'
import icon_notify from '../../assets/images/icon_notify.png'
import icon_book from '../../assets/images/icon_book.png'
import avatarUser from '../../assets/images/avatar.png'
import ic_logo from '../../assets/images/ico__logo.svg'
import PanelTab from '../../components/PanelTab'
import HeaderHome from './HeaderHome'
import ModalCourse from '../../components/ModalCourse'
import { actionGetLastestCourse } from '../../store/study/actions'
import PanelTabMobile from '../../components/PanelTab/PanelTabMobile'
interface Popup {
  id: number
  title: string
}

type Props = Record<string, unknown>
interface Popup {
  id: number
  title: string
}

const HomePage: FC<Props> = () => {
  const [currentKey, setCurrentKey] = useState('home')
  const [detailCourse, setDetailCourse] = useState({})
  const [listCourse, setListCourse] = useState([])
  const [categoryCourse, setCategoryCourse] = useState()
  const [dataCardCode, setDataCardCode] = useState({
    isOpen: false,
    status: 0
  })
  const [numNoti, SetNumNoti] = useState<number>(0)
  const dispatch = useDispatch()
  const history = useHistory()
  const updateProfile = useSelector((state: RootState) => state.home.must_update)
  const showPopupVitan = useSelector((state: RootState) => state.home.show_popup_vitan)

  const userID = useSelector((state: RootState) => state.login.userInfo.id)
  const { fullname, avatar } = useSelector((state: RootState) => state.login.userInfo)
  const { list_popup, list_item_popup_show } = useSelector((state: RootState) => state.popup)
  const [dataMapping, setDataMapping] = useState<any>([])
  const [coursesRecent, setCoursesRecent] = useState([])
  const [loadingCoursesRecent, setLoadingCoursesRecent] = useState<boolean>(false)
  const [currentPopupIndex, setCurrentPopupIndex] = useState(0)
  const currentPopup: Popup | any = dataMapping[currentPopupIndex]
  const [showModal, setShowModal] = useState(true)
  const [visibleCategory, setVisibleCategory] = useState<boolean>(false)
  const [isShowPopupVitan, setIsShowPopupVitan] = useState<boolean>(
    showPopupVitan == 1 ? true : false
  )

  useEffect(() => {
    setIsShowPopupVitan(showPopupVitan == 1 ? true : false)
    if (list_popup?.length > 0) {
      const nonMatchingItems = list_popup?.filter(
        (item) => !list_item_popup_show?.some((item2) => item.id === item2.id)
      )
      setDataMapping(nonMatchingItems)
    }
  }, [showModal, showPopupVitan])

  window.addEventListener('beforeunload', () => {
    dispatch(clearDataListPopup())
  })

  const handlePopupClose = async () => {
    await dispatch(setStatusItemPopup(currentPopup))

    if (currentPopupIndex < dataMapping.length - 1) {
      setCurrentPopupIndex(currentPopupIndex + 1)
      setShowModal(true)
    } else {
      setShowModal(false)
    }
  }

  const getCourseLasted = async () => {
    await dispatch(actionGetLastestCourse())
  }

  useEffect(() => {
    const getRecentcourses = async () => {
      try {
        setLoadingCoursesRecent(true)
        const res = await api2.post('/courses/recent')
        if (res?.status == 200) {
          setCoursesRecent(res.data.data)
          setLoadingCoursesRecent(false)
        } else {
          setCoursesRecent([])
          setLoadingCoursesRecent(false)
        }
      } catch (error) {
        setCoursesRecent([])
        setLoadingCoursesRecent(false)
        console.log(error)
      }
    }
    getRecentcourses()
  }, [])

  useEffect(() => {
    const initDataPopup = async () => {
      const body = {
        type: 1,
        user_id: userID
      }
      // TODO:
      const response = await apiCore.post('/admin/advertisements/getList', body)
      if (response?.data?.data) {
        const data = response?.data?.data.filter((item: any) => {
          if (item.type == 'popup') {
            if (item.device == 1 || item.device == 3) {
              return item.status == 1
            }
          }
          return false
        })

        dispatch(saveListPopup(data))
      }
    }
    initDataPopup()
  }, [dispatch])

  const handleClose = useCallback(() => {
    setDataCardCode({
      ...dataCardCode,
      isOpen: false
    })
  }, [dataCardCode])

  // useEffect(() => {
  //   getCourseLasted()
  //   const handleTabClose = (event: any) => {
  //     localStorage.setItem('showFubo', 'FUBO')
  //   }

  //   window.addEventListener('beforeunload', handleTabClose)
  //   return () => window.removeEventListener('beforeunload', handleTabClose)
  // }, [])

  const getNotifyNotRead = async () => {
    dispatch(actionGetListNotify({ status: STATUS.NOT_READ }))
  }

  useEffect(() => {
    getNotifyNotRead()
    const checkAffiliate = async () => {
      try {
        const res = await apiCore.post('/user/check-affiliate')
        if (res?.data?.code == 1) {
          const check: boolean = res?.data?.data?.check == 1
          if (check) {
            dispatch(actionSetAffiliate(true))
          } else {
            checkCardExpired()
          }
        }
      } catch (error) {
        checkCardExpired()
      }
    }
    checkAffiliate()
  }, [])

  const checkCardExpired = async () => {
    const res = await apiCore.post('/user/checkExpiry')
    if (res?.data?.data) {
      const data = {
        status: res?.data?.data?.check,
        isOpen: res?.data?.data?.check !== 2 ? true : false
      }
      setDataCardCode(data)
    }
  }

  if (!updateProfile)
    return (
      <div style={{ position: 'relative' }}>
        <ModalCourse
          isShow={visibleCategory}
          handleClose={() => setVisibleCategory(false)}
          data={detailCourse}
        />
        <PanelTab />
        <PanelTabMobile/>
        <div className="homePage">
          {currentKey === 'home' && (
            <HeaderHome
              title={
                <div style={{ display: 'flex' }} className='say_hi'>
                  {`Xin chào, `}
                  <div style={{ fontWeight: 'bold' }}>{fullname}</div>
                </div>
              }
            />
          )}
          <div className="content_has_tab">
            {(currentKey === 'home' || currentKey === 'detail') && (
              <>
                <BannerHome dataCourese={coursesRecent} loadingCourses={loadingCoursesRecent}/>
                <div style={{ height: 30 }} />
                <ListCourse
                  setCurrentKey={(data: string) => setCurrentKey(data)}
                  changeData={(value: any) => setDetailCourse(value)}
                  setListCourse={(value: any) => setListCourse(value)}
                  setCategoryCourse={(value: any) => setCategoryCourse(value)}
                  setVisibleCategory={(value: boolean) => setVisibleCategory(value)}
                />
              </>
            )}
            {currentKey === 'quick' && (
              <QuickStart
                setCurrentKey={(data: string) => setCurrentKey(data)}
                listCourse={listCourse}
              />
            )}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {currentPopup && (
              <PopupModal
                data={currentPopup}
                images={currentPopup?.imageUrl}
                showModal={showModal}
                description={currentPopup?.description}
                handleClose={handlePopupClose}
                slideshow_popup_id={currentPopup.id}
                url={currentPopup?.url}
              />
            )}
          </div>
        </div>

        {/* TODO: show popup vitan */}
        <ModalCustomArena
          show={isShowPopupVitan}
          isClose
          onHide={() => {
            setIsShowPopupVitan(false)
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              marginTop: 30,
              marginBottom: 30
            }}
          >
            <div style={{ fontSize: 24 }}>
              <p style={{ textAlign: 'center', padding: 0, margin: 0 }}>
                Bạn đang sử dụng tài khoản mặc định.
              </p>
              <p style={{ textAlign: 'center', padding: 0, marginTop: 15 }}>
                Vui lòng cập nhật thông tin tài khoản để học tập ổn định hơn!
              </p>
            </div>
            <Button
              variant="primary"
              onClick={() => {
                console.log('nghia nghia')
                history.push('update-usernew')
              }}
            >
              Cập nhật ngay
            </Button>
          </div>
        </ModalCustomArena>

        <CardCode
          dataCardCode={dataCardCode}
          handleClose={handleClose}
          reLoadData={() => console.log('HomePage')}
        />
        <Affiliate />
      </div>
    )
  return <Redirect to="/update-profile" />
}

export default HomePage
