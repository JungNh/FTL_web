import * as React from 'react'
import _ from 'lodash'
import './styles.scss'

import PopupContainer from '../../../../components/PopupContainer'
import Button from '../../../../components/Button'

type Props = {
  onRedirect: any,
  open: boolean,
}

const PopupRecievedGifts: React.FC<Props> = ({ open, onRedirect }) => {
  return open ? (
    <PopupContainer withClose={false}>
      <div className="popupnodata__component">
        <div className="content__text">
          <p>Bạn đã quay thưởng cho vòng này, vui lòng kiểm tra kho quà tặng</p>
        </div>
        <div className="content__buttons">
          <Button.Shadow content="QUÀ TẶNG" color="blue" onClick={onRedirect} />
        </div>
      </div>
    </PopupContainer>
  ) : null;
}

export default PopupRecievedGifts
