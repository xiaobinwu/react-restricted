import { createStore, combineReducers } from 'redux';
import loggedUserReducer from './reducers/loggedUserReducer';
import routeReducer from './reducers/routeReducer';
import devToolsEnhancer from 'remote-redux-devtools';
const reducers = combineReducers({
    loggedUserState: loggedUserReducer,
    routeState: routeReducer
});

const store = createStore(reducers, devToolsEnhancer());

export default store;