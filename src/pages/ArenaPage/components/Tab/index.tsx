import * as React from 'react'
import type { FC } from 'react'

import { ContestType } from '../../../../utils/enums'
import './styles.scss'
import { openInNewTab } from '../../../../utils/common'

type Props = {
  tab: ContestType
  setTab: (value: ContestType) => void
}

const Tab: FC<Props> = ({ tab, setTab }) => {
  return (
    <div className="tab__component">
      <div
        className={tab === ContestType.UPCOMING ? 'active' : ''}
        onClick={() => setTab(ContestType.UPCOMING)}
      >
        Sắp diễn ra
      </div>
      <div
        className={tab === ContestType.HAPPENNING ? 'active' : ''}
        onClick={() => setTab(ContestType.HAPPENNING)}
      >
        Đang diễn ra
      </div>
      <div
        className={tab === ContestType.HAPPENED ? 'active' : ''}
        onClick={() => setTab(ContestType.HAPPENED)}
      >
        Đã kết thúc
      </div>
      <div
        className={tab === ContestType.NEWS ? 'active' : ''}
        onClick={() => openInNewTab('https://futurelang.startup40.com/futurelang-english-champions')}
      >
        Tin tức
      </div>
    </div>
  )
}

export default Tab
