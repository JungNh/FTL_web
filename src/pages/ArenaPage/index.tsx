import * as React from 'react'
import _ from 'lodash'
import { Form, InputGroup, Spinner } from 'react-bootstrap'
import { clearInterval as clearI, setInterval as setI } from 'worker-timers'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect, useHistory } from 'react-router-dom'
import isFuture from 'date-fns/isFuture'
import isPast from 'date-fns/isPast'
import { getArenaAuththentication } from '../../lib/arenaApi'
import Tab from './components/Tab'
import Popup from './components/Popup'
import { RootState } from '../../store'
import { Button } from '../../components'
import Carousel from './components/Carousel'
import ArenaItem from './components/ArenaItem'
import { ContestType } from '../../utils/enums'
import ContainerWithBack from '../../components/ContainerWithBack'
import { Context, Provider } from './components/LazyLoadingProvider'
import {
  contestRegistration,
  resetContestRegistration,
  saveIsOpenEditUser,
  saveTabOptions
} from '../../store/arena/actions'
import './styles.scss'
import { actionUserMeCore } from '../../store/login/actions'
import { openInNewTab } from '../../utils/common'
import { FaSearch } from 'react-icons/fa'
import { Accordion, Card, ListGroup } from 'react-bootstrap'

import PopupFormUser from '../QuizPage/components/PopupFormUser'
import { actionGetAllHomeSlide } from '../../store/home/actions'
import { getGifts } from '../../store/gifts/actions'
import ModalCustomArena from '../../components/ModalCustomArena'
let interval: any

export type ItemExam = {
  id: number
  name: string
  allow_register: boolean
  contest_id: number
  round_index: number
  datetime_from_register: string
  datetime_from_register_remaining_timestamp: number
  datetime_from_register_remaining_mili_timestamp: number
  exam_start_time: string
  exam_start_time_remaining_timestamp: number
  exam_start_time_remaining_mili_timestamp: number
  exam_end_time: string
  exam_end_time_remaining_timestamp: number
  exam_end_time_remaining_mili_timestamp: number
  is_active: boolean
  vip: boolean
  no_vip: boolean
  code_round: string
  bxh: true
  bonus: boolean
  contest_name: string
  contest_grade_name: string
  contest_subject_name: string
  is_registed: boolean
  is_dialed: boolean
  is_submitted: boolean
  contest_rules: string
  date_from: string
  date_to: string
  createdAt: string
}

const Index: React.FC = () => {
  // =================================================== LAYZY ===================================================
  const {
    data: contests,
    isLoading,
    error,
    isEnded,
    loadDataChunk: loadData,
    reset
  } = React.useContext(Context)
  const [element, setElement] = React.useState<HTMLDivElement | null>(null)
  const observer = React.useRef<IntersectionObserver | null>(null)
  const [tab, setTab] = React.useState(ContestType.UPCOMING)
  const loadDataChunk = () => loadData(tab.toLowerCase())
  const loader = React.useRef(loadDataChunk)
  const [displayPopupNoti, setDisplayPopupNoti] = React.useState<boolean>()
  const [userInfo, setUserInfo] = React.useState<any>()
  const dispatch = useDispatch()
  const [popupUpdateInfo, setPopUpdateInfo] = React.useState(false)
  const [checkVipUser, setCheckVipUser] = React.useState<any>()
  const [tokenLesson, setTokenLesson] = React.useState<string>('')
  const [checkStatusbtn, setCheckStatusBtn] = React.useState<string>('')
  const dataRound = useSelector((state: RootState) => state.arena.data_round_info)
  const [searchText, setSearchText] = React.useState<string>('')
  const [isReloadSlider, setIsReloadSlider] = React.useState<boolean>(false)
  const [isShowPopupGift, setIsShowPopupGift] = React.useState<boolean>(false)
  const user = useSelector((state: RootState) => state.login.userInfoCore)

  const getProfile = React.useCallback(async () => {
    const response: any = await dispatch(actionUserMeCore())
    if (response?.status === 200 && response?.data) {
      setUserInfo(response.data)
    }
  }, [])
  const datagift = useSelector((state: RootState) => state.gifts)

  // yyyy-mm-dd hh:mm:s
  const checkVip = async () => {
    const body = {
      email: user?.email,
      time: `${new Date().getFullYear()}-${
        new Date().getMonth() + 1 > 9 ? new Date().getMonth() + 1 : `0${new Date().getMonth() + 1}`
      }-${new Date().getDate() > 9 ? new Date().getDate() : `0${new Date().getDate()}`} ${
        new Date().getHours() > 9 ? new Date().getHours() : `0${new Date().getHours()}`
      }:${new Date().getMinutes() > 9 ? new Date().getMinutes() : `0${new Date().getMinutes()}`}:${
        new Date().getSeconds() > 9 ? new Date().getSeconds() : `0${new Date().getSeconds()}`
      }`
    }

    const response = await fetch(`${process.env.REACT_APP_API_V2}/arena/check-vip`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        auth: `${process.env.REACT_APP_ARENA_AUTH}`,
        'Content-Type': 'application/json'
      }
    })
      .then((res) => res.json())
      .then((success) => {
        if (success?.data?.vip) setCheckVipUser(true)
        else setCheckVipUser(false)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  React.useEffect(() => {
    if (user) checkVip()
  }, [user])

  React.useEffect(() => {
    getProfile()
  }, [])

  React.useEffect(() => {
    observer.current = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0]
        if (firstEntry.isIntersecting && loader.current) loader.current()
      },
      { threshold: 1 }
    )
  }, [])

  React.useEffect(() => {
    loader.current = loadDataChunk
  }, [loadDataChunk])

  React.useEffect(() => {
    loader.current = loadDataChunk
  }, [loadDataChunk])

  React.useEffect(() => {
    if (element) {
      observer.current?.observe(element)
    }
    return () => {
      if (element) {
        observer.current?.unobserve(element)
      }
    }
  }, [element])
  // =================================================== HOOKS ===================================================
  const history = useHistory()
  const {
    contests_registration_succeed_id,
    mode,
    is_registed,
    error_message,
    is_open_popup_edit_user,
    tab_option
  } = useSelector((state: RootState) => state.arena)

  const [arr, setArray] = React.useState<Contest[]>([])

  React.useEffect(() => {
    getArrayValue()
    interval = setI(() => {
      getArrayValue()
    }, 10000)
    return () => clearI(interval)
  }, [contests, tab])

  React.useEffect(() => {
    reset()
    dispatch(actionGetAllHomeSlide({ sevice: 'sevice' }))

    return () => {
      dispatch(saveIsOpenEditUser(false))
      dispatch(resetContestRegistration())
    }
  }, [tab])

  const contestRegistrationMessage = () => {
    const data = contests.find((contest) => contest.id === contests_registration_succeed_id)
    return data
      ? `${data.contest_name.toUpperCase()} - ${data.contest_grade_name} ${data?.name}`
      : ''
  }

  const getArrayValue = React.useCallback(() => {
    const arr = contests.filter((contest) => {
      const start = new Date(contest?.exam_start_time)
      const end = new Date(contest?.exam_end_time)
      if (tab === ContestType.HAPPENNING && isPast(start) && isFuture(end)) return true
      if (tab === ContestType.HAPPENED && isPast(start)) return true
      if (tab === ContestType.UPCOMING && isFuture(end)) return true
      return false
    })
    setArray(arr)
  }, [contests, tab])

  React.useEffect(() => {
    dispatch(getGifts())
  }, [])

  React.useEffect(() => {
    if (user?.class && user?.class !== '') {
      setDisplayPopupNoti(false)
      return
    } else setDisplayPopupNoti(true)
  }, [user])

  React.useEffect(() => {
    const success = () => history.push('/arena')
    const failed = () => history.push('/home')
    getArenaAuththentication(success, failed).catch(failed)
  }, [])

  const getTab = () => {
    switch (tab) {
      case 'HAPPENNING':
        return 'Hiện tại chưa có cuộc thi nào đang diễn ra!'
      case 'UPCOMING':
        return 'Hiện tại chưa có cuộc thi nào sắp diễn ra!'

      case 'HAPPENED':
        return 'Hiện tại chưa có cuộc thi nào đã diễn ra!'

      default:
        break
    }
  }

  const loadDataItem = () => {
    let dataList: any
    if (searchText.length > 0) {
      dataList = arr.filter((item) =>
        item.contest_name.toLowerCase().includes(searchText.toLowerCase())
      )
    } else {
      dataList = arr
    }

    // const data = groupBy('contest_id', dataList)
    const newArrList: any[] = []

    _.chain(dataList)
      .groupBy('contest_id')
      .transform(function (result: any, obj: any, type: any) {
        const sortedChildren = _.orderBy(obj, 'exam_start_time', 'asc')

        return newArrList?.push({
          contest_id: type,
          parent: {
            id: obj[0].id,
            contest_name: obj[0].contest_name,
            bonus: obj[0].bonus,
            item: obj[0].contest_grade_name,
            contest_id: obj[0].contest_id,
            round_index: obj[0].round_index,
            datetime_from_register: obj[0].datetime_from_register,
            datetime_from_register_remaining_mili_timestamp:
              obj[0].datetime_from_register_remaining_mili_timestamp,
            datetime_from_register_remaining_timestamp:
              obj[0].datetime_from_register_remaining_timestamp,
            exam_start_time: obj[0].exam_end_time,
            exam_start_time_remaining_timestamp: obj[0].exam_start_time_remaining_timestamp,
            exam_start_time_remaining_mili_timestamp:
              obj[0].exam_start_time_remaining_mili_timestamp,
            exam_end_time: obj[0].exam_end_time,
            exam_end_time_remaining_timestamp: obj[0].exam_end_time_remaining_timestamp,
            exam_end_time_remaining_mili_timestamp: obj[0].exam_end_time_remaining_mili_timestamp,
            date_from: obj[0].date_from,
            date_to: obj[0].date_to,
            contest_rules: obj[0].contest_rules
          },
          children: sortedChildren
        })
      })
      .value()
    // console.log(newArrList, 'newArrList==>>')
    const sortedData = _.orderBy(newArrList, ['parent.date_from'], ['desc'])

    return sortedData.length > 0 ? (
      sortedData?.map((item, index) => {
        return (
          <ArenaItem
            type={tab}
            userInfo={user}
            data={item.parent}
            children={_.orderBy(item.children, ['exam_start_time'], ['desc'])}
            key={index}
            // popupUpdateInfo={popupUpdateInfo}
            // setPopUpdateInfo={setPopUpdateInfo}
            checkVipUser={checkVipUser !== undefined ? checkVipUser : false}
            tokenLesson={tokenLesson}
            setCheckStatusBtn={setCheckStatusBtn}
          />
        )
      })
    ) : (
      <div
        style={{
          fontSize: 20,
          display: 'flex',
          justifyContent: 'center',
          fontWeight: '400',
          marginTop: 20
        }}
      >
        Không tìm thấy tên cuộc thi !
      </div>
    )
  }

  const handleLoginCourse = () => {
    if (dataRound?.id) {
      if (dataRound?.is_submitted) {
        history.push(`/contest-summary/${dataRound.id}`)
      } else if (dataRound?.is_registed) {
        history.push(`/quiz/${dataRound.id}`)
      } else {
        dispatch(contestRegistration(dataRound?.id, ContestType.HAPPENNING))
      }
    }
  }

  const handleUpComing = () => {
    if (dataRound?.id) {
      if (dataRound?.is_registed) {
        history.push(`/join/${dataRound.id}`)
      } else {
        dispatch(contestRegistration(dataRound?.id))
        // dispatch(contestRegistration(dataRound?.id, ContestType.UPCOMING))
      }
    }
  }

  return (
    <ContainerWithBack to="/home">
      <div className="arenapage__component">
        <div className="button__home">
          <Button.Shadow
            className="button__hd"
            color="green"
            onClick={() =>
              openInNewTab(
                'https://futurelang.startup40.com/huong-dan-dang-ki-cuoc-thi-futurelang-english-stars-2023'
              )
            }
            content={
              <div>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.66668 2.99967H0.333344V12.333C0.333344 13.0663 0.933344 13.6663 1.66668 13.6663H11V12.333H1.66668V2.99967ZM12.3333 0.333008H4.33334C3.60001 0.333008 3.00001 0.933008 3.00001 1.66634V9.66634C3.00001 10.3997 3.60001 10.9997 4.33334 10.9997H12.3333C13.0667 10.9997 13.6667 10.3997 13.6667 9.66634V1.66634C13.6667 0.933008 13.0667 0.333008 12.3333 0.333008ZM12.3333 9.66634H4.33334V1.66634H12.3333V9.66634ZM5.66668 4.99967H11V6.33301H5.66668V4.99967ZM5.66668 6.99967H8.33334V8.33301H5.66668V6.99967ZM5.66668 2.99967H11V4.33301H5.66668V2.99967Z"
                    fill="#FFB800"
                  />
                </svg>

                <span> Hướng dẫn thi</span>
              </div>
            }
          />

          <Button.Shadow
            className="button__gift"
            color="blue"
            onClick={() => {
              if (datagift.gifts?.length > 0) {
                setIsShowPopupGift(false)
                history.push('/gifts')
              } else {
                setIsShowPopupGift(true)
              }
            }}
            content={
              <div>
                <svg
                  width="16"
                  height="15"
                  viewBox="0 0 16 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14.4 8.68535V14.2107C14.4 14.42 14.3157 14.6208 14.1657 14.7688C14.0157 14.9168 13.8122 15 13.6 15H2.4C2.18783 15 1.98434 14.9168 1.83431 14.7688C1.68429 14.6208 1.6 14.42 1.6 14.2107V8.68535H14.4ZM10 0.00270096C10.4725 0.00254152 10.9374 0.120371 11.3513 0.345215C11.7653 0.57006 12.1148 0.894606 12.3674 1.28863C12.6199 1.68265 12.7674 2.13333 12.7959 2.5987C12.8244 3.06406 12.733 3.52898 12.5304 3.95015L15.2 3.94936C15.4122 3.94936 15.6157 4.03252 15.7657 4.18055C15.9157 4.32858 16 4.52935 16 4.73869V7.10668C16 7.31603 15.9157 7.5168 15.7657 7.66483C15.6157 7.81285 15.4122 7.89602 15.2 7.89602H0.8C0.587827 7.89602 0.384344 7.81285 0.234315 7.66483C0.0842854 7.5168 0 7.31603 0 7.10668V4.73869C0 4.52935 0.0842854 4.32858 0.234315 4.18055C0.384344 4.03252 0.587827 3.94936 0.8 3.94936L3.4696 3.95015C3.1846 3.35947 3.1213 2.68817 3.29096 2.05575C3.46062 1.42334 3.85223 0.870842 4.39608 0.496627C4.93993 0.122412 5.60072 -0.0492408 6.26083 0.0122263C6.92093 0.0736933 7.53751 0.364291 8.0008 0.832289C8.26083 0.569067 8.57175 0.360014 8.91516 0.217515C9.25856 0.0750156 9.62746 0.00196856 10 0.00270096ZM6 1.58136C5.69183 1.58151 5.39552 1.69864 5.17249 1.90847C4.94946 2.1183 4.81679 2.40475 4.80198 2.70846C4.78717 3.01217 4.89135 3.30987 5.09294 3.53985C5.29453 3.76984 5.57806 3.91449 5.8848 3.94383L6 3.94936H7.2V2.76536C7.19999 2.47103 7.08886 2.18726 6.88831 1.96938C6.68775 1.75151 6.41213 1.61514 6.1152 1.58689L6 1.58136ZM10 1.58136L9.8848 1.58689C9.6075 1.6131 9.34808 1.73369 9.15103 1.92797C8.95398 2.12225 8.83157 2.37812 8.8048 2.6517L8.8 2.76536V3.94936H10L10.1152 3.94383C10.412 3.91544 10.6875 3.77902 10.8879 3.56116C11.0884 3.34329 11.1994 3.0596 11.1994 2.76536C11.1994 2.47113 11.0884 2.18743 10.8879 1.96957C10.6875 1.7517 10.412 1.61528 10.1152 1.58689L10 1.58136Z"
                    fill="#FFB800"
                  />
                </svg>
                <span> Quà của bạn</span>
              </div>
            }
          />
        </div>
        <div className="arenapage__wrapper">
          <Carousel />
          {/* TODO: Seach */}
          <div className="form-search">
            <div className="input-group">
              <input
                type="text"
                placeholder="Tên cuộc thi"
                className="search-input"
                onChange={(e) => setSearchText(e.target.value)}
              />
              <div className="button-search" onClick={() => console.log(searchText, 'searchText')}>
                <FaSearch className="search-icon" />
                <span className="search-text">Tìm kiếm</span>
              </div>
            </div>
          </div>
          <Tab tab={tab} setTab={setTab} />
          {/* const [popupUpdateInfo, setPopUpdateInfo] = React.useState(false) */}
          <div className="content__list">
            {!_.isEmpty(arr) ? (
              <>{loadDataItem()}</>
            ) : (
              <p style={{ textAlign: 'center', fontSize: 20, padding: 20 }}>{getTab()}</p>
            )}
            {isLoading && <Spinner animation="grow" className="loading__icon" />}
            {!isLoading && !error && !isEnded && <div ref={setElement} />}
          </div>
        </div>
        {/* TODO: POPUP */}

        <ModalCustomArena show={isShowPopupGift} isClose onHide={() => setIsShowPopupGift(false)}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 20,
              flexDirection: 'column'
            }}
          >
            <div>
              <p style={{ textAlign: 'center' }}>
                <b>
                  {' '}
                  Bạn chưa có phần quà nào , <br />
                  vui lòng quay lại sau!
                </b>
              </p>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 20,
                marginBottom: 20
              }}
            >
              <Button.Shadow
                content="XÁC NHẬN"
                color="blue"
                style={{
                  width: 150,
                  fontSize: 15
                }}
                onClick={() => setIsShowPopupGift(false)}
              />
            </div>
          </div>
        </ModalCustomArena>

        <Popup
          open={
            !!contests_registration_succeed_id &&
            tab_option === ContestType.UPCOMING &&
            error_message === null
          }
          onClose={() => {
            dispatch(resetContestRegistration())
            dispatch(
              contestRegistration(dataRound?.id, ContestType.UPCOMING, () =>
                history.push(`/join/${dataRound.id}`)
              )
            )
          }}
        >
          <p>
            Chúc mừng bạn đã đăng kí tham gia <br />
            <b>{contestRegistrationMessage()}</b> <br />
            thành công.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div className="popup_button" style={{ width: 200 }}>
              <Button.Shadow
                content="Xác nhận"
                onClick={() => {
                  dispatch(resetContestRegistration())
                  dispatch(
                    contestRegistration(dataRound?.id, ContestType.UPCOMING, () =>
                      history.push(`/join/${dataRound.id}`)
                    )
                  )
                }}
              />
            </div>
          </div>
        </Popup>

        <Popup
          open={!!error_message && error_message !== '-10'}
          onClose={() => dispatch(resetContestRegistration())}
        >
          <p>{error_message}</p>
        </Popup>
        <Popup
          open={!!error_message && error_message === '-10'}
          onClose={() => dispatch(resetContestRegistration())}
        >
          {checkStatusbtn === 'join' ? (
            <p>
              <b>Quá hạn</b> thời gian tham gia thi <br />
              <b>{contestRegistrationMessage()}</b>
            </p>
          ) : (
            <p>
              Chưa đến thời gian đăng kí <br />
              <b>{contestRegistrationMessage()}</b>
            </p>
          )}
        </Popup>
        <Popup
          open={
            !!contests_registration_succeed_id &&
            !is_registed &&
            tab_option === ContestType.HAPPENNING
          }
          onClose={() => dispatch(resetContestRegistration())}
        >
          <p>
            <b>{contestRegistrationMessage()} </b> đang diễn ra rồi. <br />
            Vào thi ngay bạn nhé !
          </p>
          <div className="popup_button">
            <Button.Shadow
              content="VÀO THI"
              onClick={() => history.push(`/quiz/${contests_registration_succeed_id}`)}
            />
          </div>
        </Popup>
        {!!contests_registration_succeed_id &&
          is_registed &&
          tab_option === ContestType.HAPPENNING && (
            <Redirect to={`/quiz/${contests_registration_succeed_id}`} />
          )}
      </div>
      <PopupFormUser
        // ischeckTypeCode={ischeckTypeCode}
        open={is_open_popup_edit_user}
        onClose={() => dispatch(saveIsOpenEditUser(false))}
        userInfo={user}
        // setFormUser={setFormUser}
        // setPopUpdateInfo={setPopUpdateInfo}
        // setPopupSubmit={setPopupSubmit}
        isVisible={is_open_popup_edit_user}
        // questions={questions}
        onSubmit={() => dispatch(saveIsOpenEditUser(false))}
        handleLoginCourse={handleLoginCourse}
        statusBtn={tab_option}
        handleUpcoming={handleUpComing}
        // formUser={formUser}
        code={dataRound?.code_round}
        ischeckTypeCode={dataRound?.code_round}
        dataItem={dataRound}
      />
    </ContainerWithBack>
  )
}

const ArenaPage: React.FC = () => {
  return (
    <Provider>
      <Index />
    </Provider>
  )
}

export default ArenaPage
