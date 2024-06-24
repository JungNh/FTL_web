import React, { useState } from 'react'
import { Form, Image } from 'react-bootstrap'
import ico_vn from '../../../../assets/images/ico_vn-small.svg'
import ico_anh from '../../../../assets/images/ico_anh-small.svg'
import ico_my from '../../../../assets/images/ico_my-small.svg'

type Props = Record<string, unknown>

const TabLanguage: React.FC<Props> = () => {
  const [active, setActive] = useState<'vn' | 'anh' | 'my'>('vn')
  return (
    <div className="tab_setting">
      <div className="tab__wrap">
        <p className="h4 fw-bold mb-3">Ngôn ngữ</p>

        <div
          className="language__item d-flex justify-content-between align-items-center mb-3 cursor-pointer"
          onClick={() => setActive('vn')}
        >
          <Form.Check
            checked={active === 'vn'}
            onChange={() => setActive('vn')}
            className="fw-bold"
            type="radio"
            label="Vietnamese"
          />
          <div className="d-flex align-items-center">
            <p className="country_name mb-0 me-3">Tiếng Việt</p>
            <Image src={ico_vn} />
          </div>
        </div>
        <div
          className="language__item d-flex justify-content-between align-items-center mb-3 cursor-pointer"
          onClick={() => setActive('my')}
        >
          <Form.Check
            checked={active === 'my'}
            onChange={() => setActive('my')}
            className="fw-bold"
            type="radio"
            label="English - US"
          />
          <div className="d-flex align-items-center">
            <p className="country_name mb-0 me-3">Tiếng Anh - Mỹ</p>
            <Image src={ico_my} />
          </div>
        </div>
        <div
          className="language__item d-flex justify-content-between align-items-center mb-3 cursor-pointer"
          onClick={() => setActive('anh')}
        >
          <Form.Check
            checked={active === 'anh'}
            onChange={() => setActive('anh')}
            className="fw-bold"
            type="radio"
            label="English - UK"
          />
          <div className="d-flex align-items-center">
            <p className="country_name mb-0 me-3">Tiếng Anh - Anh</p>
            <Image src={ico_anh} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default TabLanguage
