import React, { Component } from 'react';
import { Input, Select, Row, Col, Button, Table, Tag, Modal, message } from 'antd';
import gatewayService from 'service/gatewayService';

const { Option } = Select;
const { confirm } = Modal;
const statusList = [
    {
        value: '0',
        text: '全部'
    }, {
        value: '1',
        text: '已上线'
    }, {
        value: '2',
        text: '未上线'
    }, {
        value: '3',
        text: '已删除'
    }
];
class Dubbo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectKey: 'serviceKey',
            selectValue: '',
            status: '0',
            loading: false,
            data: [],
            pagination: {
                current: 1,
                pageSize: 20,
                totalCount: 0
            },
            filteredInfo: {},
            selectedRowKeys: []
        };
        this.columns = [{
            title: '服务组',
            dataIndex: 'group',
            key: 'group',
            width: 100
        }, {
            title: '服务KEY',
            dataIndex: 'serviceKey',
            key: 'serviceKey'
        }, {
            title: '接口服务名称',
            dataIndex: 'service',
            key: 'service'
        }, {
            title: '方法',
            dataIndex: 'method',
            key: 'method',
            width: 200
        }, {
            title: '参数',
            dataIndex: 'parameter',
            key: 'parameter'
        }, {
            title: '版本号',
            dataIndex: 'version',
            key: 'version',
            width: 90
        }, {
            title: '是否已上线',
            dataIndex: 'status',
            key: 'status',
            width: 140,
            filters: statusList,
            filteredValue: this.state.filteredInfo.status || null,
            onFilter: (value, record) => { // eslint-disable-line
                return record.status === value;
            },
            render: (text, record) => {
                switch (text) {
                case 1: {
                    return (<Tag className='system-online-detail-tag'>已上线</Tag>);
                }
                case 2: {
                    return (<Tag className='system-online-detail-error-tag'>未上线</Tag>);
                }
                default:
                    return (<Tag className='system-online-detail-error-tag'>已删除</Tag>);
                }
            }
        }, {
            title: '操作',
            key: 'action',
            width: 150,
            render: (text, record) => { // eslint-disable-line
                return (
                    <div>
                        {
                            record.status === 1 ?
                                <Button icon="down" type="primary" size="small" onClick={this.onLine.bind(this, record.serviceKey, record.method, false)}>下线</Button>
                                : <Button icon="up" type="primary" size="small" onClick={this.onLine.bind(this, record.serviceKey, record.method, true)}>上线</Button>
                        }
                    </div>
                );
            }
        }];
    }
    componentDidMount() {
        this.getData();
    }
    // 多选触发
    onSelectChange = (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
    }
    // 上下线
    onLine = (serviceKey, method, flag) => {
        const content = <div style={{ marginTop: '20px' }}><p>接口：{serviceKey}</p><p>方法：{method}</p></div>;
        const successTip = flag ? `上线${serviceKey}:${method}成功！` : `下线${serviceKey}:${method}成功！`;
        const that = this;
        confirm({
            title: flag ? '确认是否上线' : '确认是否下线',
            content,
            okText: '确定',
            cancelText: '取消',
            onOk() {
                (async () => {
                    let res;
                    if (flag) {
                        res = await gatewayService.onLine({
                            serviceKey,
                            method
                        });
                    } else {
                        res = await gatewayService.offLine({
                            serviceKey,
                            method
                        });
                    }
                    if (res.code === 0) {
                        that.getData();
                        message.success(successTip);
                    }
                })();
            }
        });
    }
    // 获取select搜索框的prefix
    getSelectBefore = () => { // eslint-disable-line
        const { selectKey } = this.state;
        return (
            <Select value={selectKey} style={{ width: 90 }} onChange={this.changeSelect}>
                <Option value="service">接口服务名称</Option>
                <Option value="method">方法</Option>
                <Option value="version">版本</Option>
                <Option value="serviceKey">唯一KEY</Option>
            </Select>
        );
    }
    // select触发
    changeSelect = (value) => {
        this.setState({
            selectKey: value
        });
    }
    changeStatusSelect = (value) => {
        this.setState({
            status: value
        });
    }
    // Input触发
    changeInput = (e) => {
        this.setState({
            selectValue: e.target.value.replace(/(^\s*)|(\s*$)/g, '')
        });
    }
    // 获取数据
    getData = async (e) => {
        e && e.preventDefault(); // eslint-disable-line
        const {
            pagination,
            selectKey,
            selectValue,
            status
        } = this.state;
        const params = {
            key: selectKey,
            value: selectValue,
            status,
            ...pagination
        };
        delete params.totalCount;
        this.setState({
            loading: true
        });
        const res = await gatewayService.getService(params);
        res.data && res.data.forEach((item, index) => { // eslint-disable-line
            item.key = index;
        });
        this.setState({
            loading: false,
            pagination: { ...pagination, ...{ totalCount: res.total } },
            data: res.data
        });
    }
    // 修改页数
    changePage = (page, pageSize) => {
        const { pagination } = this.state;
        this.setState({
            pagination: { ...pagination, ...{ current: page, pageSize } }
        }, () => {
            this.getData();
        });
    }
    handleTableChange = (pagination, filters, sorter) => {
        this.setState({
            filteredInfo: filters
        });
    }
    render() {
        const {
            selectKey,
            pagination,
            loading,
            data,
            status,
            selectedRowKeys
        } = this.state;
        const columns = this.columns; // eslint-disable-line
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
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange
        };
        return (
            <div>
                <Row gutter={16} style={{ marginBottom: 16 }}>
                    <Col span={4}>
                        <Select placeholder="请选择服务状态" value={status} onChange={this.changeStatusSelect} style={{ width: '100%' }}>
                            {
                                statusList.map((item, index) => { // eslint-disable-line
                                    return (<Option value={item.value} key={index}>{item.text}</Option>);
                                })
                            }
                        </Select>
                    </Col>
                    <Col span={6}>
                        <Input addonBefore={this.getSelectBefore()} onChange={this.changeInput} placeholder={selectKey === 'serviceKey' ? '请输入service:version:method......' : `请输入${selectKey}......`}/>
                    </Col>
                    <Col span={3}>
                        <Button icon="search" type="primary" onClick={this.getData}>查询</Button>
                    </Col>
                </Row>
                <Table
                    rowSelection={rowSelection}
                    loading={loading}
                    columns={columns}
                    dataSource={data}
                    pagination={pageControl}
                    onChange={this.handleTableChange}
                />
            </div>
        );
    }
}

export default Dubbo;
