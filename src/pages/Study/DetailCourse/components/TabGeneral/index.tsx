import React from 'react'

import ico_check_green from '../../../../../assets/images/ico_check-green.svg'
import ico_check_yellow from '../../../../../assets/images/ico_check-yellow.svg'

type Props = {
  listLession: StudyPart[]
}

type StudyPart = {
  courseId?: number
  id?: number
  name?: string
  sequenceNo?: number
  showAll?: boolean
  children?: any[]
}

const TabGeneral: React.FC<Props> = ({ listLession }) => {
  const convertStatus = (status: string) => {
    switch (status) {
      case 'Tốt':
        return (
          <span className="good">
            <img src={ico_check_green} alt="good" />
            &nbsp; Tốt
          </span>
        )
      case 'Khá':
        return (
          <span className="greate">
            <img src={ico_check_yellow} alt="greate" />
            &nbsp; Khá
          </span>
        )
      case 'publish':
        return <span className="not__yet">Chưa học</span>
      case 'Chưa thực hiện':
        return <span className="not__done">Chưa thực hiện</span>
      default:
        return ''
    }
  }
  return (
    <div className="tab__general">
      <p className="text__title">Giới thiệu</p>
      <p className="text__info"> </p>
      <p className="text__title">Nội dung khóa học</p>
      {listLession.map((item: any, index: number) => (
        <React.Fragment key={index}>
          <p className="part__title">{item?.name}</p>
          <ul className="part__list">
            {item?.children?.map((lesson: any, lessIndex: number) => (
              <li key={lessIndex}>
                <div>
                  <span>{lesson.name}</span>
                </div>
                {convertStatus(lesson.status)}
              </li>
            ))}
          </ul>
        </React.Fragment>
      ))}
    </div>
  )
}

export default TabGeneral
