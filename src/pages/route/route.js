/*
    url组装结果：
        站点url片段/一级菜单url片段/二级菜单url片段/三级菜单url片段 => /service-gateway/serviceManagement/service/dubbo

        // 带有hasChildrenNotInMenuBar配置情况：
        /service-gateway/serviceManagement/service/online/onlineDetail?id=1

    结构说明：
        {
            site: 'serviceGateway', // 站点英文标识, 用于切换站点，更改currentSite状态
            path: '/service-gateway', // 站点url片段
            icon: 'bar-chart', // 站点Icon
            name: '服务网关', // 站点中文名字

            // 如果需要将若干站点进行集合展示，需要对需要集合展示的站点配置相同的parent属性
            parent: {
                icon: 'book',
                name: '常用系统',
                site: 'commonSystem'
            },

            children: [
                {
                    name: '服务管理',  // 一级菜单名称
                    path: 'serviceManagement', // 一级菜单url片段
                    icon: 'cloud', // 一级菜单Icon
                    key: '0', // 一级菜单的key值
                    children: [
                        {
                            name: '服务', // 二级菜单名称
                            path: 'service', // 二级菜单url片段
                            key: '0-0', // 二级菜单的key值
                            children: [
                                {
                                    name: 'Dubbo服务', // 三级菜单名称
                                    path: 'dubbo', // 三级菜单url片段
                                    icon: 'book', // 三级菜单的Icon
                                    component: 'GetwayDubbo', // 绑定了这个菜单项对应的组件名称
                                    key: '0-0-0' // 三级菜单的key值
                                },
                                {
                                    name: 'Gateway在线服务',
                                    path: 'online',
                                    icon: 'book',
                                    component: 'GetwayOnline',
                                    key: '0-0-1',

                                    // 当菜单项绑定了组件，表示它是菜单栏底层menuItem了，不是subMenu级别了，理论上它应该不会children了，但是有例外的情况，就是
                                    // GetwayOnline组件中是个列表，但是它还有个对应数据行的详情页，且这个详情页又不会显示在左侧菜单栏,
                                    // 那么就需要设置hasChildrenNotInMenuBar:true,然后再为其扩展children

                                    hasChildrenNotInMenuBar: true,

                                    // 不展示在左侧菜单栏的children
                                    children: [
                                        // 此处不能再有children属性了，这个路由组件为最底层的组件了
                                        {
                                            name: '服务详情',
                                            path: 'onlineDetail',
                                            component: 'GetwayOnlineDetail',
                                            key: '0-0-1-0'
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
*/

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
            name: '常用系统',
            site: 'commonSystem'
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
                        name: '接口调用分析',
                        path: 'interfaceInfo',
                        component: 'InterfaceInfo',
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
            name: '常用系统',
            site: 'commonSystem'
        },
        children: [
            {
                name: '服务管理',
                path: 'serviceManagement',
                icon: 'cloud',
                key: '0',
                children: [
                    {
                        name: '服务',
                        path: 'service',
                        key: '0-0',
                        children: [
                            {
                                name: 'Dubbo服务',
                                path: 'dubbo',
                                icon: 'book',
                                component: 'GetwayDubbo',
                                key: '0-0-0'
                            },
                            {
                                name: 'Gateway在线服务',
                                path: 'online',
                                icon: 'book',
                                component: 'GetwayOnline',
                                key: '0-0-1',
                                hasChildrenNotInMenuBar: true,
                                children: [
                                    {
                                        name: '服务详情',
                                        path: 'onlineDetail',
                                        component: 'GetwayOnlineDetail',
                                        key: '0-0-1-0'
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        name: '连接',
                        path: 'line',
                        key: '0-1',
                        children: [
                            {
                                name: '连接管理',
                                path: 'connect',
                                icon: 'book',
                                component: 'GetwayConnect',
                                key: '0-1-0'
                            }
                        ]
                    }
                ]
            }, {
                name: '监控管理',
                path: 'monitoringManagement',
                icon: 'cloud',
                key: '1',
                children: [
                    {
                        name: '实时',
                        path: 'live',
                        key: '1-0',
                        children: [
                            {
                                name: '在线监控',
                                path: 'monitor',
                                component: 'GetwayMonitor',
                                key: '1-0-0',
                            }
                        ],
                    },
                    {
                        name: '离线',
                        path: 'offline',
                        key: '1-1',
                        children: [
                            {
                                name: '全局流量分析',
                                path: 'flow',
                                component: 'GetwayFlow',
                                key: '1-1-0',
                            },
                            {
                                name: '全局QPS分析',
                                path: 'QPS',
                                component: 'GetwayQPS',
                                key: '1-1-1',
                            },
                            {
                                name: '慢服务查询',
                                path: 'slowService',
                                component: 'GetwaySlowService',
                                key: '1-1-2',
                            },
                        ],
                    }
                ]
            }, {
                name: '集群管理',
                path: 'clusterManagement',
                icon: 'cloud',
                key: '2',
                children: [
                    {
                        name: '管理',
                        path: 'manager',
                        key: '2-0',
                        children: [
                            {
                                name: '集群概览',
                                path: 'colony',
                                component: 'GetwayColony',
                                key: '2-0-0',
                            },
                            {
                                name: 'IP 黑名单',
                                path: 'blacklist',
                                component: 'GetwayIpblacklist',
                                key: '2-0-1',
                            },
                            {
                                name: 'TOKEN管理',
                                path: 'token',
                                component: 'GetwayToken',
                                key: '2-0-2',
                            },
                        ],
                    },
                    {
                        name: '系统',
                        path: 'system',
                        key: '2-1',
                        children: [
                            {
                                name: '参数配置',
                                path: 'parameter',
                                component: 'GetwayParameterConf',
                                key: '2-1-0',
                            },
                            {
                                name: '链路状态',
                                path: 'link',
                                component: 'GetwayLinkstate',
                                key: '2-1-1',
                            },
                        ],
                    }
                ]
            }
        ]
    }
];

export default routes;
