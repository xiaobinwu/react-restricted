const initialState = {
    pending: true,
    logged: false,
    username: '',
};

const userReducer = (state = initialState, action) => {
    if (action.type === 'SET_LOGGED_USER') {
        return Object.assign({}, state, {
            logged: action.logged,
            pending: false,
            username: action.username
        });
    }
    return state;
};

export default userReducer;
