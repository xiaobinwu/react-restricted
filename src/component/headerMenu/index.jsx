import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Icon } from 'antd';
import store from 'rRedux/store';
import styles from './index.css';

const { SubMenu } = Menu;

export default class SiderMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: false,
            headerMenuSelectedKey: ['0']
        };
    }
    UNSAFE_componentWillMount() { // eslint-disable-line
        this.view = this.reduceMenu(this.props.navData);
        this.handleLocation(this.props.location);
    }
    // 更换当前站点，更新store
    changeSite = (currentSite) => {
        store.dispatch({
            type: 'SET_SITE',
            currentSite
        });
    }
    // 更换当前面包屑，更新store
    changeBreadCrumb = (e) => {
        if (e.key) {
            store.dispatch({
                type: 'SET_BREADCRUMB',
                breadCrumb: e.item.props.breadcrumb.split('/')
            });
        } else if (e.domEvent) {
            e.domEvent.stopPropagation();
        }
    }
    // 匹配当前{location}获取顶部菜单栏默认selectedKey（以路由配置表的site为key）
    handleLocation = ({ pathname }) => {
        const { navData } = this.props;
        const { routeState } = store.getState();
        let headerMenuSelectedKey;
        if (pathname === '/') {
            headerMenuSelectedKey = [routeState.currentSite];
        }
        const selectedItem = navData.find(item => pathname.search(new RegExp(`^${item.path}`, 'ig')) > -1);
        headerMenuSelectedKey = selectedItem ? [selectedItem.site] : [routeState.currentSite];
        if (selectedItem) {
            this.changeSite(selectedItem.site);
        }
        this.setState({
            headerMenuSelectedKey
        });
    }
    // 拼凑顶部菜单栏的href，以及获取面包屑（用来更新store）
    reducePath = (item) => {
        const backPath = [];
        const backName = [];
        let pathObj = JSON.parse(JSON.stringify(item));
        while (pathObj.children && pathObj.children.length > 0) {
            backPath.push(pathObj.children[0].path);
            backName.push(pathObj.children[0].name);
            pathObj = pathObj.children[0]; // eslint-disable-line
        }
        return {
            backPath: backPath.length > 0 ? `/${backPath.join('/')}` : '',
            backName: backName.join('/')
        };
    }
    // 拼凑顶部菜单栏
    reduceMenu = (navData) => {
        const subNavData = {};
        const subMenuData = [];
        const menuData = navData.map((item, i) => {
            if (item.parent) {
                const parent = JSON.stringify(item.parent);
                if (subNavData[parent] && subNavData[parent].length > 0) {
                    subNavData[parent].push(item);
                } else {
                    subNavData[parent] = [item];
                }
                return null;
            }
            return this.getMenuItem(item);
        }).filter(item => item !== null);

        Object.keys(subNavData).forEach((item) => {
            const parseItem = JSON.parse(item);
            subMenuData.push(<SubMenu key={parseItem.site} title={
                <span>
                    {parseItem.icon && <Icon type={parseItem.icon} />}
                    <span>{parseItem.name}</span>
                </span>
            }>
                {
                    subNavData[item].map((it, i) => this.getMenuItem(it))
                }
            </SubMenu>);
        });
        return [...menuData, ...subMenuData];
    }
    // 返回顶部菜单submenu的menuItem
    getMenuItem(it) {
        return (
            <Menu.Item key={it.site} className={styles.menuItem} breadcrumb={`${it.name}/${this.reducePath(it).backName}`}>
                <Icon type={it.icon} />
                {/* changeSite需要bind绑定，不然会触发多次 */}
                <Link to={`${it.path}${this.reducePath(it).backPath}`} onClick={this.changeSite.bind(this, it.site)}>{it.name}</Link>
            </Menu.Item>
        );
    }
    render() {
        const { headerMenuSelectedKey } = this.state;
        const { view } = this;
        return (
            <Menu mode="horizontal" theme="dark" defaultSelectedKeys={headerMenuSelectedKey} className={styles.nav} onClick={this.changeBreadCrumb}>
                { view }
            </Menu>
        );
    }
}
