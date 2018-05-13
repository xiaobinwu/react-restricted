import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
// import registerServiceWorker from 'src/registerServiceWorker';
import Auth from './pages/auth/auth';
import BaseLayout from './pages/baseLayout/baseLayout';

ReactDOM.render(
    <BrowserRouter>
        <Switch>
            <Route path='/login' component={Auth}></Route>
            <Route path='/site'  component={BaseLayout}></Route>
            <Redirect to='/site'></Redirect>
        </Switch>
    </BrowserRouter>,
    document.getElementById('root')
);

// registerServiceWorker();
