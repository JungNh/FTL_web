import * as React from 'react'
import type { FC } from 'react'
import { format } from 'date-fns'
import './styles.scss'

import CalendarIcon from '../../assets/images/ico_calendar.svg'
import ClockIcon from '../../assets/images/ico_clock.svg'
import LogoArena from '../../assets/images/logo_arena.svg'
import Gift1 from '../../assets/images/gift-01.png'
import Gift2 from '../../assets/images/gift-02.png'
import Gift3 from '../../assets/images/gift-03.png'
import Gift4 from '../../assets/images/gift-04.svg'
import Carousel from '../../pages/ArenaPage/components/Carousel'

type Props = {
  data: Contest | null
}

const ArenaBanner: FC<Props> = ({ data }) => {
  const time = data
    ? format(new Date(data?.exam_start_time), 'HH:mm') +
      ' - ' +
      format(new Date(data?.exam_end_time), 'HH:mm')
    : ''
  const date = data ? format(new Date(data?.exam_start_time), 'dd/MM/yyyy') : ''

  return (
    <div className="arenabanner__component">
      <Carousel />

      <div className="content__banner">
        {date && (
          <div className="content__banner-date">
            <img src={CalendarIcon} alt="icon" />
            <span>{date}</span>
          </div>
        )}
        {time && (
          <div className="content__banner-timer">
            <img src={ClockIcon} alt="icon" />
            <span>{time}</span>
          </div>
        )}
        {/* <div className="content__banner-content">
          <img src={LogoArena} alt="logo" />
          <h1>ĐẤU TRƯỜNG TIẾNG ANH</h1>
          <div className="content__badge-wrapper">
            <div>Khối THCS & THPT</div>
          </div>
          <div className="content__gift-wrapper">
            <img src={Gift1} alt="gift" />
            <img src={Gift2} alt="gift" />
            <img src={Gift3} alt="gift" />
            <img src={Gift4} alt="gift" />
          </div>
        </div> */}
      </div>
      {/* <div className="content__dots">
        <div />
        <div />
        <div className="active" />
        <div />
        <div />
      </div> */}
    </div>
  )
}

export default ArenaBanner
