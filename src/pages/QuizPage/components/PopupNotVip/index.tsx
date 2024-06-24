import * as React from 'react'
import _ from 'lodash'
import './styles.scss'

import PopupContainer from '../../../../components/PopupContainer'
import Button from '../../../../components/Button'
import { useHistory } from 'react-router'
import ModalCustomArena from '../../../../components/ModalCustomArena'

type Props = {
  onRedirect: any
  setShowPopupVip: any
  isShowPopupVip: boolean
}

const PopupNotVip: React.FC<Props> = ({ onRedirect, setShowPopupVip, isShowPopupVip }) => {
  return (
    // <PopupContainer withClose={false}>
    //   <div className="popupnodata__component">
    //     <div className="content__text">
    //       <p>Bạn không đủ điều kiện tham gia vòng thi này</p>
    //       <p style={{ fontWeight: 'bold', fontSize: 15, color: '#333' }}>
    //         Bạn vui lòng nâng cấp thẻ VIP để tham gia
    //       </p>
    //     </div>

    //     <div className="content__buttons">
    //       <Button.Shadow content="VỀ TRANG CHỦ" color="blue" onClick={onRedirect} />
    //     </div>
    //   </div>
    // </PopupContainer>
    <ModalCustomArena show={isShowPopupVip} isClose onHide={() => setShowPopupVip(false)}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 20,
          flexDirection: 'column'
        }}
      >
        <div className="popupnodata__component">
          <div className="content__text">
            <p>Bạn không đủ điều kiện tham gia vòng thi này</p>
            <p style={{ fontWeight: 'bold', fontSize: 15, color: '#333' }}>
              Bạn vui lòng nâng cấp thẻ VIP để tham gia
            </p>
          </div>

          <div className="content__buttons">
            <Button.Shadow content="VỀ TRANG CHỦ" color="blue" onClick={onRedirect} />
          </div>
        </div>
      </div>
    </ModalCustomArena>
  )
}

export default PopupNotVip
