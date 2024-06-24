import * as React from 'react'
import _ from 'lodash'
import './styles.scss'

import PopupContainer from '../../../../components/PopupContainer'
import Button from '../../../../components/Button'

interface Props {
  onRedirect: any
  message: string
}

const PopupNotifiText: React.FC<Props> = ({ onRedirect, message }) => {
  const [display, setDisplay] = React.useState(false)

  return (
    <div>
      <PopupContainer withClose={false}>
        <div className="popupnodata__component">
          <div className="content__text">
            <p>{message}</p>
          </div>
          <div className="content__buttons">
            <button
              color="blue"
              onClick={() => {
                setDisplay(true)
                onRedirect()
              }}
            >
              Tiếp tục
            </button>
          </div>
        </div>
      </PopupContainer>
    </div>
  )
}

export default PopupNotifiText
