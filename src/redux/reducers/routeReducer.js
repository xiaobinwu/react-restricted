const initialState = {
    currentSite: 'linkTracking',
};

const routeReducer = (state = initialState, action) => {
    if (action.type === 'SET_SITE') {
        return Object.assign({}, state, {
            currentSite: action.currentSite
        });
    }
    return state;
}

export default routeReducer;