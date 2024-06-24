import React, { FC } from 'react'
import { randomBG } from '../../../../utils/common'
import ico_updown from '../../../../assets/images/ico_updown.svg'

type Props = {
  number: number
  type: string
  updown: 'up' | 'down'
  percent: number
}

const CardInfo: FC<Props> = ({
  number, type, updown, percent,
}) => (
  <div className="info__card w-100" style={{ backgroundImage: `url(${randomBG()})` }}>
    <div className="info__top">
      <p className="info__number">{number}</p>
      <p className="info__type">{type}</p>
    </div>
    <div className="info__bottom">
      <img
        className={`info__updown ${updown === 'down' ? 'down' : ''}`}
        src={ico_updown}
        alt=""
      />
      <p className="info__percent">
        {percent}
        %
      </p>
    </div>
  </div>
)

export default CardInfo
