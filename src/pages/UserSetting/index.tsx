import * as React from 'react'
import { useCallback, useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import Swal from 'sweetalert2'
import { useLocation } from 'react-router-dom'
import _ from 'lodash'
import { useDispatch } from 'react-redux'
import NavBar from '../../components/Navbar'

import { Button } from '../../components'
import TabMyAcc from './components/TabMyAcc'
import TabSubAcc from './components/TabSubAcc'
import TabParentControl from './components/TabParentControl'
import TabCardActive from './components/TabCardActive'
import TabStudyRoute from './components/TabStudyRoute'
import TabSetting from './components/TabSetting'
import TabInfo from './components/TabInfo'
import TabPassword from './components/TabPassword'
import TabContact from './components/TabContact'
import TabTutorial from './components/TabTutorial'
import TabCondition from './components/TabCondition'
import TabNews from './components/TabNews'
import TabAchievements from './components/TabAchievements'
import TabAchievementsDetail from './components/TabAchievementsDetail'
import { actionUnregisterNotification } from '../../store/settings/actions'
import { clearDataListPopup } from '../../store/popup/actions'
import TabAffiliate from './components/TabAffiliate'
import { useTranslation } from 'react-i18next'
import PanelTab from '../../components/PanelTab'
import HeaderHome from '../Homepage/HeaderHome'

import TabOverview from './components/TabOverview'
import left from '../../assets/images/left.png'
import PanelTabMobile from '../../components/PanelTab/PanelTabMobile'

type Props = Record<string, never>

const isDev = sessionStorage.getItem('GAME_RESOURCES') === 'true'

type TabsType =
  | 'overview'
  | 'my-acc'
  | 'card-active'
  | 'change-pass'
  | 'parent-control'
  | 'sub-acc'
  | 'study-route'
  | 'setting'
  | 'tutorial'
  | 'contact'
  | 'condition'
  | 'info'
  | 'logOut'
  | 'achievements'
  | 'achievements-detail'
  | 'affiliate'

interface LocationState {
  my_leaning: string // Đặt kiểu cho thuộc tính my_leaning
}

const UserSetting: React.FC<Props> = () => {
  const location = useLocation<LocationState>()
  const [t, i18n] = useTranslation('lang')
  const my_leaning = location.state?.my_leaning
  const [active, setActive] = useState<TabsType>(my_leaning ? 'card-active' : 'overview')
  const history = useHistory()
  const dispatch = useDispatch()

  useEffect(() => {
    if (my_leaning) {
      setActive('card-active')
    } else {
      const tabPanel = _.get(location, 'state.tabPanel') || 'overview'
      setActive(tabPanel)
    }
  }, [location])

  const unregisterNotification = async () => {
    await dispatch(actionUnregisterNotification())
  }

  const logOut = () => {
    Swal.fire({
      title: 'Bạn muốn đăng xuất',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Không',
      confirmButtonText: 'Đăng xuất'
    })
      .then(async (result) => {
        if (result.isConfirmed) {
          await unregisterNotification()
          await dispatch(clearDataListPopup())
          localStorage.clear()
          dispatch({ type: 'RESET' })
          history.push('/login')
        }
        return ''
      })
      .catch((error) => console.error(error))
    // const response = dispatch({

    // })
  }

  const openExtenalLink = (url: string) => {
    window?.open(url, '_blank')?.focus()
  }

  const goToScreen = useCallback(
    (text: TabsType) => {
      setActive(text)
    },
    [active]
  )

  return (
    <div className="userSetting__page">
      <div style={{ position: 'relative' }}>
        <PanelTab />
        <PanelTabMobile/>
        <div className="homePage">
          <HeaderHome
            title={
              <>
                {active === 'overview' && (
                  <div style={{display: 'flex' }} className='say_hi'>Tài khoản</div>
                )}
                {active === 'my-acc' && (
                  <div
                    style={{ fontSize: 26, display: 'flex', alignItems: 'center' }}
                    onClick={() => setActive('overview')}
                  >
                    <img src={left} style={{ marginRight: 10, height: 16 }} />
                    Quản lý hồ sơ
                  </div>
                )}
                {active === 'achievements' && (
                  <div
                    style={{ fontSize: 26, display: 'flex', alignItems: 'center' }}
                    onClick={() => setActive('overview')}
                  >
                    <img src={left} style={{ marginRight: 10, height: 16 }} />
                    Thành tích cá nhân
                  </div>
                )}
                {active === 'achievements-detail' && (
                  <div
                    style={{ fontSize: 26, display: 'flex', alignItems: 'center' }}
                    onClick={() => setActive('achievements')}
                  >
                    <img src={left} style={{ marginRight: 10, height: 16 }} />
                    Thành tích khoá học
                  </div>
                )}
              </>
            }
          />
          {active === 'overview' && <TabOverview gotoScreen={goToScreen} logout={logOut} />}
          {active === 'my-acc' && <TabMyAcc goToSubAccTab={() => setActive('overview')} />}
          {active === 'achievements' && (
            <TabAchievements
              goToAchiveDetailTab={() => setActive('achievements-detail')}
              goToSubAccTab={() => setActive('overview')}
            />
          )}
          {active === 'achievements-detail' && (
            <TabAchievementsDetail goToSubAccTab={() => setActive('overview')} />
          )}
          {active === 'change-pass' && <TabPassword />}
          {active === 'affiliate' && <TabAffiliate />}
          {active === 'tutorial' && <TabTutorial />}
          {active === 'contact' && <TabContact />}
          {active === 'condition' && <TabCondition />}
          {active === 'info' && <TabInfo />}
        </div>
      </div>
    </div>
  )
}

export default UserSetting

