const initialState = {
    theme: 'black'
};

const themeReducer = (state = initialState, action) => {
    if (action.type === 'SET_THEME') {
        return Object.assign({}, state, {
            theme: action.theme
        });
    }
    return state;
}

export default themeReducer;