import { createStore, combineReducers } from 'redux';
import userReducer from './reducers/userReducer';
import routeReducer from './reducers/routeReducer';
import themeReducer from './reducers/themeReducer';
import devToolsEnhancer from 'remote-redux-devtools';
const reducers = combineReducers({
    userState: userReducer,
    routeState: routeReducer,
    themeState: themeReducer
});

const store = createStore(reducers, devToolsEnhancer());

export default store;