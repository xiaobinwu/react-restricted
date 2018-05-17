const initialState = {
    currentSite: 'linkTracking',
    breadCrumb: []
};

const routeReducer = (state = initialState, action) => {
    if (action.type === 'SET_SITE') {
        return Object.assign({}, state, {
            currentSite: action.currentSite
        });
    }
    if (action.type === 'SET_BREADCRUMB') {
        return Object.assign({}, state, {
            breadCrumb: action.breadCrumb
        });
    }
    return state;
}

export default routeReducer;