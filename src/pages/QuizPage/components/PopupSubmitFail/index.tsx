import * as React from 'react'
import './styles.scss'

import Button from '../../../../components/Button'
import PopupContainer from '../../../../components/PopupContainer'

type Props = {
  contest: string
  open: boolean
  onClose: any
}

const PopupSubmitSucceed: React.FC<Props> = ({ contest, open, onClose }) => {
  return open ? (
    <PopupContainer onClose={onClose}>
      <div className="popupcongrats__component">
        <div className="content__text">
          <p>Lỗi nộp bài</p>
          <p>
            <strong>{contest}</strong>
          </p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button.Shadow content="QUAY LẠI ĐẤU TRƯỜNG" onClick={onClose} />
        </div>
      </div>
    </PopupContainer>
  ) : null
}

export default PopupSubmitSucceed
