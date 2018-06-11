import React, { Component } from 'react';
import { Row, Col, Form, InputNumber, Checkbox } from 'antd';

const FormItem = Form.Item; // eslint-disable-line

class TokenForm extends Component {
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
                            <FormItem label="请求速度/S">
                                {getFieldDecorator('permitsPerSecond', {
                                    initialValue: injectForm.permitsPerSecond,
                                })(<InputNumber min={1} />)}
                            </FormItem>
                        </Col>
                        <Col span={11} offset={2}>
                            <FormItem label="超时时间">
                                {getFieldDecorator('timeout', {
                                    initialValue: injectForm.timeout,
                                })(<InputNumber min={500} step={100} />)}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={11}>
                            <FormItem label="启用超时">
                                {getFieldDecorator('timeoutEnabled', {
                                    initialValue: injectForm.timeoutEnabled,
                                    valuePropName: 'checked'
                                })(<Checkbox />)}
                            </FormItem>
                        </Col>
                    </Row>
                </Row>
            </Form>
        );
    }
}

export default Form.create()(TokenForm);
