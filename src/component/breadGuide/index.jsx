import React, { Component } from 'react';
import { Breadcrumb } from 'antd';
import { connect } from 'react-redux';
import styles from './index.css';
class BreadGuide extends Component {
    render() {
        const { breadCrumb } = this.props;
        return (
            <Breadcrumb className={styles.breadcrumb}>
                {
                    breadCrumb.map((item, i) => {
                        return(
                            <Breadcrumb.Item key={i}>{item}</Breadcrumb.Item>
                        )
                    })
                }
            </Breadcrumb>
        );
    }
}

const stateToProps = ({ routeState }) => ({
    breadCrumb: routeState.breadCrumb
});

export default connect(stateToProps)(BreadGuide);