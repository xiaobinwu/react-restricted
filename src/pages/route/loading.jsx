import React from 'react';
import { Spin } from 'antd';

const Loading = props => (
    <div style={{ height: 'calc(100vh - 117px)', textAlign: 'center', lineHeight: 'calc(100vh - 117px)' }}>
        <Spin size="large" tip="Loading..." />
    </div>
);

export default Loading;
