import React from 'react'

const PlusTabData = [
  {
    key: '',
    title: 'Nổi bật'
  },
  {
    key: 'zh-CN',
    title: 'Tiếng Trung'
  },
  {
    key: 'ko-KR',
    title: 'Tiếng Hàn'
  },
  {
    key: 'ja-JP',
    title: 'Tiếng Nhật'
  },
  {
    key: 'en-UK',
    title: 'Tiếng Anh'
  }
]

interface Props {
  active: number
  handleGetDataPlus: (language: string, index: number) => void
}

const CourseTabs = ({ active, handleGetDataPlus }: Props) => {
  return (
    <div className="plus-tabs">
      {PlusTabData.map((item, index) => {
        return (
          <div
            key={index}
            className={`plus-tab ${active === index && 'plus-tab-active'}`}
            onClick={() => {
              if (active !== index) handleGetDataPlus(item.key, index)
            }}
          >
            {item.title}
          </div>
        )
      })}
    </div>
  )
}

export default React.memo(CourseTabs)
