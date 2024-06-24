import 'react-app-polyfill/ie11'
import 'react-app-polyfill/stable'

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import './i18n'
import Main from './main'
import * as serviceWorker from './serviceWorker'
import configureStore from './configureStore'
import history from './utils/history'
{/* <script src="https://sp.zalo.me/plugins/sdk.js"></script> */}

// We use hash history because this example is going to be hosted statically.
// Normally you would use browser history.
export const store = configureStore(history)

ReactDOM.render(<Main store={store} history={history} />, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()
