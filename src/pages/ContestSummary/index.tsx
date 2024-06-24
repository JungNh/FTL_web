import * as React from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { format } from 'date-fns'
import { isEmpty } from 'lodash'
import './styles.scss'

import { RootState } from '../../store'
import { Button } from '../../components'
import avatar from '../../assets/images/avata.jpg'
import { getContest } from '../../store/joiningRoom/actions'
import ContainerWithBack from '../../components/ContainerWithBack'
import BackgroundArena from '../../assets/images/background-arena.png'
import { getContestSummary } from '../../store/contestSummary/actions'
import Popup from './components/Popup'
import PopupRecievedGifts from './components/PopupRecievedGifts'
import Carousel from '../ArenaPage/components/Carousel'
import { openInNewTab } from '../../utils/common'
import { arenaApi as api } from '../../lib'
import PopupNotComplete from './components/PopupNotComplete'

const ContestSummaryPage: React.FC = () => {
  // =================================================== HOOKS ===================================================
  const history = useHistory()
  const dispatch = useDispatch()
  const { id } = useParams<{ id: string }>()
  const { contest_summary } = useSelector((state: RootState) => state.contestSummary)
  const contest: any = useSelector((state: RootState) => state.joiningRoom.contest)
  const user_info = useSelector((state: RootState) => state.login.userInfo)
  const dataRound = useSelector((state: RootState) => state.arena.data_round_info)

  const [open, setOpen] = React.useState(false)
  // =================================================== CONSTANTS ===================================================
  const { date, time }: any = React.useMemo(() => {
    if (isEmpty(contest)) return { date: '', time: '' }
    const dateEnd = format(new Date(contest?.exam_end_time), 'dd/MM/yyyy')
    const dateStart = format(new Date(contest?.exam_start_time), 'dd/MM/yyyy')
    const date = dateStart === dateEnd ? dateStart : `${dateStart} - ${dateEnd}`
    const time =
      format(new Date(contest?.exam_start_time), 'HH:mm') +
      ' - ' +
      format(new Date(contest?.exam_end_time), 'HH:mm')
    return { date, time }
  }, [contest])
  // =================================================== EFFECTS ===================================================
  React.useEffect(() => {
    dispatch(getContestSummary(+id))
    dispatch(getContest(+id))
  }, [id])
  // console.log(contest_summary, 'contest_summary')
  const [isCheckBxh, setIsCheckBxh] = React.useState<boolean>(false)

  const handleClickBXH = async () => {
    const response = await api.post('/contests/get_results_rank_table_the_round/', {
      round_id: id,
      start: 0
    })
    if (response?.data?.c == '-10') {
      setIsCheckBxh(true)
    } else {
      setIsCheckBxh(false)
      history.push(`/contest-leaderboard/${+id}`)
    }
  }

  // =================================================== RENDERS ===================================================
  return (
    <ContainerWithBack to="/arena">
      <Carousel />
      <div className="contestsummary__component">
        <div className="contestsummary__banner">
          {/* <img src={BackgroundArena} alt="background" className="banner__background" />
          <div className="banner__text">
            <h1>ĐẤU TRƯỜNG TIẾNG ANH</h1>
            <div>
              <div>{contest ? `${contest.contest_grade_name} - ${contest.name}` : ''}</div>
            </div>
          </div> */}
          <div className="banner__badge">
            <span>
              <svg
                width="13"
                height="15"
                viewBox="0 0 13 15"
                fill="#ffffff"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="#ffffff"
                  d="M10.5571 3.54864L11.6065 2.51077L12.6277 3.52079L11.5783 4.55866C12.6153 5.84238 13.1159 7.47006 12.9773 9.10742C12.8388 10.7448 12.0716 12.2675 10.8334 13.3629C9.59511 14.4583 7.97978 15.0432 6.31912 14.9975C4.65846 14.9518 3.07853 14.2789 1.90381 13.1171C0.729086 11.9552 0.0487496 10.3926 0.00251971 8.75019C-0.0437101 7.10774 0.547676 5.51013 1.65522 4.28545C2.76277 3.06078 4.3024 2.30201 5.95792 2.16499C7.61344 2.02796 9.25917 2.52307 10.5571 3.54864V3.54864ZM6.49968 13.5717C7.16359 13.5717 7.82099 13.4424 8.43436 13.1911C9.04772 12.9398 9.60504 12.5715 10.0745 12.1072C10.5439 11.6429 10.9163 11.0917 11.1704 10.4851C11.4245 9.87842 11.5552 9.22823 11.5552 8.5716C11.5552 7.91498 11.4245 7.26479 11.1704 6.65815C10.9163 6.05151 10.5439 5.5003 10.0745 5.036C9.60504 4.5717 9.04772 4.20339 8.43436 3.95211C7.82099 3.70083 7.16359 3.5715 6.49968 3.5715C5.15887 3.5715 3.87297 4.0983 2.92487 5.036C1.97677 5.9737 1.44413 7.24549 1.44413 8.5716C1.44413 9.89771 1.97677 11.1695 2.92487 12.1072C3.87297 13.0449 5.15887 13.5717 6.49968 13.5717V13.5717ZM5.77746 5.0001H7.2219V9.2859H5.77746V5.0001ZM3.6108 0H9.38857V1.4286H3.6108V0Z"
                />
              </svg>
              {time}
            </span>
            <span>
              <svg
                width="13"
                height="11"
                viewBox="0 0 13 11"
                fill="#ffffff"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="#ffffff"
                  d="M4.55 0V1.1H8.45V0H9.75V1.1H12.35C12.5224 1.1 12.6877 1.15795 12.8096 1.26109C12.9315 1.36424 13 1.50413 13 1.65V10.45C13 10.5959 12.9315 10.7358 12.8096 10.8389C12.6877 10.9421 12.5224 11 12.35 11H0.65C0.477609 11 0.312279 10.9421 0.190381 10.8389C0.0684819 10.7358 0 10.5959 0 10.45V1.65C0 1.50413 0.0684819 1.36424 0.190381 1.26109C0.312279 1.15795 0.477609 1.1 0.65 1.1H3.25V0H4.55ZM11.7 3.85H1.3V9.9H11.7V3.85ZM8.4734 5.0248L9.3925 5.8025L6.175 8.525L3.8766 6.5802L4.797 5.8025L6.17565 6.9696L8.47405 5.0248H8.4734Z"
                />
              </svg>
              Ngày {date}
            </span>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 20,
            fontSize: 17,
            fontWeight: 'bold'
          }}
        >
          Đây là kết quả thi của bạn:{' '}
        </div>
        <div className="contestsummary__userinfo">
          <img
            src={user_info?.avatar && user_info?.avatar !== '' ? user_info?.avatar : avatar}
            alt="profile-avatar"
          />
          <p>{user_info?.fullname ?? ''}</p>
        </div>

        <div className="contestsummary__scores">
          <div className="item">
            <div className="left">
              <svg
                width="25"
                height="25"
                viewBox="0 0 25 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14.2513 24.7029C20.1877 24.5394 24.8665 19.6341 24.7017 13.7464C24.5369 7.85879 19.591 3.21839 13.6546 3.38182C7.71825 3.54525 3.03946 8.45061 3.20425 14.3383C3.36903 20.2259 8.31497 24.8663 14.2513 24.7029Z"
                  fill="white"
                />
                <path
                  d="M13.952 22.5408C18.6858 22.5408 22.5232 18.7348 22.5232 14.0399C22.5232 9.34503 18.6858 5.53906 13.952 5.53906C9.21831 5.53906 5.38086 9.34503 5.38086 14.0399C5.38086 18.7348 9.21831 22.5408 13.952 22.5408Z"
                  fill="#0076FE"
                />
                <path
                  d="M20.1775 14.1809C20.2555 10.772 17.5323 7.94579 14.0952 7.86843C10.6581 7.79107 7.80846 10.4919 7.73046 13.9008C7.65246 17.3097 10.3756 20.136 13.8127 20.2133C17.2499 20.2907 20.0995 17.5899 20.1775 14.1809Z"
                  fill="white"
                />
                <path
                  d="M17.9555 14.0404C17.9555 14.8248 17.721 15.5917 17.2816 16.2439C16.8422 16.8961 16.2176 17.4045 15.4869 17.7047C14.7561 18.0049 13.9521 18.0834 13.1764 17.9304C12.4006 17.7773 11.6881 17.3996 11.1288 16.8449C10.5695 16.2902 10.1887 15.5835 10.0344 14.8142C9.88006 14.0448 9.95925 13.2473 10.2619 12.5226C10.5646 11.7979 11.0772 11.1785 11.7348 10.7426C12.3924 10.3068 13.1656 10.0742 13.9565 10.0742C15.0171 10.0742 16.0343 10.4921 16.7842 11.2359C17.5342 11.9797 17.9555 12.9885 17.9555 14.0404Z"
                  fill="#0076FE"
                />
                <path
                  d="M13.952 15.9659C15.0244 15.9659 15.8937 15.1037 15.8937 14.0401C15.8937 12.9765 15.0244 12.1143 13.952 12.1143C12.8796 12.1143 12.0103 12.9765 12.0103 14.0401C12.0103 15.1037 12.8796 15.9659 13.952 15.9659Z"
                  fill="white"
                />
                <g filter="url(#filter0_d_344_1476)">
                  <path
                    d="M13.9521 14.1372L12.4902 9.21918L11.5216 10.1358L6.08292 4.99739L5.93629 2.85125L4.38112 1.65258L4.49665 3.49906L3.58577 2.63972L3.62576 1.23392L1.97728 0L2.29276 2.10648L0 1.99631L1.0975 3.5916L2.89261 3.43736L3.87903 4.40246L1.67069 4.38043L2.9326 6.12555L5.34533 5.92724L10.4152 11.1846L9.43764 12.1145L13.9521 14.1372Z"
                    fill="white"
                  />
                </g>
                <defs>
                  <filter
                    id="filter0_d_344_1476"
                    x="0"
                    y="0"
                    width="13.952"
                    height="14.6377"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                  >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feColorMatrix
                      in="SourceAlpha"
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                      result="hardAlpha"
                    />
                    <feOffset dy="0.5" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0"
                    />
                    <feBlend
                      mode="normal"
                      in2="BackgroundImageFix"
                      result="effect1_dropShadow_344_1476"
                    />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="effect1_dropShadow_344_1476"
                      result="shape"
                    />
                  </filter>
                </defs>
              </svg>
              <span>Điểm</span>
            </div>
            <div className="right">{contest_summary?.scores ?? 0}</div>
          </div>

          <div className="item">
            <div className="left">
              <svg
                width="25"
                height="25"
                viewBox="0 0 25 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.5 25C5.59625 25 0 19.4037 0 12.5C0 5.59625 5.59625 0 12.5 0C19.4037 0 25 5.59625 25 12.5C25 19.4037 19.4037 25 12.5 25ZM12.5 22.5C15.1522 22.5 17.6957 21.4464 19.5711 19.5711C21.4464 17.6957 22.5 15.1522 22.5 12.5C22.5 9.84783 21.4464 7.3043 19.5711 5.42893C17.6957 3.55357 15.1522 2.5 12.5 2.5C9.84783 2.5 7.3043 3.55357 5.42893 5.42893C3.55357 7.3043 2.5 9.84783 2.5 12.5C2.5 15.1522 3.55357 17.6957 5.42893 19.5711C7.3043 21.4464 9.84783 22.5 12.5 22.5ZM11.2537 17.5L5.95 12.1962L7.7175 10.4288L11.2537 13.965L18.3237 6.89375L20.0925 8.66125L11.2537 17.5Z"
                  fill="white"
                />
              </svg>
              <span>Số câu đúng</span>
            </div>
            <div className="right">{contest_summary?.number_of_correct_answers ?? 0}</div>
          </div>

          <div className="item">
            <div className="left">
              <svg
                width="21"
                height="25"
                viewBox="0 0 21 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17.0538 5.91441L18.749 4.18461L20.3986 5.86798L18.7035 7.59777C20.3785 9.7373 21.1872 12.4501 20.9634 15.179C20.7396 17.908 19.5003 20.4459 17.5 22.2715C15.4998 24.0972 12.8904 25.0721 10.2078 24.9958C7.5252 24.9196 4.973 23.7982 3.07538 21.8618C1.17776 19.9254 0.0787493 17.3211 0.0040703 14.5836C-0.0706087 11.8462 0.884708 9.18354 2.67382 7.14242C4.46294 5.1013 6.95004 3.83669 9.62433 3.60831C12.2986 3.37993 14.9571 4.20512 17.0538 5.91441ZM10.4995 22.6195C11.5719 22.6195 12.6339 22.404 13.6247 21.9852C14.6156 21.5664 15.5158 20.9525 16.2742 20.1787C17.0325 19.4048 17.6341 18.4862 18.0445 17.4751C18.4549 16.464 18.6661 15.3804 18.6661 14.286C18.6661 13.1916 18.4549 12.108 18.0445 11.0969C17.6341 10.0858 17.0325 9.16717 16.2742 8.39333C15.5158 7.61949 14.6156 7.00565 13.6247 6.58685C12.6339 6.16805 11.5719 5.9525 10.4995 5.9525C8.33355 5.9525 6.25633 6.83049 4.72479 8.39333C3.19324 9.95616 2.33283 12.0758 2.33283 14.286C2.33283 16.4962 3.19324 18.6158 4.72479 20.1787C6.25633 21.7415 8.33355 22.6195 10.4995 22.6195ZM9.33282 8.3335H11.6662V15.4765H9.33282V8.3335ZM5.83283 0H15.1661V2.381H5.83283V0Z"
                  fill="white"
                />
              </svg>
              <span>Thời gian</span>
            </div>
            <div className="right">{contest_summary?.time_for_to_do_the_exam_str ?? 0}</div>
          </div>

          <div className="item">
            <div className="left">
              <svg
                width="25"
                height="25"
                viewBox="0 0 25 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.5 25C5.59625 25 0 19.4037 0 12.5C0 5.59625 5.59625 0 12.5 0C19.4037 0 25 5.59625 25 12.5C25 19.4037 19.4037 25 12.5 25ZM12.5 22.5C15.1522 22.5 17.6957 21.4464 19.5711 19.5711C21.4464 17.6957 22.5 15.1522 22.5 12.5C22.5 9.84783 21.4464 7.3043 19.5711 5.42893C17.6957 3.55357 15.1522 2.5 12.5 2.5C9.84783 2.5 7.3043 3.55357 5.42893 5.42893C3.55357 7.3043 2.5 9.84783 2.5 12.5C2.5 15.1522 3.55357 17.6957 5.42893 19.5711C7.3043 21.4464 9.84783 22.5 12.5 22.5ZM12.5 10.7325L16.035 7.19625L17.8037 8.965L14.2675 12.5L17.8037 16.035L16.035 17.8037L12.5 14.2675L8.965 17.8037L7.19625 16.035L10.7325 12.5L7.19625 8.965L8.965 7.19625L12.5 10.7325Z"
                  fill="white"
                />
              </svg>
              <span>Số câu sai</span>
            </div>
            <div className="right">{contest_summary?.number_of_wrong_answers ?? 0}</div>
          </div>
        </div>
        <div className="contestsummary__buttons">
          <Button.Shadow
            color="gray"
            onClick={() => openInNewTab('https://hoc.futurelang.vn/')}
            content="Trang chủ"
          />
          {dataRound?.bonus && (
            <Button.Shadow
              onClick={() => {
                if (!!contest?.is_dialed) {
                  setOpen(true)
                } else {
                  history.push(`/draw/${+id}`)
                }
              }}
              content={
                <>
                  <svg
                    width="27"
                    height="29"
                    viewBox="0 0 27 29"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ marginRight: '0.25rem' }}
                  >
                    <circle
                      cx="13.5"
                      cy="15.0869"
                      r="12.931"
                      stroke="white"
                      strokeWidth="0.862069"
                    />
                    <path
                      d="M18.6351 3.68795C17.0668 2.98014 15.332 2.58691 13.5 2.58691C12.6395 2.58691 11.8022 2.67481 10.9926 2.83673L13.5 15.0869L18.6351 3.68795Z"
                      fill="#27AE60"
                    />
                    <path
                      d="M10.9926 2.83691C8.36952 3.37355 6.04717 4.72903 4.29846 6.62577L13.5 15.0871L10.9926 2.83691Z"
                      fill="#6FCF97"
                    />
                    <path
                      d="M25.889 16.7618C25.963 16.2159 26 15.6562 26 15.0871C26 12.9545 25.468 10.9513 24.5242 9.19336L13.5 15.0871L25.889 16.7618Z"
                      fill="#9B51E0"
                    />
                    <path
                      d="M4.29846 6.625C2.56364 8.51249 1.40246 10.932 1.08325 13.6106L13.4954 15.0863L4.29846 6.625Z"
                      fill="#EB5757"
                    />
                    <path
                      d="M24.5242 9.19366C23.2243 6.76953 21.1517 4.8219 18.6351 3.68848L13.5 15.0874L24.5242 9.19366Z"
                      fill="#BB6BD9"
                    />
                    <path
                      d="M8.18915 26.4085C9.80369 27.1672 11.6033 27.5928 13.5047 27.5928C14.2957 27.5928 15.0683 27.5188 15.8178 27.38L13.5047 15.0928L8.18915 26.4085Z"
                      fill="#2F80ED"
                    />
                    <path
                      d="M13.5 15.0869L22.5674 23.6917C24.3346 21.8319 25.5328 19.4263 25.889 16.757L13.5 15.0869Z"
                      fill="#56CCF2"
                    />
                    <path
                      d="M15.8177 27.3753C18.4547 26.8803 20.7955 25.5619 22.5674 23.6975L13.5 15.0928L15.8177 27.3753Z"
                      fill="#2D9CDB"
                    />
                    <path
                      d="M1.0879 13.6113C1.03238 14.0971 1 14.5875 1 15.0871C1 17.2892 1.56902 19.3571 2.56828 21.152L13.5 15.0871L1.0879 13.6113Z"
                      fill="#F2994A"
                    />
                    <path
                      d="M2.5683 21.1577C3.8405 23.4431 5.80664 25.2889 8.18451 26.4085L13.5 15.0928L2.5683 21.1577Z"
                      fill="#F2C94C"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M15.9018 2.39857C15.9018 1.07397 14.828 0.00017436 13.5034 0.000174418C12.1788 0.000174475 11.105 1.07397 11.105 2.39857C11.105 2.6961 11.1592 2.98098 11.2582 3.24388C11.2674 3.3126 11.2829 3.38177 11.305 3.4508L12.7985 8.10691C13.0184 8.79249 13.9884 8.79249 14.2083 8.10691L15.7017 3.4508C15.7239 3.38176 15.7393 3.31257 15.7486 3.24384C15.8476 2.98095 15.9018 2.69609 15.9018 2.39857Z"
                      fill="white"
                    />
                    <circle
                      cx="13.5206"
                      cy="2.49146"
                      r="0.800536"
                      transform="rotate(-90 13.5206 2.49146)"
                      fill="#0066FF"
                    />
                  </svg>
                  <span>Quay thưởng</span>
                </>
              }
            />
          )}
          {dataRound?.bxh && (
            <Button.Shadow
              color="gray"
              // onClick={() => history.push(`/contest-leaderboard/${+id}`)}
              onClick={handleClickBXH}
              content="BẢNG XẾP HẠNG"
            />
          )}
        </div>
      </div>

      <PopupNotComplete contest={contest} isCheckBxh={isCheckBxh} setCheckShow={setIsCheckBxh} />
      <PopupRecievedGifts
        open={open}
        onClose={() => setOpen(false)}
        onRedirect={() => history.push('/gifts')}
      />
    </ContainerWithBack>
  )
}

export default ContestSummaryPage
