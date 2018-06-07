import React, { Component } from 'react';
import { Input, Select, Button, Row, Col, Table, Modal } from 'antd';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import gatewayService from 'service/gatewayService';

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
            dubboConfirmLoading: false
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
                    <Link to={{ pathname: this.props.paths.onlineDetail.linkPath }} target="_blank">{text}</Link>
                );
            }
        }, {
            title: '操作',
            key: 'action',
            render: (text, record) => { // eslint-disable-line
                return (
                    <div>
                        <Button icon="setting" type="primary" size="small" style={{ marginRight: '10px' }} onClick={this.showModal.bind(this, 'threadsVisible')}>线程参数</Button>
                        <Button icon="table" type="primary" size="small" onClick={this.showModal.bind(this, 'dubboVisible')}>Dubbo参数</Button>
                    </div>
                );
            }
        }];
    }
    componentDidMount() {
        this.getData();
    }
    // 打开modal
    showModal = (type) => {
        this.setState({
            [type]: true
        });
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
    handleThreadsOk = () => {
        console.log(1111);
    }
    // 设置Dubbo参数
    handleDubboOk = () => {
        console.log(2222);
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
            dubboConfirmLoading
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
                <Modal
                    title="设置线程参数(只有使用线程池隔离限流才有效)"
                    visible={threadsVisible}
                    confirmLoading={threadsConfirmLoading}
                    onOk={this.handleThreadsOk}
                    onCancel={this.handleCancel.bind(this, 'threadsVisible')}
                >
                    <p>设置线程参数(只有使用线程池隔离限流才有效)</p>
                </Modal>
                <Modal
                    title="设置Dubbo参数"
                    visible={dubboVisible}
                    confirmLoading={dubboConfirmLoading}
                    onOk={this.handleDubboOk}
                    onCancel={this.handleCancel.bind(this, 'dubboVisible')}
                >
                    <p>设置Dubbo参数</p>
                </Modal>
            </div>
        );
    }
}

const stateToProps = ({ routeState }) => ({
    paths: routeState.paths
});

export default connect(stateToProps)(GetwayOnline);
