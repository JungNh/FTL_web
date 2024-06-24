import * as React from 'react'
import { FormControl } from 'react-bootstrap'

type Props = {
  placeholder?: string
  value?: string
  onChange?: (data: string) => void
  isError?: boolean
  type?: string
  onBlur?: (e: any) => void
  className?: string
  autoFocus?: boolean
  maxLength?: number
  rows?: number
  id?: string
  disabled?: boolean
}

const InputTextArea: React.FC<Props> = ({
  id,
  placeholder = '',
  value = '',
  onChange = () => {},
  isError = false,
  className,
  maxLength,
  type,
  rows = 3,
  ...props
}) => (
  <FormControl
    id={id}
    className={`input__textarea__component ${className} ${isError ? 'has__error' : ''}`}
    placeholder={placeholder}
    value={value}
    maxLength={maxLength}
    type={type}
    as="textarea"
    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
    rows={rows}
    {...props}
  />
)

export default InputTextArea
