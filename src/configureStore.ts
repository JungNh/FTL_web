import { Store, createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { routerMiddleware } from 'connected-react-router'
import { composeWithDevTools } from 'redux-devtools-extension'
import { History } from 'history'
import _ from 'lodash'
import { RootState, rootReducer } from './store'
import { loadState, saveState } from './utils/storage'

export default function configureStore(history: History): Store<RootState, any> {
  const composeEnhancers = composeWithDevTools({})
  const persistedState = loadState()
  const store = createStore(
    rootReducer(history),
    persistedState,
    composeEnhancers(applyMiddleware(routerMiddleware(history), thunk))
  )

  store.subscribe(_.throttle(() => {
    saveState(store.getState())
  }, 1000))

  return store
}
