import React from 'react'

type Props = Record<string, unknown>

type DataType = {
  id: number
  type: string
  sentence: string
}

const TabEngEng: React.FC<Props> = () => {
  const fakeData: DataType[] = [
    {
      id: 1,
      type: 'Danh từ',
      sentence: 'Sóng tràn cuốn cả cột buồm và mọi thứ trên boong',
    },
    {
      id: 2,
      type: 'Ngoại động từ',
      sentence: 'Sóng tràn cuốn cả cột buồm và mọi thứ trên boong',
    },
  ]
  return (
    <div className="tab_EngEng pb-5">
      {fakeData.map((item: DataType) => (
        <div className="py-1" key={item?.id}>
          <p className="title mb-2">{item?.type}</p>
          <p className="content mb-2">{item?.sentence}</p>
        </div>
      ))}
    </div>
  )
}

export default TabEngEng
