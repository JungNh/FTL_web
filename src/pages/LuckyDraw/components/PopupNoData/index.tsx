import * as React from 'react'
import _ from 'lodash'
import './styles.scss'

import PopupContainer from '../../../../components/PopupContainer'
import Button from '../../../../components/Button'

type Props = {
  onRedirect: any,
}

const PopupNoData: React.FC<Props> = ({ onRedirect }) => {
  return (
    <PopupContainer withClose={false}>
      <div className="popupnodata__component">
        <div className="content__text">
          <p>Bạn không có quyền quay thưởng cho vòng này</p>
        </div>
        <div className="content__buttons">
          <Button.Shadow content="VỀ TRANG CHỦ" color="blue" onClick={onRedirect} />
        </div>
      </div>
    </PopupContainer>
  );
}

export default PopupNoData
