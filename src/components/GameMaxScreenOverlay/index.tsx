import React from 'react'
import { Image } from 'react-bootstrap'
import { KImage } from '..'
import fubo_icon from '../../assets/images/ico_fubo.svg'
import arrow__icon from '../../assets/images/ico_prev-black.svg'
import { openInNewTab } from '../../utils/common'

const MaxScreenOverlay = () => (
  <div className="max__screen--overlay">
    <KImage src={fubo_icon} alt="fubo_ico" className="fubo__image" />

    <Image src={arrow__icon} alt="fubo_ico" className="left__arrow" />
    <Image src={arrow__icon} alt="fubo_ico" className="right__arrow" />
    <Image src={arrow__icon} alt="fubo_ico" className="top__arrow" />
    <Image src={arrow__icon} alt="fubo_ico" className="bottom__arrow" />
    <div style={{ width: '70%' }}>
      <p
        style={{
          fontSize: 25,
          textAlign: 'center'
        }}
      >
        Vui lòng mở rộng toàn màn hình để tiếp tục học.Hoặc nhấn tổ hợp phím:{' '}
        <b>CTRL và phím "-"</b>
      </p>
      <p
        style={{
          color: '#0066FF',
          fontStyle: 'italic',
          fontSize: 25,
          textAlign: 'center',
          fontWeight: 'bold',
          textDecorationLine: 'underline'
        }}
        onClick={() =>
          openInNewTab(
            'https://futurelang.edu.vn/news/detail/huong-dan-mo-rong-man-hinh-tro-choi-futurelang'
          )
        }
      >
        Xem hướng dẫn
      </p>
    </div>
  </div>
)

export default MaxScreenOverlay
