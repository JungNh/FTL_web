import * as React from 'react'
import { Image, ProgressBar } from 'react-bootstrap'
import Truncate from 'react-truncate'
import defaultImage from '../../../assets/images/defaut_background.svg'

type Props = {
  courseImage?: string
  coursename?: string
  content?: string
  progress?: number
}

const CourseItemSmall: React.FC<Props> = ({
  courseImage, coursename, content, progress,
}) => (
  <div className="course__item--small d-flex">
    <Image
      className="course__item--logo me-3"
      src={courseImage || defaultImage}
      alt="course_img"
      rounded
    />
    <div className="flex-1 course__item--text">
      <p className="course__item--title mb-0">{coursename}</p>
      <Truncate lines={2} className="course__item--content">
        {content}
      </Truncate>
      <ProgressBar className="course__item--progress" now={progress || 0} variant="success" />
    </div>
  </div>
)

export default CourseItemSmall
