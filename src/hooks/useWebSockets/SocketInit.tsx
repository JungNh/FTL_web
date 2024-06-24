import React, { FC, useContext, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { io } from 'socket.io-client'
import { SocketContext, SocketStatus } from '.'
import { RootState } from '../../store'

type Props = {
  children?: any
}

const SocketInit: FC<Props> = ({ children }) => {
  const { state, dispatch } = useContext(SocketContext)
  const { socket, status } = state
  const storeToken = useSelector((rState: RootState) => rState.login?.authUser?.token)

  useEffect(() => {
    const token = storeToken || localStorage.getItem('token')
    if (!socket) {
      if (token) {
        const newSocket = io('http://125.212.235.135:40011', {
          auth: { token },
          forceNew: true,
          transports: ['websocket', 'polling'],
          timeout: 10000,
        })
        dispatch({
          type: 'CONNECT',
          payload: { data: newSocket },
        })
      }
    }
  }, [dispatch, socket, storeToken])

  useEffect(() => () => {
    if (socket) {
      console.log('%csocket disconnecting', 'background: red; color: white')
      socket.disconnect()
    }
  }, [socket])

  useEffect(() => {
    if (socket && status === SocketStatus.CONNECTING) {
      console.log('%c socket is connecting', 'background: #B2B2B2; color: red')

      socket.on('connect', () => {
        console.log(
          '%c socket is connected: ',
          'background: #bbbbbb; color: green',
          'socket instance',
          socket
        )
        dispatch({
          type: 'CONNECTED',
        })
      })
    }
    if (socket && status === SocketStatus.CONNECTED) {
      socket.on('disconnect', (reason: any) => {
        console.log('%c socket is disconnect: ', 'background: #bbbbbb; color: green', reason)
        dispatch({
          type: 'DISCONNECT',
        })
      })
    }
  }, [dispatch, socket, status])

  return <div>{children}</div>
}

export default SocketInit
