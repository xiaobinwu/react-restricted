import { createStore, combineReducers } from 'redux';
import userReducer from './reducers/userReducer';
import routeReducer from './reducers/routeReducer';
import devToolsEnhancer from 'remote-redux-devtools';
const reducers = combineReducers({
    userState: userReducer,
    routeState: routeReducer
});

const store = createStore(reducers, devToolsEnhancer());

export default store;