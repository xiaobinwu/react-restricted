import React, { Component } from 'react';
import { Row, Col, Form, InputNumber } from 'antd';

const FormItem = Form.Item; // eslint-disable-line
class ThreadsFormModal extends Component {
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
                        <Col span={11}>
                            <FormItem label="线程数">
                                {getFieldDecorator('coreSize', {
                                    initialValue: injectForm.coreSize,
                                })(<InputNumber min={1} />)}
                            </FormItem>
                        </Col>
                        <Col span={11} offset={2}>
                            <FormItem label="最大线程数">
                                {getFieldDecorator('maximumSize', {
                                    initialValue: injectForm.maximumSize,
                                })(<InputNumber min={1} />)}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={11}>
                            <FormItem label="最大队列值">
                                {getFieldDecorator('maxQueueSize', {
                                    initialValue: injectForm.maxQueueSize,
                                })(<InputNumber min={1} />)}
                            </FormItem>
                        </Col>
                        <Col span={11} offset={2}>
                            <FormItem label="拒绝队列数">
                                {getFieldDecorator('queueSizeRejectionThreshold', {
                                    initialValue: injectForm.queueSizeRejectionThreshold,
                                })(<InputNumber min={1} />)}
                            </FormItem>
                        </Col>
                    </Row>
                </Row>
            </Form>
        );
    }
}

export default Form.create()(ThreadsFormModal);
