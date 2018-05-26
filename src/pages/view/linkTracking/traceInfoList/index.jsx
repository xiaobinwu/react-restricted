import React, { Component } from 'react';
import {Table, Form, Row, Col, Select, DatePicker, Button } from 'antd';
import linkTrackingService from 'service/linkTrackingService';
const Option = Select.Option;
const { RangePicker } = DatePicker;
const FormItem = Form.Item;

let appList = [];
const columns = [{
    title: '序号',
    dataIndex: 'key',
    key: 'key'
},{
    title: '接口',
    dataIndex: 'serviceName',
    key: 'serviceName'
},{
    title: '方法',
    dataIndex: 'methodName',
    key: 'methodName'
},{
    title: '应用名',
    dataIndex: 'appName',
    key: 'appName'
},{
    title: '时间',
    dataIndex: 'timestamps',
    key: 'timestamps'
},{
    title: 'traceId',
    dataIndex: 'traceId',
    key: 'traceId'
}];


class TraceInfoList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            data: [],
            pagination: {
                pageNum: 1,
                pageSize: 20,
                totalCount: 0
            }
        }
    }
    async componentWillMount() {
        const { entry } = await linkTrackingService.getAllApp();
        appList = entry;
    }
    componentDidMount() {
        this.getListData();
    }
    changePage = (page, pageSize) => {
        const { pagination } = this.state;
        this.setState({
            pagination: { ...pagination, ...{pageNum: page, pageSize: pageSize} }
        }, () => {
            this.getListData();
        });
    }
    handleAppChange = async (value, option) => {
        const { site } = option.props;
        const res = await linkTrackingService.getAllService({ site, appId: value });
        console.log(res);
    }
    getListData = async (e) => {
        e && e.preventDefault();
        const  { pagination } = this.state;
        this.setState({
            loading: true
        });
        const params = {...this.props.form.getFieldsValue(), ...pagination};
        params.useProxy = !!params.useProxy;
        if (params.rangeTime && params.rangeTime.length > 0) {
            const rangeTime = params.rangeTime;
            params.startDate = rangeTime[0].format('YYYY-MM-DD HH:mm:ss');
            params.endDate = rangeTime[1].format('YYYY-MM-DD HH:mm:ss');
        }
        delete params.rangeTime;
        delete params.totalCount;
        const { entry, code } = await linkTrackingService.getTraceInfoList(params);
        if (code === '0') {
            const data = entry.list.map((item, index) => {
                return {
                    key: index + 1,
                    serviceName: item.serviceName,
                    methodName: item.methodName,
                    appName: item.appName,
                    timestamps: item.timestamps,
                    traceId: item.traceId
                }
            });
            this.setState({
                loading: false,
                pagination: { ...pagination, ...{totalCount: entry.total} },
                data
            });
        }
    }

    render() {
        const { loading, data, pagination } = this.state;
        const { getFieldDecorator } = this.props.form;
        const pageControl = {
            current: pagination.pageNum,
            pageSize: pagination.pageSize,
            pageSizeOptions: ['10', '20', '30', '50'],
            showQuickJumper: true,
            showSizeChanger: true,
            total: pagination.totalCount,
            onChange: this.changePage,
            onShowSizeChange: this.changePage
        };
        return (
            <div>
                <Form onSubmit={this.getListData}>
                    <Row gutter={16}>
                        <Col span={3}>
                            <FormItem>
                                {getFieldDecorator('appName', {
                                    initialValue: '',
                                })(
                                    <Select  style={{width: "100%"}} onChange={this.handleAppChange}>
                                        <Option value="">全部</Option>
                                        {
                                            appList.map((item, index) => {
                                                return (
                                                    <Option key={item.id} title={item.name} site={item.site}>{item.name}</Option>
                                                )
                                            })
                                        }
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={5}>
                            <FormItem>                            
                                {getFieldDecorator('serviceName', {
                                    initialValue: '',
                                })(
                                    <Select  style={{width: "100%"}}>
                                        <Option value="">全部</Option>
                                        <Option value="0" title="com.globalegrow.mgoods.spi.inter.IPackageFeePersonConfigService">com.globalegrow.mgoods.spi.inter.IPackageFeePersonConfigService</Option>
                                        <Option value="1">com.globalegrow.spi.mgoods.common.inter.IGoodsPriceCalculateService</Option>
                                        <Option value="2">com.globalegrow.mgoods.spi.inter.IPriceRuleConfigService</Option>
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={4}>
                            <FormItem>
                                {getFieldDecorator('methodName', {
                                    initialValue: '',
                                })(
                                    <Select  style={{width: "100%"}}>
                                        <Option value="">全部</Option>
                                        <Option value="0">deletePackageFeePersonConfig</Option>
                                        <Option value="1">batchInsertPackageConfig</Option>
                                        <Option value="2">getPackageFeeConfigList</Option>
                                        <Option value="3">getPackageFeePersonConfigList</Option>
                                        <Option value="4">updatePackageFeePersonConfig</Option>
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={3}>
                            <FormItem>      
                                {getFieldDecorator('useProxy', {
                                    initialValue: 0,
                                })(
                                    <Select  style={{width: "100%"}}>
                                        <Option value={0}>非代理层</Option>
                                        <Option value={1}>代理层</Option>
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem>
                                {getFieldDecorator('rangeTime')(
                                    <RangePicker
                                        showTime
                                        format="YYYY-MM-DD HH:mm"
                                        placeholder={['开始时间', '结束时间']}
                                        style={{width: "100%"}}
                                    />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={3}>
                            <FormItem>
                                <Button type="primary" icon="search" htmlType="submit">查询</Button>
                            </FormItem>
                        </Col>            
                    </Row>
                </Form>
                <Table 
                    loading={loading} 
                    columns={columns} 
                    dataSource={data}
                    pagination={pageControl}
                />
            </div>
        );
    }
}

export default Form.create()(TraceInfoList);