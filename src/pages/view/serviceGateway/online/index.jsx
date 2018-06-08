import React, { Component } from 'react';
import { Input, Select, Button, Row, Col, Table, message } from 'antd';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import gatewayService from 'service/gatewayService';
import DubboFormModal from './dubboFormModal';
import ThreadsFormModal from './threadsFormModal';

const { Option } = Select;

class GetwayOnline extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectKey: 'dubboServiceKey',
            selectValue: '',
            selectedRowKeys: [],
            loading: false,
            data: [],
            pagination: {
                current: 1,
                pageSize: 20,
                totalCount: 0
            },
            threadsVisible: false,
            dubboVisible: false,
            threadsConfirmLoading: false,
            dubboConfirmLoading: false,
            threadsSelectedKey: '',
            dubboSelectedKey: '',
            threadsForm: {
                coreSize: '',
                maximumSize: '',
                maxQueueSize: '',
                queueSizeRejectionThreshold: ''
            },
            dubboForm: {
                connection: '',
                timeout: '',
                retry: ''
            }
        };
        this.columns = [{
            title: '服务KEY',
            dataIndex: 'serviceKey',
            key: 'serviceKey'
        }, {
            title: '服务数量',
            dataIndex: 'serviceCount',
            key: 'serviceCount',
            render: (text, record) => { // eslint-disable-line
                return (
                    <Link to={{ pathname: this.props.paths.onlineDetail.linkPath, search: `?dubboServiceKey=${record.serviceKey}` }} target="_blank">{text}</Link>
                );
            }
        }, {
            title: '操作',
            key: 'action',
            render: (text, record) => { // eslint-disable-line
                return (
                    <div>
                        <Button icon="setting" type="primary" size="small" style={{ marginRight: '10px' }} onClick={this.showModal.bind(this, 'threadsVisible', record.serviceKey)}>线程参数</Button>
                        <Button icon="table" type="primary" size="small" onClick={this.showModal.bind(this, 'dubboVisible', record.serviceKey)}>Dubbo参数</Button>
                    </div>
                );
            }
        }];
    }
    componentDidMount() {
        this.getData();
    }
    // 打开modal
    showModal = async (type, key) => {
        switch (type) {
        case 'threadsVisible': {
            const threadsRes = await gatewayService.getHystrixThreadPoolSetter({ serviceKey: key });
            this.setState({
                threadsForm: { ...this.state.threadsForm, ...threadsRes },
                threadsSelectedKey: key,
                [type]: true
            });
            break;
        }
        default: {
            const dubboRes = await gatewayService.getDubboSetter({ serviceKey: key });
            this.setState({
                dubboForm: { ...this.state.dubboForm, ...dubboRes },
                dubboSelectedKey: key,
                [type]: true
            });
        }
        }
    }
    // 关闭modal
    handleCancel = (type) => {
        this.setState({
            [type]: false
        });
    }
    // 获取select搜索框的prefix
    getSelectBefore = () => { // eslint-disable-line
        const { selectKey } = this.state;
        return (
            <Select value={selectKey} style={{ width: 90 }} onChange={this.changeSelect}>
                <Option value="dubboServiceKey">服务KEY</Option>
            </Select>
        );
    }
    // select触发
    changeSelect = (value) => {
        this.setState({
            selectKey: value
        });
    }
    // Input触发
    changeInput = (e) => {
        this.setState({
            selectValue: e.target.value.replace(/(^\s*)|(\s*$)/g, '')
        });
    }
    // 设置线程参数
    handleThreadsOk = async () => {
        this.setState({
            threadsConfirmLoading: true
        });
        const res = await gatewayService.setHystrixThreadPoolSetter({ selectKey: this.state.threadsSelectedKey, ...this.threadsFormRef.props.form.getFieldsValue() });
        if (res.code === 0) {
            this.setState({
                threadsConfirmLoading: false,
                threadsVisible: false
            }, () => {
                message.success(res.message);
            });
        }
    }
    // 设置Dubbo参数
    handleDubboOk = async () => {
        this.setState({
            dubboConfirmLoading: true
        });
        const res = await gatewayService.setDubboSetter({ selectKey: this.state.dubboSelectedKey, ...this.dubboFormRef.props.form.getFieldsValue() });
        if (res.code === 0) {
            this.setState({
                dubboConfirmLoading: false,
                dubboVisible: false
            }, () => {
                message.success(res.message);
            });
        }
    }
    // 获取数据
    getData = async (e) => {
        e && e.preventDefault(); // eslint-disable-line
        const { pagination, selectKey, selectValue } = this.state;
        const params = { key: selectKey, value: selectValue, ...pagination };
        delete params.totalCount;
        this.setState({
            loading: true
        });
        const res = await gatewayService.getOnlineList(params);
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
    // 多选触发
    onSelectChange = (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
    }
    // 获取线程表单的ref
    getThreadsFormRef = (ref) => {
        this.threadsFormRef = ref;
    }
    // 获取线程表单的ref
    getDubboFormRef = (ref) => {
        this.dubboFormRef = ref;
    }

    render() {
        const {
            selectKey,
            pagination,
            data,
            loading,
            selectedRowKeys,
            threadsVisible,
            dubboVisible,
            threadsConfirmLoading,
            dubboConfirmLoading,
            threadsForm,
            dubboForm
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
                    <Col span={6}>
                        <Input addonBefore={this.getSelectBefore()} onChange={this.changeInput} placeholder={selectKey === 'dubboServiceKey' ? '请输入service:version......' : `请输入${selectKey}......`}/>
                    </Col>
                    <Col span={3}>
                        <Button icon="search" type="primary" onClick={this.getData}>查询</Button>
                    </Col>
                </Row>
                <Table
                    rowSelection={rowSelection}
                    rowKey="serviceKey"
                    loading={loading}
                    columns={columns}
                    dataSource={data}
                    pagination={pageControl}
                />
                <ThreadsFormModal
                    wrappedComponentRef={this.getThreadsFormRef}
                    visible={threadsVisible}
                    onOk={this.handleThreadsOk}
                    onCancel={this.handleCancel.bind(this, 'threadsVisible')}
                    threadsConfirmLoading = {threadsConfirmLoading}
                    threadsForm = {threadsForm}
                />
                <DubboFormModal
                    wrappedComponentRef={this.getDubboFormRef}
                    visible={dubboVisible}
                    onOk={this.handleDubboOk}
                    onCancel={this.handleCancel.bind(this, 'dubboVisible')}
                    dubboConfirmLoading = {dubboConfirmLoading}
                    dubboForm = {dubboForm}
                />
            </div>
        );
    }
}

const stateToProps = ({ routeState }) => ({
    paths: routeState.paths
});

export default connect(stateToProps)(GetwayOnline);
