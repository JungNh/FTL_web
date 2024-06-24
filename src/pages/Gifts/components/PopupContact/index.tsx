import * as React from 'react'
import type { FC } from 'react'

import Button from '../../../../components/Button'
import PopupContainer from '../../../../components/PopupContainer'
import './styles.scss'
import { useHistory } from 'react-router'

type Props = {
  open: boolean
  onClose: any
}

const PopupContact: FC<Props> = ({ open, onClose }) => {
  const history = useHistory()
  return open ? (
    <PopupContainer onClose={onClose}>
      <div className="popupcontact__component">
        <div className="content__text">
          <p> Liên hệ tới hotline:</p>
          <p>
            <bdo>1900252586</bdo>
          </p>
          <p>để biết thêm thông tin chi tiết và nhận quà nhé!</p>
        </div>
        <Button.Shadow
          content="Liên hệ"
          onClick={() => {
            history.push({
              pathname: '/user-setting',
              state: { tabPanel: 'contact' }
            })
          }}
        />
      </div>
    </PopupContainer>
  ) : null
}

export default PopupContact
