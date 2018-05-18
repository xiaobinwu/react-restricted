import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import store from 'rRedux/store';
// import registerServiceWorker from 'src/registerServiceWorker';
import Auth from 'pages/auth';
import BaseLayout from 'pages/baseLayout';
import AuthorizedRoute from './authorizedRoute';


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
