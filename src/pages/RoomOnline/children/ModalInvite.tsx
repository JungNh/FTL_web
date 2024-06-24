import React, {
  FC, useCallback, useContext, useState,
} from 'react'
import {
  Modal, Button, Image, Badge,
} from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { debounce } from 'lodash'
import Swal from 'sweetalert2'
import { Input } from '../../../components'
import avataPlaceholder from '../../../assets/images/avata.jpg'
import { actionGetUserExams } from '../../../store/roomOnline/actions'
import { SocketContext, SocketContextProps, SocketStatus } from '../../../hooks/useWebSockets'
import { RootState } from '../../../store'

type Props = {
  visible: boolean
  roomInfo: any
  closeModal: () => void
}

type UserType = {
  userId: number
  accountId: number
  fullname: string
  avatar: string
  sex: string
  dob: string
  isOnline: true
}

const ModalInvite: FC<Props> = ({ visible, closeModal, roomInfo }) => {
  const dispatch = useDispatch()

  const [listUser, setListUser] = useState<UserType[]>([])
  const [inputValue, setInputValue] = useState('')
  const userInfo = useSelector((state: RootState) => state.login.userInfo)
  const { state } = useContext(SocketContext) as SocketContextProps

  const onSearchUser = useCallback(
    async (text: string) => {
      const response: any = await dispatch(actionGetUserExams({ text }))

      if (response) {
        setListUser(response)
      }
    },
    [dispatch]
  )

  const onSearch = useCallback(
    debounce((text: string) => onSearchUser(text), 500),
    []
  )

  const inviteUser = (user: UserType) => {
    if (state.status === SocketStatus.CONNECTED) {
      const dataEmit = {
        code: roomInfo?.code,
        userId: user?.userId,
        accountId: user?.accountId || undefined,
      }
      // console.log('%c[emit] invite-exam/WR', 'background: yellow', dataEmit)
      state.socket?.emit('invite-exam', dataEmit, (result: any) => {
        // console.log('%c[emit] invite-exam/WR resutls', 'background: yellow', result)
        if (result.success === 1) {
          Swal.fire('Đã mời thành công', '', 'success')
        } else {
          Swal.fire('Đã xảy ra lỗi', '', 'error')
        }
      })
    }
  }

  return (
    <Modal
      // size="lg"
      className="modal_invite_user"
      show={visible}
      onHide={() => closeModal()}
    >
      <Modal.Header>
        <div className="modal__header--title">Mời người chơi</div>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-5">
          <Input.Text
            value={inputValue}
            onChange={(value: string) => {
              setInputValue(value)
              if (value) {
                onSearch(value)
              }
            }}
            className="mb-3"
            placeholder="Nhập tên người dùng để tìm kiếm"
          />
          <div className="invite__list">
            {listUser?.map((user: UserType) => (
              <div key={user?.userId} className="invite__list--row">
                <div className="d-flex">
                  <div className="me-3">
                    <Image
                      src={user?.avatar || avataPlaceholder}
                      roundedCircle
                      className="avatar_holder"
                    />
                  </div>
                  <div className="me-3">{user?.fullname}</div>
                  <div>
                    {user?.isOnline ? (
                      <Badge pill style={{ background: '#198754' }}>
                        Online
                      </Badge>
                    ) : (
                      <Badge pill style={{ background: '#b2b2b2' }}>
                        Offline
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="pe-2">
                  {user?.isOnline && userInfo.id !== user?.userId && (
                    <Button variant="primary" onClick={() => inviteUser(user)}>
                      Mời
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default ModalInvite
