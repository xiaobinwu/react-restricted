import store from 'redux/store';

/* redux状态修改 */
export const getLoggedUser = () => {
    setTimeout(() => {
        store.dispatch({
            type: 'GET_LOGGED_USER'
        });
    }, 500);
}
export const login = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            store.dispatch({
                type: 'SET_LOGGED_USER',
                logged: true
            });
        }, 500);
    });
}
export const logout = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            store.dispatch({
                type: 'SET_LOGGED_USER',
                logged: false
            });
        }, 500);
    });
}