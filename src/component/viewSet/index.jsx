import React, { Component } from 'react';
import routeSet from 'route/index';
import { Route, Switch, Redirect } from 'react-router-dom';

class ViewSet extends Component {
    constructor(props) {
        super(props);
        this.state = {
            views: []
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
                if (key.split('-').reduce((accumulator, currentValue) => { return Number(accumulator) + Number(currentValue) }, 0) === 0) {
                    return (
                        <div>
                            <Route exact path="/" component={routeSet[item.component]} />
                            <Route key={key} path={linkPath} component={routeSet[item.component]} />
                        </div>
                    );
                } else {
                    return (
                        <Route key={key} path={linkPath} component={routeSet[item.component]} />
                    );
                }
            }
        });
    }
    render() {
        const { views } = this.state;  
        return (
            <Switch>
                { views } 
            </Switch>
        )
    }
}

export default ViewSet;