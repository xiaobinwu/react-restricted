const routes = [
    {
        site: 'businessMarket',
        path: '/business-market',
        icon: 'table',
        name: '业务大盘',
        children: [
            {
                name: '业务大盘',
                path: 'businessMarket',
                icon: 'layout',
                component: 'BusinessMarket',
                key: '0'
            },
            {
                name: '业务报表',
                path: 'businessReport',
                icon: 'profile',
                component: 'BusinessReport',
                key: '1'
            }
        ]
    },

    {
        site: 'qualityService',
        path: '/quality-service',
        icon: 'bar-chart',
        name: '业务治理',
        children: [
            {
                name: '应用管理',
                path: 'businessManagement',
                icon: 'inbox',
                component: 'BusinessManagement',
                key: '0'
            },
            {
                name: '服务管理',
                path: 'serviceManagement',
                icon: 'laptop',
                component: 'ServiceManagement',
                key: '1'
            }
        ]
    },

    {
        site: 'linkTracking',
        path: '/link-tracking',
        icon: 'area-chart',
        name: '火眼',
        parent: {
            icon: 'book',
            name: '常用系统'
        },
        children: [
            {
                name: '实时分析',
                path: 'analysis',
                icon: 'dashboard',
                key: '0',
                children: [
                    {
                        name: '应用概览',
                        path: 'overview',
                        component: 'Overview',
                        key: '0-0'
                    },
                    {
                        name: '核心业务',
                        path: 'business',
                        component: 'Business',
                        key: '0-1'
                    }
                ]
            },
            {
                name: '链路跟踪',
                path: 'trace',
                icon: 'credit-card',
                key: '1',
                children: [
                    {
                        name: '链路信息',
                        path: 'traceInfoList',
                        component: 'TraceInfoList',
                        key: '1-0'
                    },
                    {
                        name: '链路详情',
                        path: 'traceInquire',
                        component: 'TraceInquire',
                        key: '1-1'
                    }
                ]
            },
            {
                name: '应用拓扑',
                path: 'topology',
                icon: 'fork',
                key: '2',
                component: 'TopologyInfo'
            },
            {
                name: '异常信息',
                path: 'abnormal',
                icon: 'frown-o',
                key: '3',
                children: [
                    {
                        name: '异常列表',
                        path: 'abnormalList',
                        component: 'AbnormalList',
                        key: '3-0'
                    }
                ]
            },
            {
                name: '配置管理',
                path: 'setting',
                icon: 'setting',
                key: '4',
                children: [
                    {
                        name: '核心业务配置',
                        path: 'coreSetting',
                        component: 'CoreSetting',
                        key: '4-0'
                    }
                ]
            }
        ]
    },
    {
        site: 'serviceGateway',
        path: '/service-gateway',
        icon: 'bar-chart',
        name: '服务网关',
        parent: {
            icon: 'book',
            name: '常用系统'
        },
        children: [
            {
                name: '应用概览',
                path: 'overview',
                icon: 'calendar',
                component: 'Overview1',
                key: '0'
            },
            {
                name: '测试父菜单',
                path: 'test',
                icon: 'cloud',
                key: '1',
                children: [
                    {
                        name: '测试子菜单1',
                        path: 'test1',
                        component: 'Test1',
                        key: '1-0',
                        children: [
                            {
                                name: '测试子菜单1-1',
                                path: 'test3',
                                icon: 'book',
                                component: 'Test1',
                                key: '1-0-0'
                            },
                            {
                                name: '测试子菜单1-2',
                                path: 'test4',
                                icon: 'book',
                                component: 'Test2',
                                key: '1-0-1'
                            }
                        ]
                    },
                    {
                        name: '测试子菜单2',
                        path: 'test2',
                        component: 'Test2',
                        key: '1-1'
                    }
                ]
            }
        ]
    }
]
export default routes