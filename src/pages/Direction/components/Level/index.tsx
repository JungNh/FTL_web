import * as React from 'react'
import { Button } from '../../../../components'

type Props = {
  active: string
  setActive: (data: string) => void
}
type OptionPurpose = { title: string; value: string }

const LearnPurposeSection: React.FC<Props> = ({ active, setActive }) => {
  const optionsPurpose: OptionPurpose[] = [
    { title: 'Người mới', value: 'newbie' },
    { title: 'Tiếng Anh cơ bản', value: 'basic' },
    { title: 'Trung cấp', value: 'middle' },
    { title: 'Nâng cao', value: 'advanced' },
    { title: 'Kiểm tra trình độ của bạn', value: 'testing' },
  ]

  return (
    <div className="level__section">
      <p className="section--subTitle">Hãy chọn</p>
      <p className="section--title">Cấp độ học của bạn</p>
      <div className="options__purpose">
        {optionsPurpose.map((item: OptionPurpose) => (
          <Button.Shadow
            key={item?.value}
            color={active.includes(item.value) ? 'blue' : 'gray'}
            content={item.title}
            className="fw-bold mb-3"
            onClick={() => setActive(item.value)}
          />
        ))}
      </div>
    </div>
  )
}

export default LearnPurposeSection
