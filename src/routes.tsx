import * as React from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect } from 'react-router'
import { Route, Switch } from 'react-router-dom'
import { RootState } from './store'
/* PLOP_IMPORT */
import Cource from './pages/Cource'
import CourseDetail from './pages/CourseDetail'
// import DirectionPage from './pages/Direction'
import ContestSummary from './pages/ContestSummary'
import LuckyDraw from './pages/LuckyDraw'
import QuizPage from './pages/QuizPage'
import JoiningRoom from './pages/JoiningRoom'
import Gifts from './pages/Gifts'
import ArenaPage from './pages/ArenaPage'
import ArenaLogin from './pages/ArenaLogin'
import ContestRule from './pages/ContestRule'
import ContestLeaderBoard from './pages/ContestLeaderBoard'
import FixNetWorkTutorial from './pages/FixNetworkTutorial'
import Homepage from './pages/Homepage'
import LeaderBoard from './pages/LeaderBoard'
import Lession from './pages/Lession'
import LoginPage from './pages/LoginPage'
import ProgressPage from './pages/ProgressPage'
import RoomOffline from './pages/RoomOffline'
import RoomOnline from './pages/RoomOnline'
import Study from './pages/Study'
import UpdateProfile from './pages/UpdateProfile'
import UserSetting from './pages/UserSetting'
import { actionCheckUserHasSchool } from './store/home/actions'
import { actionUserMe, actionUserMeCore, userInteractWeb } from './store/login/actions'
import CoursePlus from './pages/CoursePlus'
import { ArenaRoute } from './lib/arenaApi'
import PopupSlider from './pages/PopupSlider'
import RegiterPage from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ShareGift from './pages/ShareGift'
import MyCourseLeaning from './pages/MyCourseLeaning'
import TokenCAS from './pages/TokenCAS'
import UpdateProfileVitaPage from './pages/TokenCAS/UpdateProfileVitaPage'
import BlocksLanguagePage from './pages/BlocksLanguagePage'
import ActiveCard from './pages/ActiveCard'
import Attendance from './pages/Attendance'

type Props = {}

const Routes: React.FC<Props> = () => {
  const [checkUpdate, setCheckUpdate] = React.useState(false)

  const dispatch = useDispatch()
  const userInfo = useSelector((state: RootState) => state.login.userInfo)
  const updateProfile = useSelector((state: RootState) => state.home.must_update)

  useEffect(() => {
    dispatch(userInteractWeb(false))
    if (userInfo?.id) {
      dispatch(actionUserMeCore())
      dispatch(actionUserMe())
    }
  }, [dispatch, userInfo?.id])

  useEffect(() => {
    const checkUpdateProfile = async () => {
      await dispatch(actionCheckUserHasSchool())
      setCheckUpdate(true)
    }
    checkUpdateProfile()
  }, [])
  if (checkUpdate)
    return (
      <div onClick={() => dispatch(userInteractWeb(true))}>
        {/* PLOP_ROUTE */}

        {!userInfo?.id ? (
          <Switch>
            <Route exact path="/login" component={LoginPage} />
            <Route exact path="/register" component={RegiterPage} />
            <Route exact path="/fix-network" component={FixNetWorkTutorial} />
            <Route exact path="/forgot-password" component={ForgotPassword} />
            <Route exact path="/share" component={ShareGift} />
            <Route exact path="/update-token" component={TokenCAS} />

            <Redirect to="/login" />
          </Switch>
        ) : (
          <Switch>
            <Route exact path="/update-token" component={TokenCAS} />

            {/* Arena routes */}
            <Route exact path="/arena-login" component={ArenaLogin} />
            <ArenaRoute path="/arena" component={ArenaPage} />
            <ArenaRoute path="/join/:id" component={JoiningRoom} />
            <ArenaRoute path="/contest-rule/:id" component={ContestRule} />
            <ArenaRoute path="/quiz/:id" component={QuizPage} />
            <ArenaRoute path="/contest-summary/:id" component={ContestSummary} />
            <ArenaRoute path="/draw/:id" component={LuckyDraw} />
            <ArenaRoute path="/contest-leaderboard/:id" component={ContestLeaderBoard} />
            <ArenaRoute path="/gifts" component={Gifts} />
            {/* End arena routes */}
            <Route exact path="/home" component={Homepage} />
            <Route path="/posts" component={PopupSlider} />
            {/* <Route exact path="/direction" component={DirectionPage} /> */}
            <Route exact path="/user-setting" component={UserSetting} />
            <Route exact path="/progress" component={ProgressPage} />
            <Route path="/study" component={Study} />
            <Route path="/course/:id" component={CourseDetail} />
            <Route exact path="/leader-board/:id" component={LeaderBoard} />
            <Route exact path="/lession/:id" component={Lession} />
            <Route exact path="/my-progress/:id" component={Cource} />
            <Route exact path="/exam-online" component={RoomOnline} />
            <Route exact path="/exam-offline" component={RoomOffline} />
            <Route exact path="/update-profile" component={UpdateProfile} />
            <Route exact path="/update-usernew" component={UpdateProfileVitaPage} />
            <Route exact path="/en-UK" component={BlocksLanguagePage} />
            <Route exact path="/zh-CN" component={BlocksLanguagePage} />
            <Route exact path="/ja-JP" component={BlocksLanguagePage} />
            <Route exact path="/ko-KR" component={BlocksLanguagePage} />
            <Route exact path="/share" component={ShareGift} />
            <Route exact path="/my-leanning" component={MyCourseLeaning} />
            <Route exact path="/active-card" component={ActiveCard} />
            <Route exact path="/attendance" component={Attendance} />

            {/* <Route exact path="/game-resources" component={GameResources} /> */}
            {updateProfile ? <Redirect to="/update-profile" /> : <Redirect to="/home" />}

            {/* <Redirect to="/home" /> */}
          </Switch>
        )}

        {/* <Route path="/courses" component={Courses} />
          <Route path="/discovery" component={Discovery} />
          <Route exact path="/dictionary" component={Dictionary} />
          <Route path="/fix-network" component={FixNetworkTutorial} />
          <Route path="/test" component={TestPlace} /> */}
      </div>
    )
  return null
}

export default Routes
