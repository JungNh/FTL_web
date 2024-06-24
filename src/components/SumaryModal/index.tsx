/* eslint-disable react/require-default-props */
import React, { FC, useMemo } from 'react'
import { format } from 'date-fns'
import { Modal, Button } from 'react-bootstrap'
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar'
import './modal-dialog.scss'

type Props = {
  showModal: boolean
  closeButton?: boolean
  durationTime: any
  countAnser: any
  unitScore: any
  highestScore: Number
  footerCustom?: any
  backCourse?: (isDone?: boolean) => void
  setShowModal: (isShow: boolean) => void
  continueQuestion?: any
}
const ModalDialog: FC<Props> = ({
  showModal,
  closeButton = true,
  durationTime,
  countAnser,
  unitScore,
  highestScore,
  footerCustom,
  backCourse,
  setShowModal,
  continueQuestion,
}) => {
  const handleClose = () => {
    backCourse && backCourse(true)
    setShowModal(false)
  }

  const handleContinue = () => {
    setShowModal(false)
    continueQuestion()
  }

  const getHighestScore = useMemo(() => {
    if (highestScore) {
      return unitScore > highestScore ? unitScore : highestScore
    }

    return unitScore || 0
  }, [unitScore, highestScore])

  return (
    <Modal dialogClassName="sumary-popup" show={showModal} onHide={handleClose} backdrop="static">
      <Modal.Header closeButton={closeButton}>
        <Modal.Title className="w-100 text-center mt-2">Bài học hoàn tất</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <CircularProgressbar
          className="circlePercent mb-3"
          value={unitScore}
          text={`+${unitScore}`}
          strokeWidth={4}
          styles={buildStyles({
            textColor: 'black',
            pathColor: '#04BC8A',
          })}
        />
        <div className="score-details">
          <p>
            Số câu đúng:&nbsp;
            <b>{countAnser}</b>
          </p>
          <p>
            Điểm cao nhất:&nbsp;
            <b>{getHighestScore}</b>
          </p>
          <p>
            Thời gian hoàn thành:&nbsp;
            <b>{format(durationTime * 1000, 'mm:ss')}</b>
          </p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        {footerCustom ? (
          footerCustom
        ) : (
          <div>
            <Button className="btn-end" onClick={handleClose} variant="outline-dark">
              KẾT THÚC
            </Button>
            <Button className="btn-continue" onClick={handleContinue} variant="primary">
              TIẾP TỤC
            </Button>
          </div>
        )}
      </Modal.Footer>
    </Modal>
  )
}

export default ModalDialog
