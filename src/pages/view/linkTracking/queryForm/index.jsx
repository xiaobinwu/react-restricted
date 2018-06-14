import React, { Component } from 'react';
import { Form, Row, Col, Select, DatePicker, Button } from 'antd';
import linkTrackingService from 'service/linkTrackingService';
import moment from 'moment';
import styles from './index.css';

const { Option } = Select;
const { RangePicker } = DatePicker;
const FormItem = Form.Item;

let appList = [];
class QueryForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            serviceName: '',
            serviceSet: [],
            methodSet: {}
        };
    }
    async UNSAFE_componentWillMount() { // eslint-disable-line
        const { entry } = await linkTrackingService.getAllApp();
        appList = entry;
    }
    // select搜索
    filterOption = (input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
    // 触发应用select onChange
    handleAppChange = async (value, option) => {
        this.props.form.resetFields([
            'serviceName',
            'methodName'
        ]);
        if (value === '') {
            return;
        }
        const { site, id } = option.props;
        const { entry } = await linkTrackingService.getAllService({ site, appId: id });
        const serviceSet = [];
        const methodSet = {};
        entry && entry.forEach((item) => { // eslint-disable-line
            serviceSet.push({
                id: item.id,
                name: item.name
            });
            methodSet[item.name] = item.methods;
        });
        this.setState({
            serviceSet,
            methodSet
        });
    }
    // 触发服务select Onchange
    handleServiceChange = (value, option) => {
        this.props.form.resetFields([
            'methodName'
        ]);
        if (value === '') {} else { // eslint-disable-line
            this.setState({
                serviceName: value
            });
        }
    }
    // 重置搜索条件
    reset = () => {
        this.props.form.resetFields();
    }
    render() {
        const {
            serviceSet,
            methodSet,
            serviceName
        } = this.state;
        const {
            form, onSubmit, baseFormItemsSetting, extraFormItem
        } = this.props;
        const {
            app, service, method, date
        } = baseFormItemsSetting;

        const {
            getFieldDecorator, getFieldValue
        } = form;
        return (
            <div>
                <Form onSubmit={onSubmit}>
                    <Row gutter={16}>
                        <Col span={3}>
                            <FormItem>
                                {getFieldDecorator(app.id || 'appName', app.options || {})(<Select style={{ width: '100%' }} showSearch optionFilterProp="children" onChange={this.handleAppChange} filterOption={this.filterOption}>
                                    <Option value="">全部</Option>
                                    {
                                        appList.map((item, index) => (
                                            <Option key={item.name} title={item.name} id={item.id} site={item.site}>{item.name}</Option>
                                        ))
                                    }
                                </Select>)}
                            </FormItem>
                        </Col>
                        <Col span={5}>
                            <FormItem>
                                {getFieldDecorator(service.id || 'serviceName', service.options || {})(<Select style={{ width: '100%' }} disabled={getFieldValue(app.id) === '' && serviceSet.length === 0} showSearch optionFilterProp="children" onChange={this.handleServiceChange} filterOption={this.filterOption}>
                                    <Option value="">全部</Option>
                                    {
                                        serviceSet.map((item, index) => (
                                            <Option key={item.name} title={item.name}>{item.name}</Option>
                                        ))
                                    }
                                </Select>)}
                            </FormItem>
                        </Col>
                        <Col span={4}>
                            <FormItem>
                                {getFieldDecorator(method.id || 'methodName', method.options || {})(<Select style={{ width: '100%' }} disabled={getFieldValue(service.id) === ''} showSearch optionFilterProp="children" filterOption={this.filterOption}>
                                    <Option value="">全部</Option>
                                    {
                                        (serviceName && methodSet[serviceName]) ? methodSet[serviceName].map((item, index) => (
                                            <Option key={item} title={item}>{item}</Option>
                                        )) : null
                                    }
                                </Select>)}
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem>
                                {getFieldDecorator('rangeTime', date.options)(<RangePicker
                                    showTime
                                    format="YYYY-MM-DD HH:mm"
                                    placeholder={['开始时间', '结束时间']}
                                    style={{ width: '100%' }}
                                    ranges={{
                                        最近5秒: [moment().subtract('seconds', 5), moment()],
                                        最近1分钟: [moment().subtract('minutes', 1), moment()],
                                        最近15分钟: [moment().subtract('minutes', 15), moment()],
                                        最近1小时: [moment().subtract('hours', 1), moment()],
                                    }}
                                />)}
                            </FormItem>
                        </Col>
                        {
                            extraFormItem.map((item, index) => { // eslint-disable-line
                                return (<Col span={item.span} key={item.id}>
                                    <FormItem label={item.label} colon={false} className={item.className}>
                                        {getFieldDecorator(item.id, item.options)(item.component)}
                                    </FormItem>
                                </Col>);
                            })
                        }
                        <Col span={3}>
                            <FormItem>
                                <Button type="primary" icon="search" htmlType="submit">查询</Button>
                                <Button type="primary" className={styles.resetBtn} onClick={this.reset}>重置</Button>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </div>
        );
    }
}

export default Form.create()(QueryForm);
