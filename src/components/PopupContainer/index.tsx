import * as React from 'react'
import type { FC } from 'react'

import fubo_blink from '../../assets/images/fubo_blink.svg'
import './styles.scss'

type Props = {
  onClose?: any
  withClose?: boolean
}

const PopupContainer: FC<Props> = ({ onClose, children, withClose = true }) => {
  return (
    <div className="popupcontainer__component">
      <div className="popupcontainer__wrapper">
        <img className="popupcontainer__logo" src={fubo_blink} />
        {withClose && (
          <div className="popupcontainer__close" onClick={onClose}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13.2034 2.67773L2.52545 13.3557"
                stroke="#444444"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2.52545 2.67773L13.2034 13.3557"
                stroke="#444444"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
        <div className="popupcontainer__content">{children}</div>
      </div>
    </div>
  )
}

export default PopupContainer
