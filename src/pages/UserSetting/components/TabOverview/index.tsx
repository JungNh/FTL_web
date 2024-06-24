import React, { useCallback, useEffect, useState } from 'react'
import { format } from 'date-fns'
import viLocale from 'date-fns/locale/vi'
import { useDispatch } from 'react-redux'
import ReactHtmlParser from 'react-html-parser'
import { Image, Col, Modal, Row } from 'react-bootstrap'
import { NewsItem } from '../../../../components'

import { actionGetNews } from '../../../../store/settings/actions'
import { convertUrl } from '../../../../utils/common'
import { itemPopupSlider } from '../../../../store/popup/actions'
import { useHistory } from 'react-router'
import acc_user from '../../../../assets/images/acc_user.png'
import acc_archive from '../../../../assets/images/acc_archive.png'
import acc_pass from '../../../../assets/images/acc_pass.png'
import acc_share from '../../../../assets/images/acc_share.png'
import acc_tutorial from '../../../../assets/images/acc_tutorial.png'
import acc_contact from '../../../../assets/images/acc_contact.png'
import acc_condition from '../../../../assets/images/acc_condition.png'
import acc_info from '../../../../assets/images/acc_info.png'
import acc_logout from '../../../../assets/images/acc_logout.png'
import ModalUserSetting from '../../ModalUserSetting'

type Props = {
  gotoScreen: any
  logout: () => void
}

const infoData = [
  {
    id: 1,
    img: acc_user,
    code: 'my-acc'
  },
  {
    id: 2,
    img: acc_archive,
    code: 'achievements'
  },
  {
    id: 3,
    img: acc_pass,
    code: 'change-pass'
  },
  {
    id: 4,
    img: acc_share,
    code: 'affiliate'
  }
]

const supportData = [
  {
    id: 1,
    img: acc_tutorial,
    code: 'tutorial'
  },
  {
    id: 2,
    img: acc_contact,
    code: 'contact'
  },
  {
    id: 3,
    img: acc_condition,
    code: 'condition'
  }
]

const openExtenalLink = (url: string) => {
  window?.open(url, '_blank')?.focus()
}

type TabsType =
  | 'overview'
  | 'my-acc'
  | 'card-active'
  | 'change-pass'
  | 'parent-control'
  | 'sub-acc'
  | 'study-route'
  | 'setting'
  | 'tutorial'
  | 'contact'
  | 'condition'
  | 'info'
  | 'logOut'
  | 'achievements'
  | 'achievements-detail'
  | 'affiliate'

const TabOverview: React.FC<Props> = ({ gotoScreen, logout }) => {
  const [isShowModal, setIsShowModal] = useState<boolean>(false)
  const [tab, setTab] = useState<TabsType>('overview')

  const openPopUp = (tab: TabsType) => {
    setTab(tab)
    setIsShowModal(true)
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <ModalUserSetting isShow={isShowModal} tab={tab} handleClose={() => setIsShowModal(false)} />

      <div className="bg_content_progress" style={{ maxWidth: '900px' }}>
        <div className="title_overview">Tài khoản</div>
        <div style={{ display: 'flex' }}>
          {infoData.map((item: any, index: number) => {
            return (
              <div
                className="cursor"
                style={{ flex: 1, padding: 10 }}
                key={index}
                onClick={() => {
                  if (item?.code == 'my-acc' || item?.code == 'achievements') {
                    gotoScreen(item?.code)
                  } else openPopUp(item?.code)
                }}
              >
                <img src={item.img} style={{ objectFit: 'contain', width: '100%' }} />
              </div>
            )
          })}
        </div>
        <div className="title_overview">Hỗ trợ</div>
        {supportData.map((item: any, index) => {
          return (
            <div
              className="cursor"
              key={index}
              style={{ marginBottom: 15 }}
              onClick={() => {
                if (item.code == 'condition') {
                  openExtenalLink('https://futurelang.edu.vn/dieu-khoan-su-dung')
                } else openPopUp(item?.code)
              }}
            >
              <img src={item.img} style={{ objectFit: 'contain', width: '100%' }} />
            </div>
          )
        })}
        <div className="cursor" style={{ marginBottom: 15 }} onClick={() => openPopUp('info')}>
          <img src={acc_info} style={{ objectFit: 'contain', width: '100%' }} />
        </div>
        <div className="cursor" style={{ marginBottom: 15 }} onClick={() => logout()}>
          <img src={acc_logout} style={{ objectFit: 'contain', width: 150 }} />
        </div>
      </div>
    </div>
  )
}
export default TabOverview
