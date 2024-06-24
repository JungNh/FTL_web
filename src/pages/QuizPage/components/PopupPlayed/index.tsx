import * as React from 'react'
import _ from 'lodash'
import './styles.scss'

import PopupContainer from '../../../../components/PopupContainer'
import Button from '../../../../components/Button'

interface Props {
  onRedirect: any
  contest: any
}

const PopupPlayed: React.FC<Props> = ({ onRedirect, contest }) => {
  const contestRegistrationMessage = () => {
    return contest
      ? `${contest.contest_name.toUpperCase()} - ${contest.contest_grade_name} ${contest.name}`
      : ''
  }
  return (
    <PopupContainer withClose={false}>
      <div className="popupplayed__component">
        <div className="content__text">
          <div>
            Bạn đã hết lượt tham gia <br />
            <b>{contestRegistrationMessage()}</b>. <br />
            Vui lòng quay lại khi đấu trường tiếp theo diễn ra.
          </div>
        </div>
        <div
          className="content__buttons"
          style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
          <Button.Shadow content="VỀ TRANG CHỦ" color="blue" onClick={onRedirect} />
        </div>
      </div>
    </PopupContainer>
  )
}

export default PopupPlayed
