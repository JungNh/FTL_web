import * as React from 'react'
import type { FC } from 'react'
import { format } from 'date-fns'
import { useHistory } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import './styles.scss'
import Button from '../../../../components/Button'
import { ContestType } from '../../../../utils/enums'
import {
  contestRegistration,
  saveDataRoundInfo,
  saveTabOptions
} from '../../../../store/arena/actions'
import PopupContainer from '../../../../components/PopupContainer'
import PopupArena from '../../../QuizPage/components/PopupArena'
import { actionUserMeCore } from '../../../../store/login/actions'
import ModalUpdate from '../../../UserSetting/components/TabMyAcc/ModalUpdate'
import PopupFormUser from '../../../QuizPage/components/PopupFormUser'
import PopupNotifiText from '../../../QuizPage/components/PopupNotifiText'
import PopupNotVip from '../../../QuizPage/components/PopupNotVip'
import Vip from '../../../../assets/images/vip.png'
import IconNor from '../../../../assets/images/nor_mem.png'
import AllUser from '../../../../assets/images/all.png'
import { RootState } from '../../../../store'
import { ItemExam } from '../../index'
import { CSSTransition } from 'react-transition-group'
import { FaArrowDown, FaArrowRight } from 'react-icons/fa'
import { openInNewTab } from '../../../../utils/common'
import ModalCustomArena from '../../../../components/ModalCustomArena'
import viLocale from 'date-fns/locale/vi'
import ReactHtmlParser from 'react-html-parser'
import { Modal } from 'react-bootstrap'

type Props = {
  type: ContestType
  data: ItemExam
  setPopUpdateInfo?: any
  popupUpdateInfo?: boolean
  checkVipUser: any
  tokenLesson: string
  setCheckStatusBtn: any
  userInfo: any
  children: any
}

const ArenaItem: FC<Props> = ({
  type,
  data,
  setPopUpdateInfo,
  popupUpdateInfo,
  checkVipUser,
  setCheckStatusBtn,
  tokenLesson,
  children,
  userInfo
}) => {
  const [popupSubmit, setPopupSubmit] = React.useState(false)
  const [questions, setQuestions] = React.useState<Question[]>([])
  // const [userInfo, setUserInfo] = React.useState<any>()
  const [showModal, setShowModal] = React.useState(false)
  const [formUser, setFormUser] = React.useState<boolean>(true)
  const [ischeckTypeCode, setIscheckTypeCode] = React.useState<boolean>(false)
  const [idLesson, setIdLesson] = React.useState<any>()
  const [checkVipLesson, setCheckVipLesson] = React.useState<any>(false)
  const [checkNoVipLesson, setCheckNoVipLesson] = React.useState<any>(false)
  const [displayPopupNoVip, setdisplayPopupNoVip] = React.useState<boolean>(false)
  const [code, setcode] = React.useState<string>('')
  const [statusBtn, setStatusBtn] = React.useState<string>('')
  const dispatch = useDispatch()
  const dataRound = useSelector((state: RootState) => state.arena.data_round_info)
  const { tab_option } = useSelector((state: RootState) => state.arena)
  const [isClickItemExam, setIsClickItemExam] = React.useState<boolean>(false)
  const [isShowPopupContest, setIsShowPopupContest] = React.useState<boolean>(false)
  const user = useSelector((state: RootState) => state.login.userInfoCore)
  const [isCloseVip, setIsCloseVip] = React.useState<boolean>(false)
  const [messBlockRound, setMessBlockRound] = React.useState<string>('')
  const [nextRoundCourse, setNextRoundCourse] = React.useState<boolean>(false)
  // const [checkDk, setCheckDk] = React.useState<boolean>(false)
  // console.log(tab_option, 'tab_option')

  const onSubmit = () => {
    setPopupSubmit(false)
  }

  const history = useHistory()
  const classes: any = React.useMemo(() => {
    const infomation = {
      title: data?.contest_name,
      subTitle: data?.name + ' - ' + data?.contest_grade_name,
      date_from: format(new Date(data?.date_from), 'HH:mm'),
      date_to: format(new Date(data?.date_to), 'HH:mm'),
      date_start: format(new Date(data?.date_from), 'dd/MM/yyyy'),
      date_end: format(new Date(data?.date_to), 'dd/MM/yyyy'),
      exam_end: format(new Date(data?.exam_end_time), 'dd/MM/yyyy')
    }

    switch (type) {
      case ContestType.HAPPENNING:
        return {
          ...infomation,
          wrapper: 'arenaitem__component--1',
          type: 'Đang diễn ra',
          buttonText: data?.is_submitted
            ? 'XEM KẾT QUẢ'
            : data?.is_registed
            ? 'VÀO THI'
            : 'THAM GIA',
          hidden: false
        }
      case ContestType.UPCOMING:
        return {
          ...infomation,
          wrapper: 'arenaitem__component--2',
          type: 'Sắp diễn ra',
          buttonText: data?.is_registed ? 'PHÒNG CHỜ' : 'ĐĂNG KÝ THAM GIA',
          hidden: false
        }
      case ContestType.HAPPENED:
        return {
          ...infomation,
          wrapper: 'arenaitem__component--3',
          type: 'Đã diễn ra',
          buttonText: 'XEM KẾT QUẢ',
          // hidden: !data?.is_registed,
          hidden: false
        }
      default:
        return {
          wrapper: '',
          type: ''
        }
    }
  }, [type, data])

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

  const detailContest = async (id: number) => {
    const body = {
      round_id: id
    }
    return await fetch(
      `${process.env.REACT_APP_END_POINT_ARENA}/contests/get_contest_round_info/`,
      {
        method: 'POST',
        headers: {
          Authorization: `${localStorage.getItem('arena-token')}`
        },
        body: JSON.stringify(body)
      }
    )
      .then(async (res) => {
        if (res.ok) {
          return res.json()
        }
      })
      .then((success) => {
        if (success?.c == -1) {
          setMessBlockRound(success.m)
          setNextRoundCourse(false)
        } else if (success?.c == -99) {
          setMessBlockRound(success.m)
          setNextRoundCourse(false)
        } else {
          setNextRoundCourse(true)
          console.log(success, 'success info ')
          dispatch(saveDataRoundInfo(success.d[0]))

          setCheckVipLesson(success.d[0].vip)
          setCheckNoVipLesson(success.d[0].no_vip)
          setcode(success?.d[0].code_round)
          // saveDataRoundInfo(success.d[0])
        }
        return success
      })
  }

  // React.useEffect(() => {
  //   if (idLesson > 0) detailContest()
  // }, [idLesson])

  const checkDk =
    checkVipLesson !== checkNoVipLesson &&
    typeof checkNoVipLesson === 'boolean' &&
    typeof checkVipLesson === 'boolean' &&
    (checkNoVipLesson === checkVipUser || checkVipLesson === !checkVipUser)

  React.useEffect(() => {
    if (checkDk) {
      // setPopupSubmit(false)
      setIsCloseVip(true)
      setdisplayPopupNoVip(true)
    } else {
      setIsCloseVip(false)
      setdisplayPopupNoVip(false)
    }
  }, [checkVipLesson, checkNoVipLesson, checkDk])

  const ref: any = React.useRef(null)

  const handleOnClickOpen = () => {
    console.log(children, 'children')
    isClickItemExam ? setIsClickItemExam(false) : setIsClickItemExam(true)
  }

  const handleClickItem = async (item: ItemExam) => {
    console.log('item allow_register ', item.allow_register)

    switch (type) {
      case ContestType.HAPPENNING:
        console.log('dang xay ra ')

        dispatch(saveDataRoundInfo(item))
        dispatch(saveTabOptions(ContestType.HAPPENNING))
        // console.log(tab_option, '-----tab_option')

        setStatusBtn('HAPPENNING')
        setCheckStatusBtn('join')
        setIscheckTypeCode(true)
        setIdLesson(item?.id)
        const response = await detailContest(item?.id)
        console.log(response, 'nghia nfghias')
        if (response.c == 1 || item?.is_submitted) {
          if (item.allow_register) {
            if (item?.is_submitted) {
              if (item?.id) {
                if (item?.is_submitted) {
                  history.push(`/contest-summary/${item.id}`)
                } else if (item?.is_registed) {
                  history.push(`/quiz/${item.id}`)
                } else {
                  dispatch(contestRegistration(item?.id, ContestType.HAPPENNING))
                }
              }
            } else if (!checkDk) setPopupSubmit(true)
          } else {
            console.log(item?.is_registed, 'item?.is_registed')

            if (item?.id) {
              if (item?.is_submitted) {
                history.push(`/contest-summary/${item.id}`)
              } else if (item?.is_registed) {
                history.push(`/quiz/${item.id}`)
              } else {
                dispatch(contestRegistration(item?.id, ContestType.HAPPENNING))
              }
            }
          }
        }
        return
      case ContestType.UPCOMING:
        dispatch(saveDataRoundInfo(item))
        dispatch(saveTabOptions(ContestType.UPCOMING))
        setCheckStatusBtn('')
        setStatusBtn('UPCOMING')
        setIscheckTypeCode(true)
        setIdLesson(item?.id)
        const res = await detailContest(item?.id)
        console.log('tab sắp diễn ra ', item.allow_register, 'item?.is_registed', item?.is_registed)

        if (res.c == 1) {
          if (item.allow_register) {
            if (item?.is_registed) {
              if (item?.id) {
                if (item?.is_registed) {
                  history.push(`/join/${item.id}`)
                } else {
                  dispatch(contestRegistration(item?.id, ContestType.UPCOMING))
                }
              }
            } else if (!checkDk) {
              setPopupSubmit(true)
            }
          } else {
            if (item?.id) {
              if (item?.is_registed) {
                history.push(`/join/${item.id}`)
              } else {
                dispatch(contestRegistration(item?.id, ContestType.UPCOMING))
              }
            }
          }
        }
        return
      case ContestType.HAPPENED:
        dispatch(saveDataRoundInfo(item))
        dispatch(saveTabOptions(ContestType.HAPPENED))
        if (item?.id) history.push(`/contest-summary/${item.id}`)
        return
      default:
        return {
          wrapper: '',
          type: ''
        }
    }
  }
  const handleGetText = (item: ItemExam) => {
    switch (type) {
      case ContestType.HAPPENNING:
        return item?.is_submitted ? 'XEM KẾT QUẢ' : data?.is_registed ? 'VÀO THI' : 'THAM GIA'
      case ContestType.UPCOMING:
        return item?.is_registed ? 'PHÒNG CHỜ' : 'ĐĂNG KÝ THAM GIA'
      case ContestType.HAPPENED:
        return 'XEM KẾT QUẢ'
      default:
        return
    }
  }

  return (
    <>
      <div className={`arenaitem__component ${classes.wrapper} `} onClick={handleOnClickOpen}>
        <div className="arenaitem__filter" />
        <div className="arenaitem__wrapper">
          <div className="arenaitem__wrapper-left">
            <h1>{classes.title}</h1>
            {/* <h3>{classes.subTitle}</h3>
            <span>{classes.type}</span> */}
          </div>
          {/* <img
            src={data?.vip === data?.no_vip ? AllUser : data?.vip ? Vip : IconNor}
            className="img_vip tooltipImg"
          />  */}
          {/* <div className="tooltipBlock">
            <img
              className="size_of_img img_vip"
              src={data?.vip === data?.no_vip ? AllUser : data?.vip ? Vip : IconNor}
              alt="Image"
            />
            <span className="tooltiptext">
              {data?.vip === data?.no_vip
                ? 'Vòng thi cho tất cả user'
                : data?.vip
                ? 'Vòng thi cho các user Vip'
                : 'Vòng thi cho các user thường'}
            </span>
          </div> */}
          {data?.contest_rules.length > 0 && (
            <div
              className={`arenaitem__wrapper-right`}
              style={{ display: classes.hidden ? 'none' : '' }}
            >
              <Button.Shadow
                content={'Thể lệ'}
                onClick={() => {
                  setIsShowPopupContest(true)
                }}
                color="white"
              />
            </div>
          )}
        </div>

        <div className="arenaitem__badge">
          Bắt đầu :
          <span>
            <svg
              width="13"
              height="15"
              viewBox="0 0 13 15"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.5571 3.54864L11.6065 2.51077L12.6277 3.52079L11.5783 4.55866C12.6153 5.84238 13.1159 7.47006 12.9773 9.10742C12.8388 10.7448 12.0716 12.2675 10.8334 13.3629C9.59511 14.4583 7.97978 15.0432 6.31912 14.9975C4.65846 14.9518 3.07853 14.2789 1.90381 13.1171C0.729086 11.9552 0.0487496 10.3926 0.00251971 8.75019C-0.0437101 7.10774 0.547676 5.51013 1.65522 4.28545C2.76277 3.06078 4.3024 2.30201 5.95792 2.16499C7.61344 2.02796 9.25917 2.52307 10.5571 3.54864V3.54864ZM6.49968 13.5717C7.16359 13.5717 7.82099 13.4424 8.43436 13.1911C9.04772 12.9398 9.60504 12.5715 10.0745 12.1072C10.5439 11.6429 10.9163 11.0917 11.1704 10.4851C11.4245 9.87842 11.5552 9.22823 11.5552 8.5716C11.5552 7.91498 11.4245 7.26479 11.1704 6.65815C10.9163 6.05151 10.5439 5.5003 10.0745 5.036C9.60504 4.5717 9.04772 4.20339 8.43436 3.95211C7.82099 3.70083 7.16359 3.5715 6.49968 3.5715C5.15887 3.5715 3.87297 4.0983 2.92487 5.036C1.97677 5.9737 1.44413 7.24549 1.44413 8.5716C1.44413 9.89771 1.97677 11.1695 2.92487 12.1072C3.87297 13.0449 5.15887 13.5717 6.49968 13.5717V13.5717ZM5.77746 5.0001H7.2219V9.2859H5.77746V5.0001ZM3.6108 0H9.38857V1.4286H3.6108V0Z"
                fill="currentColor"
              />
            </svg>
            {classes.date_from}
          </span>
          <span>
            <svg
              width="13"
              height="11"
              viewBox="0 0 13 11"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.55 0V1.1H8.45V0H9.75V1.1H12.35C12.5224 1.1 12.6877 1.15795 12.8096 1.26109C12.9315 1.36424 13 1.50413 13 1.65V10.45C13 10.5959 12.9315 10.7358 12.8096 10.8389C12.6877 10.9421 12.5224 11 12.35 11H0.65C0.477609 11 0.312279 10.9421 0.190381 10.8389C0.0684819 10.7358 0 10.5959 0 10.45V1.65C0 1.50413 0.0684819 1.36424 0.190381 1.26109C0.312279 1.15795 0.477609 1.1 0.65 1.1H3.25V0H4.55ZM11.7 3.85H1.3V9.9H11.7V3.85ZM8.4734 5.0248L9.3925 5.8025L6.175 8.525L3.8766 6.5802L4.797 5.8025L6.17565 6.9696L8.47405 5.0248H8.4734Z"
                fill="currentColor"
              />
            </svg>
            Ngày {classes.date_start}
          </span>
        </div>
        <div
          style={{
            position: 'absolute',
            top: data?.contest_rules.length > 0 ? '83px' : '54px',
            right: '70px',
            width: '30px',
            height: '30px',
            zIndex: 999,
            borderRadius: '15px',
            boxShadow:
              'rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset',
            justifyContent: 'center',
            alignItems: 'center',
            display: 'flex',
            cursor: 'pointer'
          }}
        >
          {isClickItemExam ? <FaArrowDown /> : <FaArrowRight />}
        </div>

        <div className="arenaitem__badge">
          Kết thúc :
          <span>
            <svg
              width="13"
              height="15"
              viewBox="0 0 13 15"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.5571 3.54864L11.6065 2.51077L12.6277 3.52079L11.5783 4.55866C12.6153 5.84238 13.1159 7.47006 12.9773 9.10742C12.8388 10.7448 12.0716 12.2675 10.8334 13.3629C9.59511 14.4583 7.97978 15.0432 6.31912 14.9975C4.65846 14.9518 3.07853 14.2789 1.90381 13.1171C0.729086 11.9552 0.0487496 10.3926 0.00251971 8.75019C-0.0437101 7.10774 0.547676 5.51013 1.65522 4.28545C2.76277 3.06078 4.3024 2.30201 5.95792 2.16499C7.61344 2.02796 9.25917 2.52307 10.5571 3.54864V3.54864ZM6.49968 13.5717C7.16359 13.5717 7.82099 13.4424 8.43436 13.1911C9.04772 12.9398 9.60504 12.5715 10.0745 12.1072C10.5439 11.6429 10.9163 11.0917 11.1704 10.4851C11.4245 9.87842 11.5552 9.22823 11.5552 8.5716C11.5552 7.91498 11.4245 7.26479 11.1704 6.65815C10.9163 6.05151 10.5439 5.5003 10.0745 5.036C9.60504 4.5717 9.04772 4.20339 8.43436 3.95211C7.82099 3.70083 7.16359 3.5715 6.49968 3.5715C5.15887 3.5715 3.87297 4.0983 2.92487 5.036C1.97677 5.9737 1.44413 7.24549 1.44413 8.5716C1.44413 9.89771 1.97677 11.1695 2.92487 12.1072C3.87297 13.0449 5.15887 13.5717 6.49968 13.5717V13.5717ZM5.77746 5.0001H7.2219V9.2859H5.77746V5.0001ZM3.6108 0H9.38857V1.4286H3.6108V0Z"
                fill="currentColor"
              />
            </svg>
            {classes.date_to}
          </span>
          <span>
            <svg
              width="13"
              height="11"
              viewBox="0 0 13 11"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.55 0V1.1H8.45V0H9.75V1.1H12.35C12.5224 1.1 12.6877 1.15795 12.8096 1.26109C12.9315 1.36424 13 1.50413 13 1.65V10.45C13 10.5959 12.9315 10.7358 12.8096 10.8389C12.6877 10.9421 12.5224 11 12.35 11H0.65C0.477609 11 0.312279 10.9421 0.190381 10.8389C0.0684819 10.7358 0 10.5959 0 10.45V1.65C0 1.50413 0.0684819 1.36424 0.190381 1.26109C0.312279 1.15795 0.477609 1.1 0.65 1.1H3.25V0H4.55ZM11.7 3.85H1.3V9.9H11.7V3.85ZM8.4734 5.0248L9.3925 5.8025L6.175 8.525L3.8766 6.5802L4.797 5.8025L6.17565 6.9696L8.47405 5.0248H8.4734Z"
                fill="currentColor"
              />
            </svg>
            Ngày {classes.date_end}
          </span>
        </div>
      </div>
      {isClickItemExam &&
        children.map((item: ItemExam, index: number) => {
          return (
            <div
              key={index}
              style={{ display: 'flex', justifyContent: 'right', alignItems: 'center' }}
            >
              <div
                className={`arenaitem__component_child arenaitem__component-tab-${type}`}
                ref={ref}
              >
                <div className="arenaitem__filter" />
                <div className="arenaitem__wrapper">
                  <div className="arenaitem__wrapper-left">
                    <h3>{item?.name + ' - ' + item?.contest_grade_name.toLocaleUpperCase()}</h3>
                    <span>{classes.type}</span>
                  </div>
                  <div className="tooltipBlock">
                    <img
                      className="size_of_img img_vip"
                      src={item?.vip === item?.no_vip ? AllUser : item?.vip ? Vip : IconNor}
                      alt="Image"
                    />
                    <span className="tooltiptext">
                      {item?.vip === item?.no_vip
                        ? 'Vòng thi cho tất cả user'
                        : item?.vip
                        ? 'Vòng thi cho các user Vip'
                        : 'Vòng thi cho các user thường'}
                    </span>
                  </div>
                  <div
                    className={`arenaitem__wrapper-child`}
                    style={{ display: classes.hidden ? 'none' : '' }}
                  >
                    <Button.Shadow
                      content={handleGetText(item)}
                      onClick={() => {
                        if (checkDk) {
                          // setPopupSubmit(false)
                          setIsCloseVip(true)
                          setdisplayPopupNoVip(true)
                        } else {
                          setIsCloseVip(false)
                          setdisplayPopupNoVip(false)
                          handleClickItem(item)
                        }
                      }}
                      color="yellow"
                    />
                  </div>
                </div>
                <div className="arenaitem__badge">
                  <span>
                    <svg
                      width="13"
                      height="15"
                      viewBox="0 0 13 15"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10.5571 3.54864L11.6065 2.51077L12.6277 3.52079L11.5783 4.55866C12.6153 5.84238 13.1159 7.47006 12.9773 9.10742C12.8388 10.7448 12.0716 12.2675 10.8334 13.3629C9.59511 14.4583 7.97978 15.0432 6.31912 14.9975C4.65846 14.9518 3.07853 14.2789 1.90381 13.1171C0.729086 11.9552 0.0487496 10.3926 0.00251971 8.75019C-0.0437101 7.10774 0.547676 5.51013 1.65522 4.28545C2.76277 3.06078 4.3024 2.30201 5.95792 2.16499C7.61344 2.02796 9.25917 2.52307 10.5571 3.54864V3.54864ZM6.49968 13.5717C7.16359 13.5717 7.82099 13.4424 8.43436 13.1911C9.04772 12.9398 9.60504 12.5715 10.0745 12.1072C10.5439 11.6429 10.9163 11.0917 11.1704 10.4851C11.4245 9.87842 11.5552 9.22823 11.5552 8.5716C11.5552 7.91498 11.4245 7.26479 11.1704 6.65815C10.9163 6.05151 10.5439 5.5003 10.0745 5.036C9.60504 4.5717 9.04772 4.20339 8.43436 3.95211C7.82099 3.70083 7.16359 3.5715 6.49968 3.5715C5.15887 3.5715 3.87297 4.0983 2.92487 5.036C1.97677 5.9737 1.44413 7.24549 1.44413 8.5716C1.44413 9.89771 1.97677 11.1695 2.92487 12.1072C3.87297 13.0449 5.15887 13.5717 6.49968 13.5717V13.5717ZM5.77746 5.0001H7.2219V9.2859H5.77746V5.0001ZM3.6108 0H9.38857V1.4286H3.6108V0Z"
                        fill="currentColor"
                      />
                    </svg>
                    {format(new Date(item.exam_start_time), 'HH:mm')} -{' '}
                    {format(new Date(item.exam_end_time), 'HH:mm')}
                  </span>
                  <span>
                    <svg
                      width="13"
                      height="11"
                      viewBox="0 0 13 11"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4.55 0V1.1H8.45V0H9.75V1.1H12.35C12.5224 1.1 12.6877 1.15795 12.8096 1.26109C12.9315 1.36424 13 1.50413 13 1.65V10.45C13 10.5959 12.9315 10.7358 12.8096 10.8389C12.6877 10.9421 12.5224 11 12.35 11H0.65C0.477609 11 0.312279 10.9421 0.190381 10.8389C0.0684819 10.7358 0 10.5959 0 10.45V1.65C0 1.50413 0.0684819 1.36424 0.190381 1.26109C0.312279 1.15795 0.477609 1.1 0.65 1.1H3.25V0H4.55ZM11.7 3.85H1.3V9.9H11.7V3.85ZM8.4734 5.0248L9.3925 5.8025L6.175 8.525L3.8766 6.5802L4.797 5.8025L6.17565 6.9696L8.47405 5.0248H8.4734Z"
                        fill="currentColor"
                      />
                    </svg>
                    Ngày {format(new Date(item.exam_end_time), 'dd/MM/yyyy')}
                  </span>
                </div>
              </div>
            </div>
          )
        })}

      {displayPopupNoVip ? (
        <PopupNotVip
          onRedirect={() => history.push('/')}
          isShowPopupVip={isCloseVip}
          setShowPopupVip={setIsCloseVip}
        />
      ) : (
        <PopupArena
          userInfo={user}
          open={popupSubmit}
          questions={questions}
          onClose={() => setPopupSubmit(false)}
          onSubmit={() => onSubmit()}
          handleLoginCourse={handleLoginCourse}
          setShowModal={setShowModal}
          statusBtn={tab_option}
          handleUpcoming={handleUpComing}
          formUser={formUser}
          setFormUser={setFormUser}
          // setPopUpdateInfo={setPopUpdateInfo}
          code={dataRound?.code_round}
        />
      )}

      <Modal
        size="xl"
        show={isShowPopupContest}
        onHide={() => setIsShowPopupContest(false)}
        style={{
          zIndex: 9999999,
          height: '100vh'
        }}
      >
        <div className="p-3">
          <div className="popupcontainer__close" onClick={() => setIsShowPopupContest(false)}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13.2034 2.67773L2.52545 13.3557"
                stroke="#444444"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2.52545 2.67773L13.2034 13.3557"
                stroke="#444444"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="d-flex justify-content-end mb-3">
            <small className="ms-auto">
              {data?.createdAt
                ? format(new Date(data?.createdAt), 'eeee, dd/MM/yyyy, HH:mm (z)', {
                    locale: viLocale
                  })
                : ''}
            </small>
          </div>
          <h1 className="fw-bold">{data?.contest_name}</h1>
          <div className="html__container">{ReactHtmlParser(data?.contest_rules)}</div>
        </div>
      </Modal>
      <ModalCustomArena
        show={messBlockRound?.length > 0 ? true : false}
        isClose
        onHide={() => {
          setMessBlockRound('')
        }}
      >
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
              <b>{messBlockRound}</b>
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
              onClick={() => setMessBlockRound('')}
            />
          </div>
        </div>
      </ModalCustomArena>
    </>
  )
}

export default ArenaItem
