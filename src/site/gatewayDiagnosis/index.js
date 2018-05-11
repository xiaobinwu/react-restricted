/* 网关诊断系统 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Test1 from './pages/test1/test1';
// import registerServiceWorker from 'src/registerServiceWorker';

import { Layout, Menu, Icon, Breadcrumb } from 'antd';
const { Header, Sider, Content, Footer } = Layout;


class BaseLayout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: false,
        }
    }
    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    }
    render() {
        return (
            <div>
                <Layout>
                    <Sider
                        trigger={null}
                        collapsible
                        collapsed={this.state.collapsed}
                        style={{background: '#fff'}}
                    >
                        <div className="logo" style={{ height: 32, background: '#d8e6df', margin: 16}}/>
                        <Menu mode="inline" defaultSelectedKeys={['1']} style={{ height: '100%' }}>
                            <Menu.Item key="1">
                                <Icon type="user"></Icon>
                                <span>Nav 1</span>
                            </Menu.Item>
                            <Menu.Item key="2">
                                <Icon type="video-camera"></Icon>
                                <span>Nav 2</span>
                            </Menu.Item>   
                            <Menu.Item key="3">
                                <Icon type="upload"></Icon>
                                <span>Nav 3</span>
                            </Menu.Item>                 
                        </Menu>
                    </Sider>
                    <Layout>
                        <Header style={{ background: '#fff', padding: '0 25px' }}>
                            <Icon 
                                className="trigger"
                                type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                                onClick={this.toggle}
                            />
                        </Header>
                        <Content style={{ padding: '0 25px' }}>
                            <Breadcrumb style={{ margin: '16px 0' }}>
                                <Breadcrumb.Item>Home</Breadcrumb.Item>
                                <Breadcrumb.Item>List</Breadcrumb.Item>
                                <Breadcrumb.Item>App</Breadcrumb.Item>
                            </Breadcrumb>
                            <div style={{ padding: 24, background: '#fff', minHeight: 280 }}>
                                <Test1/>
                            </div>
                        </Content>
                        <Footer style={{ textAlign: 'center' }}>
                            Ant Design ©2016 Created by Ant UED
                        </Footer>
                    </Layout>
                </Layout>
            </div>
        );
    }
}



ReactDOM.render(<BaseLayout />, document.getElementById('root'));
// registerServiceWorker();
