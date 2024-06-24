import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import { IoClose } from 'react-icons/io5'

import '../../pages/UserSetting/ModalUserSetting/style.scss'
import { useDispatch } from 'react-redux'
import logo from '../../assets/icon.png'
import TabTutorial from '../../pages/UserSetting/components/TabTutorial'

interface Props {
  isShow: boolean
  tab: string
  handleClose: () => void
  platform: any
}

const ModalHandleMobile = ({ isShow, tab, handleClose, platform }: Props) => {
  const [dataCardTitle, setDataCardTitle] = useState({
    type: 'notfound',
    message: ''
  })
  const openExtenalLink = (url: string) => {
    window.open(url, '_blank')?.focus()
  }

  return (
    <Modal
      className="modal_user_setting"
      show={isShow}
      onHide={handleClose}
      centered
      keyboard={false}
    >
      <Modal.Body style={{ backgroundColor: 'white', borderRadius: 20 }}>
        <IoClose className="icon-close" onClick={handleClose} />
        <div
          style={{
            zIndex: 2,
            display: 'flex',
            marginTop: 30,
            marginBottom: 15
          }}
        >
          <img src={logo} style={{ width: 100, height: 100, borderRadius: 10 }} />
          <div style={{ flex: 1, paddingLeft: 10 }}>
            <div style={{ fontSize: 18, fontWeight: '700' }}>
              Học mượt hơn với ứng dụng Futurelang
            </div>
            <div style={{ fontSize: 18, color: 'gray' }}>{`Dùng thử miễn phí trên ${
              platform == 'Android' ? 'Google Store' : platform == 'iOS' ? 'App Store' : ''
            }`}</div>
            <div
              style={{
                backgroundColor: '#378cff',
                maxWidth: 100,
                padding: 5,
                borderRadius: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: 18,
                fontWeight: '500',
                marginTop: 10
              }}
              onClick={() => {
                if (platform == 'Android') {
                  openExtenalLink(
                    'https://play.google.com/store/apps/details?id=com.futurelang&hl=vi'
                  )
                } else {
                  openExtenalLink('https://apps.apple.com/vn/app/future-lang/id1533923999')
                }
              }}
            >
              Tải về
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default React.memo(ModalHandleMobile)
