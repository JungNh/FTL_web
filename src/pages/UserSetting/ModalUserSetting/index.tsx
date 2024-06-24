import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import { IoClose } from 'react-icons/io5'

import './style.scss'
import { useDispatch } from 'react-redux'
import TabPassword from '../components/TabPassword'
import TabAffiliate from '../components/TabAffiliate'
import TabTutorial from '../components/TabTutorial'
import TabContact from '../components/TabContact'
import TabCondition from '../components/TabCondition'
import TabInfo from '../components/TabInfo'

interface Props {
  isShow: boolean
  tab: string
  handleClose: () => void
}

const ModalUserSetting = ({ isShow, tab, handleClose }: Props) => {
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
        {/* <div className="mb-60px text-right">
        </div> */}
        <IoClose className="icon-close" onClick={handleClose} />
        {tab === 'change-pass' && <TabPassword />}
        {tab === 'affiliate' && <TabAffiliate />}
        {tab === 'tutorial' && <TabTutorial />}
        {tab === 'contact' && <TabContact />}
        {tab === 'condition' && <TabCondition />}
        {tab === 'info' && <TabInfo />}
      </Modal.Body>
    </Modal>
  )
}

export default React.memo(ModalUserSetting)
