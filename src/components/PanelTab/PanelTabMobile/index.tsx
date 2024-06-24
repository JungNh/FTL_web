import React, { useState } from 'react'
import { useHistory, useLocation } from 'react-router'
import { useDispatch } from 'react-redux'
import ic_logo from '../../../assets/images/ico__logo.svg'
import panel_home from '../../../assets/images/panel_home.png'
import panel_arena from '../../../assets/images/panel_arena.png'
import panel_proccess from '../../../assets/images/panel_proccess.png'
import panel_card from '../../../assets/images/panel_card.png'
import panel_account from '../../../assets/images/panel_account.png'
import panel_home_active from '../../../assets/images/panel_home_active.png'
import panel_arena_active from '../../../assets/images/panel_arena_active.png'
import panel_proccess_active from '../../../assets/images/panel_proccess_active.png'
import panel_card_active from '../../../assets/images/panel_card_active.png'
import panel_account_active from '../../../assets/images/panel_account_active.png'
import panel_eng from '../../../assets/images/panel_eng.png'
import panel_chn from '../../../assets/images/panel_chn.png'
import panel_jap from '../../../assets/images/panel_jap.png'
import panel_kor from '../../../assets/images/panel_kor.png'
import btn_install from '../../../assets/images/install_mobile.png'
import PopupQR from '../PopupQR'

type Props = {}

const PanelTabMobile: React.FC<Props> = () => {
  const history = useHistory()
  const pathCurrent = useLocation()
  const dispatch = useDispatch()
  const [showQr, setShowQR] = useState(false)

  const data = [
    {
      id: 1,
      title: 'Trang chủ',
      icon: panel_home,
      icon_active: panel_home_active,
      path: '/home'
    },
    {
      id: 2,
      title: 'Đấu trường',
      icon: panel_arena,
      icon_active: panel_arena_active,
      path: '/arena'
    },
    {
      id: 3,
      title: 'Tiến trình',
      icon: panel_proccess,
      icon_active: panel_proccess_active,
      path: '/progress'
    },
    {
      id: 4,
      title: 'Kích hoạt thẻ',
      icon: panel_card,
      icon_active: panel_card_active,
      path: '/active-card'
    },
    {
      id: 5,
      title: 'Tài khoản',
      icon: panel_account,
      icon_active: panel_account_active,
      path: '/user-setting'
    }
  ]

  const languageData = [
    {
      id: 1,
      title: 'Tiếng Anh',
      icon: panel_eng,
      path: '/en-UK'
    },
    {
      id: 2,
      title: 'Tiếng Trung',
      icon: panel_chn,
      path: '/zh-CN'
    },
    {
      id: 3,
      title: 'Tiếng Nhật',
      icon: panel_jap,
      path: '/ja-JP'
    },
    {
      id: 4,
      title: 'Tiếng Hàn',
      icon: panel_kor,
      path: '/ko-KR'
    }
  ]

  return (
    <div className="panelLeft_mobile">
      {/* <img onClick={() => console.log('home')} src={ic_logo} className="ic_logo" /> */}
      <PopupQR isShow={showQr} handleClose={() => setShowQR(false)} />
      {data.map((item, index) => {
        return (
          <div
            className={`panel_item ${pathCurrent.pathname === item.path ? 'active' : ''}`}
            key={index}
            onClick={() => {
              history.push(item.path)
            }}
          >
            <img
              onClick={() => console.log('thong báo')}
              src={pathCurrent.pathname === item.path ? item.icon_active : item.icon}
              className="ic_panel"
            />
          </div>
        )
      })}
      {languageData.map((item, index) => {
        return (
          <div
            className={`panel_item ${pathCurrent.pathname === item.path ? 'active' : ''}`}
            key={index}
            onClick={() => {
              history.push(item.path)
            }}
          >
            <img onClick={() => console.log('thong báo')} src={item.icon} className="ic_panel" />
          </div>
        )
      })}
      <img
        onClick={() => setShowQR(true)}
        src={btn_install}
        className="ic_panel"
        style={{ marginBottom: 30, marginLeft: 5, marginTop: 20 }}
      />
    </div>
  )
}

export default PanelTabMobile
