import React, { Component } from 'react';
import {Table, Form, Row, Col, Select, DatePicker, Button } from 'antd';
import linkTrackingService from 'service/linkTrackingService';
const Option = Select.Option;
const { RangePicker } = DatePicker;
const FormItem = Form.Item;

class TraceInfoList extends Component {
    componentWillMount() {
        linkTrackingService.getTraceInfoList({
            pageNum: 1,
            pageSize: 50,
        }).then((res) => {
            console.log(res);
        })
    }

    async componentDidMount() {
        const apps= await linkTrackingService.getAllApp();
        console.log(apps);
    }
    getListData = (e) => {
        e.preventDefault();
        console.log(this.props.form.getFieldsValue());
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <Form onSubmit={this.getListData}>
                    <Row gutter={16}>
                        <Col span={3}>
                            <FormItem>
                                {getFieldDecorator('appName', {
                                    initialValue: '',
                                })(
                                    <Select  style={{width: "100%"}}>
                                        <Option value="">默认空</Option>
                                        <Option value="0">mgoods</Option>
                                        <Option value="1">promotion</Option>
                                        <Option value="2">mpromotion</Option>
                                        <Option value="3">mshop</Option>
                                        <Option value="4">pay</Option>
                                        <Option value="5">goods</Option>    
                                        <Option value="4">mstock</Option>
                                        <Option value="7">mlogistics</Option>
                                        <Option value="8">mmember</Option>
                                        <Option value="9">member</Option>
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
                                        <Option value="">默认空</Option>
                                        <Option value="0">com.globalegrow.mgoods.spi.inter.IPackageFeePersonConfigService</Option>
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
                                        <Option value="">默认空</Option>
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
                                    initialValue: 'false',
                                })(
                                    <Select  style={{width: "100%"}}>
                                        <Option value="false" selected="selected">非代理层</Option>
                                        <Option value="true">代理层</Option>
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

            </div>
        );
    }
}

export default Form.create()(TraceInfoList);