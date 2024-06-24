import * as React from 'react'
import './styles.scss'

import Button from '../../../../components/Button'
import PopupContainer from '../../../../components/PopupContainer'

type Props = {
  type: 'submit' | 'auto_submit'
  contest: Contest | null
  open: boolean
  onClose: any
}

const PopupSubmitSucceed: React.FC<Props> = ({ type, contest, open, onClose }) => {
  return open ? (
    <PopupContainer onClose={onClose}>
      <div className="popupcongrats__component">
        <div className="content__text">
          {type === 'submit' && <p>Chúc mừng bạn đã hoàn thành</p>}
          {type === 'auto_submit' && <p>Bài dự thi</p>}
          <p>
            <strong>
              {contest
                ? `${contest.contest_name.toUpperCase()} - ${contest.contest_grade_name} ${
                    contest.name
                  }`
                : ''}
            </strong>
          </p>
          {type === 'auto_submit' && <p>của bạn đã tự động nộp!</p>}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button.Shadow content="XEM KẾT QUẢ" onClick={onClose} />
        </div>
      </div>
    </PopupContainer>
  ) : null
}

export default PopupSubmitSucceed
