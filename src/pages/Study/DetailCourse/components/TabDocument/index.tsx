import React, { useState } from 'react'
import _ from 'lodash'

import { DictionaryModal } from '../../../../../components'

type Props = Record<string, unknown>

type DocumentType = { title: string; order: number }
type CourseData = {
  generalInfo: string
  documents: DocumentType[]
}

const TabDocument: React.FC<Props> = () => {
  const [isShow, setIsShow] = useState<boolean>(false)
  const fakeData: CourseData = {
    generalInfo:
      'Vestibulum eu quam nec neque pellentesque efficitur id eget nisl. Proin porta est convallis lacus blandit pretium sed non enim. Maecenas lacinia non orci at aliquam.',
    documents: [
      { title: 'breach', order: 1 },
      { title: 'breach', order: 2 },
      { title: 'breach', order: 3 },
      { title: 'breach', order: 4 },
      { title: 'breach', order: 5 },
      { title: 'no name', order: 6 },
      { title: 'no name', order: 7 },
      { title: 'no name', order: 8 },
      { title: 'no name', order: 9 },
      { title: 'no name', order: 10 },
    ],
  }

  return (
    <div className="tab__document">
      <p className="text__title">Tài liệu tham khảo</p>
      <p className="text__info">{fakeData.generalInfo || ''}</p>

      <ul className="part__list">
        {_.orderBy(fakeData.documents, 'order', 'asc').map((item: DocumentType, index: number) => (
          <li key={index} onClick={() => setIsShow(true)}>{`Từ điển: ${item.title}`}</li>
        ))}
      </ul>

      <DictionaryModal isShow={isShow} closeModal={() => setIsShow(false)} />
    </div>
  )
}

export default TabDocument
