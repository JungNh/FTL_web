import React, { useState } from 'react'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import './styles.scss'
import { FaEye } from 'react-icons/fa'
import { FaEyeSlash } from 'react-icons/fa'

interface Iprops {
  iconLeftElement: React.ReactNode
  value?: string
  onChangeText?: any
  placeholder?: string
  ispassword?: boolean
  title: string
  required: boolean
  background?: string
  disable: boolean | undefined
}

const TextInputContainer = ({
  iconLeftElement,
  value = '',
  onChangeText,
  placeholder,
  title = '',
  required = false,
  background = '#E9E9E9',
  ispassword = false,
  disable = false
}: Iprops) => {
  const [showPass, setShowPass] = useState<boolean>(false)

  return (
    <div className="container">
      <div
        style={{
          marginBottom: 5
        }}
      >
        {title}
        {required && <span style={{ color: 'red' }}>*</span>}
      </div>
      <div className="input-container" style={{ backgroundColor: background }}>
        <InputGroup style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {iconLeftElement}
          <input
            type={showPass ? 'password' : 'text'}
            placeholder={placeholder}
            className="input"
            style={{ backgroundColor: background }}
            aria-describedby="basic-addon1"
            onChange={onChangeText}
            value={value}
            disabled={disable ? true : false}
          />
          {ispassword ? (
            showPass ? (
              <FaEye onClick={() => setShowPass(false)} size={25} />
            ) : (
              <FaEyeSlash onClick={() => setShowPass(true)} size={25} />
            )
          ) : null}
        </InputGroup>
      </div>
    </div>
  )
}
export default React.memo(TextInputContainer)
