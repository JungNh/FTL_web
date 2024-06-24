import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import { IoClose } from 'react-icons/io5'
import img_qr from '../../../assets/images/qr_app.png'

import './style.scss'
import { useDispatch } from 'react-redux'

interface Props {
  isShow: boolean
  handleClose: () => void
}

const PopupQR = ({ isShow, handleClose }: Props) => {
  const [dataCardTitle, setDataCardTitle] = useState({
    type: 'notfound',
    message: ''
  })

  const dispatch = useDispatch()

  return (
    <Modal
      className="modal_user_setting"
      show={isShow}
      onHide={handleClose}
      centered
      keyboard={false}
    >
      <Modal.Body style={{ backgroundColor: 'white', borderRadius: 20 }}>
        <IoClose
          className="icon-close"
          onClick={handleClose}
          style={{ marginTop: -30, marginRight: -40 }}
        />
        <img src={img_qr} className="qr_img" />
      </Modal.Body>
    </Modal>

  )
}

export default React.memo(PopupQR)
