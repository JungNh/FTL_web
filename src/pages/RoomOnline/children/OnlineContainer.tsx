import React, { useState } from 'react'
import CreateRoom from './CreateRoom'
import ListRoom from './ListRoom'
import QuizRoom from './QuizRoom'
import WaitingRoom from './WaitingRoom'

import { PageType } from '../types'

const OnlineContainer = () => {
  const [page, setPage] = useState<PageType>('list')

  return (
    <div>
      {page === 'list' && <ListRoom changePage={setPage} />}
      {page === 'create' && <CreateRoom changePage={setPage} />}
      {page === 'waiting' && <WaitingRoom changePage={setPage} />}
      {page === 'examing' && <QuizRoom changePage={setPage} />}
    </div>
  )
}

export default OnlineContainer
