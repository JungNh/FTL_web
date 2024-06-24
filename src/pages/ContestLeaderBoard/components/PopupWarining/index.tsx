import * as React from 'react'
import Button from '../../../../components/Button'

import PopupContainer from '../../../../components/PopupContainer'
import './styles.scss'

type Props = {
  message: string
  setIsShowPopup: () => void
  isShow: boolean
}

const PopupWarining: React.FC<Props> = ({ message, setIsShowPopup, isShow }) => {
  return isShow ? (
    <PopupContainer withClose={true} onClose={setIsShowPopup}>
      <div className="popup__component">
        <div className="content__text">
          <p>
            <b>{message}</b>
          </p>
        </div>
        <div className="content__buttons">
          <Button.Shadow content="XÁC NHẬN" color="blue" onClick={setIsShowPopup} />
        </div>
      </div>
    </PopupContainer>
  ) : null
}

export default PopupWarining
