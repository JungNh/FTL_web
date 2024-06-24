import * as React from 'react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import './styles.scss'

type Props = {}

const NotificationItem: FC<Props> = (props) => {
  const { t } = useTranslation(['lang'])

  return (
    <div className="notificationitem__component">
      <div className="notificationitem__content">
        <img src="https://via.placeholder.com/150" alt="avatar" />
        <div className="content__text">
          Hãy nhanh tay đăng ký tham gia <span>ĐẤU TRƯỜNG TIẾNG ANH</span> và rinh về những phần quà
          giá trị thôi bạn ơi!
        </div>
        {/* <div className="content__status">
          <div />
        </div> */}
      </div>
      <div className="notificationitem__time">
        <p>5 phút trước</p>
        <button>Xem ngay</button>
      </div>
    </div>
  )
}

export default NotificationItem
