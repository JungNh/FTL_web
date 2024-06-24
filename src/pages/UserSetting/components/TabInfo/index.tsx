import React from 'react'
import BrandName from '../../../../assets/images/logo-large.svg'
import ico_globe from '../../../../assets/images/ico_globe.svg'
import ico_facebook from '../../../../assets/images/ico_facebook.svg'
import ico_youtube from '../../../../assets/images/ico_youtube.svg'

type Props = Record<string, unknown>

const TabInfo: React.FC<Props> = () => (
  <div className="tab__info">
    <div className="tab__wrap">
      <div className="d-flex flex-column align-items-center py-5">
        <img
          src={BrandName}
          alt="FutureLang"
          // onClick={() => setShowLogin(true)}
          // className="mb-5"
        />
        <b>66 ngày chinh phục tiếng Anh toàn diện</b>
        <div style={{ marginTop: '10rem' }}>
          <p style={{ color: '#105EAC', fontWeight: 'bold' }}>FutureLang.edu.vn</p>
          <p className="text-center small" style={{ color: 'black', fontWeight: 'bold' }}>
            Phiên bản: 240624
            {sessionStorage.getItem('IS_DEV') === 'true' && '(DEV)'}
          </p>
          <div className="d-flex align-items-center my-3">
            <img
              className="mx-3 cursor-pointer"
              src={ico_globe}
              alt="globe"
              onClick={() => {
                window.open('https://www.futurelang.edu.vn/', '_blank')?.focus()
              }}
            />
            <img
              className="me-3 cursor-pointer"
              src={ico_facebook}
              alt="facebook"
              onClick={() => {
                window.open('https://www.facebook.com/futurelangapp/', '_blank')?.focus()
              }}
            />
            <img
              className="me-3 cursor-pointer"
              src={ico_youtube}
              alt="youtube"
              onClick={() => {
                window.open('https://www.youtube.com/c/futurelang', '_blank')?.focus()
              }}
            />
          </div>
        </div>
      </div>
    </div>
  </div>
)

export default TabInfo
