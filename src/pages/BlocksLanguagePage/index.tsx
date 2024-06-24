import React, { FC, useState, useEffect, useCallback } from 'react'

import BannerHome from '../Homepage/BannerHome'
import ListCourseEng from './ListCourseEng'
import DefaultNav from '../../components/Navbar'
import AssistiveTouch from '../../components/AssistiveTouch'
import AllCourse from '../Homepage/AllCourse'
import QuickStart from '../Homepage/QuickStartCourse'
import CategoryCourses from '../Homepage/CategoryCourses'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store'
import { Redirect, useHistory, useLocation } from 'react-router'
import CardCode from '../Homepage/CardCode'
import { apiCore } from '../../lib-core'
import { api2 } from '../../lib2'
import { STATUS } from '../Homepage/ModalNotify/constants'
import { actionGetListNotify, actionSetAffiliate } from '../../store/home/actions'
import PopupModal from '../Homepage/components/Popup'
import { clearDataListPopup, saveListPopup, setStatusItemPopup } from '../../store/popup/actions'
import Affiliate from '../Homepage/Affiliate'
import axios from 'axios'
import { api } from '../../lib'
import Popup from '../ArenaPage/components/Popup'
import ModalCustomArena from '../../components/ModalCustomArena'
import { Button } from 'react-bootstrap'
import PanelTab from '../../components/PanelTab'
import HeaderHome from '../Homepage/HeaderHome'
import ModalCourse from '../../components/ModalCourse'
import backArrow from '../../assets/images/left.png'
import _ from 'lodash'
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

const BlocksLanguagePage: FC<Props> = () => {
  const [currentKey, setCurrentKey] = useState('home')
  const [detailCourse, setDetailCourse] = useState({})
  const [listCourse, setListCourse] = useState([])
  const [categoryCourse, setCategoryCourse] = useState()
  const [dataCardCode, setDataCardCode] = useState({
    isOpen: false,
    status: 0
  })
  const pathCurrent = useLocation()
  const dispatch = useDispatch()
  const history = useHistory()
  const updateProfile = useSelector((state: RootState) => state.home.must_update)
  const showPopupVitan = useSelector((state: RootState) => state.home.show_popup_vitan)

  const userID = useSelector((state: RootState) => state.login.userInfo.id)
  const { fullname, avatar } = useSelector((state: RootState) => state.login.userInfo)
  const { list_popup, list_item_popup_show } = useSelector((state: RootState) => state.popup)
  const [dataMapping, setDataMapping] = useState<any>([])

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

  useEffect(() => {
    setCurrentKey('home')
  }, [pathCurrent])

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
        {currentKey === 'home' ? (
          <HeaderHome
            title={
              <div style={{ display: 'flex' }} className='say_hi'>
                {`Xin chào, `}
                <div style={{ fontWeight: 'bold' }}>{fullname}</div>
              </div>
            }
          />
        ) : currentKey === 'showAll' ? (
          <HeaderHome
            title={
              <div
                style={{ display: 'flex', alignItems: 'center' }}
                onClick={() => setCurrentKey('home')}
                className='say_hi'
              >
                <img src={backArrow} alt="bageSection" style={{ marginRight: 10, height: 16 }} />
                <div className="h4" style={{ margin: 0 }}>
                  {_.get(categoryCourse, 'name')}
                </div>
              </div>
            }
          />
        ) : (
          <></>
        )}
        {(currentKey === 'home' || currentKey === 'detail') && (
          <>
            <ListCourseEng
              setCurrentKey={(data: string) => setCurrentKey(data)}
              changeData={(value: any) => setDetailCourse(value)}
              setListCourse={(value: any) => setListCourse(value)}
              setCategoryCourse={(value: any) => setCategoryCourse(value)}
              setVisibleCategory={(value: boolean) => setVisibleCategory(value)}
            />
          </>
        )}
        {currentKey === 'showAll' && (
          <CategoryCourses
            changeData={(value: any) => setDetailCourse(value)}
            setCurrentKey={(data: string) => setCurrentKey(data)}
            categoryCourse={categoryCourse}
            setVisibleCategory={(value: boolean) => setVisibleCategory(value)}
          />
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

export default BlocksLanguagePage
