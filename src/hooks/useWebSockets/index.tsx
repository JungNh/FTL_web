import React, { createContext, Dispatch, useReducer } from 'react'
import io, { Socket } from 'socket.io-client'

export enum SocketStatus {
  CONNECTING,
  CONNECTED,
  DISCONNECTING,
  DISCONNECTED
}

export type SocketContextProps = {
  state: StateProps
  dispatch: Dispatch<any>
}

export type StateProps = {
  socket: Socket | null
  status: SocketStatus
}

const initialSocketContext = {
  socket: null,
  status: SocketStatus.DISCONNECTED,
}

export type ParamType = {
  type: string
  payload: any
}

const reducer = (state: StateProps, action: ParamType) => {
  /**
   * reducer xử lý các action socket reducer
   */
  switch (action.type) {
    case 'CONNECT':
      return {
        ...state,
        status: SocketStatus.CONNECTING,
        socket: action.payload.data,
      }
    case 'CONNECTED':
      return {
        ...state,
        status: SocketStatus.CONNECTED,
      }
    case 'DISCONNECT':
      return {
        ...state,
        status: SocketStatus.DISCONNECTING,
        socket: null,
      }
    case 'DISCONNECTED':
      return {
        ...state,
        status: SocketStatus.DISCONNECTED,
      }

    default:
      return state
  }
}

const SocketContext = createContext<SocketContextProps>({
  state: initialSocketContext,
  dispatch: () => null,
})

const { Provider } = SocketContext

const SocketProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(reducer, initialSocketContext)

  return <Provider value={{ state, dispatch } as any}>{children}</Provider>
}

export { SocketProvider, SocketContext }
