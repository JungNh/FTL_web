import React from 'react'
import { Image } from 'react-bootstrap'
import ico_sound from '../../../../assets/images/ico_sound-gray.svg'

type Props = Record<string, unknown>
type DataType = {
  id: number
  eng: string
  sentence: string
}

const TabSentence: React.FC<Props> = () => {
  const fakeData: DataType[] = [
    { id: 1, sentence: 'Sóng tràn cuốn cả cột buồm và mọi thứ trên boong', eng: 'Clean breach' },
    { id: 2, sentence: 'Sóng tràn cuốn cả cột buồm và mọi thứ trên boong', eng: 'Clean breach' },
    { id: 3, sentence: 'Sóng tràn cuốn cả cột buồm và mọi thứ trên boong', eng: 'Clean breach' },
    { id: 4, sentence: 'Sóng tràn cuốn cả cột buồm và mọi thứ trên boong', eng: 'Clean breach' },
  ]
  return (
    <div className="tab__sentence pb-5">
      {fakeData.map((item: DataType) => (
        <div key={item?.id} className="border-bottom py-1">
          <p className="mb-2">{item?.sentence}</p>
          <p className="mb-2">{item?.eng}</p>
          <Image className="cursor-pointer" src={ico_sound} />
        </div>
      ))}
    </div>
  )
}

export default TabSentence
