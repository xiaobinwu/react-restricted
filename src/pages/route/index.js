import React from 'react';
import Loadable from 'react-loadable';
import Loading from './loading';

const generateLoadable = (component, props) => {
    return Loadable({
        loader: component,
        loading: () => <Loading {...props}/>,
        delay: 20000
    });
}

export default {
    //链路跟踪系统
    'Overview': generateLoadable(() => import('view/linkTracking/overview')),
    'Performance': generateLoadable(() => import('view/linkTracking/performance')),
    'Business': generateLoadable(() => import('view/linkTracking/business')),

    // 网关服务系统
    'Overview1': generateLoadable(() => import('view/serviceGateway/overview')),
    'Test1': generateLoadable(() => import('view/serviceGateway/test1')),
    'Test2': generateLoadable(() => import('view/serviceGateway/test2'))
}
