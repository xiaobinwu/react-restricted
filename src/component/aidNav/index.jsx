import React, { Component } from 'react';
import { Icon, Menu } from 'antd';
import userService from 'service/userService';
import store from 'rRedux/store';
import styles from './index.css';
import { registerTheme } from 'echarts';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

const ColorBlocks = (props) => {
    const { name, color } = props;
    return (
        <div>
            <span>{name}</span>
            <span style={{ 
                display: 'inline-block', 
                width: '30%', 
                height: '20px', 
                marginTop: '10px', 
                float: 'right', 
                border: '2px solid #eee',
                borderRadius: '2px',
                backgroundColor: color }}>
            </span>
        </div>
    )
}

class AidNav extends Component {
    logout = async () => {
        const { code } = await userService.logout();
        if (code === '0') {
            store.dispatch({
                type: 'SET_LOGGED_USER',
                logged: false,
                username: ''
            });
        }
    }
    handleClick = (e) => {
        if (e.key) {
            switch (e.key) {
                case 'message':

                break;
                case 'usergroup-add':

                break;

                case 'user': 
                    this.logout();
                break;

                default:
                    if (e.key.search(/^antd-theme/) > -1) {
                        window.less && window.less.modifyVars({
                            '@primary-color': e.item.props.theme
                        });
                    }
                    if (e.key.search(/^echart-theme/) > -1) {
                        const { themeState } = store.getState();
                        if (themeState.themeSet.findIndex((value) => { return value === e.item.props.theme;  }) === -1) {
                            // 修改主题
                            import(`themes/echart/${e.item.props.theme}`).then((theme) => {
                                registerTheme(e.item.props.theme, theme.default);
                                store.dispatch({
                                    type: 'SET_THEME',
                                    theme: e.item.props.theme
                                });
                            });
                        } else {
                            store.dispatch({
                                type: 'SET_THEME',
                                theme: e.item.props.theme
                            });
                        }
                    }
            }
        } else {
            if (e.domEvent) {
                e.domEvent.stopPropagation();
            }
        }
    }
    render() {
        return (
            <Menu onClick={this.handleClick} theme="dark" mode="horizontal" className={styles.aidNav}>
                <SubMenu title={<span><Icon type="setting" /></span>}>
                    <MenuItemGroup title="Antd主题">
                        <Menu.Item key="antd-theme-1" theme="#eb2f96"><ColorBlocks name="purple" color="#eb2f96" /></Menu.Item>
                        <Menu.Item key="antd-theme-2" theme="#1da57a"><ColorBlocks name="green" color="#1da57a" /></Menu.Item>
                    </MenuItemGroup>
                    <MenuItemGroup title="Echart主题">
                        <Menu.Item key="echart-theme-1" theme="halloween">halloween（默认）</Menu.Item>
                        <Menu.Item key="echart-theme-2" theme="black">black</Menu.Item>
                        <Menu.Item key="echart-theme-3" theme="chalk">chalk</Menu.Item>
                    </MenuItemGroup>
                </SubMenu>
                <Menu.Item key="message">
                    <Icon type="message" />
                </Menu.Item>
                <Menu.Item key="usergroup-add">
                    <Icon type="usergroup-add" />
                </Menu.Item>
                <SubMenu title={<span><Icon type="user" /></span>}>
                    <Menu.Item key="user">
                        Sign Out
                    </Menu.Item>
                </SubMenu>
            </Menu>
        );
    }
}

export default AidNav;
