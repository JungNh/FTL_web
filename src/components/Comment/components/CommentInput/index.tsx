import * as React from 'react'
import { useEffect, useRef, useState } from 'react'
import { Image } from 'react-bootstrap'
import ico_user from '../../../../assets/images/ico_user-black.svg'
import Button from '../../../Button'
import ico_arrowRight from '../../../../assets/images/ico_arrowRight-white.svg'

type Props = {
  user?: {
    username?: string
    avata?: string
  }
  onAnswer?: (text: string) => void
  isSub?: boolean
  changeFocus?: boolean
  onCancel?: () => void
}

const CommentInput: React.FC<Props> = ({
  user, onAnswer, isSub, changeFocus, onCancel,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [value, setValue] = useState<string>('')

  useEffect(() => {
    if (inputRef?.current && changeFocus !== undefined) {
      inputRef.current.focus()
    }
  }, [changeFocus])

  const submitComment = () => {
    if (value && onAnswer) {
      onAnswer(value)
      setValue('')
    }
  }

  return (
    <div className="comment__component--input mb-3">
      <div className="d-flex align-items-center mb-2">
        <Image
          className={`avata__holder ${isSub ? 'small__avata' : ''}`}
          src={user?.avata || ico_user}
          roundedCircle
        />
        <div className="flex-1">
          {isSub ? '' : <div className="host__text">Trả lời hoặc thảo luận</div>}
          <div className="host__input--container">
            <input
              value={value}
              type="text"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e?.target?.value)}
              className="comment__input-custom"
              ref={inputRef}
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              onBlurCapture={() => {
                if (!value && onCancel) onCancel()
              }}
            />
            <Button.Shadow
              color="malibu"
              className="ms-2"
              onClick={() => submitComment()}
              content={(
                <div className="d-flex align-items-center h-100">
                  <p className="mb-0 text-nowrap me-2">Bình luận</p>
                  <img src={ico_arrowRight} alt="->" />
                </div>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CommentInput
