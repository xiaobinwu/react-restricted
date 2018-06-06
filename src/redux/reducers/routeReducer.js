const initialState = {
    currentSite: 'businessMarket',
    breadCrumb: [],
    paths: {}
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

    if (action.type === 'SET_PATHS') {
        return Object.assign({}, state, {
            paths: action.paths
        });
    }

    return state;
};

export default routeReducer;
