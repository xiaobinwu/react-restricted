import React, { Component } from 'react';
// import CSSModules from 'react-css-modules';
import { BrowserRouter } from 'react-router-dom';
import styles from './index.css';
import App from '../routeCompoent/linkTracking/overview';
import logo from 'src/logo.svg';
import { Layout, Icon } from 'antd';
import routes from '../../../../route';  // 后面由服务端下发
import SiderMenu from "../../component/siderMenu";
import HeaderMenu from "../../component/headerMenu";
import BreadGuide from "../../component/breadGuide";
const { Header, Sider, Content, Footer } = Layout;


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
        const { collapsed } = this.state; 
        const { location } = this.props;
        return (
            <BrowserRouter>
                <Layout>
                    <Sider
                        trigger={null}
                        collapsible
                        collapsed={collapsed}
                        width="256"
                    >
                        <div className={styles.logo}>
                            <img src={logo} alt="logo" />
                            <h1>Service governance</h1>
                        </div>

                        <SiderMenu location={location} navData={routes} />
                        
                    </Sider>
                    <Layout>
                        <Header className={styles.header}>
                            <Icon 
                                className={styles.trigger}
                                type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                                onClick={this.toggle}
                            />

                            <HeaderMenu location={location} navData={routes} />

                            <div className={styles.aidNav}>
                                <Icon type="message" />
                                <Icon type="usergroup-add" />
                                <Icon type="user" />
                            </div>
                        </Header>
                        <Content style={{ padding: '0 25px' }}>
                            <BreadGuide />
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