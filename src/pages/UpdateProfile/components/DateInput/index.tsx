import * as React from 'react'
import { useState } from 'react'
import { FormControl } from 'react-bootstrap'
import { BsEyeFill, BsEyeSlashFill } from 'react-icons/bs'
import './styles.scss'

type Props = {
  inputRef?: React.Ref<HTMLInputElement>
  placeholder?: string
  value?: string
  onChange?: (data: string) => void
  isError?: boolean
  type?: string
  className?: string
  autoFocus?: boolean
  checkPassRoom?: boolean
  maxLength?: number
  inputKey?: string
  max?: number
  min?: number
}

const DateInput: React.FC<Props> = ({
  inputRef,
  placeholder = '',
  value = '',
  onChange = () => {},
  isError = false,
  type,
  className,
  autoFocus = false,
  maxLength,
  inputKey,
  checkPassRoom = false,
  max,
  min
}) => {
  const [isShowPass, setIsShowPass] = useState(false)
  const checkPassNumber = new RegExp(/^[0-9]+$/)

  return (
    <div className="input__component--wrapper_dob">
      <FormControl
        ref={inputRef}
        key={inputKey}
        className={`input__component_dob ${className} ${isError ? 'has__error_dob' : ''} ${
          type === 'password' ? 'input__password' : ''
        }`}
        placeholder={placeholder}
        value={value}
        maxLength={maxLength}
        min={min}
        max={max}
        type={isShowPass ? 'text' : type}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          if (checkPassRoom) {
            if (checkPassNumber.test(e.target.value)) {
              onChange(e.target.value)
            }
            if (e.target.value === '') {
              onChange('')
            }
          } else {
            onChange(e.target.value)
          }
        }}
        autoFocus={autoFocus}
      />
    </div>
  )
}

export default DateInput
