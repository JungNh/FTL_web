import * as React from 'react'
import { Button } from '../../../../components'

type Props = {
  active: string[]
  setActive: (data: string[]) => void
}
type OptionPurpose = { title: string; value: string }

const LearnPurposeSection: React.FC<Props> = ({ active, setActive }) => {
  const optionsPurpose: OptionPurpose[] = [
    { title: 'Cơ hội nghề nghiệp', value: 'job_opportunity' },
    { title: 'Giao tiếp tiếng Anh', value: 'communication' },
    { title: 'Học tập trên lớp', value: 'learning' },
    { title: 'Du lịch', value: 'traveling' },
    { title: 'Luyện thi', value: 'study_for_test' },
    { title: 'Mục đích khác', value: 'other' },
  ]

  const chooseOptions = (value: string) => {
    if (active.includes(value)) {
      const newActive = active.filter((item: string) => item !== value)
      setActive(newActive)
    } else {
      const newActive = [...active, value]
      setActive(newActive)
    }
  }

  return (
    <div className="learn__section">
      <p className="section--subTitle">Hãy chọn</p>
      <p className="section--title">Mục đích học</p>
      <div className="options__purpose">
        {optionsPurpose.map((item: OptionPurpose) => (
          <Button.Shadow
            key={item?.value}
            color={active.includes(item.value) ? 'blue' : 'gray'}
            content={item.title}
            className="fw-bold mb-3"
            onClick={() => chooseOptions(item.value)}
          />
        ))}
      </div>
    </div>
  )
}

export default LearnPurposeSection
