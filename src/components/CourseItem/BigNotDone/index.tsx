import * as React from 'react'
import { ProgressBar } from 'react-bootstrap'
import defaultImage from '../../../assets/images/defaut_background.svg'

type Props = {
  courseImage?: string
  coursename?: string
  courseTime?: number
  lessons?: number
  percent?: number
}

const BigNotDone: React.FC<Props> = ({ courseImage, coursename, courseTime, lessons, percent }) => (
  <div
    className="course__item--bigNotDone d-flex"
    style={{
      backgroundImage: `url(${courseImage || defaultImage})`
    }}
  >
    <p className="logo__course">FutureLang</p>
    <div className="course__item--text">
      <p className="course__item--name">{coursename}</p>
      <p className="course__item--content">
        Thời lượng {courseTime} phút. {lessons} bài
      </p>
      <div className="d-flex justify-content-between">
        <b>TIẾN TRÌNH CỦA BẠN</b>
        <p className="percent__progress">{percent}%</p>
      </div>
      <ProgressBar variant="success" className="progress__bar--notdone" now={percent}/>
    </div>
  </div>
)

export default BigNotDone
