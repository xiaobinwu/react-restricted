import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Icon } from 'antd';
import styles from './index.css';

export default class SiderMenu extends Component {
    reducePath (item) {
        const backPath = [];
        let pathObj = JSON.parse(JSON.stringify(item)); 
        while (pathObj.children && pathObj.children.length > 0) {
            backPath.push(pathObj.children[0].path);
            pathObj = pathObj.children[0];
        }
        return backPath.length > 0 ? `/${backPath.join('/')}` : '';
    }
    render() {
        const { navData, defaultSelectedKeys } = this.props;
        return (
            <Menu mode="horizontal" defaultSelectedKeys={defaultSelectedKeys} className={styles.nav}>
                {
                    navData.map((item, i) => {
                        return(
                            <Menu.Item key={i}>
                                <Icon type={item.icon} />
                                <Link to={`${item.path}${this.reducePath(item)}`}>{item.name}</Link>
                            </Menu.Item>
                        )
                    })
                }
            </Menu>
        );
    }
}
