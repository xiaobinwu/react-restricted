import React, { Component } from 'react';
import { Row, Col, Form, InputNumber } from 'antd';

const FormItem = Form.Item; // eslint-disable-line

class SignalForm extends Component {
    render() {
        const {
            form,
            injectForm
        } = this.props;
        const { getFieldDecorator } = form;
        return (
            <Form layout="inline">
                <Row>
                    <Col span={24}>
                        <FormItem label="最大请求数">
                            {getFieldDecorator('maxRequest', {
                                initialValue: injectForm.maxRequest,
                            })(<InputNumber min={1} />)}
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        );
    }
}

export default Form.create()(SignalForm);
