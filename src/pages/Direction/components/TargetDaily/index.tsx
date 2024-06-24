import * as React from 'react'
import { useState } from 'react'
import { Modal } from 'react-bootstrap'
import { Button } from '../../../../components'

type Props = {
  active: string
  setActive: (data: string) => void
  hoursActive: string
  setHoursActive: (data: string) => void
  minutesActive: string
  setMinutesActive: (data: string) => void
  dayPartActive: 'am' | 'pm'
  setDayPartActive: (data: 'am' | 'pm') => void
}

type OptionPurpose = {
  subTitle: string
  title: string
  value: string
}

const TargetDailySection: React.FC<Props> = ({
  active,
  setActive,
  hoursActive,
  setHoursActive,
  minutesActive,
  setMinutesActive,
  dayPartActive,
  setDayPartActive,
}) => {
  const [showModal, setShowModal] = useState(false)

  const optionsPurpose: OptionPurpose[] = [
    { title: 'Thong thả', subTitle: '10', value: 'basic' },
    { title: 'Trung bình', subTitle: '20', value: 'normal' },
    { title: 'Dễ', subTitle: '30', value: 'easy' },
    { title: 'Khó', subTitle: '60', value: 'hard' },
  ]

  const hours = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']

  const minutes = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55']

  return (
    <div className="target__section">
      <div>
        <p className="section--subTitle mb-1">Hãy chọn</p>
        <p className="section--title mb-1">Mục tiêu mỗi ngày</p>
      </div>
      <div className="options__target">
        {optionsPurpose.map((item: OptionPurpose) => (
          <Button.Shadow
            key={item?.value}
            color={active === item?.value ? 'blue' : 'gray'}
            className="mb-2 px-3 options_btn"
            onClick={() => setActive(item?.value)}
            content={(
              <div className="target__btn">
                <p className="button__title">{item?.title}</p>
                <div className="button__subTitle">
                  {item?.subTitle}
                  {' '}
                  phút
                  <br />
                  mỗi ngày
                </div>
              </div>
            )}
          />
        ))}
        <Button.Solid
          className={`marathon__btn ${active === 'marathon' && 'active'}`}
          onClick={() => setActive('marathon')}
          content={(
            <div className="marathon__content">
              <div className="button__title">
                <div className="main__text">Marathon</div>
                <div className="sub__text">66 ngày chinh phục tiếng Anh toàn diện</div>
              </div>
              <p className="button__subTitle">
                66 ngày
                <br />
                liên tục
              </p>
            </div>
          )}
        />
      </div>
      <p className="section--title text-center my-3">Chọn thời gian học hàng ngày</p>
      <div className="time__section">
        <div className="time__text" onClick={() => setShowModal(true)}>
          <div className="time__content">{hoursActive}</div>
          <div>Giờ</div>
        </div>
        <div className="time__text" onClick={() => setShowModal(true)}>
          <div className="time__content">{minutesActive}</div>
          <div>Phút</div>
        </div>
        <div className="day__part">
          <div
            className={`time__text ${dayPartActive === 'am' && 'active'}`}
            onClick={() => setDayPartActive('am')}
          >
            Sáng
          </div>
          <div
            className={`time__text ${dayPartActive === 'pm' && 'active'}`}
            onClick={() => setDayPartActive('pm')}
          >
            Tối
          </div>
        </div>
      </div>

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
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default TargetDailySection
