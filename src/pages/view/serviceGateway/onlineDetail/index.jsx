import React, { Component } from 'react';
import { Row, Col, Table, Tag, Button, Modal, message, Input, Select } from 'antd';
import { getQueryString } from 'js/util';
import gatewayService from 'service/gatewayService';
import withFormModal from 'component/hoc/withFormModal';
import LimiterModeForm from './limiterModeForm';
import TokenForm from './tokenForm';
import FuseForm from './fuseForm';
import SignalForm from './signalForm';

// 切换限流表单modal
const LimiterModeFormModal = withFormModal(LimiterModeForm);
// 设置熔断参数表单
const FuseFormModal = withFormModal(FuseForm);
// 设置令牌桶参数表单
const TokenFormModal = withFormModal(TokenForm);
// 设置信息量参数表单
const SignalFormModal = withFormModal(SignalForm);

const { confirm } = Modal;
class GetwayOnlineDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedRowKeys: [],
            selectKey: 'serviceKey',
            selectValue: '',
            dubboServiceKey: '',
            data: [],
            loading: false,
            pagination: {
                current: 1,
                pageSize: 10,
                totalCount: 0
            },
            // 切换限流
            limiterVisible: false,
            limiterConfirmLoading: false,
            limiterModeForm: {
                limiterModeValue: ''
            },
            // 熔断参数
            fuseVisible: false,
            fuseConfirmLoading: false,
            fuseLimiterMode: '',
            fuseForm: {
                circuitBreakerEnabled: true,
                forceOpen: false,
                circuitBreakerRequestVolumeThreshold: 0,
                executionIsolationThreadTimeoutInMilliseconds: 0,
                breakerErrorThresholdPercentage: 0,
                sleepWindowInMilliseconds: 0,
                forceClosed: false,
                withExecutionTimeoutEnabled: true
            },
            // 令牌桶参数
            tokenVisible: false,
            tokenConfirmLoading: false,
            tokenForm: {
                permitsPerSecond: 100,
                timeout: 3000,
                timeoutEnabled: true
            },
            // 信号量参数
            signalVisible: false,
            signalConfirmLoading: false,
            signalForm: {
                maxRequest: 100
            },
            selectedKey: ''
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
                                <Button icon="bars" type="primary" size="small" onClick={this.removeService.bind(this, record.serviceKey, record.method)} style={layout}>清除</Button>
                                : null
                        }
                        <Button icon="bars" type="primary" size="small" style={layout} onClick={this.switchLimiter.bind(this, record.serviceKey, record.method, record.limitMode)} >切换限流</Button>
                        {
                            record.type === 1 ?
                                <Button icon="arrow-down" type="primary" size="small" onClick={this.onLine.bind(this, record.serviceKey, record.method, false)} style={layout}>下线</Button>
                                : <Button icon="arrow-up" type="primary" size="small" onClick={this.onLine.bind(this, record.serviceKey, record.method, true)} style={layout}>上线</Button>
                        }
                        {
                            record.limitMode !== 1 ?
                                <React.Fragment>
                                    {/* <Button icon="line-chart" type="primary" size="small" onClick={this.onMonitor.bind(this, record.serviceKey, record.method)} style={layout}>监控</Button> */}
                                    <Button icon="setting" type="primary" size="small" onClick={this.onSetProps.bind(this, record.serviceKey, record.method, record.limitMode)} style={layout}>熔断参数</Button>
                                </React.Fragment>
                                : null
                        }
                        {
                            record.limitMode === 1 ?
                                <Button icon="tag-o" type="primary" size="small" onClick={this.setTokenBucket.bind(this, record.serviceKey, record.method)} style={layout}>令牌桶参数</Button>
                                : null
                        }
                        {
                            record.limitMode === 2 ?
                                <Button icon="usb" type="primary" size="small" onClick={this.setSemaphore.bind(this, record.serviceKey, record.method)} style={layout}>信号量参数</Button>
                                : null
                        }
                        {
                            record.limitMode !== 1 && record.circuit === 1 ?
                                <Button icon="tool" type="primary" size="small" onClick={this.onFallback.bind(this, record.serviceKey, record.method, record.limitMode, true)} style={layout}>降级</Button>
                                : <Button icon="loading-3-quarters" type="primary" size="small" onClick={this.onFallback.bind(this, record.serviceKey, record.method, record.limitMode, false)} style={layout}>恢复</Button>
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
    // 上下线
    onLine = (serviceKey, method, flag) => {
        const content = <div style={{ marginTop: '20px' }}><p>接口：{serviceKey}</p><p>方法：{method}</p></div>;
        const successTip = flag ? `上线${serviceKey}成功！` : `下线${serviceKey}成功！`;
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
    // 降级与恢复
    onFallback = (serviceKey, method, limitMode, flag) => {
        const key = `${serviceKey}:${method}`;
        const content = <div style={{ marginTop: '20px' }}><p>注意：{flag ? '会阻断对这个服务的所有请求' : '此操作会恢复到自动降级'}</p><p>接口：{serviceKey}</p><p>方法：{method}</p></div>;
        const that = this;
        confirm({
            title: flag ? '确认是否降级' : '确认是否恢复',
            content,
            okText: '确定',
            cancelText: '取消',
            onOk() {
                (async () => {
                    const res = await gatewayService.onFallback({
                        serviceKey: key,
                        flag,
                        limiterMode: limitMode
                    });
                    if (res.code === 0) {
                        that.getData();
                        message.success(res.message);
                    }
                })();
            }
        });
    }
    // 清除
    removeService = (serviceKey, method) => {
        const content = <div style={{ marginTop: '20px' }}><p>接口：{serviceKey}</p><p>方法：{method}</p></div>;
        const that = this;
        confirm({
            title: '确认是否清除',
            content,
            okText: '确定',
            cancelText: '取消',
            onOk() {
                (async () => {
                    const res = await gatewayService.removeService({
                        serviceKey,
                        method
                    });
                    if (res.code === 0) {
                        that.getData();
                        message.success('清除成功');
                    }
                })();
            }
        });
    }
    // 切换限流
    switchLimiter = (serviceKey, method, limitMode) => {
        this.setState({
            limiterVisible: true,
            selectedKey: `${serviceKey}:${method}`,
            limiterModeForm: { ...this.state.limiterModeForm, limiterModeValue: String(limitMode) }
        });
    }
    // 切换限流表单提交
    switchLimiterSend = () => {
        const content = <div style={{ marginTop: '20px' }}><p>确定需要更新当前服务的限流策略！有可能会更新失败，可多次操作。</p></div>;
        const that = this;
        const {
            selectedKey
        } = this.state;
        const {
            limiterModeValue
        } = this.limiterModeFormRef.props.form.getFieldsValue();
        confirm({
            title: '确认提示',
            okText: '确定',
            cancelText: '取消',
            content,
            onOk() {
                that.setState({
                    limiterConfirmLoading: true
                });
                (async () => {
                    const res = await gatewayService.switchLimiter({
                        serviceKey: selectedKey,
                        limiterMode: limiterModeValue
                    });
                    that.setState({
                        limiterConfirmLoading: false,
                        limiterVisible: false
                    });
                    if (res.code === 0) {
                        that.getData();
                        message.success(res.message);
                    }
                })();
            }
        });
    }
    // 监控
    onMonitor = (serviceKey, method) => {
        console.log(serviceKey, method);
    }
    // 熔断参数
    onSetProps = async (serviceKey, method, limitMode) => {
        let res;
        const selectKey = `${serviceKey}:${method}`;
        const params = { serviceKey: selectKey };
        if (limitMode === 0) {
            res = await gatewayService.getHystrixSetter(params);
        } else if (limitMode === 2) {
            res = await gatewayService.getSemaphoreSend(params);
        }
        this.setState({
            fuseVisible: true,
            fuseForm: { ...this.state.fuseForm, ...res },
            fuseLimiterMode: limitMode,
            selectedKey: selectKey
        });
    }
    setHystrixSetter = async () => {
        let res;
        const {
            fuseLimiterMode,
            selectedKey
        } = this.state;
        this.setState({
            fuseConfirmLoading: true
        });
        const params = { selectKey: selectedKey, ...this.ruseFormRef.props.form.getFieldsValue() };
        if (fuseLimiterMode === 0) {
            res = await gatewayService.setHystrixSetter(params);
        } else if (fuseLimiterMode === 2) {
            res = await gatewayService.setSemaphoreSetter(params);
        }
        if (res.code === 0) {
            this.setState({
                fuseConfirmLoading: false,
                fuseVisible: false
            }, () => {
                message.success(res.message);
            });
        }
    }
    // 令牌桶参数
    setTokenBucket = async (serviceKey, method) => {
        const selectKey = `${serviceKey}:${method}`;
        const params = { serviceKey: selectKey };
        const res = await gatewayService.getTokenBucketSend(params);
        this.setState({
            tokenVisible: true,
            tokenForm: { ...this.state.tokenForm, ...res },
            selectedKey: selectKey
        });
    }
    setTokenBucketSend = async () => {
        const {
            selectedKey
        } = this.state;
        this.setState({
            tokenConfirmLoading: true
        });
        const params = { selectKey: selectedKey, ...this.tokenFormRef.props.form.getFieldsValue() };
        const res = await gatewayService.setTokenBucketSend(params);
        if (res.code === 0) {
            this.setState({
                tokenConfirmLoading: false,
                tokenVisible: false
            }, () => {
                message.success(res.message);
            });
        }
    }
    // 信号量参数
    setSemaphore = async (serviceKey, method) => {
        const selectKey = `${serviceKey}:${method}`;
        const params = { serviceKey: selectKey };
        const res = await gatewayService.getSemaphoreSend(params);
        this.setState({
            signalVisible: true,
            signalForm: { ...this.state.signalForm, maxRequest: res.maxRequest },
            selectedKey: selectKey
        });
    }
    setSemaphoreSend = async () => {
        const {
            selectedKey
        } = this.state;
        this.setState({
            signalConfirmLoading: true
        });
        const params = { selectKey: selectedKey, ...this.signalFormRef.props.form.getFieldsValue() };
        const res = await gatewayService.setSemaphoreSend(params);
        if (res.code === 0) {
            this.setState({
                signalConfirmLoading: false,
                signalVisible: false
            }, () => {
                message.success(res.message);
            });
        }
    }
    // 批量下线
    batchOnline = () => {
        const {
            data,
            selectedRowKeys
        } = this.state;
        const that = this;
        if (selectedRowKeys.length > 10 || selectedRowKeys.length === 0) {
            message.warning('批量操作一次只能选择大于0，小于10数据条数!');
            return;
        }
        confirm({
            title: '确认提示',
            okText: '确定',
            cancelText: '取消',
            content: '此操作将批量下线选中的服务项',
            onOk() {
                const filterData = data.filter((item, index) => { // eslint-disable-line
                    return selectedRowKeys.includes(item.key);
                });
                (async () => {
                    const res = await gatewayService.batchOnline(filterData);
                    if (res.code === 0) {
                        that.getData();
                        that.setState({
                            selectedRowKeys: []
                        });
                        message.success(res.message);
                    }
                })();
            }
        });
    }
    // 多选触发
    onSelectChange = (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
    }
    // 修改页数
    changePage = (page, pageSize) => {
        const { pagination } = this.state;
        this.setState({
            pagination: { ...pagination, ...{ current: page, pageSize } },
            selectedRowKeys: []
        }, () => {
            this.getData();
        });
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
        res.data && res.data.forEach((item, index) => { // eslint-disable-line
            item.key = index;
        });
        this.setState({
            loading: false,
            pagination: { ...pagination, ...{ totalCount: res.total } },
            data: res.data
        });
    }
    // 关闭modal
    handleCancel = (type) => {
        this.setState({
            [type]: false
        });
    }
    // 获取切换限流的ref
    getLimiterModeFormRef = (ref) => {
        this.limiterModeFormRef = ref;
    }
    // 获取熔断参数ref
    getRuseFormRef = (ref) => {
        this.ruseFormRef = ref;
    }
    // 获取令牌桶参数ref
    getTokenFormRef = (ref) => {
        this.tokenFormRef = ref;
    }
    // 获取信息量参数ref
    getSignalFormRef = (ref) => {
        this.signalFormRef = ref;
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
    // Input触发
    changeInput = (e) => {
        this.setState({
            selectValue: e.target.value.replace(/(^\s*)|(\s*$)/g, '')
        });
    }
    render() {
        const {
            selectKey,
            selectedRowKeys,
            data,
            pagination,
            loading,
            limiterModeForm,
            limiterVisible,
            limiterConfirmLoading,
            fuseConfirmLoading,
            fuseForm,
            fuseVisible,
            tokenForm,
            tokenVisible,
            tokenConfirmLoading,
            signalVisible,
            signalConfirmLoading,
            signalForm
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
                <Row gutter={16} style={{ marginBottom: 50 }}>
                    <Col span={6}>
                        <Input addonBefore={this.getSelectBefore()} onChange={this.changeInput} placeholder={selectKey === 'dubboServiceKey' ? '请输入service:version:method......' : `请输入${selectKey}......`}/>
                    </Col>
                    <Col span={3}>
                        <Button icon="search" type="primary" onClick={this.getData}>查询</Button>
                    </Col>
                </Row>
                {/* <Button type="primary" style={{ marginBottom: '10px' }} onClick={this.batchOnline}>批量下线</Button> */}
                <Table
                    rowSelection={rowSelection}
                    loading={loading}
                    columns={columns}
                    dataSource={data}
                    pagination={pageControl}
                />
                <LimiterModeFormModal
                    maskClosable={false}
                    width={300}
                    injectForm={limiterModeForm}
                    getRef={this.getLimiterModeFormRef}
                    title="切换限流策略"
                    visible={limiterVisible}
                    onOk={this.switchLimiterSend}
                    onCancel={this.handleCancel.bind(this, 'limiterVisible')}
                    footer={[
                        <Button key="submit" type="primary" loading={limiterConfirmLoading} onClick={this.switchLimiterSend}>
                            设置策略
                        </Button>
                    ]}
                />
                <FuseFormModal
                    maskClosable={false}
                    injectForm={fuseForm}
                    getRef={this.getRuseFormRef}
                    title="设置熔断参数"
                    visible={fuseVisible}
                    onOk={this.setHystrixSetter}
                    onCancel={this.handleCancel.bind(this, 'fuseVisible')}
                    footer={[
                        <Button key="submit" type="primary" loading={fuseConfirmLoading} onClick={this.setHystrixSetter}>
                            设置参数
                        </Button>
                    ]}
                />
                <TokenFormModal
                    maskClosable={false}
                    injectForm={tokenForm}
                    getRef={this.getTokenFormRef}
                    title="设置令牌桶参数"
                    visible={tokenVisible}
                    onOk={this.setTokenBucketSend}
                    onCancel={this.handleCancel.bind(this, 'tokenVisible')}
                    footer={[
                        <Button key="submit" type="primary" loading={tokenConfirmLoading} onClick={this.setTokenBucketSend}>
                            设置参数
                        </Button>
                    ]}
                />
                <SignalFormModal
                    maskClosable={false}
                    width={300}
                    injectForm={signalForm}
                    getRef={this.getSignalFormRef}
                    title="设置信号量参数"
                    visible={signalVisible}
                    onOk={this.setSemaphoreSend}
                    onCancel={this.handleCancel.bind(this, 'signalVisible')}
                    footer={[
                        <Button key="submit" type="primary" loading={signalConfirmLoading} onClick={this.setSemaphoreSend}>
                            设置参数
                        </Button>
                    ]}
                />
            </div>
        );
    }
}

export default GetwayOnlineDetail;
