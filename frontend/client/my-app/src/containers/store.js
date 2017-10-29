import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/es/storage' // default: localStorage if web, AsyncStorage if react-native
import rootReducer from '../reducers/user'
import {createStore, compose} from 'redux';

const config = {
  key: 'root', // key is required
  storage, // storage is now required
}

const reducer = persistReducer(config, rootReducer)

function configureStore () {
  // ...
  let store = createStore(reducer)
  let persistor = persistStore(store)
  
  return { persistor, store }
}

export default createStore(
	reducer,
	undefined,
	compose()
	);