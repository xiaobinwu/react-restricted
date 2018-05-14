import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { getLoggedUser } from 'service/auth';
import { Spin } from 'antd';

// 登录状态认证组件
class AuthorizedRoute extends Component {
    componentWillMount() {
        // 异步验证是否登录
        getLoggedUser();
    }
    render() {
        const { component: Component, pending, logged, ...rest } = this.props;
        return (
            <Route {...rest} render={(props) => {
                if (pending) return (<Spin />);
                return logged ? (<Component {...props} />) : (<Redirect to="/auth" />);
            }} />
        );
    }
}

// 将state通过connect包装AuthorizedRoute组件，达到state以props方式传入组件
const stateToProps = ({ loggedUserState }) => ({
    pending: loggedUserState.pending,
    logged: loggedUserState.logged
});

export default connect(stateToProps)(AuthorizedRoute);