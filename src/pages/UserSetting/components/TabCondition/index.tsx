import React from 'react'

type Props = Record<string, unknown>

const TabStudyRoute: React.FC<Props> = () => (
  <div className="tab_condition">
    <div className="tab__wrap">
      <p className="h4 fw-bold">Điều khoản</p>
      <div>
        <h1 className="display-1 my-5 text-center fw-bold" style={{ color: '#b2b2b2' }}>
          Trang chưa khả dụng
        </h1>
      </div>
    </div>
  </div>
)

export default TabStudyRoute
