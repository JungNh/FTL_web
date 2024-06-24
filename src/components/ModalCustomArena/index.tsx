import React, { useState } from 'react'
import { Modal } from 'react-bootstrap'
import './styles.scss'
import fubo_blink from '../../assets/images/fubo_blink.svg'

interface CenteredModalProps {
  show: boolean
  onHide: () => void
  children: React.ReactNode
  isClose?: boolean
  size?: string
  onBackdropClick?: () => void
}

const ModalCustomArena: React.FC<CenteredModalProps> = ({
  show,
  onHide,
  isClose = true,
  children,
  size = 'sm',
  onBackdropClick = () => {}
}) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      animation
      keyboard={false}
      onBackdropClick={onBackdropClick}
      className="modal"
    >
      <div className="modal-container">
        {isClose && (
          <div className="popupcontainer__close" onClick={onHide}>
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
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <img className="popupcontainer__logo" src={fubo_blink} />
        </div>
        <Modal.Body style={{ marginTop: 30 }}>{children}</Modal.Body>
      </div>
    </Modal>
  )
}

export default ModalCustomArena
