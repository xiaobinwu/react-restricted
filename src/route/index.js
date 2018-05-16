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
                component: 'Overview',
                children: [
                    {
                        name: '实时性能监控',
                        path: 'performance',
                        component: 'Performance'
                    },
                    {
                        name: '实时业务监控',
                        path: 'business',
                        component: 'Business'
                    }
                ]

            },
            {
                name: '仪表盘',
                path: 'board',
                icon: 'pie-chart',
                children: [
                    {
                        name: '实时性能监控',
                        path: 'performance',
                        component: 'Performance'
                    },
                    {
                        name: '实时业务监控',
                        path: 'business',
                        component: 'Business'
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
                component: 'Overview'
            },
            {
                name: '测试父菜单',
                path: 'test',
                icon: 'cloud',
                children: [
                    {
                        name: '测试子菜单1',
                        path: 'test1',
                        component: 'Test1',
                        children: [
                            {
                                name: '测试子菜单1-1',
                                path: 'test3',
                                icon: 'book',
                                component: 'Test3'
                            },
                            {
                                name: '测试子菜单1-2',
                                path: 'test4',
                                icon: 'book',
                                component: 'Test4'
                            }
                        ]
                    },
                    {
                        name: '测试子菜单2',
                        path: 'test2',
                        component: 'Test2'
                    }
                ]
            }
        ]
    }
]
export default routes