import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Icon } from 'antd';
import { connect } from 'react-redux';
import store from 'rRedux/store';
import styles from './index.css';
const { SubMenu } = Menu;

class SiderMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menuItems: {},
            selectedKeys: ['0'],
            openKeys: ['0-0']
        }
    }
    componentWillMount() {
        let menuItems = {};
        this.props.navData.forEach((item, i) => {
            menuItems[item.site] = (item.children && item.children.length > 0) ? this.walkMenu(item.children, item.path) : [];
        });
        this.setState({
            menuItems
        });
        this.handleLocation(this.props.location);
    }
    handleLocation = ({ pathname }) => {
        // console.log(pathname)
        //http://localhost:3000/service-gateway/test/test1/test3
        let siderMenuSelectedKey = '0';
        let siderMenuOpendedKey = [];
        if (pathname === '/') {
            let pathObj = JSON.parse(JSON.stringify(this.props.navData[0])); 
            while (pathObj.children && pathObj.children.length > 0) {
                pathObj.key && siderMenuOpendedKey.push(pathObj.key);
                siderMenuSelectedKey =  pathObj.children[0].key;
                pathObj = pathObj.children[0];
            }
            this.setState({
                selectedKeys: [siderMenuSelectedKey],
                openKeys: siderMenuOpendedKey
            });
        } else {
            const pathnameArr = pathname.split('/');
            pathnameArr.shift();
            const currentRoutes = this.props.navData.filter((item) => {
                return item.path === `/${pathnameArr[0]}`;
            });
            pathnameArr.shift();
            // while (currentRoutes.children && currentRoutes.children.length > 0) {

            // }
        }
    }
    walkMenu = (menuSet, path, index) => {
        return menuSet.map((item, i) => {
            const key = typeof(index) !== 'undefined' ? `${index}-${i}` : `${i}`;
            const linkPath = `${path}/${item.path}`;
            if (item.children && item.children.length > 0) {
                return( 
                    <SubMenu key={key}  title={
                        <span>
                            {item.icon && <Icon type={item.icon} />}
                            <span>{item.name}</span>
                        </span>
                    }>
                        {
                            this.walkMenu(item.children, linkPath, key)
                        }
                    </SubMenu>
                )
            } else {
                return(
                    <Menu.Item key={key} >
                        {item.icon && <Icon type={item.icon} />}
                        {/* <span>{item.name}</span> */}
                        <span><Link to={linkPath}>{item.name}</Link></span>
                    </Menu.Item>
                );
            }
        });
    }
    // menu onClick触发多次
    // https://github.com/ant-design/ant-design/issues/10382
    handleClick = (e) => {
        if (e.key) {
            console.log(e.key);
        } else {
            if (e.domEvent) {
                e.domEvent.stopPropagation()
            }
        }
    }
    render() {
        const { menuItems, selectedKeys, openKeys } = this.state;
        const { location, currentSite } = this.props;
        return (
            <Menu mode="inline" defaultSelectedKeys={selectedKeys} defaultOpenKeys={openKeys} className={styles.sider} onClick={this.handleClick}>
                { menuItems[currentSite] }
            </Menu>
        );
    }
}
const stateToProps = ({ routeState }) => ({
    currentSite: routeState.currentSite
});

export default connect(stateToProps)(SiderMenu);