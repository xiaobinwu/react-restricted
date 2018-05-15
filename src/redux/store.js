import { createStore, combineReducers } from 'redux';
import loggedUserReducer from './reducers/loggedUserReducer';
import devToolsEnhancer from 'remote-redux-devtools';
const reducers = combineReducers({
    loggedUserState: loggedUserReducer
});

const store = createStore(reducers, devToolsEnhancer());

export default store;