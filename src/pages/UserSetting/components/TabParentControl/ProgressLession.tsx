import React from 'react'
import type { FC } from 'react'
import { ProgressBar } from 'react-bootstrap'

type Props = {
  title: string
  lession?: { title: string; numberDone: number; total: number }[]
}

const ProgressLession: FC<Props> = ({ title, lession }) => (
  <div className="progress__lession">
    {lession?.length && (
    <>
      <p className="progress__title" style={{fontWeight:'bold'}}>{title}</p>
      {lession?.map((item: any, index: number) => (
        <div key={index} className="ps-4">
          <div className="d-flex align-items-center justify-content-between">
            <p className="mb-0 small">{item.title}</p>
            <p className="mb-0 small">
              {item.numberDone}
              /
              {item.total}
            </p>
          </div>
          <ProgressBar
            variant="success"
            className="progress__bar"
            now={(item.numberDone / item.total) * 100}
          />
        </div>
      ))}
    </>
      )}
  </div>
)

export default ProgressLession
