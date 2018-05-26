import React, { Component } from 'react';
// import CSSModules from 'react-css-modules';
import { BrowserRouter } from 'react-router-dom';
import logo from 'src/logo.svg';
import { Layout, Icon, Spin } from 'antd';
import routes from 'route/route';  // 后面由服务端下发
import SiderMenu from "component/siderMenu";
import HeaderMenu from "component/headerMenu";
import BreadGuide from "component/breadGuide";
import AidNav from "component/aidNav";
import ViewSet from "component/viewSet";
import styles from './index.css';

const { Header, Sider, Content, Footer } = Layout;


class BaseLayout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: false,
            loading: false
        }
    }
    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    }
    render() {
        const { collapsed, loading } = this.state; 
        const { location } = this.props;
        return (
            <Spin spinning={loading} size="large" wrapperClassName={styles.spin}>
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

                            <SiderMenu location={location} collapsed={collapsed} navData={routes} />
                            
                        </Sider>
                        <Layout>
                            <Header className={styles.header}>
                                <Icon 
                                    className={styles.trigger}
                                    type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                                    onClick={this.toggle}
                                />

                                <HeaderMenu location={location} navData={routes} />

                                <AidNav />
                            </Header>
                            <Content style={{ padding: '0 25px' }}>
                                <BreadGuide />
                                <div style={{ padding: 24, background: '#fff', minHeight: 280 }}>
                                    <ViewSet navData={routes} />
                                </div>
                            </Content>
                            <Footer style={{ textAlign: 'center' }}>
                                Ant Design ©2016 Created by Ant UED1111
                            </Footer>
                        </Layout>
                    </Layout>
                </BrowserRouter>
            </Spin>
        );
    }
}

export default BaseLayout;
