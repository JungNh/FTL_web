import * as React from 'react'
import _ from 'lodash'
import './styles.scss'
import { useState } from 'react'

import PopupContainer from '../../../../components/PopupContainer'
import Button from '../../../../components/Button'

import warning from '../../../../assets/images/warning.png'
import { useDispatch } from 'react-redux'
import { saveIsOpenEditUser } from '../../../../store/arena/actions'

type Props = {
  open: boolean
  questions: Question[]
  onClose: any
  onSubmit: any
  handleLoginCourse?: any
  setShowModal?: any
  userInfo?: any
  formUser?: any
  setFormUser: any
  setPopUpdateInfo?: any
  code?: string
  statusBtn: string
  handleUpcoming: any
}

const PopupArena: React.FC<Props> = ({
  open,
  onClose,
  userInfo,
  handleLoginCourse,
  setFormUser,
  formUser,
  setPopUpdateInfo,
  code,
  statusBtn,
  handleUpcoming
}) => {
  const [valueCode, setValueCode] = useState<string>('')
  const [reqInput, setReqInput] = useState<boolean>(false)
  const dispatch = useDispatch()
  const handleConfirm = () => {
    if (formUser) {
      if (code === '') {
        if (statusBtn === 'HAPPENNING') {
          handleLoginCourse()
        } else if (statusBtn === 'UPCOMING') handleUpcoming()
        onClose()
        return
      } else setFormUser(false)
    } else {
      if (valueCode === '' || valueCode !== code) {
        setReqInput(true)
      } else {
        onClose()
        if (statusBtn === 'HAPPENNING') {
          handleLoginCourse()
        } else if (statusBtn === 'UPCOMING') handleUpcoming()
        setFormUser(true)
        setReqInput(false)
      }
    }
  }

  React.useEffect(() => {
    if (valueCode !== '') {
      setReqInput(false)
    }
  }, [valueCode])

  return open ? (
    <PopupContainer onClose={onClose} withClose={true}>
      <div className="popupsubmit__component">
        {/* {getNotAnswerList(list)} */}
        {formUser ? (
          <>
            <div className="content__text">
              <p>Đây có phải thông tin của bạn không ?</p>
            </div>
            <div className="content">
              <div className="class__content">
                <p>Tên hiển thị</p>
                {userInfo?.school ? <p>Trường</p> : <p>Cấp</p>}
                {/* <p>Lớp</p> */}
              </div>
              <div className="var__content">
                <p>: {userInfo?.fullname}</p>
                {userInfo?.school ? (
                  <p>: {userInfo?.school?.name}</p>
                ) : (
                  <p>: {userInfo?.school_level?.name}</p>
                )}
                {/* <p>: {userInfo.class}</p> */}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="content__text">
              <p>Nhập mã code</p>
            </div>
            <div className="input__code">
              <input
                className={reqInput ? 'eror' : ''}
                value={valueCode}
                onChange={(e: any) => {
                  setValueCode(e.target.value)
                }}
              />
              {reqInput && (
                <p className="error_message">
                  {valueCode === ''
                    ? 'Mã code không được để trống'
                    : 'Sai mã code, vui lòng nhập lại'}
                </p>
              )}
            </div>
          </>
        )}
        <div className="content__buttons">
          {formUser && (
            <Button.Shadow
              content="Chỉnh sửa"
              color="gray"
              onClick={() => {
                dispatch(saveIsOpenEditUser(true))
                // setPopUpdateInfo(true)
                onClose()
              }}
            />
          )}
          <Button.Shadow content="Xác nhận" color="gray" onClick={handleConfirm} />
          {/* {!_.isEmpty(list) && <Button.Shadow content="LÀM TIẾP" onClick={onClose} />} */}
        </div>
      </div>
    </PopupContainer>
  ) : null
}

export default PopupArena
