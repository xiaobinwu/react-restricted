import React, { Component } from 'react';
// import CSSModules from 'react-css-modules';
import { BrowserRouter } from 'react-router-dom';
import styles from './index.css';
import App from '../routeCompoent/linkTracking/overview';
import logo from 'src/logo.svg';
import { Layout, Icon, Breadcrumb } from 'antd';
import { connect } from 'react-redux';
import store from 'rRedux/store';
import routes from '../../../../route';  // 后面由服务端下发
import SiderMenu from "../../component/siderMenu";
import HeaderMenu from "../../component/headerMenu";
import BreadGuide from "../../component/breadGuide";
const { Header, Sider, Content, Footer } = Layout;


class BaseLayout extends Component {
    constructor(props) {
        super(props);
        const {headerMenuSelectedKey} = this.handleLocation(this.props.location);
        this.state = {
            collapsed: false,
            headerMenuSelectedKey
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
        // console.log(pathname)
        //http://localhost:3000/service-gateway/test/test1/test3
        let headerMenuSelectedKey;
        let siderMenuSelectedKey;
        let siderMenuOpendedKey = [];
        if (pathname === '/') {
            headerMenuSelectedKey = ['0'];
            let count = 0;
            let pathObj = JSON.parse(JSON.stringify(routes[0])); 
            while (pathObj.children && pathObj.children.length > 0) {
                count++;
                pathObj = pathObj.children[0];
            }
            siderMenuSelectedKey = [new Array(count).fill(0).join('-')];
            while(count > 0) {
                siderMenuOpendedKey.push(new Array(count).fill(0).join('-'));
                count--;
            }
            console.log(siderMenuOpendedKey);
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
        }
    }
    render() {
        const { headerMenuSelectedKey, collapsed } = this.state; 
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

                            <HeaderMenu navData={routes} defaultSelectedKeys={headerMenuSelectedKey} onLinkClick={this.changeSite} />

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

const stateToProps = ({ routeState }) => ({
    currentSite: routeState.currentSite
});

export default connect(stateToProps)(BaseLayout);