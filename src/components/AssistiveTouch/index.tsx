import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import Draggable from 'react-draggable'
import { Button } from '..'

import fuboIcon from '../../assets/images/fubo-icon.png'
import fuboRobot from '../../assets/images/fubo-robot.png'
import fuboClose from '../../assets/images/close-fubo.png'
import fuboModalClose from '../../assets/images/close-modal-fubo.png'
import fuboChat from '../../assets/images/fubo-chat.png'
import fuboPhone from '../../assets/images/fubo-phone.png'
import thankContact from '../../assets/images/thank-contact.png'
import './styles.scss'

type Props = {}
type PositionType = { x: number; y: number }

const AssistiveTouch: React.FC<Props> = () => {
  const showFubo = localStorage.getItem('showFubo')
  const { documentElement } = document
  const wrapperWidth = window.innerWidth || documentElement.clientWidth
  const wrapperHeight = window.innerHeight || documentElement.clientHeight
  const contentWidth = wrapperWidth > 1300 ? 1170 : 1000

  const [show, setShow] = useState(false)
  const [isClick, setIsClick] = useState(false)
  const [showModalClick, setShowModalClick] = useState(false)
  const [showAssistiveTouch, setShowAssistiveTouch] = useState(showFubo === 'FUBO')
  const [position, setPosition] = useState<PositionType>({
    x: wrapperWidth - (wrapperWidth - contentWidth) / 2,
    y: 50,
  })
  const [activeDrags, setActiveDrags] = useState<Boolean>(false)

  useEffect(() => {
    if (isClick && showModalClick) {
      setShow(true)
    }
  }, [isClick, showModalClick])

  const handleClose = () => {
    setShow(false)
    setIsClick(false)
    setShowModalClick(false)
  }
  const onDrag = () => setActiveDrags(true)

  const onStop = (event: any, data: any) => {
    const center = {
      x: data.x + data.node.clientWidth / 2,
      y: data.y + data.node.clientHeight / 2,
    }

    // The margin from the draggable's center,
    // to the viewport sides (top, left, bottom, right)
    const margin = {
      top: center.y - 0,
      left: center.x - 0,
      right: wrapperWidth - center.x,
      bottom: wrapperHeight - center.y,
    } as any

    // When we get the nearest viewport side (below), then we can
    // use these metrics to calculate the new draggable sticky `position`
    const positionWidth = (wrapperWidth - contentWidth) / 2
    const positionTopBottom = data.x > wrapperWidth / 2 ? wrapperWidth - positionWidth : positionWidth / 4

    const position = {
      top: { y: 100, x: positionTopBottom },
      left: { y: data.y, x: positionWidth / 4 },
      right: { y: data.y, x: wrapperWidth - positionWidth },
      bottom: { y: wrapperHeight - 150, x: positionTopBottom },
    } as any

    // Knowing the draggable's margins to the viewport sides,
    // now we can sort them out and get the smaller one.
    // The smallest margin defines the nearest viewport side to draggable.
    const sorted = Object.keys(margin).sort((a, b) => margin[a] - margin[b])
    const nearestSide = sorted[0]
    setPosition(position[nearestSide])

    if (activeDrags) {
      setIsClick(false)
    } else {
      setIsClick(true)
    }

    setActiveDrags(false)
  }

  const handleClick = () => {
    setShowModalClick(true)
  }

  const handleCloseAssistiveTouch = () => {
    setShowAssistiveTouch(false)
    // localStorage.removeItem('showFubo')
  }

  const handleChat = () => {
    window.open ( 'https://www.facebook.com/messages/t/101256372216735')
  }
  return (
    <div style={{ position: 'absolute' }}>
      {showAssistiveTouch && (
        <div>
          <Draggable
            onDrag={onDrag}
            onStop={(event, data) => onStop(event, data)}
            defaultPosition={{ x: 1200, y: 0 }}
            position={position as any}
            grid={[25, 25]}
            scale={1}
          >
            <div>
              <img
                onClick={handleCloseAssistiveTouch}
                className="assistive__touch_close"
                src={fuboClose}
                alt=""
              />
              <img onClick={handleClick} style={{ borderRadius: '40px' }} src={fuboIcon} alt="" />
            </div>
          </Draggable>
        </div>
      )}
      <Modal
        className="modal-fubo-support"
        show={show}
        onHide={handleClose}
      >
        <div className="close-fubo-support">
          <img src={fuboModalClose} onClick={handleClose} alt="" />
        </div>
        <Modal.Body>
          <div className="content-bg">
            <div className="robot-bg">
              <img className="img-robot" src={fuboRobot} alt="" />
            </div>
            <div className="content-right">
              <img src={thankContact} alt="" className="my-4" />
              <Button.Solid
                className="support__btn"
                content={(
                  <div>
                    <a
                      href="tel:1900252586"
                      className="call__hotline flex justify-content-center align-items-center"
                    >
                      <img src={fuboPhone} width={18} alt="nav btn" className="me-2 py-1" />
                      Hotline: 1900252586
                    </a>
                  </div>
                )}
              />
              <Button.Solid
                className="support__btn"
                onClick={handleChat}
                content={(
                  <div className="flex justify-content-center align-items-center">
                    <img src={fuboChat} width={18} alt="nav btn" className="me-2 py-1" />
                    Chat với tư vấn viên
                  </div>
                )}
              />
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default AssistiveTouch
