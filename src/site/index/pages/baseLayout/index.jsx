import React, { Component } from 'react';
// import CSSModules from 'react-css-modules';
import { BrowserRouter } from 'react-router-dom';
import styles from './index.css';
import App from '../routeCompoent/linkTracking/overview';
import logo from 'src/logo.svg';
import { Layout, Icon, Breadcrumb } from 'antd';
import store from 'rRedux/store';
import { connect } from 'react-redux';
import routes from '../../../../route';  // 后面由服务端下发
import SiderMenu from "../../component/siderMenu";
import HeaderMenu from "../../component/headerMenu";

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
    changeSite = (currentSite) => {
        store.dispatch({
            type: 'SET_SITE',
            currentSite
        });
    }
    handleLocation = ({ pathname }) => {
        let headerMenuSelectedKey;
        if (pathname === '/') {
            headerMenuSelectedKey = ['0'];
        }
        const selectedIndex = routes.findIndex((item, index) => {
            return pathname.search(new RegExp(`^${item.path}`, 'ig')) > -1;
        });
        headerMenuSelectedKey = selectedIndex > -1 ? [String(selectedIndex)] : ['0'];
        if (selectedIndex > -1) {
            this.changeSite(routes[selectedIndex].site);
        }
        return {
            headerMenuSelectedKey
        };
    }
    render() {
        const {headerMenuSelectedKey} = this.handleLocation(this.props.location);
        const { location, currentSite } = this.props;
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

                        <SiderMenu location={location} navData={routes} currentSite={currentSite} />
                        
                    </Sider>
                    <Layout>
                        <Header className={styles.header}>
                            <Icon 
                                className={styles.trigger}
                                type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                                onClick={this.toggle}
                            />

                            <HeaderMenu navData={routes} defaultSelectedKeys={headerMenuSelectedKey} />

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

const stateToProps = ({ routeState }) => ({
    currentSite: routeState.currentSite,
});

export default connect(stateToProps)(BaseLayout);