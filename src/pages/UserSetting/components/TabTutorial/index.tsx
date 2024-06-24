import React from 'react'
import { Image } from 'react-bootstrap'
import { Button } from '../../../../components'
import ico_robot from '../../../../assets/images/ico_robot-tutorial.svg'

type Props = Record<string, unknown>

const TabTutorial: React.FC<Props> = () => {
  const openExtenalLink = (url: string) => {
    window.open(url, '_blank')?.focus()
  }

  return (
    <div className="tab__tutorial">
      <p className="h3 fw-bold" style={{ textAlign: 'center', marginBottom: 50 }}>
        Hướng dẫn
      </p>
      <div className="tab__wrap">
        <div className="d-flex flex-column justify-content-center align-items-center">
          <Image src={ico_robot} alt="robot" />

          <Button.Solid
            className="btn__tutorial"
            content="Hướng dẫn sử dụng App"
            onClick={() => openExtenalLink('https://www.futurelang.edu.vn/huong-dan-su-dung-app')}
          />
          <Button.Solid
            className="btn__tutorial"
            content="Hướng dẫn học hiệu quả"
            onClick={() => openExtenalLink('https://www.futurelang.edu.vn/huong-dan-hoc-hieu-qua')}
          />
          <Button.Solid
            className="btn__tutorial"
            content="Những câu hỏi thường gặp"
            onClick={() => openExtenalLink('https://www.futurelang.edu.vn/cau-hoi-thuong-gap')}
          />
        </div>
      </div>
    </div>
  )
}
export default TabTutorial
