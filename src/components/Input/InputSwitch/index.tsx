import React from 'react'
import { Form } from 'react-bootstrap'

type Props = {
  id: string
  checked?: boolean
  onChange?: (checked: boolean) => void
  className?: string
}

const InputSwitch: React.FC<Props> = ({
  checked, id, className = '', onChange = () => {},
}) => (
  <Form.Switch
    type="switch"
    id={id}
    className={`custom__switch ${className}`}
    checked={checked}
    onChange={(e) => {
      onChange(e.target.checked)
    }}
  />
)

export default InputSwitch
