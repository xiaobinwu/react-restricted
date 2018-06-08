import React, { Component } from 'react';
import { Button, Row, Col, Modal, Form, InputNumber } from 'antd';

const FormItem = Form.Item; // eslint-disable-line

class DubboFormModal extends Component {
    render() {
        const {
            form,
            visible,
            onOk,
            onCancel,
            dubboConfirmLoading,
            dubboForm
        } = this.props;
        const { getFieldDecorator } = form;
        return (
            <Modal
                maskClosable = {false}
                title="设置Dubbo参数"
                visible={visible}
                onOk={onOk}
                onCancel={onCancel}
                footer={[
                    <Button key="submit" type="primary" loading={dubboConfirmLoading} onClick={onOk}>
                        设置参数
                    </Button>
                ]}
            >
                <Form layout="inline">
                    <Row gutter={16}>
                        <Row style={{ marginBottom: '10px' }}>
                            <Col span={11}>
                                <FormItem label="服务连接数">
                                    {getFieldDecorator('connection', {
                                        initialValue: dubboForm.connection,
                                    })(<InputNumber min={0} />)}
                                </FormItem>
                            </Col>
                            <Col span={11} offset={2}>
                                <FormItem label="服务超时间">
                                    {getFieldDecorator('timeout', {
                                        initialValue: dubboForm.timeout,
                                    })(<InputNumber min={1000} />)}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={11}>
                                <FormItem label="服务重试次数">
                                    {getFieldDecorator('retry', {
                                        initialValue: dubboForm.retry,
                                    })(<InputNumber min={0} />)}
                                </FormItem>
                            </Col>
                        </Row>
                    </Row>
                </Form>
            </Modal>
        );
    }
}

export default Form.create()(DubboFormModal);
