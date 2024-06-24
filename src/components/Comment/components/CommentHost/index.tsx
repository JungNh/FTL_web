import * as React from 'react'
import { format } from 'date-fns'
import { Image } from 'react-bootstrap'
import ico_user from '../../../../assets/images/ico_user-black.svg'
import ico_arrowUp from '../../../../assets/images/ico_arrowUp-gray.svg'
import ico_enter from '../../../../assets/images/ico_enter-gray.svg'

type Props = {
  user?: {
    username?: string
    avata?: string
  }
  comment?: {
    content?: string
    createAt?: string
    like?: number
  }
  onLike?: () => void
  onAnswer?: () => void
}

const CommentHost: React.FC<Props> = ({
  user, comment, onLike, onAnswer,
}) => (
  <div className="comment__component--host mb-3">
    <div className="d-flex align-items-center mb-2">
      <Image className="avata__holder" src={user?.avata || ico_user} roundedCircle />
      <div className="ms-3">
        <div className="host__text">Được hỏi bởi</div>
        <div className="host__title">
          <span className="host__name me-2">{user?.username}</span>
          <span className="host__text me-2">vào lúc</span>
          <span className="host__time me-2">
            {comment?.createAt ? format(new Date(comment?.createAt), 'dd.MM.yyyy') : ''}
          </span>
        </div>
      </div>
    </div>
    <div className="comment__content mb-2">{comment?.content}</div>
    <div className=" d-flex">
      <div className="action__item me-3" onClick={() => onLike && onLike()}>
        <Image className="action__item--icon" src={ico_arrowUp} roundedCircle />
        Hữu ích .
        {' '}
        {comment?.like}
      </div>
      <div className="action__item me-3" onClick={() => onAnswer && onAnswer()}>
        <Image className="action__item--icon" src={ico_enter} roundedCircle />
        Trả lời
      </div>
    </div>
  </div>
)

export default CommentHost
