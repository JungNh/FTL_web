import React, { FC } from 'react'
import { differenceInSeconds, format } from 'date-fns'
import { Modal, Button } from 'react-bootstrap'
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar'
import './modal-dialog.scss'

type Props = {
  showModal: boolean
  startTime: any
  countAnser: any
  unitScore: any
  sectionScore: any
  backCourse: (isDone?: boolean) => void
  setShowModal: (isShow?: boolean) => void
}
const ModalDialog: FC<Props> = ({
  showModal,
  startTime,
  countAnser,
  unitScore,
  sectionScore,
  backCourse,
  setShowModal
}) => {
  const handleClose = () => {
    backCourse(true)
    setShowModal(false)
  }

  const duration = differenceInSeconds(new Date(), new Date(startTime as any))
  return (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title className="w-100 text-center">Bài học hoàn tất</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <CircularProgressbar
          className="circlePercent mb-3"
          value={unitScore}
          text={`+${unitScore}`}
          strokeWidth={4}
          styles={buildStyles({
            textColor: 'black',
            pathColor: '#04BC8A'
          })}
        />
        <div className="score-details">
          <p>
            Số câu đúng:&nbsp;
            <b>{countAnser}</b>
          </p>
          <p>
            Điểm cao nhất:&nbsp;
            <b>
              {(sectionScore?.unit_score && unitScore > sectionScore?.unit_score
                ? unitScore
                : sectionScore?.unit_score) || 0}
            </b>
          </p>
          <p>
            Thời gian hoàn thành:&nbsp;
            <b>{format(duration * 1000, 'mm:ss')}</b>
          </p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleClose} variant="primary">
          TIẾP TỤC
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ModalDialog
