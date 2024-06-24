import * as React from 'react'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import { Store } from 'redux'
// import preval from 'preval.macro'
import { History } from 'history'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'
import Routes from './routes'
import { RootState } from './store'
import './styles/main.scss'
import 'bootstrap/dist/css/bootstrap.min.css'
// import withClearCache from './ClearCache'
import { futureApp } from './config/firebase'
import NotificationConfig from './components/NotificationConfig'
import { I18nextProvider } from 'react-i18next'
import i18n from './i18n'

interface MainProps {
  store: Store<RootState>
  history: History
}

// const dateTimeStamp = preval`module.exports = () => {
//   const checkZero = (data) => {
//     if(data.length === 1) return data = "0" + data
//     return data;
//   }

//   const today = new Date();
//   const day = checkZero(new Date().getDate() + "");
//   const month = checkZero((today.getMonth() + 1) + "");
//   const year = checkZero(today.getFullYear() + "");
//   const hour = checkZero(today.getHours() + "");
//   const minutes = checkZero(today.getMinutes() + "");
//   const seconds = checkZero(today.getSeconds() + "")
//   return day + "/" + month + "/" + year + " " + hour + ":" + minutes + ":" + seconds
// }`
// console.log('=====================================')
// console.log('REACT VERSION CREATED AT: ', dateTimeStamp)
// console.log('=====================================')

// const VAPID_KEY = 'BCfiQTtIWuTtLi4lhU2IOvAOvCktMp4DAvPY-3U7KKG1YXDmjR2vRDXyCxfSfIgZ6dtPZ1r4hmkCg-wqMVGDDKM'

const messaging = getMessaging(futureApp)
getToken(messaging)
  .then((currentToken) => {
    if (currentToken) {
      // console.log('Firebase Token', currentToken)
    } else {
      // Show permission request UI
      // console.log('No registration token available. Request permission to generate one.')
      // ...
    }
  })
  .catch((err) => {
    // console.log('An error occurred while retrieving token. ', err)
    // ...
  })
onMessage(messaging, (payload) => {
  // console.log('Message received. ', payload)
})

const Main: React.FC<MainProps> = ({ store, history }) => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <NotificationConfig />
      <Routes />
    </ConnectedRouter>
  </Provider>
)
// const ClearCacheComponent = withClearCache(Main)
const App: React.FC<MainProps> = ({ store, history }) => (
  <I18nextProvider i18n={i18n}>
    <Main store={store} history={history} />
  </I18nextProvider>
)

export default App
