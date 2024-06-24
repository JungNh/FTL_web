import * as React from 'react'
import Truncate from 'react-truncate'
import defaultImage from '../../../assets/images/defaut_background.svg'

type Props = {
  courseImage?: string
  coursename?: string
  description?: string
  courseLevel?: string
}

const CourseItemBig: React.FC<Props> = ({
  courseImage, coursename, description, courseLevel,
}) => (
  <div
    className="course__item--big d-flex"
    style={{
      backgroundImage: `url(${courseImage || defaultImage})`,
    }}
  >
    <p className="logo__course">FutureLang</p>
    <div className="course__item--text">
      <p className="course__item--name">{coursename}</p>
      <p className="course__item--level">{courseLevel}</p>
      <div className="description__container">
        <Truncate lines={3} className="course__item--description">
          {description}
        </Truncate>
      </div>
    </div>
  </div>
)

export default CourseItemBig
