import * as React from 'react'
import { useState } from 'react'
import { FormControl } from 'react-bootstrap'
import { BsEyeFill, BsEyeSlashFill } from 'react-icons/bs'

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
}

const InputText: React.FC<Props> = ({
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
  checkPassRoom = false
}) => {
  const [isShowPass, setIsShowPass] = useState(false)
  const checkPassNumber = new RegExp(/^[0-9]+$/)

  return (
    <div className="input__component--wrapper">
      <FormControl
        ref={inputRef}
        key={inputKey}
        className={`input__component ${className} ${isError ? 'has__error' : ''} ${
          type === 'password' ? 'input__password' : ''
        }`}
        placeholder={placeholder}
        value={value}
        maxLength={maxLength}
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
      {type === 'password' &&
        (!isShowPass ? (
          <BsEyeSlashFill className="input__icon__eye" onClick={() => setIsShowPass(true)} />
        ) : (
          <BsEyeFill className="input__icon__eye" onClick={() => setIsShowPass(false)} />
        ))}
    </div>
  )
}

export default InputText
