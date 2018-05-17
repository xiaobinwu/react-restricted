import React, { Component } from 'react';
import { Breadcrumb } from 'antd';
import { connect } from 'react-redux';

class BreadGuide extends Component {
    render() {
        const { breadCrumb } = this.props;
        return (
            <Breadcrumb style={{ margin: '16px 0' }}>
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