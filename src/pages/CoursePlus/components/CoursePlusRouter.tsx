import React, { useCallback, useMemo, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { IoArrowBack } from 'react-icons/io5'
import { MdKeyboardArrowRight, MdOutlineKeyboardArrowRight } from 'react-icons/md'
import { useHistory, useLocation } from 'react-router'
import { Button } from '../../../components'
import { convertUrl } from '../../../utils/common'
import CardCode from '../../Homepage/CardCode'
import CourseTabs from './CourseTabs'
import PanelTab from '../../../components/PanelTab'
import HeaderHome from '../../Homepage/HeaderHome'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store'
import panel_jap from '../../../assets/images/panel_jap.png'
import panel_chn from '../../../assets/images/panel_chn.png'
import panel_kor from '../../../assets/images/panel_kor.png'
import vipcourse from '../../../assets/images/vip_course.png'
import { LANGGUAGE } from '../../../constants'
import PanelTabMobile from '../../../components/PanelTab/PanelTabMobile'

interface Props {
  dataPlus: any
  handleGetDataPlus: (language: string, index: number) => void
  handleGetCourse: (id: number) => void
}

const CoursePlusRouter = ({ dataPlus, handleGetDataPlus, handleGetCourse }: Props) => {
  const history = useHistory()
  const pathCurrent = useLocation()
  const [dataCardCode, setDataCardCode] = useState({
    isOpen: false,
    status: 'active'
  })

  const { fullname } = useSelector((state: RootState) => state.login.userInfo)

  const handleOpen = () => {
    setDataCardCode({
      isOpen: true,
      status: 'active'
    })
  }

  const handleClose = useCallback(() => {
    setDataCardCode({
      isOpen: false,
      status: 'active'
    })
  }, [])

  const language = useMemo(() => {
    let handlePath = pathCurrent.pathname.replace(/\//g, '')
    handleGetDataPlus(handlePath, 0)
    switch (handlePath) {
      case LANGGUAGE.CHINA:
        return {
          icon: panel_chn,
          text: 'Tiếng Trung'
        }
      case LANGGUAGE.JAP:
        return {
          icon: panel_jap,
          text: 'Tiếng Nhật'
        }
      case LANGGUAGE.KOR:
        return {
          icon: panel_kor,
          text: 'Tiếng Hàn'
        }
    }
  }, [pathCurrent])

  return (
    <div style={{ position: 'relative' }}>
      <PanelTab />
      <PanelTabMobile/>
      <div className="homePage">
        <HeaderHome
          title={
            <div style={{ fontSize: 26, display: 'flex' }} className='say_hi'>
              {`Xin chào, `}
              <div style={{ fontWeight: 'bold' }}>{fullname}</div>
            </div>
          }
        />
        <div className="plus-router-container">
          <div className="bg_lang" style={{ marginBottom: 20 }}>
            <img src={language?.icon} />
            <div className="title_course">{language?.text}</div>
            <MdOutlineKeyboardArrowRight size={20} />
          </div>
          <div className="plus-body" style={{ display: 'flex', flexWrap: 'wrap' }}>
            {dataPlus.data?.map((item: any) => (
              <div key={item?.id} className="plus-card" style={{ marginRight: 30 }}>
                <div style={{ position: 'relative' }} onClick={() => handleGetCourse(item?.id)}>
                  <img
                    style={{ height: '15rem', borderRadius: 15, cursor: 'pointer' }}
                    src={convertUrl(item.imageUrl, 'image') || ''}
                    alt=""
                  />
                  {item?.vip ? (
                    <img src={vipcourse} style={{ position: 'absolute', bottom: 0, right: -2 }} />
                  ) : (
                    <></>
                  )}
                </div>

                <div className="plus-name" onClick={() => handleGetCourse(item?.id)}>
                  {item.name}
                </div>
              </div>
            ))}
          </div>
          <CardCode
            dataCardCode={dataCardCode}
            handleClose={handleClose}
            reLoadData={() => console.log('CouresPlusRouter')}
          />
        </div>
      </div>
    </div>
  )
}

export default React.memo(CoursePlusRouter)
