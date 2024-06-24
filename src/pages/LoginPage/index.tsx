import * as React from 'react'

import { useState } from 'react'
import _ from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router'
import Swal from 'sweetalert2'
import logo from '../../assets/images/logo_login.png'
import EmailSection from './components/EmailSection'
import PasswordSection from './components/PasswordSection'
import ForgotPasswordSection from './components/ForgotPassSection'
import RegisterSection from './components/RegisterSection'
import NewPasswordSection from './components/NewPasswordSection'
import {
  actionCheckEmail,
  actionLogin,
  actionForgotPassword,
  actionRenewPassword,
  actionGetProfile,
  actionUserMe
} from '../../store/login/actions'

import { actionRegisterNotification } from '../../store/settings/actions'
import { RootState } from '../../store'
import { actionCheckUserHasSchool } from '../../store/home/actions'

type Props = Record<string, unknown>

const LoginPage: React.FC<Props> = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const firebaseToken = useSelector((state: RootState) => state.login.firebaseToken)
  const [loginAccount, setLoginAccount] = useState<any>(null)
  // const [isCheckUpdate, setIsCheckUpdate] = useState(true)
  const [loading, setLoading] = useState(false)
  const [currentView, setCurrentView] = useState<
    'email' | 'password' | 'forgotPassword' | 'register' | 'newPassword'
  >('email')

  const renderTitle = () => {
    switch (currentView) {
      case 'email':
        return 'Đăng nhập'
      case 'password':
        return 'Đăng nhập'
      case 'forgotPassword':
        return 'Quên mật khẩu'
      case 'register':
        return 'Đăng ký'
      case 'newPassword':
        return 'Lấy lại mật khẩu'
      default:
        return ''
    }
  }

  const registerNotification = (token: string) => {
    const response: any = dispatch(actionRegisterNotification({ token }))
    if (response) {
      // console.log('reponse register', response)
    }
  }

  const onEmailSecFinish = async (value?: string) => {
    if (value) {
      setLoading(true)
      const dataResult: any = await dispatch(
        actionCheckEmail({
          email: value
        })
      )
      if (!_.isEmpty(dataResult) && !_.isEmpty(dataResult.data) && dataResult.status === 200) {
        setCurrentView('password')
        setLoginAccount(dataResult.data)
      }
      setLoading(false)
    }
  }

  const onPassSecFinish = async (value: { password: string }) => {
    setLoading(true)

    const dataPass: any = await dispatch(
      actionLogin({
        email: loginAccount?.email || '',
        password: value.password
      })
    )
    if (!_.isEmpty(dataPass) && !_.isEmpty(dataPass.data) && dataPass.status === 200) {
      const token = localStorage.getItem('token')

      if (firebaseToken && token) await registerNotification(firebaseToken)

      const userMe: any = await dispatch(actionGetProfile())
      let resultUserHasSchool: any = await dispatch(actionCheckUserHasSchool())
      setLoading(false)
      await dispatch(actionUserMe())
      if (userMe?.data) {
        if (resultUserHasSchool?.data?.must_update) history.push('/update-profile')
        else history.push('/home')
      } else {
        history.push('/update-profile')
      }
    }
    setLoading(false)
  }

  const onForgotPassSecFinish = async (value?: string) => {
    if (value) {
      await sessionStorage.setItem('@email-forgot-pass', value)
      setLoading(true)
      const dataForgot: any = await dispatch(
        actionForgotPassword({
          email: value
        })
      )
      setLoading(false)

      if (!_.isEmpty(dataForgot) && dataForgot.status === 200) {
        Swal.fire(
          'Mã xác thực đã được gởi đến email của bạn.',
          'Vui lòng kiểm tra email để reset mật khẩu.',
          'info'
        )
        setCurrentView('newPassword')
      }
    }
  }

  const onNewPassSecFinish = async (value: {
    password: string
    rePassword: string
    otp: string
  }) => {
    console.log(value, 'value')

    setLoading(true)
    const dataChangePass: any = await dispatch(
      actionRenewPassword({
        email: loginAccount?.email || '',
        otp: value.otp,
        password: value.password,
        'confirm-password': value.password
      })
    )
    console.log(dataChangePass, 'dataChangePassdataChangePass')

    setLoading(false)
    if (!_.isEmpty(dataChangePass) && dataChangePass.code === 1) {
      Swal.fire('Mật khẩu của bạn đã được đổi thành công', '', 'success')
      setCurrentView('password')
    } else {
      Swal.fire('Mã xác nhận không đúng. Vui lòng kiểm tra lại!', '', 'warning')
    }
  }
  return (
    <div className="login__page">
      <img
        src={logo}
        alt="FutureLang"
        className="mb-5"
        onClick={() => sessionStorage.removeItem('IS_DEV')}
      />
      <div className="login__page--panel">
        <h1 className="login__title">{renderTitle()}</h1>

        {/* Username section */}
        {currentView === 'email' && (
          <EmailSection
            setCurrentView={() => history.push('/register')}
            loading={loading}
            onFinish={onEmailSecFinish}
          />
        )}

        {/* Password section */}
        {currentView === 'password' && (
          <PasswordSection
            loginAccount={loginAccount}
            loginOtherAcc={() => setCurrentView('email')}
            setCurrentView={setCurrentView}
            loading={loading}
            onFinish={onPassSecFinish}
          />
        )}

        {/* Forget Password section */}
        {currentView === 'forgotPassword' && (
          <ForgotPasswordSection
            setCurrentView={setCurrentView}
            loading={loading}
            onFinish={onForgotPassSecFinish}
            initEmail={loginAccount?.email || ''}
          />
        )}
        {/* Retype Password section */}
        {currentView === 'newPassword' && (
          <NewPasswordSection
            setCurrentView={setCurrentView}
            loading={loading}
            onFinish={onNewPassSecFinish}
          />
        )}

        {/* Register section */}
        {currentView === 'register' && <RegisterSection setCurrentView={setCurrentView} />}

        {currentView !== 'newPassword' &&
          currentView !== 'register' &&
          currentView !== 'forgotPassword' && (
            <p className="sub__text">
              Được bảo vệ bởi reCAPTCHA và dựa theo Quy tắc Quyền riêng tư của Google.
            </p>
          )}
      </div>
    </div>
  )
}

export default LoginPage
