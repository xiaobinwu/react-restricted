import React, { Component } from 'react';
import routeSet from 'route/index';
import { Route, Switch } from 'react-router-dom';
import store from 'rRedux/store';

let paths = {};
let childrenNotInMenuBarRoute = [];
class ViewSet extends Component {
    constructor(props) {
        super(props);
        this.state = {
            views: [],
            defaultView: '',
        };
    }
    UNSAFE_componentWillMount() { // eslint-disable-line
        const walkRoutes = this.walkRoutes(this.props.navData);
        const views = [...walkRoutes, ...childrenNotInMenuBarRoute];
        store.dispatch({
            type: 'SET_PATHS',
            paths: { ...paths }
        });
        paths = null; // 回收path
        childrenNotInMenuBarRoute = null; // 回收childrenNotInMenuBarRoute
        this.setState({
            views
        });
    }
    walkRoutes = (routes, path, index) => routes.map((item, i) => {
        const routekey = typeof (index) !== 'undefined' ? `${index}-${i}` : `${i}`;
        const linkPath = typeof (path) !== 'undefined' ? `${path}/${item.path}` : `${item.path}`;
        if (item.children && item.children.length > 0) {
            if (item.hasChildrenNotInMenuBar) {
                paths[item.path] = {
                    routekey,
                    key: item.key,
                    linkPath
                };
                const route = <Route key={routekey} path={linkPath} component={routeSet[item.component]} />;
                childrenNotInMenuBarRoute.push(route);
            }
            return this.walkRoutes(item.children, linkPath, routekey);
        }
        const isBasePath = routekey.split('-').reduce((accumulator, currentValue) => Number(accumulator) + Number(currentValue), 0) === 0;
        if (isBasePath) {
            this.setState({
                defaultView: item.component
            });
        }
        paths[item.path] = {
            routekey, // 用于给Route组件添加唯一标识key
            key: item.key, // 路由表的key值，用于后面权限管理
            linkPath
        };
        return (
            <Route key={routekey} path={linkPath} component={routeSet[item.component]} />
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
