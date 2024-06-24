import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import { History } from 'history'
/* PLOP IMPORT STORE */
import contestLeaderBoardReducer from './contestLeaderBoard/reducer'
import contestLeaderBoardStates from './contestLeaderBoard/states'
import luckyDrawReducer from './luckyDraw/reducer'
import luckyDrawStates from './luckyDraw/states'
import contestSummaryReducer from './contestSummary/reducer'
import contestSummaryStates from './contestSummary/states'
import quizPageReducer from './quizPage/reducer'
import joiningRoomReducer from './joiningRoom/reducer'
import joiningRoomStates from './joiningRoom/states'

import { loginReducer } from './login/reducer'
import loginStates from './login/states'
import { homeReducer } from './home/reducer'
import { studyReducer } from './study/reducer'
import { settingsReducer } from './settings/reducer'
import { roomOnlineReducer } from './roomOnline/reducer'
import { roomOfflineReducer } from './roomOffline/reducer'
import { progressReducer } from './progress/reducer'
import { lessonReducer } from './lesson/reducer'
import { achivementReducer } from './achivements/reducer'
import arenaReducer from './arena/reducer'
import giftsReducer from './gifts/reducer'
import homeState from './home/states'
import arenaState from './arena/states'
import quizPageStates from './quizPage/states'
import giftsState from './gifts/states'
import studyState from './study/states'
import settingsState from './settings/states'
import roomOnlineState from './roomOnline/states'
import roomOfflineState from './roomOffline/states'
import progressState from './progress/states'
import achivementState from './achivements/states'
import lessonState from './lesson/states'
import popupSlider from './popup/reducer'
import popup from './popup/states'

export interface RootState {
  /* PLOP STORE STATE */
  contestLeaderBoard: contestLeaderBoardStates
  luckyDraw: luckyDrawStates
  contestSummary: contestSummaryStates
  quizPage: quizPageStates
  joiningRoom: joiningRoomStates
  arena: arenaState
  gifts: giftsState
  popup: popup
  login: loginStates
  home: homeState
  study: studyState
  news: settingsState
  roomOnline: roomOnlineState
  roomOffline: roomOfflineState
  progress: progressState
  achivement: achivementState
  lesson: lessonState
}

export const rootReducer = (history: History) =>
  combineReducers({
    router: connectRouter(history),
    login: loginReducer,
    home: homeReducer,
    study: studyReducer,
    news: settingsReducer,
    roomOnline: roomOnlineReducer,
    roomOffline: roomOfflineReducer,
    progress: progressReducer,
    achivement: achivementReducer,
    lesson: lessonReducer,
    arena: arenaReducer,
    gifts: giftsReducer,
    joiningRoom: joiningRoomReducer,
    quizPage: quizPageReducer,
    contestSummary: contestSummaryReducer,
    luckyDraw: luckyDrawReducer,
    contestLeaderBoard: contestLeaderBoardReducer,
    popup: popupSlider
  })
