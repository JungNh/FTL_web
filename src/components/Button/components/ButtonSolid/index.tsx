import * as React from 'react'
import { Button } from 'react-bootstrap'

type Props = {
  content?: React.ReactNode
  className?: string
  onClick?: () => void
  disabled?: boolean
  upperCase?: boolean
  type?: 'button' | 'submit' | 'reset'
  block?: boolean
  variant?: string
  style?: Record<string, unknown>
  color?: 'gray'
  onKeyPress?: any
  htmlType?: 'button' | 'submit' | 'reset'
}

const ButtonSolid: React.FC<Props> = ({
  content,
  className = '',
  onClick,
  color,
  block = true,
  onKeyPress,
  htmlType,

  ...props
}) => (
  <Button
    className={`button__solid ${className} ${color && `btn-${color}`}`}
    // block={block}
    onClick={onClick}
    onKeyPress={onKeyPress}
    {...props}
    type={htmlType}
  >
    {content}
  </Button>
)

export default ButtonSolid
