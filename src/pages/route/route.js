const routes = [
    {
        site: 'linkTracking',
        path: '/link-tracking',
        icon: 'area-chart',
        name: '链路跟踪系统',
        children: [
            {
                name: '应用概览',
                path: 'overview',
                icon: 'book',
                key: '0',
                component: 'Overview'
            },
            {
                name: '仪表盘',
                path: 'board',
                icon: 'pie-chart',
                key: '1',
                children: [
                    {
                        name: '实时性能监控-1',
                        path: 'performance',
                        component: 'Performance',
                        key: '1-0'
                    },
                    {
                        name: '实时业务监控-1',
                        path: 'business',
                        component: 'Business',
                        key: '1-1'
                    }
                ]
            }
        ]
    },
    {
        site: 'serviceGateway',
        path: '/service-gateway',
        icon: 'bar-chart',
        name: '网关服务系统',
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