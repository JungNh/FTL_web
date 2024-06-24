import React, { useState } from 'react'
import ContainerWithBack from '../../components/ContainerWithBack'
import './styles.scss'
import { Button } from 'react-bootstrap'
import { BsEyeFill, BsEyeSlashFill } from 'react-icons/bs'
import { useHistory, useLocation } from 'react-router-dom'

import ModalCustomArena from '../../components/ModalCustomArena'
import Spinner from 'react-bootstrap/Spinner'

type Message = {
  title: string
  desc: string
  isSuccess: boolean
  slugDesc: string
}
const ForgotPassword = () => {
  const [isShowPass, setIsShowPass] = useState<boolean>(false)
  const location = useLocation()

  const [password, setPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [errorMessPass, setErrorMessPass] = useState<string>('')
  const [isShowModal, setIsShowModal] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const [messageForgot, setMessageForgot] = useState<Message>({
    title: '',
    desc: '',
    isSuccess: false,
    slugDesc: ''
  })

  const history = useHistory()

  const getParamEmail = () => {
    const searchParams = location.search
    if (!searchParams || !searchParams.includes('@')) {
      return null
    }
    const email = searchParams.match(/[\w.-]+@[\w.-]+\.\w+/)
    return email ? email[0] : null
  }

  const onSubmitForm = async (event: { preventDefault: () => void }) => {
    event.preventDefault()

    if (password.trim().length < 6) {
      setErrorMessPass('Mật khẩu phải từ 6 kí tự trở lên')
    } else {
      setErrorMessPass('')
    }

    if (password.trim().length > 5 && confirmPassword.trim() === password.trim()) {
      setLoading(true)
      const body = {
        email: getParamEmail(),
        password: password.trim(),
        'confirm-password': confirmPassword.trim()
      }
      await fetch(`${process.env.REACT_APP_API_CORE}/user/confirmUrl`, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then((res) => res.json())
        .then((success) => {
          if (success?.code == 1) {
            setMessageForgot({
              title: 'Đổi mật khẩu thành công',
              desc: 'Bạn đã thay đổi mật khẩu thành công. ',
              slugDesc: 'Vui lòng đăng nhập lại với mật khẩu mới của bạn!',
              isSuccess: true
            })
            setIsShowModal(true)
          } else if (success?.statusCode == 400) {
            setMessageForgot({
              title: 'Đã quá hạn đổi mật khẩu!',
              desc: 'Link đổi mật khẩu chỉ có hiệu lực trong vòng 2h. ',
              slugDesc: 'Vui lòng thử lại sau !',
              isSuccess: false
            })
            setIsShowModal(true)
          }
        })
        .catch((err) => {
          console.log(err, 'errror')
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }

  const onChangeTextPass = (value: string) => {
    setPassword(value)
  }

  const onChangeTextConfirmPass = (value: string) => {
    setConfirmPassword(value)
  }

  const handleCloseModal = () => {
    setIsShowModal(false)
    if (messageForgot.isSuccess) {
      history.push('/login')
    }
  }

  return (
    <ContainerWithBack
      background="linear-gradient(to bottom, #69DBFF, #9BE7FF, #E5FFFF)"
      to="/login"
    >
      <form className="forgot-pass" onSubmit={onSubmitForm}>
        <div className="title-password ">Đặt mật khẩu mới</div>
        <div
          className="form-group-inline"
          style={{ marginBottom: errorMessPass.length > 0 ? 0 : 15 }}
        >
          <div className="text-pass">Mật khẩu mới</div>
          <div className="input-container">
            <input
              type={isShowPass ? 'text' : 'password'}
              className="input-pass"
              placeholder="Nhập mật khẩu"
              onChange={(value) => onChangeTextPass(value.target.value)}
            />
            {!isShowPass ? (
              <div className="input__icon__eye" onClick={() => setIsShowPass(true)}>
                <BsEyeSlashFill size={25} />
              </div>
            ) : (
              <div className="input__icon__eye" onClick={() => setIsShowPass(false)}>
                <BsEyeFill size={25} />
              </div>
            )}
          </div>
        </div>
        {errorMessPass.length > 0 && (
          <div className="error-message">
            <div>{errorMessPass}</div>
          </div>
        )}
        <div className="form-group-inline">
          <div className="text-pass">Nhập lại mật khẩu mới</div>
          <div className="input-container">
            <input
              type={isShowPass ? 'text' : 'password'}
              className="input-pass"
              onChange={(value) => onChangeTextConfirmPass(value.target.value)}
              placeholder="Nhập lại mật khẩu mới"
            />
            {!isShowPass ? (
              <div className="input__icon__eye" onClick={() => setIsShowPass(true)}>
                <BsEyeSlashFill size={25} />
              </div>
            ) : (
              <div className="input__icon__eye" onClick={() => setIsShowPass(false)}>
                <BsEyeFill size={25} />
              </div>
            )}
          </div>
        </div>
        {password.trim() !== confirmPassword.trim() && confirmPassword.length > 0 && (
          <div className="error-message">
            <div>Mật khẩu nhập lại không khớp</div>
          </div>
        )}
        <div className="button-confirm">
          <Button variant="primary" size={'lg'} type="submit" disabled={loading ? true : false}>
            {loading ? (
              <>
                <Spinner animation="border" size={'sm'} /> <span>Loading ...</span>
              </>
            ) : (
              'Xác nhận'
            )}
          </Button>
        </div>
      </form>
      <ModalCustomArena
        onHide={handleCloseModal}
        isClose
        show={isShowModal}
        onBackdropClick={handleCloseModal}
      >
        <div className="modal-forgot">
          <div className="title-pass">{messageForgot.title}</div>
          <div>
            <div>{messageForgot.desc}</div>
            <div>{messageForgot.slugDesc}</div>
          </div>
        </div>
      </ModalCustomArena>
    </ContainerWithBack>
  )
}

export default ForgotPassword
