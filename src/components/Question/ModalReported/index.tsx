import { ErrorMessage } from '@hookform/error-message'
import _ from 'lodash'
import React from 'react'
import { Button, Modal } from 'react-bootstrap'
import { IoClose } from 'react-icons/io5'
import RobotCardCode from '../../../assets/images/robot_card_code.svg'

interface Props {
  isShow: any
  handleClose: () => void
}

const ModalReported = ({ isShow, handleClose }: Props) => {
  return (
    <Modal show={isShow} onHide={handleClose} centered backdrop="static" keyboard={false}>
      <Modal.Body className="relative">
        <div className="mb-60px text-right">
          <img
            className="absolute robot"
            src={RobotCardCode}
            alt="robot"
            width={201}
            height={201}
            style={{ top: -100 }}
          />
          <IoClose
            onClick={() => {
              handleClose()
            }}
            className="icon-close"
          />
        </div>
        <div className="card-title">
          <span className="title">Bạn đã báo cáo cho câu hỏi này!</span>
        </div>
        <div
          className="bg_btn"
          style={{
            width: '100%',
            height: 100,
            alignItems: 'center',
            justifyContent: 'center',
            display: 'flex'
          }}
        >
          <div
            style={{ backgroundColor: '#0066FF', padding: 10, borderRadius: 5, color: 'white' }}
            onClick={handleClose}
          >
            XÁC NHẬN
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default React.memo(ModalReported)
