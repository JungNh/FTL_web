import * as React from 'react'
import { ProgressBar } from 'react-bootstrap'
import defaultImage from '../../../assets/images/defaut_background.svg'
import vipcourse from '../../../assets/images/vip_course.png'

type Props = {
  courseImage?: string
  coursename?: string
  courseTime?: number
  lessons?: number
  percent?: number
  vip?: number
}

const BigNotDone: React.FC<Props> = ({
  courseImage,
  coursename,
  courseTime,
  lessons,
  percent,
  vip
}) => (
  <div
    style={{
      flex: 1,
      height: 150,
      backgroundColor: '#f9f9f9',
      marginBottom: 10,
      borderRadius: 10,
      display: 'flex',
      padding: 8
    }}
  >
    <div style={{ position: 'relative' }}>
      <img
        src={courseImage || defaultImage}
        style={{ width: 134, height: 134, borderRadius: 10 }}
      />
      {vip ? (
        <img src={vipcourse} style={{ position: 'absolute', bottom: -2, right: -2 }} />
      ) : (
        <></>
      )}
    </div>

    <div
      className="course__item--text"
      style={{
        padding: 10,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        flex: 1
      }}
    >
      <div style={{ fontWeight: 'bold', fontSize: 16 }}>{coursename}</div>
      <div style={{ fontSize: 14, marginTop: 10, marginBottom: 10 }}>
        Thời lượng {courseTime} phút. {lessons} bài
      </div>
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', left: '48%', color: 'white', fontSize: 12 }}>
          <p>{percent}%</p>
        </div>
        <ProgressBar
          variant="#008CFF"
          className="progress__bar--notdone progress"
          now={percent}
          // label={<div style={{ fontSize: 10, textAlign:'center', alignItems:'center' }}>{percent}%</div>}
          style={{
            backgroundColor: '#214B6F',
            borderRadius: 20
          }}
        />
      </div>
    </div>
  </div>
)

export default BigNotDone
