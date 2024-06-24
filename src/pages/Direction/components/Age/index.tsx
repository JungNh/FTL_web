import * as React from 'react'
import { useMemo, useState } from 'react'
import { SwitchTransition, CSSTransition } from 'react-transition-group'
import getYear from 'date-fns/getYear'
import Select from 'react-select'
import age_secondary from '../../../../assets/images/age_secondary.svg'
import age_elementary from '../../../../assets/images/age_elementary.svg'
import age_15 from '../../../../assets/images/age_15.svg'
import age_20 from '../../../../assets/images/age_20.svg'
import age_30 from '../../../../assets/images/age_30.svg'

type Props = {
  active: number
  setActive: (data: number) => void
}

const AgeSection: React.FC<Props> = ({ active, setActive }) => {
  const switchImage = useMemo(() => {
    const currentYear = getYear(new Date())
    if (active === 0) return age_elementary
    if (active > currentYear - 11) return age_elementary
    if (active > currentYear - 14) return age_secondary
    if (active > currentYear - 20) return age_15
    if (active > currentYear - 28) return age_20
    if (active <= currentYear - 28) return age_30
    return age_30
  }, [active])

  const ageOption = useMemo(() => {
    const currentYear = getYear(new Date())
    const options = [{ value: 0, label: 'Vui lòng chọn năm sinh của bạn' }]
    for (let i = 0; i < 100; i++) {
      options.push({
        value: currentYear - i,
        label: (currentYear - i).toString(),
      })
    }
    return options
  }, [])

  return (
    <div className="age__section">
      <div>
        <p className="section--subTitle">Hãy chọn</p>
        <p className="section--title">Độ tuổi của bạn</p>
      </div>

      <Select
        className="select__age"
        onChange={(ops: any) => {
          setActive(ops.value)
        }}
        value={ageOption.find((item: any) => item.value === active)}
        options={ageOption}
        name="color"
        classNamePrefix="select"
      />
      <div className="image__holder">
        <SwitchTransition>
          <CSSTransition
            type="out-in"
            key={switchImage}
            addEndListener={(node, done) => node.addEventListener('transitionend', done, false)}
            classNames="fade"
          >
            <img draggable={false} className="image__age" src={switchImage} alt="age__group" />
          </CSSTransition>
        </SwitchTransition>
      </div>
    </div>
  )
}

export default AgeSection
