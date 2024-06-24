import * as React from 'react'
import _ from 'lodash'
import { useHistory } from 'react-router-dom'
import './styles.scss'
import PopupContainer from '../../components/PopupContainer'
import { getArenaAuththentication } from '../../lib/arenaApi'

const ArenaPage: React.FC = () => {
  const history = useHistory()

  React.useEffect(() => {
    const success = () => history.push('/arena')
    const failed = () => history.push('/home')
    getArenaAuththentication(success, failed).catch(failed)
  },[])

  return (
    <PopupContainer>
      <div className="popup__component">
        <p>Đang đăng nhập vào đấu trường ...</p>
      </div>
    </PopupContainer>
  )
}

export default ArenaPage
