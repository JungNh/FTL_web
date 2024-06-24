import React, {
  FC, useCallback, useContext, useEffect, useMemo, useState,
} from 'react'
import { Col, Row } from 'react-bootstrap'
import Swal from 'sweetalert2'
import { useDispatch, useSelector } from 'react-redux'
import { PageType } from '../types'
import { RootState } from '../../../store'
import { actionGetContestById, actionGetMemberOfRoom } from '../../../store/roomOnline/actions'
import { convertUrl } from '../../../utils/common'
import { SocketContext, SocketContextProps, SocketStatus } from '../../../hooks/useWebSockets'
import ModalInvite from './ModalInvite'
import { hideLoading, showLoading } from '../../../store/login/actions'

import icoPlay from '../../../assets/images/ico__play--white.svg'
import icoLeave from '../../../assets/images/ico__leave--white.svg'
import icoChain from '../../../assets/images/ico__chain--white.svg'
import icoPlan from '../../../assets/images/ico__plan--white.svg'
import icoClose from '../../../assets/images/ico_error.svg'
import backArrow from '../../../assets/images/ico_arrowLeft-blue.svg'
import ButtonShadow from '../../../components/Button/components/ButtonShadow'

type Props = {
  changePage: (page: PageType) => void
}

const WaitingRoom: FC<Props> = ({ changePage }) => {
  const [showInviteModal, setShowInviteModal] = useState(false)
  const { info } = useSelector((state: RootState) => state.roomOnline?.currentRoom)
  const [member, setMember] = useState<any[]>([])

  const userInfo = useSelector((state: RootState) => state.login?.userInfo)
  const { state } = useContext(SocketContext) as SocketContextProps
  const dispatch = useDispatch()

  const getDetail = useCallback(async () => {
    const responseMember: any = await dispatch(actionGetMemberOfRoom({ examId: info?.id }))
    if (responseMember) {
      setMember(responseMember)
    }

    await dispatch(actionGetContestById({ contestId: info?.contest?.id || info?.contestId }))
  }, [dispatch, info])

  useEffect(() => {
    dispatch(showLoading())
    getDetail()
    dispatch(hideLoading())
  }, [dispatch, getDetail])

  const hostInfo = useMemo(
    () => ({
      isHost: userInfo?.id === info?.createdBy,
      id: info?.createdBy,
    }),
    [info?.createdBy, userInfo?.id]
  )

  const onKickMember = (memberInfo: any) => {
    if (state.status === SocketStatus.CONNECTED) {
      const dataEmit = {
        code: info?.code,
        userId: memberInfo?.userId,
        accountId: memberInfo?.accountId,
      }
      // console.log('%c[emit] kick-exam/WR', 'background: yellow', dataEmit)
      state.socket?.emit('kick-exam', dataEmit, (result: any) => {})
    }
  }

  const onLeave = useCallback(() => {
    if (state.status === SocketStatus.CONNECTED) {
      dispatch(showLoading())
      // console.log('%c[emit] exit-exam/WR', 'background: yellow')
      state.socket?.emit(
        'exit-exam',
        {
          code: info?.code,
          userId: userInfo?.id,
          accountId: userInfo?.id,
        },
        (result: any) => {
          // console.log('%c[emit] exit-exam/WR results', 'background: yellow', result)
          dispatch(hideLoading())
          if (result.success === 1) {
            changePage('list')
          }
        }
      )
    }
  }, [changePage, dispatch, info?.code, state.socket, state.status, userInfo?.id])

  const onStartExam = async () => {
    if (state.status === SocketStatus.CONNECTED) {
      // console.log('%c[emit] start-exam/WR', 'background: yellow')
      state.socket?.emit('start-exam', { code: info?.code }, (result: any) => {
        // console.log('%c[emit] start-exam/WR results', 'background: yellow', result)
      })
    }
  }

  const eventController = useCallback(
    (data: { cmd: string; data: any }) => {
      // console.log('%c socket event waiting room, ', 'background: green; color: white', data)
      if (data?.cmd === 'join-exam') {
        // console.log('join-exam')
        const userObj = data?.data?.user
        if (userObj?.userId) {
          const isUserInRoom = member?.map((item) => item?.userId).includes(userObj.userId)
          if (isUserInRoom) return
          const newMember = [...member, userObj]
          setMember(newMember)
        }
      }
      if (data?.cmd === 'exit-exam') {
        // console.log('exit-exam')
        const userObj = data?.data?.user
        if (userObj?.userId) {
          const isUserInRoom = member
            ?.map((item) => item?.userId)
            .includes(Number(userObj.userId || ''))
          if (!isUserInRoom) return
          const newMember = member
            .slice()
            .filter((item: any) => item?.userId !== Number(userObj.userId || ''))
          setMember(newMember)
        }
      }
      if (data?.cmd === 'kick-exam') {
        // console.log('kick-exam')
        const userObj = data?.data?.user
        if (userObj?.userId) {
          if (userObj?.userId === userInfo?.id) {
            onLeave()
          }
          const isUserInRoom = member
            ?.map((item) => item?.userId)
            .includes(Number(userObj.userId || ''))
          if (!isUserInRoom) return
          const newMember = member
            .slice()
            .filter((item: any) => item?.userId !== Number(userObj.userId || ''))
          setMember(newMember)
        }
      }
      if (data?.cmd === 'host-leave-exam') {
        // console.log('host-leave-exam')
        onLeave()
      }
      if (data?.cmd === 'start-exam') {
        let timerInterval: any
        Swal.fire({
          title: 'Hãy sẵn sàng!',
          html: 'Bài thi sẽ bắt đầu trong <b></b> giây.',
          timer: 5000,
          timerProgressBar: true,
          showCloseButton: false,
          allowOutsideClick: false,
          didOpen: () => {
           //  Swal.showLoading()
            const b = Swal?.getHtmlContainer()?.querySelector('b')
            timerInterval = setInterval(() => {
              if (b) {
                b.textContent = String((Swal?.getTimerLeft() || 0) / 1000)
              }
            }, 100)
          },
          willClose: () => {
            clearInterval(timerInterval)
          },
        })
          .then(() => {
            changePage('examing')
            return ''
          })
          .catch((error: any) => {
            console.log(error)
          })
      }
    },
    [changePage, member, onLeave]
  )

  useEffect(() => {
    if (state.status === SocketStatus.CONNECTED) {
      state.socket?.on('events', (data: any) => eventController(data))
    }
    return () => {
      state.socket?.off('events')
    }
  }, [eventController, state.socket, state.status])

  return (
    <div className="waitingRoom__page">
      <h1 className="room__online--title my-3">
        Mã phòng:
        {' '}
        {info?.code}
      </h1>
      <ButtonShadow
        className="button__back"
        color="gray"
        content={<img src={backArrow} alt="back" />}
        onClick={onLeave}
      />
      <Row className="action__row my-4">
        {hostInfo?.isHost && (
          <>
            <Col className="d-flex flex-column align-items-center">
              <div
                className="icon__container"
                style={{ backgroundColor: '#04BC8A' }}
                onClick={onStartExam}
              >
                <img className="icon__img" src={icoPlay} alt="icon" />
              </div>
              <p>Bắt đầu</p>
            </Col>
            <Col className="d-flex flex-column align-items-center">
              <div
                className="icon__container"
                style={{ backgroundColor: '#FFCC00' }}
                onClick={() => setShowInviteModal(true)}
              >
                <img className="icon__img" src={icoPlan} alt="icon" />
              </div>
              <p>Mời</p>
            </Col>
            <Col className="d-flex flex-column align-items-center">
              <div
                className="icon__container"
                style={{ backgroundColor: '#D1D1D6' }}
                onClick={() => Swal.fire('Tính năng chưa mở', '', 'info')}
              >
                <img className="icon__img" src={icoChain} alt="icon" />
              </div>
              <p>Copy link</p>
            </Col>
          </>
        )}

        <Col className="d-flex flex-column align-items-center">
          <div className="icon__container" style={{ backgroundColor: '#FF7A00' }} onClick={onLeave}>
            <img className="icon__img" src={icoLeave} alt="icon" />
          </div>
          <p>Rời phòng</p>
        </Col>
      </Row>

      <div className="divider__horizontal my-3" />

      <div className="user__container">
        {member?.map((memberInfo: any) => {
          const isUserHost = memberInfo?.userId === hostInfo?.id
          return (
            <div className="user__item" key={memberInfo?.userId}>
              <div className="user__img--wrapper">
                <img
                  className="user__img"
                  src={convertUrl(memberInfo?.avatar, 'avata')}
                  alt="userAvata"
                />
                {hostInfo?.isHost && !isUserHost && (
                  <img
                    className="close__icon"
                    src={icoClose}
                    alt="icoClose"
                    onClick={() => onKickMember(memberInfo)}
                  />
                )}
              </div>
              <p>{isUserHost ? 'Chủ phòng' : memberInfo?.fullname || 'Unknown'}</p>
            </div>
          )
        })}
      </div>

      <ModalInvite
        roomInfo={info}
        visible={showInviteModal}
        closeModal={() => setShowInviteModal(false)}
      />
    </div>
  )
}

export default WaitingRoom
