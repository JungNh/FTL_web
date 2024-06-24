import * as React from 'react'
import _ from 'lodash'
import HeaderHome from '../Homepage/HeaderHome'
import PanelTab from '../../components/PanelTab'
import TabCardActive from '../UserSetting/components/TabCardActive'
import { url } from 'inspector'
import PanelTabMobile from '../../components/PanelTab/PanelTabMobile'

type Props = Record<string, never>

const ActiveCard: React.FC<Props> = () => {
  return (
    <div className="bg-active-card" >
      <div style={{ position: 'relative' }}>
        <PanelTab />
        <PanelTabMobile/>
        <div className="userSetting_panel-right">
          <TabCardActive />
        </div>
      </div>
    </div>
  )
}

export default ActiveCard
