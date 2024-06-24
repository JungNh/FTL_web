import * as React from 'react'
import './styles.scss'

type Props = {
  item: any
  onClick: any
}

const GiftItem: React.FC<Props> = ({ item, onClick }) => {
  return (
    <div className="giftitem__component" onClick={onClick}>
      <div className="giftitem__left">
        <p>
          {item.contest_round_dict.contest_dict.name} -{' '}
          {item.contest_round_dict.contest_dict.grade_dict.name} {item.contest_round_dict.name}
        </p>
        <div />
        <b>
          {item.lottery_gift_dict.number_of_units_per_hit > 1
            ? item.lottery_gift_dict.number_of_units_per_hit
            : ''}{' '}
          {item.lottery_gift_dict.gift_dict.name} - {item.is_received_gift ? 'Đã' : 'Chưa'} nhận
        </b>
      </div>
      <div className="giftitem__right">
        <img src={item.lottery_gift_dict.gift_dict.image} alt="gift" />
      </div>
    </div>
  )
}

export default GiftItem
