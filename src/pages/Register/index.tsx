import * as React from 'react'

import { useState } from 'react'
import _ from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router'
import Swal from 'sweetalert2'
import logo from '../../assets/images/logo_login.png'
import RegisterSection from '../LoginPage/components/RegisterSection'
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

const RegiterPage: React.FC<Props> = () => {
  const history = useHistory()

  return (
    <div className="login__page">
      <img
        src={logo}
        alt="FutureLang"
        className="mb-5"
        onClick={() => sessionStorage.removeItem('IS_DEV')}
      />
      <div className="login__page--panel">
        <h1 className="login__title">{'Đăng ký'}</h1>
        <RegisterSection setCurrentView={()=>history.push('/login')} />
      </div>
    </div>
  )
}

export default RegiterPage
