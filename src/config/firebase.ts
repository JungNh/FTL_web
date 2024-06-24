import { initializeApp } from 'firebase/app'
import { getAnalytics } from "firebase/analytics"

const firebaseConfig = {
  // apiKey: 'AIzaSyBb2ORyWPhYUYCImhwBDtKxdb_ThzGAKHU',
  // authDomain: 'newproject-52028.firebaseapp.com',
  // databaseURL: 'https://newproject-52028.firebaseio.com',
  // projectId: 'newproject-52028',
  // storageBucket: 'newproject-52028.appspot.com',
  // messagingSenderId: '873508799176',
  // appId: '1:873508799176:web:97d74005440c2a41bb9bfd',
  apiKey: 'AIzaSyDqTnaRoNHYQYh932QXWGfEm3HZOEovahI',
  authDomain: 'future-lang.firebaseapp.com',
  databaseURL: 'https://future-lang-default-rtdb.firebaseio.com',
  projectId: 'future-lang',
  storageBucket: 'future-lang.appspot.com',
  messagingSenderId: '447560689095',
  appId: '1:447560689095:web:9f068677b3bd60dc1625e2',
  measurementId: 'G-DHFJQRQM3K',
}

const futureApp = initializeApp(firebaseConfig)
const analytics = getAnalytics(futureApp)

export { firebaseConfig, futureApp }
