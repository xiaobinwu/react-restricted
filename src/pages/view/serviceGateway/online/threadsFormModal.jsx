import React, { Component } from 'react';
import { Button, Row, Col, Modal, Form, InputNumber } from 'antd';

const FormItem = Form.Item; // eslint-disable-line
class ThreadsFormModal extends Component {
    render() {
        const {
            form,
            visible,
            onOk,
            onCancel,
            threadsConfirmLoading,
            threadsForm
        } = this.props;
        const { getFieldDecorator } = form;
        return (
            <Modal
                maskClosable = {false}
                title="设置线程参数(只有使用线程池隔离限流才有效)"
                visible={visible}
                onOk={onOk}
                onCancel={onCancel}
                footer={[
                    <span style={{ marginRight: '10px' }} key="tip">*表示gateway修改后需要重启</span>,
                    <Button key="submit" type="primary" loading={threadsConfirmLoading} onClick={onOk}>
                        设置参数
                    </Button>
                ]}
            >
                <Form layout="inline">
                    <Row gutter={16}>
                        <Row style={{ marginBottom: '10px' }}>
                            <Col span={11}>
                                <FormItem label="线程数">
                                    {getFieldDecorator('coreSize', {
                                        initialValue: threadsForm.coreSize,
                                    })(<InputNumber min={1} />)}
                                </FormItem>
                            </Col>
                            <Col span={11} offset={2}>
                                <FormItem label="最大线程数">
                                    {getFieldDecorator('maximumSize', {
                                        initialValue: threadsForm.maximumSize,
                                    })(<InputNumber min={1} />)}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={11}>
                                <FormItem label="最大队列值">
                                    {getFieldDecorator('maxQueueSize', {
                                        initialValue: threadsForm.maxQueueSize,
                                    })(<InputNumber min={1} />)}
                                </FormItem>
                            </Col>
                            <Col span={11} offset={2}>
                                <FormItem label="拒绝队列数">
                                    {getFieldDecorator('queueSizeRejectionThreshold', {
                                        initialValue: threadsForm.queueSizeRejectionThreshold,
                                    })(<InputNumber min={1} />)}
                                </FormItem>
                            </Col>
                        </Row>
                    </Row>
                </Form>
            </Modal>
        );
    }
}

export default Form.create()(ThreadsFormModal);
