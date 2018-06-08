import React, { Component } from 'react';
import { Table, Tag, Button } from 'antd';
import { getQueryString } from 'js/util';
import gatewayService from 'service/gatewayService';

class GetwayOnlineDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectKey: 'serviceKey',
            selectValue: '',
            dubboServiceKey: '',
            data: [],
            loading: false,
            pagination: {
                current: 1,
                pageSize: 10,
                totalCount: 0
            }
        };
        this.columns = [{
            title: '服务组',
            dataIndex: 'group',
            key: 'group',
            width: 100
        }, {
            title: '服务KEY',
            dataIndex: 'serviceKey',
            key: 'serviceKey',
            width: 200
        }, {
            title: '接口服务名称',
            dataIndex: 'service',
            key: 'service',
            width: 200
        }, {
            title: '方法',
            dataIndex: 'method',
            key: 'method',
            width: 150
        }, {
            title: '参数',
            dataIndex: 'parameter',
            key: 'parameter',
            width: 200
        }, {
            title: '限流策略',
            dataIndex: 'limitMode',
            key: 'limitMode',
            width: 100,
            render: (text, record) => {
                switch (text) {
                case 0: {
                    return (<Tag className='system-online-detail-tag'>线程池隔离</Tag>);
                }
                case 1: {
                    return (<Tag className='system-online-detail-tag'>令牌桶限流</Tag>);
                }
                case 2: {
                    return (<Tag className='system-online-detail-tag'>信号量限流</Tag>);
                }
                default:
                    return '无';
                }
            }
        }, {
            title: '版本号',
            dataIndex: 'version',
            key: 'version',
            width: 80
        }, {
            title: '服务状态',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: (text, record) => {
                if (text === 3) {
                    return (<Tag className='system-online-detail-error-tag'>异常</Tag>);
                }
                return (<Tag className='system-online-detail-tag'>正常</Tag>);
            }
        }, {
            title: '操作',
            key: 'action',
            render: (text, record) => { // eslint-disable-line
                const layout = { marginRight: '10px', marginBottom: '10px' };
                return (
                    <div>
                        {
                            record.status === 3 ?
                                <Button icon="bars" type="primary" size="small" style={layout}>清除</Button>
                                : null
                        }
                        <Button icon="bars" type="primary" size="small" style={layout}>切换限流</Button>
                        {
                            record.type === 1 ?
                                <Button icon="arrow-down" type="primary" size="small" style={layout}>下线</Button>
                                : <Button icon="arrow-up" type="primary" size="small" style={layout}>上线</Button>
                        }
                        {
                            record.limitMode !== 1 ?
                                <React.Fragment>
                                    <Button icon="line-chart" type="primary" size="small" style={layout}>监控</Button>
                                    <Button icon="setting" type="primary" size="small" style={layout}>熔断参数</Button>
                                </React.Fragment>
                                : null
                        }
                        {
                            record.limitMode === 1 ?
                                <Button icon="tag-o" type="primary" size="small" style={layout}>令牌桶参数</Button>
                                : null
                        }
                        {
                            record.limitMode === 2 ?
                                <Button icon="usb" type="primary" size="small" style={layout}>信号量参数</Button>
                                : null
                        }
                        {
                            record.limitMode !== 1 && record.circuit === 1 ?
                                <Button icon="tool" type="primary" size="small" style={layout}>降级</Button>
                                : <Button icon="loading-3-quarters" type="primary" size="small" style={layout}>恢复</Button>
                        }
                    </div>
                );
            }
        }];
    }
    componentDidMount() {
        const { dubboServiceKey } = getQueryString();
        this.setState({
            dubboServiceKey
        }, () => {
            this.getData();
        });
    }
    // 多选触发
    onSelectChange = (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
    }
    // 修改页数
    changePage = (page, pageSize) => {
        const { pagination } = this.state;
        if (pagination.totalCount > pagination.current * pagination.pageSize) {
            this.setState({
                pagination: { ...pagination, ...{ current: page, pageSize } }
            }, () => {
                this.getData();
            });
        }
    }
    // 获取数据
    getData = async (e) => {
        e && e.preventDefault(); // eslint-disable-line
        const {
            pagination,
            selectKey,
            selectValue,
            dubboServiceKey
        } = this.state;
        const params = {
            key: selectKey,
            value: selectValue,
            dubboServiceKey,
            ...pagination
        };
        delete params.totalCount;
        this.setState({
            loading: true
        });
        const res = await gatewayService.getLineService(params);
        this.setState({
            loading: false,
            pagination: { ...pagination, ...{ totalCount: res.total } },
            data: res.data
        });
    }
    render() {
        const {
            selectedRowKeys,
            data,
            pagination,
            loading
        } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange
        };
        const pageControl = {
            current: pagination.current,
            pageSize: pagination.pageSize,
            pageSizeOptions: ['10', '20', '30', '50'],
            showQuickJumper: true,
            showSizeChanger: true,
            total: pagination.totalCount,
            onChange: this.changePage,
            onShowSizeChange: this.changePage
        };
        const columns = this.columns; // eslint-disable-line
        return (
            <div>
                <Table
                    rowSelection={rowSelection}
                    rowKey="method"
                    loading={loading}
                    columns={columns}
                    dataSource={data}
                    pagination={pageControl}
                />
            </div>
        );
    }
}

export default GetwayOnlineDetail;
