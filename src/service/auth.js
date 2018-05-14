import store from 'rRedux/store';

/* redux状态修改 */
export const getLoggedUser = () => {
    console.log(11111);
    setTimeout(() => {
        store.dispatch({
            type: 'GET_LOGGED_USER'
        });
    }, 3000);
}
export const login = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('success')
            store.dispatch({
                type: 'SET_LOGGED_USER',
                logged: true
            });
        }, 3000);
    });
}
export const logout = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            store.dispatch({
                type: 'SET_LOGGED_USER',
                logged: false
            });
        }, 3000);
    });
}