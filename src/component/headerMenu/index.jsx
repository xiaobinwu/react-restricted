import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Icon } from 'antd';
import store from 'rRedux/store';
import styles from './index.css';
const SubMenu = Menu.SubMenu;

export default class SiderMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: false,
            headerMenuSelectedKey: ['0']
        }
    }
    UNSAFE_componentWillMount() {
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
        } else {
            if (e.domEvent) {
                e.domEvent.stopPropagation();
            }
        }
    }
    // 匹配当前{location}获取顶部菜单栏默认selectedKey
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
    // 拼凑顶部菜单栏的href，以及获取面包屑（用来更新store）
    reducePath = (item) => {
        const backPath = [];
        const backName = [];
        let pathObj = JSON.parse(JSON.stringify(item)); 
        while (pathObj.children && pathObj.children.length > 0) {
            backPath.push(pathObj.children[0].path);
            backName.push(pathObj.children[0].name);
            pathObj = pathObj.children[0];
        }
        return {
            backPath: backPath.length > 0 ? `/${backPath.join('/')}` : '',
            backName: backName.join('/')
        }
    }
    // 拼凑顶部菜单栏
    reduceMenu = (navData) => {
        // navData.map((item, i) => {
        //     return(
        //         <Menu.Item key={i} breadcrumb={`${item.name}/${this.reducePath(item).backName}`}>
        //             <Icon type={item.icon} />
        //             {/* changeSite需要bind绑定，不然会触发多次 */}
        //             <Link to={`${item.path}${this.reducePath(item).backPath}`} onClick={this.changeSite.bind(this, item.site)}>{item.name}</Link>
        //         </Menu.Item>
        //     )
        // })

        const subNavData = {};
        const subMenuData = [];
        const menuData = navData.map((item, i) => {
            if (item.parent) {
                if (subNavData[item.parent.name] && subNavData[item.parent.name].length > 0) {
                    subNavData[item.parent.name].push(item);
                } else {
                    subNavData[item.parent.name] = [item];
                }
                return null;
            }
            return(
                <Menu.Item key={item.site} breadcrumb={`${item.name}/${this.reducePath(item).backName}`}>
                    <Icon type={item.icon} />
                    {/* changeSite需要bind绑定，不然会触发多次 */}
                    <Link to={`${item.path}${this.reducePath(item).backPath}`} onClick={this.changeSite.bind(this, item.site)}>{item.name}</Link>
                </Menu.Item>
            )
        }).filter(item => item !== null);
        console.log(Object.keys(subNavData))
        Object.keys(subNavData).forEach(item => {
            subMenuData.push(
                <SubMenu key={subNavData[item].name} title={<span> {subNavData[item].name} </span>}>
                    {
                        subNavData[item].map((it, i) => {
                            <Menu.Item key={it.site} breadcrumb={`${it.name}/${this.reducePath(it).backName}`}>
                                <Icon type={it.icon} />
                                {/* changeSite需要bind绑定，不然会触发多次 */}
                                <Link to={`${it.path}${this.reducePath(it).backPath}`} onClick={this.changeSite.bind(this, it.site)}>{it.name}</Link>
                            </Menu.Item>                       
                        })
                    }
                </SubMenu>     
            ) 
        });
        console.log([...menuData, ...subMenuData])
        return [...menuData, ...subMenuData];
    }
    render() {
        const { headerMenuSelectedKey } = this.state;
        const { navData } = this.props;
        return (
            <Menu mode="horizontal"  defaultSelectedKeys={headerMenuSelectedKey} className={styles.nav} onClick={this.changeBreadCrumb}>
                {
                    this.reduceMenu(navData)
                }
            </Menu>
        );
    }
}
