import React, { Component } from 'react';
import routeSet from 'route/index';
import { Route, Switch } from 'react-router-dom';
import store from 'rRedux/store';

let paths = {};
class ViewSet extends Component {
    constructor(props) {
        super(props);
        this.state = {
            views: [],
            defaultView: '',
        };
    }
    UNSAFE_componentWillMount() { // eslint-disable-line
        const views = this.walkRoutes(this.props.navData);
        store.dispatch({
            type: 'SET_PATHS',
            paths: { ...paths }
        });
        paths = null; // 回收path
        this.setState({
            views
        });
    }
    walkRoutes = (routes, path, index) => routes.map((item, i) => {
        const key = typeof (index) !== 'undefined' ? `${index}-${i}` : `${i}`;
        const linkPath = typeof (path) !== 'undefined' ? `${path}/${item.path}` : `${item.path}`;
        if (item.children && item.children.length > 0) {
            return this.walkRoutes(item.children, linkPath, key);
        }
        const isBasePath = key.split('-').reduce((accumulator, currentValue) => Number(accumulator) + Number(currentValue), 0) === 0;
        if (isBasePath) {
            this.setState({
                defaultView: item.component
            });
        }
        paths[item.path] = {
            key,
            linkPath
        };
        return (
            <Route key={key} path={linkPath} component={routeSet[item.component]} />
        );

    })
    render() {
        const { views, defaultView } = this.state;
        return (
            <Switch>
                <Route exact path="/" component={routeSet[defaultView]} />
                { views }
            </Switch>
        );
    }
}

export default ViewSet;
