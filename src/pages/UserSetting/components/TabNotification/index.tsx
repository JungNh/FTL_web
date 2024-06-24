import React, { useState } from 'react'
import { Modal } from 'react-bootstrap'
import { Input, Button } from '../../../../components'

type Props = Record<string, unknown>

const TabNotification: React.FC<Props> = () => {
  const [isDeskNoti, setIsDeskNoti] = useState(false)
  const [isNewsNoti, setIsNewsNoti] = useState(false)
  const [isTimeNoti, setIsTimeNoti] = useState(false)

  const [showModal, setShowModal] = useState(false)
  const [hoursActive, setHoursActive] = useState<string>('00')
  const [minutesActive, setMinutesActive] = useState<string>('00')
  const [dayPart, setDayPart] = useState<'Sáng' | 'Chiều'>('Sáng')
  const hours = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']

  const minutes = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55']

  return (
    <div className="tab_notification">
      <div className="tab__wrap">
        <p className="h4 fw-bold mb-3">Cài đặt thông báo</p>
        <div className="d-flex justify-content-between align-items-center">
          <div className="pr-5">
            <p className="mb-2 fw-bold">Cho phép thông báo máy tính bàn</p>
            <p>Cài đặt cho phép bật hoặc tắt mọi thông báo của phần mềm.</p>
          </div>
          <Input.Switch
            id="desltop-noti"
            className="custom__switch"
            checked={isDeskNoti}
            onChange={(checked: boolean) => setIsDeskNoti(checked)}
          />
        </div>

        <div className="divider__horizontal my-3" />

        <div className="d-flex justify-content-between align-items-center">
          <div className="pr-5">
            <p className="mb-2 fw-bold">Cho phép thông báo về tin tức mới</p>
            <p>Bạn sẽ nhận được tin tức mới từ thông báo.</p>
          </div>
          <Input.Switch
            id="news-noti"
            className="custom__switch"
            checked={isNewsNoti}
            onChange={(checked: boolean) => setIsNewsNoti(checked)}
          />
        </div>

        <div className="divider__horizontal my-3" />

        <div className="d-flex justify-content-between align-items-center">
          <div className="pr-5 flex-1">
            <p className="mb-2 fw-bold">Thông báo nhắc giờ học</p>
            <div className="d-flex ">
              <Button.Solid
                className="me-3 fw-bold"
                color="gray"
                block={false}
                content={`${hoursActive} giờ`}
                style={{ width: 'fit-content' }}
                onClick={() => setShowModal(true)}
                disabled={!isTimeNoti}
              />
              <Button.Solid
                className="me-3 fw-bold"
                color="gray"
                block={false}
                content={`${minutesActive} phút`}
                style={{ width: 'fit-content' }}
                onClick={() => setShowModal(true)}
                disabled={!isTimeNoti}
              />
              <Button.Solid
                className="me-3 fw-bold"
                color="gray"
                block={false}
                content={dayPart}
                style={{ width: 'fit-content' }}
                onClick={() => setShowModal(true)}
                disabled={!isTimeNoti}
              />
            </div>
          </div>
          <Input.Switch
            id="time-noti"
            className="custom__switch"
            checked={isTimeNoti}
            onChange={(checked: boolean) => setIsTimeNoti(checked)}
          />
        </div>
      </div>

      {/* Modal Time */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        dialogClassName="modal__time"
        centered
      >
        <Modal.Body>
          <p className="h3 fw-bold">Giờ</p>
          <div className="d-flex my-4">
            {hours.map((item: string) => (
              <button
                type="button"
                className={`time__btn ${hoursActive === item && 'active'}`}
                key={item}
                onClick={() => setHoursActive(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <p className="h3 fw-bold mb-3">Phút</p>
          <div className="d-flex my-4">
            {minutes.map((item: string) => (
              <button
                type="button"
                className={`time__btn ${minutesActive === item && 'active'}`}
                key={item}
                onClick={() => setMinutesActive(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <p className="h3 fw-bold mb-3">Buổi</p>
          <div className="d-flex my-4">
            <button
              type="button"
              className={`time__btn ${dayPart === 'Sáng' && 'active'}`}
              key="Sáng"
              onClick={() => setDayPart('Sáng')}
            >
              Sáng
            </button>
            <button
              type="button"
              className={`time__btn ${dayPart === 'Chiều' && 'active'}`}
              key="Chiều"
              onClick={() => setDayPart('Chiều')}
            >
              Chiều
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default TabNotification
