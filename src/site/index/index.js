import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import store from 'redux/store';
// import registerServiceWorker from 'src/registerServiceWorker';
import Auth from './pages/auth/auth';
import BaseLayout from './pages/baseLayout/baseLayout';
import AuthorizedRoute from './authorizedRoute';


class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <BrowserRouter>
                    <Switch>
                        <Route path="/auth" component={Auth} />
                        <AuthorizedRoute path="/site" component={BaseLayout} />
                        <Redirect to="/auth" />
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
