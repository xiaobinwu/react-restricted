import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import userService from 'service/userService';
import store from 'rRedux/store';
// 登录状态认证组件
class AuthorizedRoute extends Component {
    async componentWillMount() {
        // 获取用户信息
        const { entry }   = await userService.getUserInfo();
        if (entry) {
            console.log(11)
            store.dispatch({
                type: 'SET_LOGGED_USER',
                logged: true,
                username: 'admin'
            });
        }
    }
    render() {
        const { component: Component, logged, ...rest } = this.props;
        return (
            <Route {...rest} render={(props) => {
                return logged ? (<Component {...props} />) : (<Redirect to="/auth" />);
                // return (<Component {...props} />);
            }} />
        );
    }
}

// 将state通过connect包装AuthorizedRoute组件，达到state以props方式传入组件
const stateToProps = ({ userState }) => ({
    logged: userState.logged
});

export default connect(stateToProps)(AuthorizedRoute);