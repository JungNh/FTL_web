import { format } from 'date-fns'
import * as React from 'react'
import { useHistory } from 'react-router'
import Button from '../../../../components/Button'

import PopupContainer from '../../../../components/PopupContainer'
import './styles.scss'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../../store'
import { getGifts } from '../../../../store/gifts/actions'

type Props = {
  contest: Contest | null
}

const PopupNotComplete: React.FC<Props> = ({ contest }) => {
  const history = useHistory()
  const contestRegistrationMessage = () => {
    return contest
      ? `${contest.contest_name.toUpperCase()} - ${contest.contest_grade_name} ${contest.name}`
      : ''
  }
  const time = contest ? format(new Date(contest.exam_end_time), 'HH:mm') : ''
  const dataRound = useSelector((state: RootState) => state.arena.data_round_info)
  const dispatch = useDispatch()

  const datagift = useSelector((state: RootState) => state.gifts)

  React.useEffect(() => {
    dispatch(getGifts())
  }, [])

  return (
    <PopupContainer withClose={true} onClose={() => history.goBack()}>
      <div className="popupnotcomplete__component">
        <div className="content__text">
          <p>
            <b>{contestRegistrationMessage()} </b> chưa kết thúc. Hãy quay lại vào lúc <b>{time}</b>{' '}
            để xem kết quả bảng xếp hạng!
          </p>
        </div>
        {dataRound?.bonus ? (
          datagift.gifts?.length > 0 ? (
            <div className="content__buttons">
              <Button.Shadow
                content="Quà của bạn"
                color="blue"
                onClick={() => history.push(`/gifts`)}
              />
            </div>
          ) : null
        ) : (
          <div className="content__buttons">
            <Button.Shadow content="Quay lại" color="blue" onClick={() => history.push(`/arena`)} />
          </div>
        )}
      </div>
    </PopupContainer>
  )
}

export default React.memo(PopupNotComplete)
