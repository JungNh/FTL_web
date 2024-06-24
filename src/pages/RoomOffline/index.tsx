import React, { FC, useState } from 'react'
import HomeOffline from './children/HomeOffline'
import QuizRoom from './children/QuizRoom'
import { PageType } from './types'

type Props = {
  //
}

const RoomOnline: FC<Props> = () => {
  const [page, setPage] = useState<PageType>('home')

  return (
    <div className="room__offline__page">
      {page === 'home' && <HomeOffline changePage={setPage} />}
      {page === 'examing' && <QuizRoom changePage={setPage} />}
    </div>
  )
}

export default RoomOnline
