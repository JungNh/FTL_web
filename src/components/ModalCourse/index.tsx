import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import { IoClose } from 'react-icons/io5'

import './style.scss'
import { useDispatch } from 'react-redux'
import AllCourse from '../../pages/Homepage/AllCourse'

interface Props {
  isShow: boolean
  handleClose: () => void
  data: any
}

const ModalUserSetting = ({ isShow, handleClose, data }: Props) => {
  const [dataCardTitle, setDataCardTitle] = useState({
    type: 'notfound',
    message: ''
  })

  console.log('detailCourse', data)

  const dispatch = useDispatch()

  return (
      <Modal show={isShow} onHide={handleClose} centered keyboard={false}>
        <div className="modal_body_course">
          <IoClose className="icon-close" onClick={handleClose} />
          <AllCourse
            setCurrentKey={function (data: string): void {
              throw new Error('Function not implemented.')
            }}
            detailCourse={data}
          />
        </div>
      </Modal>
  )
}

export default React.memo(ModalUserSetting)
