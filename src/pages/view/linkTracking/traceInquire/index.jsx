import React, { Component } from 'react';
import { Row, Col, Input, Form, Button, Table } from 'antd';
import linkTrackingService from 'service/linkTrackingService';
const FormItem = Form.Item;

const columns = [{
        title: '应用名',
        dataIndex: 'appName',
        key: 'appName',
    }, {
        title: '服务名',
        dataIndex: 'serviceName',
        key: 'serviceName'
    }, {
        title: '方法名',
        dataIndex: 'methodName',
        key: 'methodName'
    }, {
        title: 'IP',
        dataIndex: 'ip',
        key: 'ip'
    }, {
        title: '服务类型',
        dataIndex: 'type',
        key: 'type'
    }, {
        title: '发起时间',
        dataIndex: 'timestamps',
        key: 'timestamps'
    }, {
        title: '耗时(ms)',
        dataIndex: 'duration',
        key: 'duration'
    }, {
        title: 'Waterfall',
        dataIndex: 'waterfall',
        key: 'waterfall',
        width: 200,
        render: (value, row, index) => {
            return(<span>111</span>)
        }
    }
];
  

class TraceInquire extends Component {
    state = {
        entry: []
    };
    componentDidMount() {
        this.getTraceData('5b0fdb15e4b0172c73ca9c20');
    }
    inquire = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
          if (!err) {
            this.getTraceData(values.traceId.replace(/(^\s*)|(\s*$)/g, ''));
          }
        });
    }
    getTraceData = async (traceId) => {
        const { entry, code } = await linkTrackingService.getOneTrace({ traceId });
        if (code === '0') {
            this.setState({
                entry
            });
        }
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const { entry } = this.state;
        return (
            <div>
                <Form onSubmit={this.inquire}>
                    <Row gutter={16}>
                        <Col span={4}>
                            <FormItem>
                                {getFieldDecorator('traceId', {
                                    initialValue: '',
                                    rules: [{ required: true, message: '请输入traceId!' }],
                                })(
                                    <Input placeholder="输入traceId"/>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={2}>
                            <FormItem>
                                <Button type="primary" icon="search" htmlType="submit">查询</Button>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
                <Table columns={columns} childrenColumnName="childs" indentSize="10"  dataSource={entry} defaultExpandAllRows={true} pagination={false} />
            </div>
        );
    }
}

export default Form.create()(TraceInquire);