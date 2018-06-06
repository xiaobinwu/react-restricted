import { createStore, combineReducers } from 'redux';
import userReducer from './reducers/userReducer';
import routeReducer from './reducers/routeReducer';
import themeReducer from './reducers/themeReducer';

const reducers = combineReducers({
    userState: userReducer,
    routeState: routeReducer,
    themeState: themeReducer
});

const store = createStore(reducers);

export default store;
