import React, { Component } from 'react';
import { Row, Col, Form, InputNumber, Tag, Checkbox } from 'antd';

const FormItem = Form.Item; // eslint-disable-line

class FuseForm extends Component {
    render() {
        const {
            form,
            injectForm
        } = this.props;
        const { getFieldDecorator } = form;
        return (
            <Form layout="inline">
                <Row gutter={16}>
                    <Row style={{ marginBottom: '10px' }}>
                        <Col span={12}>
                            <FormItem label="熔断出错比例">
                                {getFieldDecorator('breakerErrorThresholdPercentage', {
                                    initialValue: injectForm.breakerErrorThresholdPercentage,
                                })(<InputNumber min={0} max={100} />)}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="熔断超时时间(MS)">
                                {getFieldDecorator('executionIsolationThreadTimeoutInMilliseconds', {
                                    initialValue: injectForm.executionIsolationThreadTimeoutInMilliseconds,
                                })(<InputNumber min={500} max={100000} step={100} />)}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="熔断器暂停时间">
                                {getFieldDecorator('sleepWindowInMilliseconds', {
                                    initialValue: injectForm.sleepWindowInMilliseconds,
                                })(<InputNumber min={1000} max={100000} stpe={100} />)}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="时间段流量">
                                {getFieldDecorator('circuitBreakerRequestVolumeThreshold', {
                                    initialValue: injectForm.circuitBreakerRequestVolumeThreshold,
                                })(<InputNumber min={1} />)}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="常开熔断器">
                                {getFieldDecorator('forceOpen', {
                                    valuePropName: 'checked',
                                    initialValue: injectForm.forceOpen,
                                })(<Checkbox disabled />)}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="常关熔断器">
                                {getFieldDecorator('forceClosed', {
                                    valuePropName: 'checked',
                                    initialValue: injectForm.forceClosed,
                                })(<Checkbox />)}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="启用超时">
                                {getFieldDecorator('withExecutionTimeoutEnabled', {
                                    valuePropName: 'checked',
                                    initialValue: injectForm.withExecutionTimeoutEnabled,
                                })(<Checkbox />)}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="是否使用熔断">
                                {
                                    injectForm.circuitBreakerEnabled ?
                                        <Tag className='system-online-detail-tag'>已使用</Tag>
                                        : <Tag className='system-online-detail-error-tag'>已使用</Tag>
                                }
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="是否已降级">
                                {
                                    injectForm.forceOpen ?
                                        <Tag className='system-online-detail-tag'>已降级</Tag>
                                        : <Tag className='system-online-detail-error-tag'>未降级</Tag>
                                }
                            </FormItem>
                        </Col>
                    </Row>
                </Row>
            </Form>
        );
    }
}

export default Form.create()(FuseForm);
