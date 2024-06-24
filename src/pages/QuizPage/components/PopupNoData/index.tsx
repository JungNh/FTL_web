import * as React from 'react'
import _ from 'lodash'
import './styles.scss'

import PopupContainer from '../../../../components/PopupContainer'
import Button from '../../../../components/Button'

interface Props {
  onRedirect: any
  message: string
}

const PopupNoData: React.FC<Props> = ({ onRedirect, message }) => {
  return (
    <PopupContainer withClose={false}>
      <div className="popupnodata__component">
        <div className="content__text">
          <p>{message}</p>
        </div>
        <div className="content__buttons">
          <Button.Shadow content="VỀ TRANG CHỦ" color="blue" onClick={onRedirect} />
        </div>
      </div>
    </PopupContainer>
  )
}

export default PopupNoData
