import * as React from 'react'
import { useHistory } from 'react-router'
import './styles.scss'

import Button from '../../../../components/Button'
import PopupContainer from '../../../../components/PopupContainer'
import { openInNewTab } from '../../../../utils/common'

type Props = {
  open: boolean
  onClick: any
  gift: string
}

const PopupGift: React.FC<Props> = ({ open, onClick, gift }) => {
  return open ? (
    <PopupContainer withClose={false}>
      <div className="popupgift__component">
        <div className="content__text">
          <p>Chúc mừng bạn đã nhận được phần thưởng là</p>
          <p>
            <div style={{ fontWeight: '500' }}>{gift}</div>
          </p>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row'
          }}
        >
          <Button.Shadow content="Tổng Kết" onClick={onClick} style={{ marginRight: 20 }} />
          <Button.Shadow
            color="gray"
            onClick={() => openInNewTab('https://hoc.futurelang.vn/')}
            content={'Trang chủ'}
          />
        </div>
      </div>
    </PopupContainer>
  ) : null
}

export default PopupGift
