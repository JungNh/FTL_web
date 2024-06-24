import * as React from 'react'
import { Button, Spinner } from 'react-bootstrap'

type Props = {
  content?: React.ReactNode
  className?: string
  color?: 'blue' | 'gray' | 'malibu' | 'green' | 'white' | 'yellow' | 'nomal'
  onClick?: () => void
  disabled?: boolean
  upperCase?: boolean
  type?: 'button' | 'submit' | 'reset'
  block?: boolean
  loading?: boolean
  style?: any
  onKeyPress?: any
  tabIndex?: number
}

const ButtonShadow: React.FC<Props> = ({
  content,
  color = 'blue',
  className = '',
  onClick,
  upperCase = true,
  block,
  disabled,
  type,
  loading,
  style,
  onKeyPress,
  tabIndex
}) => (
  <Button
    className={`button__shadow btn btn-${color} ${upperCase ? 'upperCase' : ''} ${className}`}
    onClick={onClick}
    // block={block}
    disabled={disabled || loading}
    type={type}
    style={style}
    onKeyPress={onKeyPress}
    tabIndex={tabIndex}
  >
    {loading && (
      <Spinner
        as="span"
        animation="border"
        size="sm"
        role="status"
        aria-hidden="true"
        className="me-1"
      />
    )}
    {content}
  </Button>
)

export default ButtonShadow
