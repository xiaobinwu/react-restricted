import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import store from 'rRedux/store';
// import registerServiceWorker from 'src/registerServiceWorker';

import 'antd/dist/antd.less';
// 默认黑色主题,后期去掉color.less
import 'themes/antd/color.less';
import 'themes/antd/dark.less';

import Auth from 'pages/auth';
import BaseLayout from 'pages/baseLayout';
import AuthorizedRoute from './authorizedRoute';


if (module.hot) {
    module.hot.accept();
}

class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <BrowserRouter>
                    <Switch>
                        <Route path="/auth" component={Auth} />
                        <AuthorizedRoute path="/" component={BaseLayout} />
                    </Switch>
                </BrowserRouter>
            </Provider>
        );
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);

// registerServiceWorker();
