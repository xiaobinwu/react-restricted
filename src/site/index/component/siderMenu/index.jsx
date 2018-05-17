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
    UNSAFE_componentWillMount() {
        // 组件挂载前格式化路由配置，将其变成左侧菜单
        let menuItems = {};
        this.props.navData.forEach((item, i) => {
            menuItems[item.site] = (item.children && item.children.length > 0) ? this.walkMenu(item.children, item.path, item.name) : [];
        });
        this.setState({
            menuItems
        });
        this.handleLocation(this.props.location);
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.props.currentSite !== nextProps.currentSite) {
            this.handleLocation({ pathname: window.location.pathname});
        }
    }
    // 初始状态根据{location}获取左侧菜单栏selectedKey和openKey
    handleLocation = ({ pathname }) => {
        let siderMenuSelectedKey = '0';
        let siderMenuOpendedKey = [];
        let breadCrumb = [];
        if (pathname === '/') {
            let pathObj = JSON.parse(JSON.stringify(this.props.navData[0]));
            breadCrumb.push(this.props.navData[0].name);
            while (pathObj.children && pathObj.children.length > 0) {
                pathObj.key && siderMenuOpendedKey.push(pathObj.key);
                siderMenuSelectedKey =  pathObj.children[0].key;
                breadCrumb.push(pathObj.name);
                pathObj = pathObj.children[0];
            }
        } else {
            const pathnameArr = pathname.split('/');
            pathnameArr.shift();
            let currentRoutes = this.props.navData.filter((item) => {
                return item.path === `/${pathnameArr[0]}`;
            });
            pathnameArr.shift();
            const keyPaths = [];
            let level = 0;
            const walkRoute = (routes) => {
                if (routes.children && routes.children.length > 0) {
                    const matchItem = routes.children.find((item) => {
                        return item.path === pathnameArr[level];
                    });
                    if (matchItem) {
                        keyPaths.push(matchItem.key);
                        breadCrumb.push(matchItem.name);
                        level++;
                        walkRoute(matchItem);
                    }
                }
            }
            breadCrumb.push(currentRoutes[0].name);
            walkRoute(currentRoutes[0]);
            keyPaths.length > 0 && (siderMenuSelectedKey = keyPaths[keyPaths.length - 1]);
            if (keyPaths.length > 0) {
                keyPaths.pop();
                siderMenuOpendedKey = keyPaths;
            }
        }
        // 初始状态获取面包屑
        store.dispatch({
            type: 'SET_BREADCRUMB',
            breadCrumb: breadCrumb
        });
        this.setState({
            selectedKeys: [siderMenuSelectedKey],
            openKeys: siderMenuOpendedKey
        });
    }
    // 递归获取左侧菜单栏结构
    walkMenu = (menuSet, path, name, index) => {
        return menuSet.map((item, i) => {
            const key = typeof(index) !== 'undefined' ? `${index}-${i}` : `${i}`;
            const linkPath = `${path}/${item.path}`;
            const linkName = `${name}/${item.name}`;
            if (item.children && item.children.length > 0) {
                return( 
                    <SubMenu key={key}  title={
                        <span>
                            {item.icon && <Icon type={item.icon} />}
                            <span>{item.name}</span>
                        </span>
                    }>
                        {
                            this.walkMenu(item.children, linkPath, linkName, key)
                        }
                    </SubMenu>
                )
            } else {
                return(
                    <Menu.Item key={key} breadcrumb={linkName}>
                        {item.icon && <Icon type={item.icon} />}
                        {/* <span>{item.name}</span> */}
                        <span>{item.name}</span>
                        <Link to={linkPath}></Link>
                    </Menu.Item>
                );
            }
        });
    }
    // menu onClick触发多次
    // https://github.com/ant-design/ant-design/issues/10382
    // 点击左侧菜单栏更改面包屑
    changeBreadCrumb = (e) => {
        if (e.key) {
            store.dispatch({
                type: 'SET_BREADCRUMB',
                breadCrumb: e.item.props.breadcrumb.split('/')
            });
        } else {
            if (e.domEvent) {
                e.domEvent.stopPropagation();
            }
        }
    }
    // 展开收缩菜单栏
    handleOpenChange = (openKeys) => {
        this.setState({
            openKeys: [...openKeys]
        });
    }
    // 切换选中项
    handleSelectedChange = (item) => {
        this.setState({
            selectedKeys: [item.key]
        });
    }
    render() {
        const { menuItems, selectedKeys, openKeys } = this.state;
        const { location, currentSite, collapsed } = this.props;
        return (
            <Menu mode="inline" inlineCollapsed={collapsed} onOpenChange={this.handleOpenChange} onSelect={this.handleSelectedChange} selectedKeys={selectedKeys} openKeys={openKeys}  className={styles.sider} onClick={this.changeBreadCrumb}>
                { menuItems[currentSite] }
            </Menu>
        );
    }
}
const stateToProps = ({ routeState }) => ({
    currentSite: routeState.currentSite
});

export default connect(stateToProps)(SiderMenu);