import _ from 'lodash'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory, useLocation } from 'react-router'
import { Types } from '../../store/login/types'
import { api } from '../../lib'
import { apiCore } from '../../lib-core'
import './styles.scss'
import loadingGif from './components/loading.gif'

export default function TokenCAS() {
  const location = useLocation()
  console.log(location.search.slice(1), 'search ===>>> ')
  const dispatch = useDispatch()
  const history = useHistory()

  const { innerWidth: width, innerHeight: height } = window

  const getTokenUser = async () => {
    try {
      await fetch(`${process.env.REACT_APP_API_CORE}/user/auto/login`, {
        method: 'POST',
        body: JSON.stringify({ token: location.search.slice(1) }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then((res) => res.json())
        .then((success) => {
          console.log(success.data.token, 'success')
          localStorage.setItem('token', success?.data?.token)
          localStorage.setItem('showFubo', 'FUBO')
          if (success.status == 200) {
            handleCAS()
          }
        })
        .catch((err) => {
          console.log(err)
        })
    } catch (error) {
      console.log(error, 'errrr====>>>>')
    }
  }

  const saveInfoUser = async () => {
    const response = await api.get('/me')
    if (!_.isEmpty(response) && !_.isEmpty(response?.data)) {
      dispatch({
        type: Types.SAVE_USER_INFO,
        payload: response?.data?.data
      })
      return response.data
    }
  }
  const saveUserInfoCore = async () => {
    const response = await apiCore.post('/user/me')

    if (!_.isEmpty(response) && !_.isEmpty(response?.data)) {
      dispatch({
        type: Types.SAVE_USER_INFO_CORE,
        payload: response?.data?.data
      })
      return response.data
    }
  }

  const handleCAS = async () => {
    const me = await saveInfoUser()
    const meCore = await saveUserInfoCore()

    if (me?.status == 200 && meCore?.status == 200) {
      history.push('/home')
    }
  }

  useEffect(() => {
    getTokenUser()
  }, [location.search])

  return (
    <div
      style={{
        flex: 1,
        width: width,
        height: height,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
      }}
    >
      <img src={loadingGif} alt="" />
      <p
        style={{
          fontSize: 20,
          fontWeight: '600',
          margin: 0
        }}
      >
        Đang đăng nhập
      </p>
    </div>
  )
}
