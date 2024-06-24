import React, { FC } from 'react'
import { SocketProvider } from '../../hooks/useWebSockets'
import SocketInit from '../../hooks/useWebSockets/SocketInit'
import OnlineContainer from './children/OnlineContainer'

type Props = {
  //
}

const RoomOnline: FC<Props> = () => (
  <div className="room__online__page">
    <SocketProvider>
      <SocketInit />
      <OnlineContainer />
    </SocketProvider>
  </div>
)

export default RoomOnline
