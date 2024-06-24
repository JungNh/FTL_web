import * as React from 'react'
import type { FC } from 'react'
import { Image } from 'react-bootstrap'

import Button from "../Button"
import close from "../../assets/images/ico_close.svg"
import NotificationItem from './components/NotificationItem'
import './styles.scss'

type Props = {
  open: boolean,
  onClose: any,
}

const Notification: FC<Props> = ({ open, onClose }) => {
  const [tab, setTab] = React.useState(1);

  const getActiveTab = (index: any) => tab === index ? "blue" : "gray";
  const setActiveTab = (index: any) => setTab(index);

  return open ? (
    <div className="notification__component">
      <div className="notification__wrapper">
        <div className="notification__header">
          <p>Thông Báo</p>
          <div onClick={onClose}><Image className="ico__close" src={close} /></div>
        </div>
        <div className="notification__tab">
          <Button.Shadow content="Tất cả" color={getActiveTab(1)} onClick={() => setActiveTab(1)} />
          <Button.Shadow content="Chưa đọc" color={getActiveTab(2)} onClick={() => setActiveTab(2)} />
          <Button.Shadow content="Đánh dấu đã đọc" color={getActiveTab(3)} onClick={() => setActiveTab(3)} />
        </div>
        <div className="notification__content">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
            <NotificationItem />
          ))}
        </div>
      </div>
    </div>
  ) : null;
}

export default Notification
