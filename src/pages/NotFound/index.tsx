import React from 'react'
import { useHistory } from 'react-router'
import { Button } from '../../components'

const NotFoundPage = () => {
  const history = useHistory()
  return (
    <div>
      NotFound
      <Button.Shadow content="Trở về trang chủ" onClick={() => history.push('/home')} />
    </div>
  )
}

export default NotFoundPage
