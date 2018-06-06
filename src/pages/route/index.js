import React from 'react';
import Loadable from 'react-loadable';
import Loading from './loading';

const generateLoadable = (component, props) => Loadable({
    loader: component,
    loading: () => <Loading {...props}/>,
    delay: 20000
});

export default {
    // 链路跟踪系统
    Overview: generateLoadable(() => import('view/linkTracking/overview')),
    Performance: generateLoadable(() => import('view/linkTracking/performance')),
    Business: generateLoadable(() => import('view/linkTracking/business')),
    TraceInfoList: generateLoadable(() => import('view/linkTracking/traceInfoList')),
    TraceInquire: generateLoadable(() => import('view/linkTracking/traceInquire')),

    // 网关服务系统
    GetwayDubbo: generateLoadable(() => import('view/serviceGateway/dubbo')), // Dubbo服务
    GetwayOnline: generateLoadable(() => import('view/serviceGateway/online')), // Gateway在线服务
    GetwayConnect: generateLoadable(() => import('view/serviceGateway/connect')), // 连接管理
    GetwayMonitor: generateLoadable(() => import('view/serviceGateway/monitor')), // 在线监控
    GetwayFlow: generateLoadable(() => import('view/serviceGateway/flow')), // 全局流量分析
    GetwayQPS: generateLoadable(() => import('view/serviceGateway/QPS')), // 全局QPS分析
    GetwaySlowService: generateLoadable(() => import('view/serviceGateway/slowService')), // 慢服务查询
    GetwayColony: generateLoadable(() => import('view/serviceGateway/colony')), // 集群概览
    GetwayIpblacklist: generateLoadable(() => import('view/serviceGateway/ipblacklist')), // IP 黑名单
    GetwayToken: generateLoadable(() => import('view/serviceGateway/token')), // TOKEN管理
    GetwayParameterConf: generateLoadable(() => import('view/serviceGateway/parameterConf')), // 参数配置
    GetwayLinkstate: generateLoadable(() => import('view/serviceGateway/linkstate')), // 链路状态
};
