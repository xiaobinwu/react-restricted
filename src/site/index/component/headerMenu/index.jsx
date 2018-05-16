import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Icon } from 'antd';
import store from 'rRedux/store';
import styles from './index.css';

export default class SiderMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: false,
            headerMenuSelectedKey: ['0']
        }
    }
    componentWillMount() {
        this.handleLocation(this.props.location);
    }
    changeSite = (currentSite) => {
        store.dispatch({
            type: 'SET_SITE',
            currentSite
        });
    }
    handleLocation = ({ pathname }) => {
        const { navData } = this.props;
        let headerMenuSelectedKey;
        if (pathname === '/') {
            headerMenuSelectedKey = ['0'];
        }
        const selectedIndex = navData.findIndex((item, index) => {
            return pathname.search(new RegExp(`^${item.path}`, 'ig')) > -1;
        });
        headerMenuSelectedKey = selectedIndex > -1 ? [String(selectedIndex)] : ['0'];
        if (selectedIndex > -1) {
            this.changeSite(navData[selectedIndex].site);
        }
        this.setState({
            headerMenuSelectedKey
        });
    }
    reducePath = (item) => {
        const backPath = [];
        let pathObj = JSON.parse(JSON.stringify(item)); 
        while (pathObj.children && pathObj.children.length > 0) {
            backPath.push(pathObj.children[0].path);
            pathObj = pathObj.children[0];
        }
        return backPath.length > 0 ? `/${backPath.join('/')}` : '';
    }
    render() {
        const { headerMenuSelectedKey } = this.state;
        const { navData } = this.props;
        return (
            <Menu mode="horizontal" defaultSelectedKeys={headerMenuSelectedKey} className={styles.nav}>
                {
                    navData.map((item, i) => {
                        return(
                            <Menu.Item key={i}>
                                <Icon type={item.icon} />
                                {/* changeSite需要bind绑定，不然会触发多次 */}
                                <Link to={`${item.path}${this.reducePath(item)}`} onClick={this.changeSite.bind(this, item.site)}>{item.name}</Link>
                            </Menu.Item>
                        )
                    })
                }
            </Menu>
        );
    }
}
