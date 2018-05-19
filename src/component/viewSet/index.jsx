import React, { Component } from 'react';
import routeSet from 'route/index';
import { Route, Switch, Redirect } from 'react-router-dom';

class ViewSet extends Component {
    constructor(props) {
        super(props);
        this.state = {
            views: [],
            defaultView: ''
        }
    }
    UNSAFE_componentWillMount() {
        let views = this.walkRoutes(this.props.navData);
        this.setState({
            views
        });
    }
    walkRoutes = (routes, path, index) => {
        return routes.map((item, i) => {
            const key = typeof(index) !== 'undefined' ? `${index}-${i}` : `${i}`;
            const linkPath = typeof(path) !== 'undefined' ? `${path}/${item.path}` : `${item.path}`;
            if (item.children && item.children.length > 0) {
                return this.walkRoutes(item.children, linkPath, key);
            } else {
                const isBasePath = key.split('-').reduce((accumulator, currentValue) => { return Number(accumulator) + Number(currentValue) }, 0) === 0;
                if (isBasePath) {
                    this.setState({
                        defaultView: item.component
                    });
                }
                return (
                    <Route key={key} path={linkPath} component={routeSet[item.component]} />
                );        
            }
        });
    }
    render() {
        const { views, defaultView} = this.state;  
        return (
            <Switch>
                <Route exact path="/" component={routeSet[defaultView]} />
                { views } 
            </Switch>
        )
    }
}

export default ViewSet;