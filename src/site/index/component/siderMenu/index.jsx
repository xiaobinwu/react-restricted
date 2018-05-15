import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Icon } from 'antd';

const { SubMenu } = Menu;

export default class SiderMenu extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { location, navData, currentSite } = this.props;
        console.log(location);
        console.log(navData);
        console.log(currentSite);

        const menuSet = navData.filter((item, i) => {
            return item.site === currentSite;
        })
        menuSet.length === 1 &&
        menuSet[0].children &&
        menuSet[0].children.length > 1 &&
        menuSet[0].children.map((item, i) => {
            let pathObj = JSON.parse(JSON.stringify(item));
        });

        return (
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

        );
    }
}
