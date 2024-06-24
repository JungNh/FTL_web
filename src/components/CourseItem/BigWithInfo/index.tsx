import * as React from 'react'
import { Image } from 'react-bootstrap'
import Truncate from 'react-truncate'
import defaultImage from '../../../assets/images/defaut_background.svg'

type Props = {
  courseImage?: string
  coursename?: string
  courseTime?: number
  coursePart?: number
  lessons?: number
  courseDescription?: string
}

const BigWithInfo: React.FC<Props> = ({
  courseImage,
  coursename,
  courseTime,
  coursePart,
  lessons,
  courseDescription,
}) => (
  <div className="course__item--bigInfo d-flex">
    <Image className="course__item--logo me-3" src={courseImage || defaultImage} alt="course_img" />
    <div className="flex-1 course__item--text">
      <p className="course__item--title">{coursename}</p>
      <div className="tag__container mb-2">
        <div className="course__tag">khóa học của bạn</div>
      </div>
      <b className="course__item--content">
        Thời lượng:
        {' '}
        {courseTime}
        {' '}
        phút
      </b>
      <b className="course__item--content">
        Số bài học:
        {' '}
        {coursePart}
        {' '}
        phần
        {' '}
        {lessons}
        {' '}
        bài
      </b>
      <Truncate lines={2} className="course__item--content">
        {courseDescription}
      </Truncate>
    </div>
  </div>
)

export default BigWithInfo
