import React from 'react'
import { Image } from 'react-bootstrap'
import { Button } from '../../../../components'
import ico_phone from '../../../../assets/images/ico_phone-contact.svg'
import ico_cskh from '../../../../assets/images/ico_cskh.svg'
import ico_email from '../../../../assets/images/ico_email.svg'

type Props = Record<string, unknown>

const TabContact: React.FC<Props> = () => (
  <div className="tab__contact">
    <div className="h3 fw-bold" style={{textAlign:'center', marginBottom:50}}>Liên hệ</div>
    <div className="tab__wrap">
      <div className="contact__row mt-3">
        <Image className="icon__contact" src={ico_cskh} alt="icon" />

        <div className="text__contact">
          <p className="mb-0 fw-bold">Hỗ trợ cùng FutureLang</p>
          <p className="mb-0">Hãy đặt câu hỏi cho chúng tôi</p>
        </div>
        <Button.Solid
          className="button__chat"
          content="CHAT NGAY"
          onClick={() => {
            window.open('https://m.me/futurelangapp', '_blank')?.focus()
          }}
        />
      </div>

      <p className="fw-bold">Dịch vụ hỗ trợ</p>
      <div className="contact__row">
        <Image className="icon__contact" src={ico_phone} alt="icon" />

        <div className="text__contact">
          <p className="mb-0 fw-bold">Trung tâm CSKH</p>
          <p className="mb-0">1900 252586</p>
        </div>
        <p
          className="contact__link"
          onClick={() => {
            window.open('https://www.futurelang.edu.vn/', '_blank')?.focus()
          }}
        >
          LIÊN HỆ
        </p>
      </div>
      <div className="contact__row">
        <Image className="icon__contact" src={ico_email} alt="icon" />

        <div className="text__contact">
          <p className="mb-0 fw-bold">EMAIL</p>
          <p className="mb-0">contact@futurelang.edu.vn</p>
        </div>
        <p
          className="contact__link"
          onClick={() => {
            window.open('mailto:contact@futurelang.edu.vn', '_blank')?.focus()
          }}
        >
          LIÊN HỆ
        </p>
      </div>
    </div>
  </div>
)
export default TabContact
