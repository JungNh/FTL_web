import * as React from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Spinner } from 'react-bootstrap'
import './styles.scss'

import { RootState } from '../../store'
import PopupNoti from '../ArenaPage/components/Popup'
import Popup from './components/Popup'
import { Button } from '../../components'
import draw from '../../assets/images/draw.webp'
import { getCandidateInfo } from '../../store/arena/actions'
import ContainerWithBack from '../../components/ContainerWithBack'
import { Context, Provider } from './components/LazyLoadingProvider'
import PopupNotComplete from './components/PopupNotComplete'
import { getContest } from '../../store/joiningRoom/actions'
import { openInNewTab } from '../../utils/common'
import PopupBXH from './components/PopupWarining'
import { getGifts } from '../../store/gifts/actions'

const getPosition = (index: number, isYou: boolean) => {
  if (isYou) return 'right__item--you'
  switch (index) {
    case 1:
      return 'right__item--first'
    case 2:
      return 'right__item--seccond'
    case 3:
      return 'right__item--third'
  }
  return ''
}

const Index: React.FC = () => {
  // =================================================== LAYZY ===================================================
  const {
    data: leaderboard,
    userRank,
    isLoading,
    error,
    isEnded,
    loadDataChunk: loadData
  } = React.useContext(Context)
  const [element, setElement] = React.useState<HTMLDivElement | null>(null)
  const observer = React.useRef<IntersectionObserver | null>(null)
  const loadDataChunk = () => loadData(id)
  const loader = React.useRef(loadDataChunk)
  console.log(userRank[0]?.id, 'userRank==>>>>')
  const user = userRank[0]
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
  const { id } = useParams<{ id: string }>()
  const dispatch = useDispatch()
  const history = useHistory()
  const candidate_info = useSelector((state: RootState) => state.arena.candidate_info)
  const contest = useSelector((state: RootState) => state.joiningRoom.contest)
  React.useEffect(() => {
    dispatch(getCandidateInfo())
    dispatch(getContest(+id))
  }, [id])
  console.log(leaderboard)
  const dataRound = useSelector((state: RootState) => state.arena.data_round_info)
  const [isShowPopup, setIsShowPopup] = React.useState<boolean>(false)
  const user_info = useSelector((state: RootState) => state.login.userInfo)
  const [isShowPopupGift, setIsShowPopupGift] = React.useState<boolean>(false)
  const datagift = useSelector((state: RootState) => state.gifts)

  React.useEffect(() => {
    dispatch(getGifts())
  }, [])

  const onOpenModalNoti = () => {
    if (dataRound?.bonus) {
      setIsShowPopup(false)
    } else {
      setIsShowPopup(true)
    }
  }

  return !error ? (
    <ContainerWithBack background="#ffe76b">
      <div className="contestleaderboard__page">
        <h1 className="page__title">Tổng kết cuộc thi</h1>
        <div className="page__wrapper">
          <div className="page__left">
            <div>
              <img src={draw} alt="draw" onClick={onOpenModalNoti} />
              {dataRound?.bonus && <p>Bạn đã quay thưởng</p>}
            </div>

            <Button.Shadow
              color="blue"
              onClick={() => {
                if (datagift.gifts?.length > 0) {
                  setIsShowPopupGift(false)
                  history.push('/gifts')
                } else {
                  setIsShowPopupGift(true)
                }
              }}
              content={'Quà của bạn'}
              style={{ marginBottom: 20 }}
            />

            <Button.Shadow
              color="gray"
              onClick={() => openInNewTab('https://hoc.futurelang.vn/')}
              content={'Trang chủ'}
              style={{ marginBottom: 20, color: '#333', paddingLeft: 17, paddingRight: 17 }}
            />
            {/* <a href="https://hoc.futurelang.vn/">Trang chủ</a> */}
          </div>
          <div className="page__right">
            <h1 className="right__title">Bảng xếp hạng TOP 50</h1>
            <div className="right__items">
              {leaderboard?.map((item: any) => (
                <div
                  className={`right__item ${getPosition(
                    item.rank,
                    candidate_info?.code === item.candidate_dict.code
                  )}`}
                  key={item}
                >
                  <div className="item__bubble">{item.rank}</div>
                  <img
                    src="https://via.placeholder.com/600x400"
                    alt="avatar"
                    className="item__avatar"
                  />
                  <div className="item__info">
                    <span>{item.candidate_dict.name}</span>
                    <div className="info__box">
                      <div>
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M7 14C3.1339 14 0 10.8661 0 7C0 3.1339 3.1339 0 7 0C10.8661 0 14 3.1339 14 7C14 10.8661 10.8661 14 7 14ZM7 12.6C8.48521 12.6 9.90959 12.01 10.9598 10.9598C12.01 9.90959 12.6 8.48521 12.6 7C12.6 5.51479 12.01 4.09041 10.9598 3.0402C9.90959 1.99 8.48521 1.4 7 1.4C5.51479 1.4 4.09041 1.99 3.0402 3.0402C1.99 4.09041 1.4 5.51479 1.4 7C1.4 8.48521 1.99 9.90959 3.0402 10.9598C4.09041 12.01 5.51479 12.6 7 12.6ZM6.3021 9.8L3.332 6.8299L4.3218 5.8401L6.3021 7.8204L10.2613 3.8605L11.2518 4.8503L6.3021 9.8Z"
                            fill="#23B502"
                          />
                        </svg>
                        {item.number_of_correct_answers}
                      </div>

                      <div>
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M7 14C3.1339 14 0 10.8661 0 7C0 3.1339 3.1339 0 7 0C10.8661 0 14 3.1339 14 7C14 10.8661 10.8661 14 7 14ZM7 12.6C8.48521 12.6 9.90959 12.01 10.9598 10.9598C12.01 9.90959 12.6 8.48521 12.6 7C12.6 5.51479 12.01 4.09041 10.9598 3.0402C9.90959 1.99 8.48521 1.4 7 1.4C5.51479 1.4 4.09041 1.99 3.0402 3.0402C1.99 4.09041 1.4 5.51479 1.4 7C1.4 8.48521 1.99 9.90959 3.0402 10.9598C4.09041 12.01 5.51479 12.6 7 12.6ZM7 6.0102L8.9796 4.0299L9.9701 5.0204L7.9898 7L9.9701 8.9796L8.9796 9.9701L7 7.9898L5.0204 9.9701L4.0299 8.9796L6.0102 7L4.0299 5.0204L5.0204 4.0299L7 6.0102Z"
                            fill="#FF0000"
                          />
                        </svg>
                        {item.number_of_wrong_answers}
                      </div>

                      <div>
                        <svg
                          width="13"
                          height="14"
                          viewBox="0 0 13 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M10.5571 3.31207L11.6065 2.34338L12.6277 3.28607L11.5783 4.25475C12.6153 5.45289 13.1159 6.97206 12.9773 8.50026C12.8388 10.0285 12.0716 11.4497 10.8334 12.4721C9.59511 13.4944 7.97978 14.0403 6.31912 13.9977C4.65846 13.955 3.07853 13.327 1.90381 12.2426C0.729086 11.1582 0.0487496 9.69979 0.00251971 8.16684C-0.0437101 6.63389 0.547676 5.14278 1.65522 3.99976C2.76277 2.85673 4.3024 2.14855 5.95792 2.02065C7.61344 1.89276 9.25917 2.35487 10.5571 3.31207ZM6.49968 12.6669C7.16359 12.6669 7.82099 12.5462 8.43436 12.3117C9.04772 12.0772 9.60504 11.7334 10.0745 11.3001C10.5439 10.8667 10.9163 10.3523 11.1704 9.78606C11.4245 9.21986 11.5552 8.61301 11.5552 8.00016C11.5552 7.38732 11.4245 6.78047 11.1704 6.21427C10.9163 5.64807 10.5439 5.13361 10.0745 4.70026C9.60504 4.26692 9.04772 3.92316 8.43436 3.68864C7.82099 3.45411 7.16359 3.3334 6.49968 3.3334C5.15887 3.3334 3.87297 3.82508 2.92487 4.70026C1.97677 5.57545 1.44413 6.76246 1.44413 8.00016C1.44413 9.23787 1.97677 10.4249 2.92487 11.3001C3.87297 12.1753 5.15887 12.6669 6.49968 12.6669ZM5.77746 4.66676H7.2219V8.66684H5.77746V4.66676ZM3.6108 0H9.38857V1.33336H3.6108V0Z"
                            fill="#FF9900"
                          />
                        </svg>
                        {item.time_for_to_do_the_exam_str}
                      </div>
                    </div>
                  </div>
                  {item.rank_gift_dict && (
                    <div className="item__gift">
                      <span>
                        {item.rank_gift_dict.number_of_units_per_hit > 0
                          ? item.rank_gift_dict.number_of_units_per_hit
                          : ''}
                      </span>
                      <img src={item.rank_gift_dict.gift_dict.image} alt="icon__gift" />
                    </div>
                  )}
                  {user?.id && (
                    <div className="item-ghim">
                      <div
                        className={`right__item ${getPosition(
                          user?.rank,
                          candidate_info?.code === user?.candidate_dict.code
                        )}`}
                      >
                        <div className="item__bubble">TOP {user?.rank}</div>
                        <img
                          src={
                            user_info?.avatar
                              ? user_info?.avatar
                              : 'https://via.placeholder.com/600x400'
                          }
                          alt="avatar"
                          className="item__avatar"
                        />
                        <div className="item__info">
                          <span>{user?.candidate_dict.name}</span>
                          <div className="info__box">
                            <div>
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 14 14"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M7 14C3.1339 14 0 10.8661 0 7C0 3.1339 3.1339 0 7 0C10.8661 0 14 3.1339 14 7C14 10.8661 10.8661 14 7 14ZM7 12.6C8.48521 12.6 9.90959 12.01 10.9598 10.9598C12.01 9.90959 12.6 8.48521 12.6 7C12.6 5.51479 12.01 4.09041 10.9598 3.0402C9.90959 1.99 8.48521 1.4 7 1.4C5.51479 1.4 4.09041 1.99 3.0402 3.0402C1.99 4.09041 1.4 5.51479 1.4 7C1.4 8.48521 1.99 9.90959 3.0402 10.9598C4.09041 12.01 5.51479 12.6 7 12.6ZM6.3021 9.8L3.332 6.8299L4.3218 5.8401L6.3021 7.8204L10.2613 3.8605L11.2518 4.8503L6.3021 9.8Z"
                                  fill="#23B502"
                                />
                              </svg>
                              {user?.number_of_correct_answers}
                            </div>

                            <div>
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 14 14"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M7 14C3.1339 14 0 10.8661 0 7C0 3.1339 3.1339 0 7 0C10.8661 0 14 3.1339 14 7C14 10.8661 10.8661 14 7 14ZM7 12.6C8.48521 12.6 9.90959 12.01 10.9598 10.9598C12.01 9.90959 12.6 8.48521 12.6 7C12.6 5.51479 12.01 4.09041 10.9598 3.0402C9.90959 1.99 8.48521 1.4 7 1.4C5.51479 1.4 4.09041 1.99 3.0402 3.0402C1.99 4.09041 1.4 5.51479 1.4 7C1.4 8.48521 1.99 9.90959 3.0402 10.9598C4.09041 12.01 5.51479 12.6 7 12.6ZM7 6.0102L8.9796 4.0299L9.9701 5.0204L7.9898 7L9.9701 8.9796L8.9796 9.9701L7 7.9898L5.0204 9.9701L4.0299 8.9796L6.0102 7L4.0299 5.0204L5.0204 4.0299L7 6.0102Z"
                                  fill="#FF0000"
                                />
                              </svg>
                              {user?.number_of_wrong_answers}
                            </div>

                            <div>
                              <svg
                                width="13"
                                height="14"
                                viewBox="0 0 13 14"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M10.5571 3.31207L11.6065 2.34338L12.6277 3.28607L11.5783 4.25475C12.6153 5.45289 13.1159 6.97206 12.9773 8.50026C12.8388 10.0285 12.0716 11.4497 10.8334 12.4721C9.59511 13.4944 7.97978 14.0403 6.31912 13.9977C4.65846 13.955 3.07853 13.327 1.90381 12.2426C0.729086 11.1582 0.0487496 9.69979 0.00251971 8.16684C-0.0437101 6.63389 0.547676 5.14278 1.65522 3.99976C2.76277 2.85673 4.3024 2.14855 5.95792 2.02065C7.61344 1.89276 9.25917 2.35487 10.5571 3.31207ZM6.49968 12.6669C7.16359 12.6669 7.82099 12.5462 8.43436 12.3117C9.04772 12.0772 9.60504 11.7334 10.0745 11.3001C10.5439 10.8667 10.9163 10.3523 11.1704 9.78606C11.4245 9.21986 11.5552 8.61301 11.5552 8.00016C11.5552 7.38732 11.4245 6.78047 11.1704 6.21427C10.9163 5.64807 10.5439 5.13361 10.0745 4.70026C9.60504 4.26692 9.04772 3.92316 8.43436 3.68864C7.82099 3.45411 7.16359 3.3334 6.49968 3.3334C5.15887 3.3334 3.87297 3.82508 2.92487 4.70026C1.97677 5.57545 1.44413 6.76246 1.44413 8.00016C1.44413 9.23787 1.97677 10.4249 2.92487 11.3001C3.87297 12.1753 5.15887 12.6669 6.49968 12.6669ZM5.77746 4.66676H7.2219V8.66684H5.77746V4.66676ZM3.6108 0H9.38857V1.33336H3.6108V0Z"
                                  fill="#FF9900"
                                />
                              </svg>
                              {user?.time_for_to_do_the_exam_str}
                            </div>
                          </div>
                        </div>
                        {user?.rank_gift_dict && (
                          <div className="item__gift">
                            <span>
                              {user?.rank_gift_dict.number_of_units_per_hit > 0
                                ? user?.rank_gift_dict.number_of_units_per_hit
                                : ''}
                            </span>
                            <img src={user?.rank_gift_dict.gift_dict.image} alt="icon__gift" />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {/* {user?.rank > 50 && ( */}

              {/* )} */}
              {isLoading && (
                <div className="loading">
                  <Spinner animation="grow" className="loading__icon" />
                </div>
              )}
              {!isLoading && !error && !isEnded && <div ref={setElement} />}
            </div>
          </div>
        </div>
      </div>
      {/* Hiện thị Popup */}
      <PopupNoti open={isShowPopupGift} onClose={() => setIsShowPopupGift(false)}>
        <p>
          <b>
            {' '}
            Bạn chưa có phần quà nào , <br />
            vui lòng quay lại sau!
          </b>
        </p>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 20
          }}
        >
          <Button.Shadow
            content="XÁC NHẬN"
            color="blue"
            style={{
              width: 200,
              fontSize: 15
            }}
            onClick={() => setIsShowPopupGift(false)}
          />
        </div>
      </PopupNoti>
      <PopupBXH
        isShow={isShowPopup}
        message="Cuộc thi chưa tổ chức quay thưởng, vui lòng quay lại sau!"
        setIsShowPopup={() => setIsShowPopup(false)}
      />
    </ContainerWithBack>
  ) : error === '-10' ? (
    <PopupNotComplete contest={contest} />
  ) : (
    <Popup message={error} />
  )
}

const ContestLeaderBoardPage: React.FC = () => {
  return (
    <Provider>
      <Index />
    </Provider>
  )
}

export default ContestLeaderBoardPage
