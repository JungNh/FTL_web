import * as React from 'react'
import defaultImage from '../../../assets/images/defaut_background.svg'

type Props = {
  courseImage?: string
  coursename?: string
}

const CourseItemBig: React.FC<Props> = ({ courseImage, coursename }) => (
  <div
    className="course__item--option d-flex"
    style={{
      backgroundImage: `url(${courseImage || defaultImage})`,
    }}
  >
    <div className="course__item--text">
      <p className="course__item--name">{coursename}</p>
    </div>
  </div>
)

export default CourseItemBig
