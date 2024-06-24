import * as React from 'react'
import { useHistory } from 'react-router'
import Button from '../../../../components/Button'

import PopupContainer from '../../../../components/PopupContainer'
import './styles.scss'

type Props = {
  message: any
}

const Popup: React.FC<Props> = ({ message }) => {
  const history = useHistory()
  return !!message ? (
    <PopupContainer withClose={false}>
      <div className="popup__component">
        <div className="content__text">
          <p>
            <b>{message}</b>
          </p>
        </div>
        <div className="content__buttons">
          <Button.Shadow
            content="VỀ TRANG CHỦ"
            color="blue"
            onClick={() => history.push(`/arena`)}
          />
        </div>
      </div>
    </PopupContainer>
  ) : null
}

export default Popup
