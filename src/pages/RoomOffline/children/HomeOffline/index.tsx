import React, { FC, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Button } from '../../../../components'
import backArrow from '../../../../assets/images/ico_arrowLeft-blue.svg'
import ListExam from './components/ListExam'
import ListContest from './components/ListContest'
import ReportPage from './components/Report'

type Props = {
  changePage: (data: any) => void
}
const HomeOffline: FC<Props> = ({ changePage }) => {
  const [active, setActive] = useState<'list' | 'report'>('list')
  const [current, setCurrent] = useState(null)

  useEffect(() => {
    const page = document.querySelector('.room__offline__page')
    if (page) page.scrollTop = 0
  }, [])
  const history = useHistory()
  return (
    <div className="home__offline">
      <div className="home__offline--header">
        <p className="title__lession">Phòng thi</p>
        <Button.Shadow
          className="button__back"
          color="gray"
          content={<img src={backArrow} alt="back" />}
          onClick={() => {
            if (current !== null) setCurrent(null)
            if (current === null) history.push('home')
          }}
        />
        {current === null && (
          <div className="d-flex justify-content-around align-items-center">
            <div
              className={`tabs--item left ${active === 'list' ? 'active' : ''}`}
              onClick={() => setActive('list')}
            >
              Kho đề thi
            </div>
            <div
              className={`tabs--item right ${active === 'report' ? 'active' : ''}`}
              onClick={() => setActive('report')}
            >
              Thống kê
            </div>
          </div>
        )}
      </div>
      {current !== null && <ListContest data={current} changePage={changePage} />}
      {current === null && active === 'list' && <ListExam setCurrent={setCurrent} />}
      {current === null && active === 'report' && <ReportPage />}
    </div>
  )
}

export default HomeOffline
