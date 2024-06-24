import React from 'react'
import { ProgressBar } from 'react-bootstrap'
import Button from '../Button'

import ico_success from '../../assets/images/ico_success-yellow.svg'
import ico_warn from '../../assets/images/ico_warn-black.svg'
import { numberTwoDigits } from '../../utils/common'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'

type Props = {
  currentTest?: number
  totalTest?: number
  onCheck: () => void
  onHint: () => void
  onSkip: () => void
  type?: string
  isDisabled?: boolean
}

const NavbarTest: React.FC<Props> = ({
  currentTest = 0,
  totalTest = 10,
  onCheck,
  onHint,
  onSkip,
  type,
  isDisabled
}) => {
  const { showCheer } = useSelector((state: RootState) => state.lesson)
  const convertViewToPercent = () => (currentTest / totalTest) * 100
  return (
    <div className="navbarTest__components">
      <ProgressBar className="progess__line" variant="success" now={convertViewToPercent()} />
      <div className="progess__text">
        {`${numberTwoDigits(currentTest)}/${numberTwoDigits(totalTest)} BÀI`}
      </div>
      {!showCheer && (
        <div className="progess__btn-functional">
          <Button.Solid
            className="img__functional--holder"
            variant="light"
            onClick={onHint}
            content={<img className="img__functional" src={ico_warn} alt="icon_info" />}
          />
          <Button.Solid
            className="btn__functional"
            variant="light"
            content="BỎ QUA"
            onClick={onSkip}
          />
        </div>
      )}

      <Button.Solid
        className="continue__btn"
        onClick={onCheck}
        disabled={isDisabled}
        content={
          <div className="flex justify-content-center align-items-center fw-bold">
            <img src={ico_success} alt="success_ico" className="me-2 py-1" />
            {type !== 'vocabulary' && !showCheer && 'KIỂM TRA'}
            {type !== 'vocabulary' && showCheer && 'TIẾP TỤC'}
            {type === 'vocabulary' && (currentTest === totalTest ? 'HOÀN THÀNH' : 'TIẾP TỤC')}
          </div>
        }
      />
    </div>
  )
}

export default NavbarTest
