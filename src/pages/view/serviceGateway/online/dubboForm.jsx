import React, { Component } from 'react';
import { Row, Col, Form, InputNumber } from 'antd';

const FormItem = Form.Item; // eslint-disable-line

class DubboForm extends Component {
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
                            <FormItem label="服务连接数">
                                {getFieldDecorator('connection', {
                                    initialValue: injectForm.connection,
                                })(<InputNumber min={0} />)}
                            </FormItem>
                        </Col>
                        <Col span={11} offset={2}>
                            <FormItem label="服务超时间">
                                {getFieldDecorator('timeout', {
                                    initialValue: injectForm.timeout,
                                })(<InputNumber min={1000} />)}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={11}>
                            <FormItem label="服务重试次数">
                                {getFieldDecorator('retry', {
                                    initialValue: injectForm.retry,
                                })(<InputNumber min={0} />)}
                            </FormItem>
                        </Col>
                    </Row>
                </Row>
            </Form>
        );
    }
}

export default Form.create()(DubboForm);
