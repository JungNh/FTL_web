import React from 'react'
import type { FC } from 'react'
import { Route, Switch, Link } from 'react-router-dom'
import { ProgressBar, Button } from 'react-bootstrap'
import img from '../clock.png'
import imgPoint from '../Layer 1.png'

type Props = {
  title: string
  // lession?: { name: string; unitLearnedCount: number; unitCount: number }[]
  lession?: {
    course_id: number
    course_name: string
    course_percentage: number
    course_total_score: number
    course_score: number
  }[]
}

const ProgressLession: FC<Props> = ({ title, lession }) => {
  const convertHMS = (value: any) => {
    const sec = parseInt(value, 10) // convert value to number if it's string
    let hours: any = Math.floor(sec / 3600) // get hours
    let minutes: any = Math.floor((sec - hours * 3600) / 60) // get minutes
    let seconds: any = sec - hours * 3600 - minutes * 60 //  get seconds
    // add 0 if value < 10; Example: 2 => 02
    if (hours < 10) {
      hours = '0' + hours
    }
    if (minutes < 10) {
      minutes = '0' + minutes
    }
    if (seconds < 10) {
      seconds = '0' + seconds
    }
    return hours + ':' + minutes + ':' + seconds // Return is HH : MM : SS
  }

  return (
    <div className="progress__lession">
      <p
        className="progress__title"
        style={{ color: '#018CFF', fontWeight: '700', marginBottom: 0, marginTop: 10 }}
      >
        {title}
      </p>
      {lession?.map((item: any, index: number) => (
        <div className="progress_wrap">
          <div key={index} className="progress_content">
            <div className="d-flex align-items-center justify-content-between">
              <p className="mb-0 small" style={{ width: '450px', textAlign: 'left' }}>
                {item.course_name}
              </p>
              <div style={{ width: '200px', textAlign: 'left', display: 'inline-block' }}>
                <img src={imgPoint} className="prorgess_icon_point" />
                <p className="mb-0 small point">
                  {item.course_score}/{item.course_total_score}
                </p>
              </div>
              <div style={{ width: '200px', textAlign: 'left', display: 'inline-block' }}>
                <img src={img} className="prorgess_icon" />
                <p className="mb-0 small time">{convertHMS(item.course_duration)}</p>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div className="progress_body" style={{ width: '90%' }}>
              <ProgressBar
                variant="success"
                className="progress__bar"
                now={item.course_percentage * 100}
              />
            </div>
            <Button
              className="btn btn_progreess_detail"
              variant="light"
              style={{ marginLeft: 10, backgroundColor: '#008CFF', borderRadius: 15 }}
            >
              <Link
                to={{
                  pathname: `/my-progress/${item.course_id}`,
                  state: { title: item.course_name }
                }}
                style={{ color: 'white' }}
              >
                Xem thêm
              </Link>
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ProgressLession
