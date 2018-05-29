const initialState = {
    theme: 'halloween',
    themeSet: ['halloween']
};

const themeReducer = (state = initialState, action) => {
    if (action.type === 'SET_THEME') {
        state.themeSet.push(action.theme);
        return Object.assign({}, state, {
            theme: action.theme
        });
    }
    return state;
}

export default themeReducer;