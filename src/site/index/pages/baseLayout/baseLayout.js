import React, { Component } from 'react';
// import CSSModules from 'react-css-modules';
import { BrowserRouter } from 'react-router-dom';
import styles from './baseLayout.css';
import App from '../../component/App';
import logo from 'src/logo.svg';

import { Layout, Menu, Icon, Breadcrumb } from 'antd';
const { Header, Sider, Content, Footer } = Layout;
const { SubMenu } = Menu;

class BaseLayout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: false
        }
    }
    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    }
    render() {
        return (
            <BrowserRouter>
                <Layout>
                    <Sider
                        trigger={null}
                        collapsible
                        collapsed={this.state.collapsed}
                        width="256"
                    >
                        <div className={styles.logo}>
                            <img src={logo} alt="logo" />
                            <h1>Service governance</h1>
                        </div>
                        <Menu mode="inline" defaultSelectedKeys={['2']} defaultOpenKeys={['sub1']} style={{ height: '100%', fontSize: '12px' }}>
                            <Menu.Item key="1">
                                <Icon type="dot-chart" />
                                <span>链路跟踪</span>
                            </Menu.Item>       
                            <SubMenu key="sub1" title={<span><Icon type="pie-chart" /><span>仪表盘</span></span>}>
                                <Menu.Item key="2">实时性能监控</Menu.Item>
                                <Menu.Item key="3">实时业务监控</Menu.Item>
                            </SubMenu>
                        </Menu>
                    </Sider>
                    <Layout>
                        <Header className={styles.header}>
                            <Icon 
                                className={styles.trigger}
                                type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                                onClick={this.toggle}
                            />
                            <Menu
                                mode="horizontal"
                                defaultSelectedKeys={['5']}
                                className={styles.nav}
                            >
                                <Menu.Item key="5">
                                    <Icon type="area-chart" />
                                    链路跟踪系统
                                </Menu.Item>
                                <Menu.Item key="6">
                                    <Icon type="bar-chart" />
                                    网关服务系统
                                </Menu.Item>
                            </Menu>
                            <div className={styles.aidNav}>
                                <Icon type="message" />
                                <Icon type="usergroup-add" />
                                <Icon type="user" />
                            </div>
                        </Header>
                        <Content style={{ padding: '0 25px' }}>
                            <Breadcrumb style={{ margin: '16px 0' }}>
                                <Breadcrumb.Item>Home</Breadcrumb.Item>
                                <Breadcrumb.Item>List</Breadcrumb.Item>
                                <Breadcrumb.Item>App</Breadcrumb.Item>
                            </Breadcrumb>
                            <div style={{ padding: 24, background: '#fff', minHeight: 280 }}>
                                <App/>
                            </div>
                        </Content>
                        <Footer style={{ textAlign: 'center' }}>
                            Ant Design ©2016 Created by Ant UED
                        </Footer>
                    </Layout>
                </Layout>
            </BrowserRouter>
        );
    }
}

export default BaseLayout;