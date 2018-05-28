import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { Spin } from 'antd';
import userService from 'service/userService';
import store from 'rRedux/store';
// 登录状态认证组件
class AuthorizedRoute extends Component {
    componentWillMount() {
        // 获取用户信息
        (async () => {
            const { entry } = await userService.getUserInfo();
            if (entry) {
                store.dispatch({
                    type: 'SET_LOGGED_USER',
                    logged: true,
                    username: 'admin'
                });
            }
        })()
    }
    render() {
        const { component: Component, pending, logged, ...rest } = this.props;
        return (
            <Route {...rest} render={(props) => {
                if (pending) return (
                    <Spin size="large" tip="Loading..." style={{ minHeight: "100%" }}>
                        <div style={{
                            minHeight: "800px",
                            height: "100vh"
                        }}>
                        </div>
                    </Spin>
                );
                return logged ? (<Component {...props} />) : (<Redirect to="/auth" />);
            }} />
        );
    }
}

// 将state通过connect包装AuthorizedRoute组件，达到state以props方式传入组件
const stateToProps = ({ userState }) => ({
    pending: userState.pending,
    logged: userState.logged
});

export default connect(stateToProps)(AuthorizedRoute);