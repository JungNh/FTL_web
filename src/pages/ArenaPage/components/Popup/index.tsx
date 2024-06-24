import * as React from 'react'
import type { FC } from 'react'

import PopupContainer from '../../../../components/PopupContainer'
import './styles.scss'

type Props = {
  open: boolean
  onClose?: any
  children: React.ReactNode
}

const Popup: FC<Props> = ({ open, onClose, children }) => {
  return open ? (
    <PopupContainer onClose={onClose}>
      <div className="popup__component">{children}</div>
    </PopupContainer>
  ) : null
}

export default Popup
