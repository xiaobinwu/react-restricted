const initialState = {
    pending: true,
    logged: false,
    username: '',
};

const loggedUserReducer = (state = initialState, action) => {
    if (action.type === 'SET_LOGGED_USER') {
        return Object.assign({}, state, {
            pending: false,
            logged: action.logged,
            username: action.username
        });
    }
    return state;
}

export default loggedUserReducer;